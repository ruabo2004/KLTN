const { db } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * GET /api/lessons
 * Lấy danh sách tất cả bài học
 */
exports.getAllLessons = async (req, res, next) => {
  try {
    const { level, category, limit = 50 } = req.query;

    logger.info(`📚 Đang lấy danh sách bài học (level: ${level}, category: ${category})`);

    let query = db.collection('lessons').where('isActive', '==', true);

    // Filter by level
    if (level) {
      query = query.where('level', '==', level);
    }

    // Filter by category
    if (category) {
      query = query.where('category', '==', category);
    }

    // Order by order field
    query = query.orderBy('order', 'asc').limit(parseInt(limit));

    const snapshot = await query.get();

    const lessons = [];
    snapshot.forEach((doc) => {
      lessons.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    logger.info(`✅ Tìm thấy ${lessons.length} bài học`);

    res.json({
      success: true,
      data: {
        lessons,
        total: lessons.length,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getAllLessons:', error);
    next(error);
  }
};

/**
 * GET /api/lessons/:id
 * Lấy chi tiết một bài học
 */
exports.getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`📖 Đang lấy chi tiết bài học ${id}`);

    const doc = await db.collection('lessons').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Không tìm thấy bài học',
      });
    }

    const lesson = {
      id: doc.id,
      ...doc.data(),
    };

    logger.info(`✅ Lấy thành công bài học ${id}`);

    res.json({
      success: true,
      data: { lesson },
    });
  } catch (error) {
    logger.error('❌ Error in getLessonById:', error);
    next(error);
  }
};

/**
 * GET /api/lessons/:id/exercises
 * Lấy danh sách exercises của một bài học
 */
exports.getExercisesByLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`📝 Đang lấy exercises cho bài học ${id}`);

    // Get exercises subcollection
    const snapshot = await db
      .collection('lessons')
      .doc(id)
      .collection('exercises')
      .orderBy('order', 'asc')
      .get();

    const exercises = [];
    snapshot.forEach((doc) => {
      exercises.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    logger.info(`✅ Tìm thấy ${exercises.length} exercises`);

    res.json({
      success: true,
      data: {
        lessonId: id,
        exercises,
        total: exercises.length,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getExercisesByLesson:', error);
    next(error);
  }
};


