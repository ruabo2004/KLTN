const rateLimit = require('express-rate-limit');

// Rate limiter cho Chatbot API
const chatbotLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 giờ
  max: 50, // 50 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn chỉ có thể gửi 50 tin nhắn mỗi ngày',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho Role-Play API
const roleplayLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // 20 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn đã vượt quá giới hạn. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho Freestyle API
const freestyleLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 giờ
  max: 3, // 3 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn chỉ có thể tạo 3 bài học freestyle mỗi ngày',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho Scoring API
const scoringLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 30, // 30 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn đã vượt quá giới hạn. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho Upload API
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // 10 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn đã vượt quá giới hạn upload. Vui lòng thử lại sau 1 giờ.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter chung cho GET requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 requests
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Bạn đã vượt quá giới hạn. Vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  chatbot: chatbotLimiter,
  roleplay: roleplayLimiter,
  freestyle: freestyleLimiter,
  scoring: scoringLimiter,
  upload: uploadLimiter,
  general: generalLimiter,
};

