/**
 * Generate feedback tiếng Việt dựa trên điểm số
 */
function generateVietnameseFeedback(score) {
  if (score >= 90) {
    return "🎉 Xuất sắc! Phát âm của bạn rất tốt!";
  } else if (score >= 75) {
    return "👍 Tốt lắm! Tiếp tục phát huy nhé!";
  } else if (score >= 60) {
    return "😊 Khá đấy! Còn một chút nữa thôi!";
  } else {
    return "💪 Cố gắng lên! Hãy nghe lại audio mẫu và thử lại nhé!";
  }
}

/**
 * Generate feedback cho từng từ
 */
function generateWordFeedback(word, accuracyScore) {
  if (accuracyScore >= 80) {
    return `✅ Từ "${word}" phát âm chính xác`;
  } else if (accuracyScore >= 60) {
    return `⚠️ Từ "${word}" cần chú ý thêm`;
  } else {
    return `❌ Từ "${word}" cần luyện tập lại`;
  }
}

/**
 * Error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Default error
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  };

  // Custom error handling
  if (err.message) {
    errorResponse.message = err.message;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json(errorResponse);
}

module.exports = {
  generateVietnameseFeedback,
  generateWordFeedback,
  errorHandler,
};

