const express = require('express');
const router = express.Router();
const multer = require('multer');
const scoringController = require('../controllers/scoringController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file audio'), false);
    }
  },
});

/**
 * POST /api/scoring/request
 * Chấm điểm phát âm
 * Body: { userId, lessonId, exerciseId, referenceText }
 * File: audio (multipart/form-data)
 */
router.post(
  '/request',
  authMiddleware,
  rateLimiter.scoring,
  upload.single('audio'),
  scoringController.assessPronunciation
);

module.exports = router;


