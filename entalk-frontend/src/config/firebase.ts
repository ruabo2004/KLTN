/**
 * Firebase Configuration
 * Cấu hình Firebase cho React Native
 */

// Thông tin cấu hình từ Firebase Console
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'app-entalk.firebaseapp.com',
  projectId: 'app-entalk',
  storageBucket: 'app-entalk.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Backend API URL
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-url.com/api';

export default firebaseConfig;

