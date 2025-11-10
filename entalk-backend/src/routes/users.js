const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Configure multer for avatar upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
  },
});

/**
 * GET /api/users/:id/progress
 * Lấy tiến độ học tập của user
 */
router.get('/:id/progress', authMiddleware, usersController.getUserProgress);

/**
 * GET /api/users/:id/scores
 * Lấy lịch sử điểm của user
 * Query params: ?limit=20&offset=0
 */
router.get('/:id/scores', authMiddleware, usersController.getUserScores);

/**
 * POST /api/users/upload-avatar
 * Upload avatar cho user
 * Body: { userId }
 * File: avatar (multipart/form-data)
 */
router.post(
  '/upload-avatar',
  authMiddleware,
  rateLimiter.upload,
  upload.single('avatar'),
  usersController.uploadAvatar
);

/**
 * PUT /api/users/:id
 * Cập nhật thông tin user
 * Body: { displayName, language, level }
 */
router.put('/:id', authMiddleware, usersController.updateUser);

module.exports = router;


