# EnTalk Frontend - React Native App (Android)

Ứng dụng mobile học phát âm tiếng Anh với AI - **Chỉ hỗ trợ Android**.

## 🚀 Tính năng

- ✅ **Authentication** - Đăng ký, đăng nhập, quên mật khẩu
- ✅ **Lessons** - Học phát âm với bài học có sẵn
- ✅ **AI Role-Play** - Hội thoại với AI trong tình huống thực tế
- ✅ **Freestyle** - Tạo bài học từ văn bản tùy chỉnh
- ✅ **AI Chatbot** - Trợ lý học tiếng Anh 24/7
- ✅ **Pronunciation Assessment** - Chấm điểm phát âm tự động
- ✅ **Vocabulary** - Sổ tay từ vựng với flashcards
- ✅ **Progress Tracking** - Theo dõi tiến độ học tập

## 📦 Cài đặt

### 1. Prerequisites

- Node.js >= 18
- Java JDK 11 hoặc 17
- Android Studio (latest version)
- Android SDK (API 34)

### 2. Cài đặt dependencies

```bash
cd entalk-frontend
npm install
```

### 3. Cấu hình Firebase

1. Vào [Firebase Console](https://console.firebase.google.com/project/app-entalk)
2. Project Settings → Your apps → Android app
3. Download `google-services.json`
4. Copy vào `android/app/google-services.json`

### 4. Cấu hình API

Chỉnh sửa file `src/config/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'app-entalk.firebaseapp.com',
  projectId: 'app-entalk',
  storageBucket: 'app-entalk.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Cho Android Emulator
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/api'  
  : 'https://your-production-url.com/api';

// Nếu dùng thiết bị thật, dùng IP local:
// export const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

## 🏃 Chạy ứng dụng

**Xem hướng dẫn chi tiết:** [SETUP_ANDROID.md](./SETUP_ANDROID.md)

### Quick Start

1. **Start Backend**
   ```bash
   cd ../entalk-backend
   npm start
   ```

2. **Start Metro Bundler**
   ```bash
   cd entalk-frontend
   npm start
   ```

3. **Run Android** (Terminal mới)
   ```bash
   npm run android
   ```

## 📁 Cấu trúc thư mục

```
entalk-frontend/
├── src/
│   ├── components/          # UI components
│   │   ├── common/          # Shared components
│   │   ├── audio/           # Audio components
│   │   ├── lessons/         # Lesson components
│   │   ├── results/         # Result components
│   │   ├── roleplay/        # Role-play components
│   │   ├── chatbot/         # Chatbot components
│   │   └── vocabulary/      # Vocabulary components
│   ├── screens/             # Màn hình chính
│   │   ├── auth/            # Authentication screens
│   │   ├── home/            # Home screen
│   │   ├── lessons/         # Lesson screens
│   │   ├── results/         # Result screens
│   │   ├── profile/         # Profile screens
│   │   ├── roleplay/        # Role-play screens
│   │   ├── freestyle/       # Freestyle screens
│   │   ├── chatbot/         # Chatbot screen
│   │   └── vocabulary/      # Vocabulary screens
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.tsx # Root navigator
│   │   ├── AuthNavigator.tsx # Auth screens
│   │   └── MainNavigator.tsx # Main app (Bottom Tabs)
│   ├── services/            # API & Firebase services
│   │   ├── apiService.ts    # Backend API calls
│   │   ├── authService.ts   # Firebase Auth
│   │   ├── firestoreService.ts # Firestore operations
│   │   ├── storageService.ts # Firebase Storage
│   │   └── audioService.ts  # Audio recording/playback
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # Authentication context
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Helper functions
│   │   ├── constants.ts     # Constants (colors, API endpoints)
│   │   ├── helpers.ts       # Helper functions
│   │   └── validation.ts    # Validation functions
│   ├── config/              # Configuration
│   │   └── firebase.ts      # Firebase config
│   ├── locales/             # i18n (Tiếng Việt)
│   │   ├── index.ts         # i18n setup
│   │   └── vi.json          # Vietnamese translations
│   └── assets/              # Images, icons, sounds
├── android/                 # Android native code
├── ios/                     # iOS native code
├── App.tsx                  # Root component
├── index.js                 # Entry point
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## 🎨 Tech Stack

- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Firebase** - Authentication, Firestore, Storage
- **Axios** - HTTP client
- **React Native Audio Recorder Player** - Audio recording
- **React Native Sound** - Audio playback
- **i18n-js** - Internationalization

## 🔒 Permissions Android

File `android/app/src/main/AndroidManifest.xml` đã được cấu hình các quyền:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🐛 Troubleshooting

### Metro Bundler cache issues

```bash
npm start -- --reset-cache
```

### Android build errors

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Firebase errors

- Kiểm tra `google-services.json` có trong `android/app/`
- Kiểm tra Firebase config trong `src/config/firebase.ts`
- Kiểm tra Firebase Console đã enable các services (Auth, Firestore, Storage)

## 📚 Documentation

- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase](https://rnfirebase.io/)
- [API Documentation](../API_DOCUMENTATION.md)

## 🚀 Build Android APK Release

```bash
cd android
gradlew assembleRelease
```

APK sẽ được tạo tại: `android\app\build\outputs\apk\release\app-release.apk`

### Cài đặt APK lên thiết bị

```bash
adb install android\app\build\outputs\apk\release\app-release.apk
```

## 📝 TODO

- [ ] Implement LessonsListScreen
- [ ] Implement PracticeScreen
- [ ] Implement ResultScreen
- [ ] Implement Role-Play screens
- [ ] Implement Freestyle screens
- [ ] Implement Chatbot screen
- [ ] Implement Vocabulary screens
- [ ] Add animations (Lottie)
- [ ] Add charts (react-native-chart-kit)
- [ ] Unit tests

## 📄 License

MIT License - © 2024 EnTalk Team

