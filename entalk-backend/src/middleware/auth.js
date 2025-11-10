const { auth } = require('../config/firebase');

/**
 * Middleware xác thực Firebase ID Token
 */
async function authMiddleware(req, res, next) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token không hợp lệ',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify token với Firebase
    const decodedToken = await auth.verifyIdToken(token);
    
    // Gắn user info vào request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Token không hợp lệ hoặc đã hết hạn',
    });
  }
}

module.exports = authMiddleware;

