const azureSpeechService = require('../services/azureSpeechService');
const firestoreService = require('../services/firestoreService');
const { storage } = require('../config/firebase');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/scoring/request
 * Chấm điểm phát âm từ audio file
 */
exports.assessPronunciation = async (req, res, next) => {
  try {
    const { userId, lessonId, exerciseId, referenceText } = req.body;
    const audioFile = req.file; // from multer

    // Validation
    if (!userId || !referenceText) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'userId và referenceText là bắt buộc',
      });
    }

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Không tìm thấy file audio',
      });
    }

    logger.info(`📊 Đang chấm điểm phát âm cho user ${userId}`);

    // 1. Tạo score document với status="processing"
    const scoreId = await firestoreService.saveScore({
      userId,
      lessonId: lessonId || null,
      exerciseId: exerciseId || null,
      status: 'processing',
      referenceText,
    });

    // 2. Upload audio to Firebase Storage
    const audioFileName = `recordings/${userId}/${scoreId}_${Date.now()}.wav`;
    const bucket = storage.bucket();
    const file = bucket.file(audioFileName);

    await file.save(audioFile.buffer, {
      metadata: {
        contentType: audioFile.mimetype,
      },
    });

    // Make file publicly accessible
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${audioFileName}`;

    logger.info(`✅ Audio uploaded: ${audioUrl}`);

    // 3. Call Azure Speech API for assessment
    const assessmentResult = await azureSpeechService.assessPronunciation(
      audioFile.buffer,
      referenceText
    );

    logger.info(`✅ Assessment result:`, assessmentResult);

    // 4. Update score document with results
    await firestoreService.updateScore(scoreId, {
      status: 'completed',
      audioUrl,
      overallScore: assessmentResult.overallScore,
      accuracyScore: assessmentResult.accuracyScore,
      fluencyScore: assessmentResult.fluencyScore,
      completenessScore: assessmentResult.completenessScore,
      pronunciationScore: assessmentResult.pronunciationScore,
      prosodyScore: assessmentResult.prosodyScore,
      detailedResult: {
        words: assessmentResult.words,
      },
    });

    // 5. Update user statistics
    await firestoreService.updateUserStats(userId, {
      totalPractices: require('firebase-admin').firestore.FieldValue.increment(1),
      lastPracticeAt: new Date().toISOString(),
    });

    logger.info(`🎉 Chấm điểm thành công cho score ${scoreId}`);

    // 6. Return result
    res.json({
      success: true,
      data: {
        scoreId,
        audioUrl,
        overallScore: assessmentResult.overallScore,
        accuracyScore: assessmentResult.accuracyScore,
        fluencyScore: assessmentResult.fluencyScore,
        completenessScore: assessmentResult.completenessScore,
        pronunciationScore: assessmentResult.pronunciationScore,
        prosodyScore: assessmentResult.prosodyScore,
        words: assessmentResult.words,
      },
    });
  } catch (error) {
    logger.error('❌ Error in assessPronunciation:', error);
    next(error);
  }
};


