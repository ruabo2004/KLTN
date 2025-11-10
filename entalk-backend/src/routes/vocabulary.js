const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');
const authMiddleware = require('../middleware/auth');

/**
 * POST /api/vocabulary/lookup
 * Tra từ điển
 * Body: { word }
 */
router.post('/lookup', authMiddleware, vocabularyController.lookupWord);

/**
 * POST /api/vocabulary/save
 * Lưu từ vào flashcard
 * Body: { userId, word, phonetic, meanings, audioUrl, context }
 */
router.post('/save', authMiddleware, vocabularyController.saveWord);

/**
 * GET /api/vocabulary/:userId/words
 * Lấy danh sách từ vựng đã lưu
 * Query params: ?limit=50
 */
router.get('/:userId/words', authMiddleware, vocabularyController.getUserWords);

/**
 * DELETE /api/vocabulary/:wordId
 * Xóa từ khỏi flashcard
 */
router.delete('/:wordId', authMiddleware, vocabularyController.deleteWord);

/**
 * PUT /api/vocabulary/:wordId/review
 * Đánh dấu đã ôn tập từ
 * Body: { isMastered }
 */
router.put('/:wordId/review', authMiddleware, vocabularyController.reviewWord);

module.exports = router;


