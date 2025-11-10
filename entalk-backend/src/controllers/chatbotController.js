const geminiService = require('../services/geminiService');
const firestoreService = require('../services/firestoreService');

class ChatbotController {
  /**
   * POST /api/chatbot/message
   * Gửi tin nhắn đến AI Chatbot
   */
  async sendMessage(req, res) {
    try {
      const { userId, message, conversationId } = req.body;

      // Validate
      if (!userId || !message) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: 'userId và message là bắt buộc',
        });
      }

      // Tạo hoặc lấy conversation ID
      const convId = conversationId || `chat_${Date.now()}_${userId}`;

      // Load conversation history (nếu có)
      let conversationHistory = [];
      if (conversationId) {
        const convData = await firestoreService.getChatbotConversation(conversationId);
        if (convData && convData.messages) {
          conversationHistory = convData.messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }));
        }
      }

      // Gọi Gemini AI
      const aiReply = await geminiService.chatWithBot(message, conversationHistory);

      // Lưu vào Firestore
      const timestamp = new Date().toISOString();
      const updatedMessages = [
        ...(conversationHistory.map(h => ({
          role: h.role === 'user' ? 'user' : 'ai',
          text: h.parts[0].text,
          timestamp: null,
        }))),
        {
          role: 'user',
          text: message,
          timestamp,
        },
        {
          role: 'ai',
          text: aiReply,
          timestamp,
        },
      ];

      await firestoreService.saveChatbotConversation(convId, {
        userId,
        updatedAt: timestamp,
        messages: updatedMessages,
      });

      // Response
      return res.json({
        success: true,
        conversationId: convId,
        reply: aiReply,
        timestamp,
      });

    } catch (error) {
      console.error('❌ Chatbot error:', error);
      return res.status(500).json({
        success: false,
        error: 'CHATBOT_ERROR',
        message: error.message || 'Không thể kết nối với AI. Vui lòng thử lại.',
      });
    }
  }
}

module.exports = new ChatbotController();

