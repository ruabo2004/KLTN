const { model } = require('../config/gemini');

// System prompt cho Chatbot
const CHATBOT_SYSTEM_PROMPT = `
Bạn là trợ lý AI của ứng dụng EnTalk - ứng dụng học phát âm tiếng Anh dành cho người Việt.

QUY TẮC QUAN TRỌNG:
- TRẢ LỜI HOÀN TOÀN BẰNG TIẾNG VIỆT
- Giải thích dễ hiểu, ngắn gọn (không quá 200 từ)
- Sử dụng emoji phù hợp để sinh động
- Đưa ra ví dụ cụ thể bằng tiếng Anh (kèm dịch tiếng Việt)
- Luôn khuyến khích và động viên người học

NHIỆM VỤ:
1. Dịch từ/câu (Anh → Việt hoặc Việt → Anh)
2. Giải thích ngữ pháp bằng tiếng Việt
3. Giải thích từ vựng, cách phát âm
4. Gợi ý cách học hiệu quả
5. Trả lời câu hỏi về tiếng Anh

ĐỊNH DẠNG TRẢ LỜI:
- Sử dụng emoji: 📝 (dịch), 💡 (giải thích), 🎯 (ví dụ), ⚠️ (lưu ý)
- Chia thành các phần ngắn, dễ đọc
- Luôn có ví dụ minh họa

VÍ DỤ:
User: "Dịch: Hello, how are you?"
Bot: "📝 Dịch: 'Xin chào, bạn khỏe không?'

💡 Giải thích:
• 'Hello' - lời chào phổ biến
• 'How are you?' - câu hỏi thăm hỏi sức khỏe

🎯 Cách dùng:
- Hello! (Xin chào!)
- How are you? (Bạn khỏe không?)
- I'm fine, thank you. (Tôi khỏe, cảm ơn.)

💡 Từ tương tự: Hi, Hey, What's up?"
`;

class GeminiService {
  /**
   * Chat với AI Chatbot
   * @param {string} userMessage - Tin nhắn của user
   * @param {Array} conversationHistory - Lịch sử hội thoại (optional)
   * @returns {Promise<string>} - Câu trả lời của AI
   */
  async chatWithBot(userMessage, conversationHistory = []) {
    try {
      // Tạo chat session
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: CHATBOT_SYSTEM_PROMPT }],
          },
          {
            role: 'model',
            parts: [{ text: 'Chào bạn! Tôi là trợ lý AI của EnTalk. Tôi sẽ giúp bạn học tiếng Anh. Bạn có thể hỏi tôi về dịch thuật, ngữ pháp, từ vựng, hoặc bất cứ điều gì về tiếng Anh! 😊' }],
          },
          ...conversationHistory,
        ],
      });

      // Gửi message
      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('❌ Gemini chatbot error:', error);
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại.');
    }
  }

  /**
   * Generate câu trả lời cho Role-Play
   * @param {string} scenario - Tình huống (restaurant, shopping, etc.)
   * @param {Array} conversationHistory - Lịch sử hội thoại
   * @returns {Promise<string>} - Câu trả lời của AI
   */
  async generateRolePlayResponse(scenario, conversationHistory) {
    try {
      const scenarioPrompts = {
        restaurant: 'Bạn là nhân viên phục vụ tại nhà hàng. Hãy phản hồi tự nhiên, thân thiện.',
        shopping: 'Bạn là nhân viên bán hàng. Hãy giới thiệu sản phẩm và tư vấn nhiệt tình.',
        airport: 'Bạn là nhân viên sân bay. Hãy hướng dẫn rõ ràng và chuyên nghiệp.',
        hospital: 'Bạn là y tá/bác sĩ. Hãy hỏi về triệu chứng và tư vấn.',
        interview: 'Bạn là nhà tuyển dụng. Hãy đặt câu hỏi phỏng vấn chuyên nghiệp.',
        school: 'Bạn là giáo viên. Hãy giải thích và hướng dẫn học sinh.',
        hotel: 'Bạn là lễ tân khách sạn. Hãy phục vụ chuyên nghiệp và lịch sự.',
      };

      const systemPrompt = `
Bạn đang trong tình huống: ${scenario}
${scenarioPrompts[scenario]}

QUY TẮC:
- Chỉ trả lời bằng TIẾNG ANH (vì đây là bài luyện nói)
- Câu trả lời ngắn gọn (1-2 câu)
- Tự nhiên như người bản xứ
- Phù hợp với ngữ cảnh hội thoại
- Không giải thích, không dịch

VÍ DỤ:
User: "I'd like to order a cappuccino, please."
AI: "Great choice! Would you like that hot or iced?"
`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will respond naturally in English.' }],
          },
          ...conversationHistory,
        ],
      });

      const lastUserMessage = conversationHistory[conversationHistory.length - 1];
      const result = await chat.sendMessage(lastUserMessage.parts[0].text);
      const text = result.response.text();

      return text;
    } catch (error) {
      console.error('❌ Gemini roleplay error:', error);
      throw new Error('Không thể tạo phản hồi Role-Play.');
    }
  }

  /**
   * Generate câu mở đầu cho Role-Play
   * @param {string} scenario - Tình huống
   * @returns {Promise<string>} - Câu mở đầu
   */
  async generateRolePlayOpening(scenario) {
    const openings = {
      restaurant: "Hi, welcome to our restaurant! What can I get for you today?",
      shopping: "Hello! Welcome to our store. Are you looking for anything specific?",
      airport: "Good morning! May I see your passport and ticket, please?",
      hospital: "Hello, how can I help you today? What seems to be the problem?",
      interview: "Good morning! Thank you for coming. Please, have a seat. Tell me about yourself.",
      school: "Good morning, class! Today we're going to learn about English pronunciation. Any questions?",
      hotel: "Good evening! Welcome to our hotel. Do you have a reservation?",
    };

    return openings[scenario] || "Hello! How can I help you today?";
  }

  /**
   * Dịch AI response sang tiếng Việt
   * @param {string} englishText - Câu tiếng Anh
   * @returns {Promise<string>} - Câu tiếng Việt
   */
  async translateToVietnamese(englishText) {
    try {
      const prompt = `Dịch câu sau sang tiếng Việt (chỉ trả về bản dịch, không giải thích): "${englishText}"`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      console.error('❌ Translation error:', error);
      return englishText; // Fallback
    }
  }
}

module.exports = new GeminiService();

