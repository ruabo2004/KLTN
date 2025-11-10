require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./src/utils/logger');
const { errorHandler } = require('./src/utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      firebase: 'connected',
      azure: 'connected',
      gemini: 'connected',
    },
  });
});

// API Routes
// Core APIs
app.use('/api/scoring', require('./src/routes/scoring'));
app.use('/api/lessons', require('./src/routes/lessons'));
app.use('/api/users', require('./src/routes/users'));

// Advanced APIs
app.use('/api/chatbot', require('./src/routes/chatbot'));
app.use('/api/freestyle', require('./src/routes/freestyle'));
app.use('/api/roleplay', require('./src/routes/roleplay'));
app.use('/api/vocabulary', require('./src/routes/vocabulary'));
app.use('/api/scenarios', require('./src/routes/scenarios'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'API endpoint không tồn tại',
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 EnTalk Backend Server');
  console.log('🚀 ========================================');
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔥 Health check: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📋 Core API Endpoints:');
  console.log('   POST /api/scoring/request - Chấm điểm phát âm');
  console.log('   GET  /api/lessons - Lấy danh sách bài học');
  console.log('   GET  /api/lessons/:id/exercises - Lấy exercises');
  console.log('   GET  /api/users/:id/progress - Lấy tiến độ user');
  console.log('   GET  /api/users/:id/scores - Lấy lịch sử điểm');
  console.log('   POST /api/users/upload-avatar - Upload avatar');
  console.log('');
  console.log('📋 Advanced API Endpoints:');
  console.log('   POST /api/chatbot/message - Chat với AI');
  console.log('   POST /api/freestyle/create - Tạo bài học Freestyle');
  console.log('   POST /api/roleplay/start - Bắt đầu Role-Play');
  console.log('   POST /api/roleplay/respond - Phản hồi Role-Play');
  console.log('   GET  /api/scenarios - Lấy danh sách scenarios');
  console.log('   POST /api/vocabulary/lookup - Tra từ điển');
  console.log('   POST /api/vocabulary/save - Lưu từ vựng');
  console.log('   GET  /api/vocabulary/:userId/words - Lấy từ vựng');
  console.log('');
  
  logger.info(`Server started on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

