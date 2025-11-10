const express = require('express');
const router = express.Router();
const scenariosController = require('../controllers/scenariosController');
const authMiddleware = require('../middleware/auth');

/**
 * GET /api/scenarios
 * Lấy danh sách scenarios
 * Query params: ?level=beginner&limit=20
 */
router.get('/', authMiddleware, scenariosController.getAllScenarios);

/**
 * GET /api/scenarios/:id
 * Lấy chi tiết một scenario
 */
router.get('/:id', authMiddleware, scenariosController.getScenarioById);

module.exports = router;


