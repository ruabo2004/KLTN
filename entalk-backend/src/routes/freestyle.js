const express = require('express');
const router = express.Router();
const freestyleController = require('../controllers/freestyleController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

/**
 * POST /api/freestyle/create
 * Tạo bài học Freestyle từ văn bản
 */
router.post(
  '/create',
  authMiddleware,
  rateLimiter.freestyle,
  freestyleController.createLesson
);

module.exports = router;

