const express = require('express');
const router = express.Router();
const roleplayController = require('../controllers/roleplayController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

/**
 * POST /api/roleplay/start
 * Bắt đầu cuộc hội thoại Role-Play
 */
router.post(
  '/start',
  authMiddleware,
  rateLimiter.roleplay,
  roleplayController.startConversation
);

/**
 * POST /api/roleplay/respond
 * Gửi phản hồi của user trong Role-Play
 */
router.post(
  '/respond',
  authMiddleware,
  rateLimiter.roleplay,
  roleplayController.respondToConversation
);

module.exports = router;

