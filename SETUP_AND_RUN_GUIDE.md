# 🚀 HƯỚNG DẪN SETUP VÀ CHẠY ỨNG DỤNG ENTALK

## 📋 Tổng Quan

EnTalk là ứng dụng học phát âm tiếng Anh với AI, bao gồm:
- **Backend:** Node.js + Express + Firebase Admin SDK
- **Frontend:** React Native (Android only)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **AI Services:** Azure Speech API + Google Gemini API

---

## ✅ Yêu Cầu Hệ Thống

### Backend:
- Node.js >= 18.x
- npm >= 9.x

### Frontend (Android):
- Node.js >= 18.x
- React Native CLI
- Android Studio
- JDK 11 hoặc 17
- Android SDK (API 33+)
- Android Emulator hoặc thiết bị thật

---

## 🔧 BƯỚC 1: SETUP BACKEND

### 1.1. Cài đặt Dependencies

```bash
cd entalk-backend
npm install
```

### 1.2. Tạo File Environment (.env)

```bash
# Copy từ file mẫu
cp env.example .env
```

File `.env` đã có sẵn tất cả API keys:
- ✅ Firebase credentials (Project ID, Private Key, Client Email)
- ✅ Azure Speech API Key + Region
- ✅ Google Gemini API Key

**Không cần thay đổi gì!** Tất cả đã được cấu hình sẵn.

### 1.3. Kiểm Tra Cấu Hình

Mở file `.env` và xác nhận các giá trị sau:

```env
# Firebase
FIREBASE_PROJECT_ID=app-entalk
FIREBASE_STORAGE_BUCKET=app-entalk.appspot.com

# Azure Speech
AZURE_SPEECH_KEY=50A4U5VCBw2XDJObpxAomsKato4PAK4LbhKUVaSkriIY9bGtR0QJJQQJ99BKACYeBjFXJ3w3AAAYACOGCTUc
AZURE_SPEECH_REGION=eastus

# Google Gemini
GEMINI_API_KEY=AIzaSyAsjeNx0_hS0KXtyzx7JRBy08fYALozZcQ
```

### 1.4. Chạy Backend

```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:3000`

**Kiểm tra logs:**
```bash
tail -f logs/combined.log
```

---

## 📱 BƯỚC 2: SETUP FRONTEND

### 2.1. Cài đặt Dependencies

```bash
cd entalk-frontend
npm install
```

### 2.2. Download google-services.json

1. Vào Firebase Console: https://console.firebase.google.com/project/app-entalk
2. Project Settings → Your apps → Android app
3. Download `google-services.json`
4. Copy vào: `entalk-frontend/android/app/google-services.json`

### 2.3. Cập Nhật Firebase Config

Mở file: `entalk-frontend/src/config/firebase.ts`

Thay thế các giá trị placeholder bằng giá trị thật từ Firebase Console:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Thay bằng API Key thật
  authDomain: "app-entalk.firebaseapp.com",
  projectId: "app-entalk",
  storageBucket: "app-entalk.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID", // Thay bằng Sender ID thật
  appId: "YOUR_APP_ID",                // Thay bằng App ID thật
};
```

### 2.4. Cập Nhật Backend URL

Mở file: `entalk-frontend/src/utils/constants.ts`

Cập nhật API_BASE_URL:

```typescript
// Nếu chạy trên emulator
export const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Nếu chạy trên thiết bị thật
// export const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api';
```

### 2.5. Cài Đặt Permissions (Android)

File `android/app/src/main/AndroidManifest.xml` đã có sẵn permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

## 🏃 BƯỚC 3: CHẠY ỨNG DỤNG

### 3.1. Start Metro Bundler

Terminal 1:
```bash
cd entalk-frontend
npm start
```

### 3.2. Chạy Backend

Terminal 2:
```bash
cd entalk-backend
npm start
```

### 3.3. Chạy Android App

Terminal 3:

**Trên Emulator:**
```bash
cd entalk-frontend
npm run android
```

**Hoặc:**
```bash
npx react-native run-android
```

---

## 🎯 BƯỚC 4: KIỂM TRA APP

### 4.1. Đăng Ký Tài Khoản Mới

1. Mở app
2. Nhấn "Đăng ký"
3. Nhập thông tin:
   - Email: test@example.com
   - Password: 123456
   - Display Name: Test User
4. Nhấn "Đăng ký"

### 4.2. Kiểm Tra Các Tính Năng

**Core Features:**
- ✅ Đăng nhập/Đăng ký
- ✅ Xem danh sách bài học
- ✅ Luyện phát âm (ghi âm)
- ✅ Xem kết quả chi tiết
- ✅ Lịch sử luyện tập
- ✅ Profile & Settings

**Advanced Features:**
- ✅ Freestyle (tạo bài học tự do)
- ✅ AI Chatbot
- ✅ AI Role-Play
- ✅ Vocabulary (tra từ)

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Unable to resolve module..."

```bash
cd entalk-frontend
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

### Lỗi: Gradle build failed

```bash
cd entalk-frontend/android
./gradlew clean
cd ..
npm run android
```

### Lỗi: Firebase không connect

1. Kiểm tra `google-services.json` đã copy đúng chưa
2. Kiểm tra Firebase config trong `firebase.ts`
3. Rebuild app:
   ```bash
   cd entalk-frontend/android
   ./gradlew clean
   cd ..
   npm run android
   ```

### Lỗi: Backend không kết nối được

1. Kiểm tra backend đang chạy: `http://localhost:3000`
2. Kiểm tra API_BASE_URL trong `constants.ts`:
   - Emulator: `http://10.0.2.2:3000/api`
   - Device: `http://YOUR_LOCAL_IP:3000/api`
3. Kiểm tra firewall không block port 3000

### Lỗi: Microphone permission denied

1. Vào Settings → Apps → EnTalk → Permissions
2. Bật quyền Microphone
3. Hoặc uninstall app và install lại

### Lỗi: Azure Speech API không hoạt động

1. Kiểm tra `.env` có AZURE_SPEECH_KEY và AZURE_SPEECH_REGION
2. Kiểm tra API key còn hạn sử dụng
3. Xem logs: `entalk-backend/logs/error.log`

### Lỗi: Gemini API không hoạt động

1. Kiểm tra `.env` có GEMINI_API_KEY
2. Kiểm tra API key còn quota
3. Xem logs: `entalk-backend/logs/error.log`

---

## 📊 KIỂM TRA LOGS

### Backend Logs:

```bash
# All logs
tail -f entalk-backend/logs/combined.log

# Error logs only
tail -f entalk-backend/logs/error.log
```

### Frontend Logs:

```bash
# React Native logs
npx react-native log-android

# Hoặc xem trong Metro bundler terminal
```

---

## 🎉 HOÀN THÀNH!

Nếu mọi thứ hoạt động tốt, bạn sẽ thấy:

1. ✅ Backend chạy tại `http://localhost:3000`
2. ✅ App mở trên emulator/device
3. ✅ Có thể đăng ký/đăng nhập
4. ✅ Có thể xem danh sách bài học
5. ✅ Có thể ghi âm và nhận điểm số
6. ✅ Có thể chat với AI
7. ✅ Có thể tra từ vựng

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra logs backend: `entalk-backend/logs/`
2. Kiểm tra React Native logs: `npx react-native log-android`
3. Kiểm tra Firebase Console: https://console.firebase.google.com/project/app-entalk
4. Xem API Documentation: `API_DOCUMENTATION.md`
5. Xem tiến trình: `TIEN_TRINH_HOAN_THIEN_ENTALK.md`

---

## 🚀 NEXT STEPS

Sau khi app chạy thành công:

1. **Testing:** Test toàn bộ luồng và tính năng
2. **Bug Fixes:** Fix các bugs phát hiện được
3. **Performance:** Optimize performance nếu cần
4. **Deployment:** Deploy backend lên cloud (Railway/Render)
5. **Build APK:** Build APK để cài trên thiết bị thật

---

**Chúc bạn thành công! 🎊**

