const firestoreService = require('../services/firestoreService');
const axios = require('axios');
const logger = require('../utils/logger');

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * POST /api/vocabulary/lookup
 * Tra từ điển
 */
exports.lookupWord = async (req, res, next) => {
  try {
    const { word } = req.body;

    if (!word) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'word là bắt buộc',
      });
    }

    logger.info(`📖 Đang tra từ: ${word}`);

    // Call Dictionary API
    const response = await axios.get(`${DICTIONARY_API}/${word.toLowerCase()}`);

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Không tìm thấy từ này trong từ điển',
      });
    }

    const data = response.data[0];

    // Extract meanings
    const meanings = data.meanings.map((meaning) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.slice(0, 3).map((def) => ({
        definition: def.definition,
        example: def.example || null,
      })),
    }));

    // Extract phonetics
    const phonetic = data.phonetic || data.phonetics[0]?.text || '';
    const audioUrl = data.phonetics.find((p) => p.audio)?.audio || '';

    const result = {
      word: data.word,
      phonetic,
      audioUrl,
      meanings,
    };

    logger.info(`✅ Tra từ thành công: ${word}`);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Không tìm thấy từ này trong từ điển',
      });
    }

    logger.error('❌ Error in lookupWord:', error);
    next(error);
  }
};

/**
 * POST /api/vocabulary/save
 * Lưu từ vào flashcard
 */
exports.saveWord = async (req, res, next) => {
  try {
    const { userId, word, phonetic, meanings, audioUrl, context } = req.body;

    if (!userId || !word) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'userId và word là bắt buộc',
      });
    }

    logger.info(`💾 Đang lưu từ ${word} cho user ${userId}`);

    const wordId = await firestoreService.saveVocabulary(userId, {
      word,
      phonetic: phonetic || '',
      meanings: meanings || [],
      audioUrl: audioUrl || '',
      context: context || '',
      reviewCount: 0,
      lastReviewedAt: null,
      isMastered: false,
    });

    logger.info(`✅ Lưu từ thành công: ${wordId}`);

    res.json({
      success: true,
      data: {
        wordId,
        message: 'Đã thêm từ vào sổ tay',
      },
    });
  } catch (error) {
    logger.error('❌ Error in saveWord:', error);
    next(error);
  }
};

/**
 * GET /api/vocabulary/:userId/words
 * Lấy danh sách từ vựng đã lưu
 */
exports.getUserWords = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    logger.info(`📚 Đang lấy từ vựng cho user ${userId}`);

    const vocabulary = await firestoreService.getUserVocabulary(userId, parseInt(limit));

    logger.info(`✅ Tìm thấy ${vocabulary.length} từ`);

    res.json({
      success: true,
      data: {
        vocabulary,
        total: vocabulary.length,
      },
    });
  } catch (error) {
    logger.error('❌ Error in getUserWords:', error);
    next(error);
  }
};

/**
 * DELETE /api/vocabulary/:wordId
 * Xóa từ khỏi flashcard
 */
exports.deleteWord = async (req, res, next) => {
  try {
    const { wordId } = req.params;

    logger.info(`🗑️ Đang xóa từ ${wordId}`);

    await firestoreService.deleteDocument('vocabulary', wordId);

    logger.info(`✅ Xóa từ thành công`);

    res.json({
      success: true,
      data: {
        message: 'Đã xóa từ khỏi sổ tay',
      },
    });
  } catch (error) {
    logger.error('❌ Error in deleteWord:', error);
    next(error);
  }
};

/**
 * PUT /api/vocabulary/:wordId/review
 * Đánh dấu đã ôn tập từ
 */
exports.reviewWord = async (req, res, next) => {
  try {
    const { wordId } = req.params;
    const { isMastered } = req.body;

    logger.info(`📝 Đang cập nhật review cho từ ${wordId}`);

    await firestoreService.updateDocument('vocabulary', wordId, {
      reviewCount: require('firebase-admin').firestore.FieldValue.increment(1),
      lastReviewedAt: new Date().toISOString(),
      isMastered: isMastered !== undefined ? isMastered : false,
    });

    logger.info(`✅ Cập nhật review thành công`);

    res.json({
      success: true,
      data: {
        message: 'Đã cập nhật trạng thái ôn tập',
      },
    });
  } catch (error) {
    logger.error('❌ Error in reviewWord:', error);
    next(error);
  }
};


