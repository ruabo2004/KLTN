const { db, storage, auth } = require('../config/firebase');
const logger = require('../utils/logger');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/users/:id/progress
 * Lấy tiến độ học tập của user
 */
exports.getUserProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`📊 Đang lấy tiến độ cho user ${id}`);

    // Get user data
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Không tìm thấy người dùng',
      });
    }

    const userData = userDoc.data();

    // Get user progress
    const progressSnapshot = await db
      .collection('userProgress')
      .where('userId', '==', id)
      .get();

    const progress = [];
    progressSnapshot.forEach((doc) => {
      progress.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get recent scores (last 10)
    const scoresSnapshot = await db
      .collection('scores')
      .where('userId', '==', id)
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const recentScores = [];
    scoresSnapshot.forEach((doc) => {
      recentScores.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Calculate statistics
    const totalPractices = userData.totalPractices || 0;
    const averageScore =
      recentScores.length > 0
        ? recentScores.reduce((sum, score) => sum + (score.overallScore || 0), 0) / recentScores.length
        : 0;

    logger.info(`✅ Lấy tiến độ thành công cho user ${id}`);

    res.json({
      success: true,
      data: {
        userId: id,
        displayName: userData.displayName,
        level: userData.level,
        totalPractices,
        averageScore: Math.round(averageScore),
        progress,
        recentScores,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getUserProgress:', error);
    next(error);
  }
};

/**
 * GET /api/users/:id/scores
 * Lấy lịch sử điểm của user
 */
exports.getUserScores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    logger.info(`📜 Đang lấy lịch sử điểm cho user ${id}`);

    const snapshot = await db
      .collection('scores')
      .where('userId', '==', id)
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const scores = [];
    snapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    logger.info(`✅ Tìm thấy ${scores.length} điểm`);

    res.json({
      success: true,
      data: {
        userId: id,
        scores,
        total: scores.length,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getUserScores:', error);
    next(error);
  }
};

/**
 * POST /api/users/upload-avatar
 * Upload avatar cho user
 */
exports.uploadAvatar = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const avatarFile = req.file; // from multer

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'userId là bắt buộc',
      });
    }

    if (!avatarFile) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Không tìm thấy file ảnh',
      });
    }

    logger.info(`📸 Đang upload avatar cho user ${userId}`);

    // 1. Resize image to 300x300
    const resizedImageBuffer = await sharp(avatarFile.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // 2. Get old avatar path to delete later
    const userDoc = await db.collection('users').doc(userId).get();
    const oldPhotoPath = userDoc.exists ? userDoc.data().photoStoragePath : null;

    // 3. Upload to Firebase Storage
    const fileName = `avatars/${userId}/avatar_${Date.now()}.jpg`;
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    await file.save(resizedImageBuffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    // Make file publicly accessible
    await file.makePublic();
    const photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    logger.info(`✅ Avatar uploaded: ${photoURL}`);

    // 4. Update user document
    await db.collection('users').doc(userId).update({
      photoURL,
      photoStoragePath: fileName,
      updatedAt: new Date().toISOString(),
    });

    // 5. Delete old avatar if exists
    if (oldPhotoPath) {
      try {
        await bucket.file(oldPhotoPath).delete();
        logger.info(`🗑️ Đã xóa avatar cũ: ${oldPhotoPath}`);
      } catch (error) {
        logger.warn(`⚠️ Không thể xóa avatar cũ: ${error.message}`);
      }
    }

    res.json({
      success: true,
      data: {
        photoURL,
        message: 'Cập nhật avatar thành công',
      },
    });
  } catch (error) {
    logger.error('❌ Error in uploadAvatar:', error);
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Cập nhật thông tin user
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayName, language, level } = req.body;

    logger.info(`👤 Đang cập nhật user ${id}`);

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (displayName) updateData.displayName = displayName;
    if (language) updateData.language = language;
    if (level) updateData.level = level;

    await db.collection('users').doc(id).update(updateData);

    logger.info(`✅ Cập nhật user ${id} thành công`);

    res.json({
      success: true,
      data: {
        message: 'Cập nhật thông tin thành công',
      },
    });
  } catch (error) {
    logger.error('❌ Error in updateUser:', error);
    next(error);
  }
};


