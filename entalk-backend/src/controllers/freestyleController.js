const azureSpeechService = require('../services/azureSpeechService');
const firestoreService = require('../services/firestoreService');
const { storage } = require('../config/firebase');
const compromise = require('compromise');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FreestyleController {
  /**
   * POST /api/freestyle/create
   * Tạo bài học Freestyle từ văn bản
   */
  async createLesson(req, res) {
    try {
      const { userId, text, title } = req.body;

      // Validate
      if (!userId || !text) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_REQUEST',
          message: 'userId và text là bắt buộc',
        });
      }

      // Kiểm tra độ dài (max 500 từ)
      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount > 500) {
        return res.status(400).json({
          success: false,
          error: 'TEXT_TOO_LONG',
          message: 'Văn bản không được vượt quá 500 từ',
        });
      }

      // Tách văn bản thành các câu bằng NLP
      const doc = compromise(text);
      const sentences = doc.sentences().out('array');

      if (sentences.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_TEXT',
          message: 'Không thể tách câu từ văn bản này',
        });
      }

      // Tạo exercises
      const exercises = [];
      const tempDir = path.join(__dirname, '../../temp');
      
      // Tạo thư mục temp nếu chưa có
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (!sentence) continue;

        const exerciseId = `ex_${uuidv4()}`;
        const audioFileName = `${exerciseId}.mp3`;
        const localAudioPath = path.join(tempDir, audioFileName);

        try {
          // Tạo audio bằng Azure TTS
          await azureSpeechService.textToSpeech(sentence, localAudioPath);

          // Upload lên Firebase Storage
          const bucket = storage.bucket();
          const lessonId = `freestyle_${Date.now()}_${userId}`;
          const storagePath = `audio/freestyle/${lessonId}/${audioFileName}`;
          
          await bucket.upload(localAudioPath, {
            destination: storagePath,
            metadata: {
              contentType: 'audio/mpeg',
            },
          });

          // Lấy public URL
          const file = bucket.file(storagePath);
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Long expiry
          });

          exercises.push({
            id: exerciseId,
            text: sentence,
            audioUrl: url,
            order: i + 1,
          });

          // Xóa file temp
          fs.unlinkSync(localAudioPath);

        } catch (error) {
          console.error(`❌ Error creating exercise ${i + 1}:`, error);
          // Continue với câu tiếp theo
        }
      }

      if (exercises.length === 0) {
        return res.status(500).json({
          success: false,
          error: 'CREATION_FAILED',
          message: 'Không thể tạo bài học. Vui lòng thử lại.',
        });
      }

      // Lưu lesson vào Firestore
      const lessonData = {
        userId,
        title: title || 'Bài học tự do',
        exercises,
        totalExercises: exercises.length,
        estimatedTime: exercises.length * 2, // 2 phút/câu
        type: 'freestyle',
      };

      const lessonId = await firestoreService.saveFreestyleLesson(lessonData);

      // Response
      return res.json({
        success: true,
        lessonId,
        title: lessonData.title,
        totalExercises: exercises.length,
        estimatedTime: lessonData.estimatedTime,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        exercises,
      });

    } catch (error) {
      console.error('❌ Freestyle creation error:', error);
      return res.status(500).json({
        success: false,
        error: 'CREATION_FAILED',
        message: error.message || 'Không thể tạo bài học. Vui lòng thử lại.',
      });
    }
  }
}

module.exports = new FreestyleController();

