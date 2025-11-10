const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

/**
 * POST /api/chatbot/message
 * Gửi tin nhắn đến AI Chatbot
 */
router.post(
  '/message',
  authMiddleware,
  rateLimiter.chatbot,
  chatbotController.sendMessage
);

module.exports = router;

