const geminiService = require('../services/geminiService');
const azureSpeechService = require('../services/azureSpeechService');
const firestoreService = require('../services/firestoreService');
const { storage } = require('../config/firebase');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class RoleplayController {
  /**
   * POST /api/roleplay/start
   * Bắt đầu cuộc hội thoại Role-Play
   */
  async startConversation(req, res) {
    try {
      const { userId, scenarioId } = req.body;

      // Validate
      if (!userId || !scenarioId) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: 'userId và scenarioId là bắt buộc',
        });
      }

      // Validate scenario
      const validScenarios = ['restaurant', 'shopping', 'airport', 'hospital', 'interview', 'school', 'hotel'];
      if (!validScenarios.includes(scenarioId)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SCENARIO',
          message: 'Tình huống không hợp lệ',
        });
      }

      // Generate câu mở đầu
      const openingText = await geminiService.generateRolePlayOpening(scenarioId);

      // Tạo audio cho câu mở đầu
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const audioFileName = `ai_${uuidv4()}.mp3`;
      const localAudioPath = path.join(tempDir, audioFileName);

      await azureSpeechService.textToSpeech(openingText, localAudioPath);

      // Upload lên Firebase Storage
      const conversationId = `conv_${Date.now()}_${userId}`;
      const storagePath = `audio/roleplay/${conversationId}/${audioFileName}`;
      
      const bucket = storage.bucket();
      await bucket.upload(localAudioPath, {
        destination: storagePath,
        metadata: {
          contentType: 'audio/mpeg',
        },
      });

      const file = bucket.file(storagePath);
      const [audioUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Xóa file temp
      fs.unlinkSync(localAudioPath);

      // Dịch sang tiếng Việt
      const translation = await geminiService.translateToVietnamese(openingText);

      // Lưu conversation vào Firestore
      const conversationData = {
        userId,
        scenarioId,
        messages: [
          {
            role: 'ai',
            text: openingText,
            audioUrl,
            translation,
            timestamp: new Date().toISOString(),
          },
        ],
        status: 'active',
      };

      await firestoreService.saveRolePlayConversation(conversationData);

      // Response
      const scenarioInfo = {
        restaurant: { title: 'Nhà hàng', description: 'Gọi món ăn tại nhà hàng' },
        shopping: { title: 'Mua sắm', description: 'Mua sắm tại cửa hàng' },
        airport: { title: 'Sân bay', description: 'Làm thủ tục tại sân bay' },
        hospital: { title: 'Bệnh viện', description: 'Khám bệnh tại bệnh viện' },
        interview: { title: 'Phỏng vấn', description: 'Phỏng vấn xin việc' },
        school: { title: 'Trường học', description: 'Học tập tại trường' },
        hotel: { title: 'Khách sạn', description: 'Đặt phòng khách sạn' },
      };

      return res.json({
        success: true,
        conversationId,
        scenario: {
          id: scenarioId,
          ...scenarioInfo[scenarioId],
        },
        firstMessage: {
          role: 'ai',
          text: openingText,
          audioUrl,
          translation,
        },
      });

    } catch (error) {
      console.error('❌ Roleplay start error:', error);
      return res.status(500).json({
        success: false,
        error: 'ROLEPLAY_START_FAILED',
        message: error.message || 'Không thể bắt đầu hội thoại. Vui lòng thử lại.',
      });
    }
  }

  /**
   * POST /api/roleplay/respond
   * Gửi phản hồi của user trong Role-Play
   */
  async respondToConversation(req, res) {
    try {
      const { conversationId, audioUrl, userId } = req.body;

      // Validate
      if (!conversationId || !audioUrl || !userId) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: 'conversationId, audioUrl và userId là bắt buộc',
        });
      }

      // Download audio từ Firebase Storage
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const userAudioPath = path.join(tempDir, `user_${uuidv4()}.wav`);
      
      // Download file
      const response = await axios({
        method: 'get',
        url: audioUrl,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(userAudioPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Speech-to-Text: Chuyển audio thành text
      const userText = await azureSpeechService.speechToText(userAudioPath);

      // Pronunciation Assessment: Chấm điểm
      // Note: Cần reference text, tạm thời dùng recognized text
      const assessment = await azureSpeechService.assessPronunciation(userAudioPath, userText);

      // Xóa file temp
      fs.unlinkSync(userAudioPath);

      // Lấy conversation history
      const convDoc = await firestoreService.db.collection('roleplay_conversations').doc(conversationId).get();
      if (!convDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'CONVERSATION_NOT_FOUND',
          message: 'Không tìm thấy cuộc hội thoại',
        });
      }

      const convData = convDoc.data();
      const scenarioId = convData.scenarioId;
      const messages = convData.messages || [];

      // Tạo history cho Gemini
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Thêm user message mới
      conversationHistory.push({
        role: 'user',
        parts: [{ text: userText }],
      });

      // Generate AI response
      const aiResponseText = await geminiService.generateRolePlayResponse(scenarioId, conversationHistory);

      // Tạo audio cho AI response
      const aiAudioFileName = `ai_${uuidv4()}.mp3`;
      const aiLocalAudioPath = path.join(tempDir, aiAudioFileName);

      await azureSpeechService.textToSpeech(aiResponseText, aiLocalAudioPath);

      // Upload AI audio lên Firebase
      const aiStoragePath = `audio/roleplay/${conversationId}/${aiAudioFileName}`;
      const bucket = storage.bucket();
      
      await bucket.upload(aiLocalAudioPath, {
        destination: aiStoragePath,
        metadata: {
          contentType: 'audio/mpeg',
        },
      });

      const aiFile = bucket.file(aiStoragePath);
      const [aiAudioUrl] = await aiFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // Xóa file temp
      fs.unlinkSync(aiLocalAudioPath);

      // Dịch AI response sang tiếng Việt
      const aiTranslation = await geminiService.translateToVietnamese(aiResponseText);

      // Cập nhật conversation
      const timestamp = new Date().toISOString();
      const updatedMessages = [
        ...messages,
        {
          role: 'user',
          text: userText,
          audioUrl,
          pronunciationScore: assessment.overallScore,
          timestamp,
        },
        {
          role: 'ai',
          text: aiResponseText,
          audioUrl: aiAudioUrl,
          translation: aiTranslation,
          timestamp,
        },
      ];

      await firestoreService.updateRolePlayConversation(conversationId, {
        messages: updatedMessages,
      });

      // Generate feedback
      const { generateVietnameseFeedback } = require('../utils/errorHandler');
      const feedback = generateVietnameseFeedback(assessment.overallScore);

      // Response
      return res.json({
        success: true,
        userMessage: {
          role: 'user',
          text: userText,
          audioUrl,
          pronunciationScore: assessment.overallScore,
          feedback,
        },
        aiResponse: {
          role: 'ai',
          text: aiResponseText,
          audioUrl: aiAudioUrl,
          translation: aiTranslation,
        },
      });

    } catch (error) {
      console.error('❌ Roleplay respond error:', error);
      return res.status(500).json({
        success: false,
        error: 'ROLEPLAY_RESPOND_FAILED',
        message: error.message || 'Không thể xử lý phản hồi. Vui lòng thử lại.',
      });
    }
  }
}

module.exports = new RoleplayController();

