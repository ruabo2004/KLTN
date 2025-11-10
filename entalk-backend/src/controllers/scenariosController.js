const { db } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * GET /api/scenarios
 * Lấy danh sách scenarios cho Role-Play
 */
exports.getAllScenarios = async (req, res, next) => {
  try {
    const { level, limit = 20 } = req.query;

    logger.info(`🎭 Đang lấy danh sách scenarios (level: ${level})`);

    let query = db.collection('scenarios').where('isActive', '==', true);

    // Filter by level
    if (level) {
      query = query.where('level', '==', level);
    }

    // Order by order field
    query = query.orderBy('order', 'asc').limit(parseInt(limit));

    const snapshot = await query.get();

    const scenarios = [];
    snapshot.forEach((doc) => {
      scenarios.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    logger.info(`✅ Tìm thấy ${scenarios.length} scenarios`);

    res.json({
      success: true,
      data: {
        scenarios,
        total: scenarios.length,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getAllScenarios:', error);
    next(error);
  }
};

/**
 * GET /api/scenarios/:id
 * Lấy chi tiết một scenario
 */
exports.getScenarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`🎭 Đang lấy chi tiết scenario ${id}`);

    const doc = await db.collection('scenarios').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Không tìm thấy scenario',
      });
    }

    const scenario = {
      id: doc.id,
      ...doc.data(),
    };

    logger.info(`✅ Lấy thành công scenario ${id}`);

    res.json({
      success: true,
      data: { scenario },
    });
  } catch (error) {
    logger.error('❌ Error in getScenarioById:', error);
    next(error);
  }
};


