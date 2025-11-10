const { speechConfig, sdk } = require('../config/azure');
const fs = require('fs');
const path = require('path');

class AzureSpeechService {
  /**
   * Text-to-Speech: Chuyển text thành audio
   * @param {string} text - Văn bản cần đọc
   * @param {string} outputPath - Đường dẫn file output
   * @returns {Promise<string>} - Đường dẫn file audio
   */
  async textToSpeech(text, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Tạo audio config
        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
        
        // Tạo synthesizer
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        // Synthesize
        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log(`✅ TTS thành công: ${outputPath}`);
              synthesizer.close();
              resolve(outputPath);
            } else {
              console.error('❌ TTS thất bại:', result.errorDetails);
              synthesizer.close();
              reject(new Error(result.errorDetails));
            }
          },
          (error) => {
            console.error('❌ TTS error:', error);
            synthesizer.close();
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ TTS exception:', error);
        reject(error);
      }
    });
  }

  /**
   * Speech-to-Text: Chuyển audio thành text
   * @param {string} audioPath - Đường dẫn file audio
   * @returns {Promise<string>} - Text nhận dạng được
   */
  async speechToText(audioPath) {
    return new Promise((resolve, reject) => {
      try {
        // Tạo audio config từ file
        const audioConfig = sdk.AudioConfig.fromWavFileInput(
          fs.readFileSync(audioPath)
        );

        // Tạo recognizer
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        // Nhận dạng
        recognizer.recognizeOnceAsync(
          (result) => {
            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
              console.log(`✅ STT thành công: "${result.text}"`);
              recognizer.close();
              resolve(result.text);
            } else {
              console.error('❌ STT thất bại:', result.errorDetails);
              recognizer.close();
              reject(new Error('Không nhận dạng được giọng nói'));
            }
          },
          (error) => {
            console.error('❌ STT error:', error);
            recognizer.close();
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ STT exception:', error);
        reject(error);
      }
    });
  }

  /**
   * Pronunciation Assessment: Chấm điểm phát âm
   * @param {string} audioPath - Đường dẫn file audio
   * @param {string} referenceText - Câu mẫu
   * @returns {Promise<Object>} - Kết quả chấm điểm
   */
  async assessPronunciation(audioPath, referenceText) {
    return new Promise((resolve, reject) => {
      try {
        // Cấu hình pronunciation assessment
        const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
          referenceText,
          sdk.PronunciationAssessmentGradingSystem.HundredMark,
          sdk.PronunciationAssessmentGranularity.Phoneme,
          true // Enable prosody assessment
        );

        // Tạo audio config
        const audioConfig = sdk.AudioConfig.fromWavFileInput(
          fs.readFileSync(audioPath)
        );

        // Tạo recognizer
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        
        // Apply pronunciation config
        pronunciationConfig.applyTo(recognizer);

        // Nhận dạng và chấm điểm
        recognizer.recognizeOnceAsync(
          (result) => {
            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
              const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(result);
              
              // Parse kết quả chi tiết
              const detailedResult = JSON.parse(result.properties.getProperty(
                sdk.PropertyId.SpeechServiceResponse_JsonResult
              ));

              const assessment = {
                overallScore: Math.round(pronunciationResult.pronunciationScore),
                accuracyScore: Math.round(pronunciationResult.accuracyScore),
                fluencyScore: Math.round(pronunciationResult.fluencyScore),
                completenessScore: Math.round(pronunciationResult.completenessScore),
                pronunciationScore: Math.round(pronunciationResult.pronunciationScore),
                prosodyScore: Math.round(pronunciationResult.prosodyScore || 0),
                recognizedText: result.text,
                words: detailedResult.NBest[0].Words.map(word => ({
                  word: word.Word,
                  accuracyScore: Math.round(word.PronunciationAssessment.AccuracyScore),
                  errorType: word.PronunciationAssessment.ErrorType,
                })),
              };

              console.log(`✅ Assessment thành công: ${assessment.overallScore}/100`);
              recognizer.close();
              resolve(assessment);
            } else {
              console.error('❌ Assessment thất bại:', result.errorDetails);
              recognizer.close();
              reject(new Error('Không thể chấm điểm phát âm'));
            }
          },
          (error) => {
            console.error('❌ Assessment error:', error);
            recognizer.close();
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ Assessment exception:', error);
        reject(error);
      }
    });
  }
}

module.exports = new AzureSpeechService();

