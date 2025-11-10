const sdk = require('microsoft-cognitiveservices-speech-sdk');

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  process.env.AZURE_SPEECH_REGION
);

// Cấu hình ngôn ngữ tiếng Anh
speechConfig.speechRecognitionLanguage = 'en-US';
speechConfig.speechSynthesisLanguage = 'en-US';
speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural'; // Giọng nữ tự nhiên

console.log('✅ Azure Speech Config initialized');

module.exports = { speechConfig, sdk };

