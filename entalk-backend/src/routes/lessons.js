const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');
const authMiddleware = require('../middleware/auth');

/**
 * GET /api/lessons
 * Lấy danh sách tất cả bài học
 * Query params: ?level=beginner&category=pronunciation&limit=50
 */
router.get('/', authMiddleware, lessonsController.getAllLessons);

/**
 * GET /api/lessons/:id
 * Lấy chi tiết một bài học
 */
router.get('/:id', authMiddleware, lessonsController.getLessonById);

/**
 * GET /api/lessons/:id/exercises
 * Lấy danh sách exercises của một bài học
 */
router.get('/:id/exercises', authMiddleware, lessonsController.getExercisesByLesson);

module.exports = router;


