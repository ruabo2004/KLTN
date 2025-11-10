# KẾ HOẠCH HOÀN THIỆN APP ENTALK

## 📋 TỔNG QUAN DỰ ÁN

**Tên ứng dụng**: EnTalk - English Talk & Learn

**Khẩu hiệu**: "Nói tiếng Anh tự tin cùng AI"

**Mục tiêu**: Xây dựng ứng dụng học phát âm tiếng Anh thông minh với:
- ✅ Chấm điểm phát âm tự động bằng Azure AI
- ✅ Hội thoại với AI trong tình huống thực tế
- ✅ Import nội dung tùy chỉnh để luyện tập
- ✅ Chatbot trợ lý học tập 24/7
- ✅ Phân tích ngữ điệu chi tiết
- ✅ **Giao diện 100% tiếng Việt** (dành cho người Việt học tiếng Anh)

**Công nghệ sử dụng**:
- **Giao diện**: React Native
- **Máy chủ**: Node.js + Express
- **Cơ sở dữ liệu**: Firebase Firestore
- **Lưu trữ**: Firebase Storage
- **Xác thực**: Firebase Authentication
- **Dịch vụ AI**: 
  - Azure AI Speech (Đánh giá phát âm, Chuyển giọng nói thành văn bản, Chuyển văn bản thành giọng nói)
  - Google Gemini API (Chatbot AI & Đóng vai)
  - Free Dictionary API (Từ vựng)

---

## 🗄️ PHẦN 1: THIẾT KẾ CƠ SỞ DỮ LIỆU (FIREBASE FIRESTORE)

### 1.1. Bảng: `users` (Người dùng)
```
users/{userId}
  ├── email: string
  ├── displayName: string
  ├── photoURL: string (URL từ Firebase Storage)
  ├── photoStoragePath: string (path trong Storage để xóa sau)
  ├── language: string (vi/en - ngôn ngữ giao diện, mặc định: vi)
  ├── createdAt: timestamp
  ├── updatedAt: timestamp
  ├── lastLoginAt: timestamp
  ├── totalPractices: number
  ├── averageScore: number
  └── level: string (beginner/intermediate/advanced)
```

**Lưu ý về Avatar:**
- File ảnh lưu trong **Firebase Storage**: `/avatars/{userId}/avatar_{timestamp}.jpg`
- URL lưu trong Firestore field `photoURL`
- Resize về 300x300px trước khi upload
- Max size: 5MB
- Format: JPEG/PNG

### 1.2. Collection: `lessons`
```
lessons/{lessonId}
  ├── title: string
  ├── description: string
  ├── level: string
  ├── category: string (pronunciation/vocabulary/sentence)
  ├── order: number
  ├── createdAt: timestamp
  └── isActive: boolean
```

### 1.3. SubCollection: `lessons/{lessonId}/exercises`
```
exercises/{exerciseId}
  ├── text: string (câu mẫu cần đọc)
  ├── phonetic: string (phiên âm IPA)
  ├── audioUrl: string (file âm thanh mẫu)
  ├── order: number
  ├── difficulty: string
  └── tips: string (gợi ý phát âm)
```

### 1.4. Collection: `scores`
```
scores/{scoreId}
  ├── userId: string
  ├── lessonId: string
  ├── exerciseId: string
  ├── audioUrl: string (link file ghi âm của user)
  ├── createdAt: timestamp
  ├── status: string (processing/completed/failed)
  ├── overallScore: number (0-100)
  ├── accuracyScore: number
  ├── fluencyScore: number
  ├── completenessScore: number
  ├── pronunciationScore: number
  ├── prosodyScore: number (điểm ngữ điệu 0-100)
  ├── detailedResult: object {
  │     words: array [
  │       {
  │         word: string,
  │         accuracyScore: number,
  │         errorType: string
  │       }
  │     ]
  │   }
  └── feedback: string
```

### 1.5. Collection: `userProgress`
```
userProgress/{userId}/lessons/{lessonId}
  ├── completedExercises: array[exerciseId]
  ├── bestScore: number
  ├── lastPracticeAt: timestamp
  ├── totalAttempts: number
  └── isCompleted: boolean
```

### 1.6. Collection: `scenarios` (Cho AI Role-Play)
```
scenarios/{scenarioId}
  ├── title: string (vd: "At a Restaurant")
  ├── description: string
  ├── icon: string
  ├── level: string
  ├── estimatedTime: number (phút)
  ├── systemPrompt: string (prompt cho AI)
  └── isActive: boolean
```

### 1.7. Collection: `conversations` (Lịch sử AI Role-Play)
```
conversations/{conversationId}
  ├── userId: string
  ├── scenarioId: string
  ├── startedAt: timestamp
  ├── endedAt: timestamp
  ├── totalTurns: number
  ├── averageScore: number
  └── messages: array [
      {
        role: string (user/ai),
        text: string,
        audioUrl: string (optional),
        pronunciationScore: number (nếu là user),
        timestamp: timestamp
      }
    ]
```

### 1.8. Collection: `freestyle_lessons` (Bài học tự tạo)
```
freestyle_lessons/{lessonId}
  ├── userId: string
  ├── title: string (optional)
  ├── originalText: string (văn bản gốc)
  ├── createdAt: timestamp
  ├── expiresAt: timestamp (tự động xóa sau 7 ngày)
  └── exercises: subcollection (tương tự lessons/exercises)
```

### 1.9. Collection: `vocabulary` (Từ vựng đã lưu)
```
vocabulary/{userId}/words/{wordId}
  ├── word: string
  ├── phonetic: string
  ├── definition: string
  ├── example: string
  ├── savedAt: timestamp
  ├── lastReviewedAt: timestamp
  ├── reviewCount: number
  ├── mastered: boolean
  └── sourceExerciseId: string (optional - từ bài tập nào)
```

### 1.10. Collection: `chatbot_conversations` (Lịch sử chat với AI)
```
chatbot_conversations/{conversationId}
  ├── userId: string
  ├── startedAt: timestamp
  ├── lastMessageAt: timestamp
  └── messages: array [
      {
        role: string (user/assistant),
        content: string,
        timestamp: timestamp
      }
    ]
```

### 1.11. Firebase Storage Structure
```
/audio/
  ├── samples/              # File âm thanh mẫu
  │   └── {lessonId}/
  │       └── {exerciseId}.wav
  ├── recordings/           # File ghi âm của user
  │   └── {userId}/
  │       └── {timestamp}_{exerciseId}.wav
  ├── freestyle/            # Audio cho freestyle lessons
  │   └── {lessonId}/
  │       └── {exerciseId}.mp3
  └── roleplay/             # Audio cho AI conversations
      └── {conversationId}/
          └── {messageId}.mp3

/avatars/                   # Ảnh đại diện user
  └── {userId}/
      └── avatar_{timestamp}.jpg
```

**Storage Rules:**
- Avatars: Max 5MB, chỉ user đó mới upload được avatar của mình
- Audio recordings: Max 10MB, chỉ user đó mới upload được
- Samples & freestyle: Chỉ admin/backend có quyền write

---

### 1.12. Firebase Security Rules

#### Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - user chỉ đọc/ghi data của mình
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Lessons & exercises - public read, admin write
    match /lessons/{lessonId} {
      allow read: if true;
      allow write: if false; // Chỉ admin/backend
      
      match /exercises/{exerciseId} {
        allow read: if true;
        allow write: if false;
      }
    }
    
    // Scores - user chỉ xem scores của mình
    match /scores/{scoreId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if false; // Chỉ backend update
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // User progress - private
    match /userProgress/{userId}/lessons/{lessonId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Scenarios - public read
    match /scenarios/{scenarioId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Conversations - user chỉ xem conversations của mình
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Freestyle lessons - user chỉ xem/tạo của mình
    match /freestyle_lessons/{lessonId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Vocabulary - private per user
    match /vocabulary/{userId}/words/{wordId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Chatbot conversations - private
    match /chatbot_conversations/{conversationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

#### Firebase Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Avatars - public read, user write own avatar
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth.uid == userId;
    }
    
    // User recordings - private
    match /audio/recordings/{userId}/{fileName} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('audio/.*');
      allow delete: if request.auth.uid == userId;
    }
    
    // Sample audio - public read, admin write
    match /audio/samples/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Freestyle audio - user only
    match /audio/freestyle/{lessonId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if false; // Chỉ backend tạo
    }
    
    // Role-play audio - user only
    match /audio/roleplay/{conversationId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if false; // Chỉ backend tạo
    }
  }
}
```

---

## 🔧 PHẦN 2: BACKEND (NODE.JS + EXPRESS)

### 2.1. Cấu trúc thư mục
```
backend/
├── src/
│   ├── config/
│   │   ├── firebase.js          # Firebase Admin SDK config
│   │   ├── azure.js             # Azure Speech SDK config
│   │   ├── gemini.js            # Google Gemini API config
│   │   └── env.js               # Environment variables
│   ├── middleware/
│   │   ├── auth.js              # Verify Firebase token
│   │   ├── errorHandler.js     # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validator.js         # Request validation
│   ├── controllers/
│   │   ├── scoringController.js    # Xử lý chấm điểm
│   │   ├── lessonController.js     # Quản lý bài học
│   │   ├── userController.js       # Quản lý user
│   │   ├── roleplayController.js   # AI Role-Play
│   │   ├── freestyleController.js  # Freestyle lessons
│   │   ├── chatbotController.js    # AI Chatbot
│   │   └── vocabularyController.js # Vocabulary management
│   ├── services/
│   │   ├── azureSpeechService.js   # Azure Speech (STT, TTS, Assessment)
│   │   ├── geminiService.js        # Google Gemini AI
│   │   ├── dictionaryService.js    # Free Dictionary API
│   │   ├── firebaseService.js      # Tương tác với Firestore
│   │   ├── storageService.js       # Xử lý file từ Storage
│   │   └── nlpService.js           # NLP processing (sentence splitting)
│   ├── routes/
│   │   ├── scoring.js
│   │   ├── lessons.js
│   │   ├── users.js
│   │   ├── roleplay.js
│   │   ├── freestyle.js
│   │   ├── chatbot.js
│   │   └── vocabulary.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   └── audioProcessor.js
│   └── app.js                   # Express app setup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### 2.2. Dependencies cần cài đặt
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "firebase-admin": "^12.0.0",
    "microsoft-cognitiveservices-speech-sdk": "^1.34.0",
    "@google/generative-ai": "^0.1.3",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "compromise": "^14.10.0",
    "node-fetch": "^3.3.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

### 2.3. Environment Variables (.env.example)

**File: `.env.example`**

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Azure Speech Service
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**Lưu ý**:
- KHÔNG commit file `.env` lên Git
- Chỉ commit `.env.example` (không có giá trị thật)
- Mỗi developer tạo file `.env` riêng từ template

---

### 2.4. API Endpoints chính

#### 2.3.1. POST `/api/scoring/request`
**Mục đích**: Nhận yêu cầu chấm điểm từ app

**Request Body**:
```json
{
  "fileUrl": "https://firebasestorage.googleapis.com/...",
  "userId": "user-abc",
  "lessonId": "lesson-123",
  "exerciseId": "exercise-456",
  "referenceText": "Hello, how are you today?"
}
```

**Response**:
```json
{
  "success": true,
  "scoreId": "score-789",
  "message": "Processing started. Results will be available shortly."
}
```

**Xử lý**:
1. Validate Firebase token
2. Tạo document trong collection `scores` với status="processing"
3. Tải file từ Firebase Storage
4. Gửi đến Azure Speech API
5. Nhận kết quả và cập nhật document
6. App sẽ tự động nhận được kết quả qua Firestore listener

#### 2.3.2. GET `/api/lessons`
**Mục đích**: Lấy danh sách bài học

**Query params**: `?level=beginner&category=pronunciation`

**Response**:
```json
{
  "success": true,
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Basic Vowels",
      "description": "...",
      "level": "beginner",
      "totalExercises": 10
    }
  ]
}
```

#### 2.3.3. GET `/api/lessons/:lessonId/exercises`
**Mục đích**: Lấy các bài tập trong một bài học

#### 2.3.4. GET `/api/users/:userId/progress`
**Mục đích**: Lấy tiến độ học tập của user

#### 2.3.5. GET `/api/users/:userId/scores`
**Mục đích**: Lấy lịch sử điểm số

**Query params**: `?limit=20&offset=0`

#### 2.3.6. POST `/api/users/upload-avatar`
**Mục đích**: Upload ảnh đại diện user

**Request**: Multipart form-data
- `file`: Image file (JPEG/PNG, max 5MB)

**Response**:
```json
{
  "success": true,
  "photoURL": "https://firebasestorage.googleapis.com/..."
}
```

**Xử lý**:
1. Validate file (type, size)
2. Resize về 300x300px (dùng Sharp)
3. Upload lên Firebase Storage: `/avatars/{userId}/avatar_{timestamp}.jpg`
4. Lấy public URL
5. Update Firestore `users.photoURL`
6. (Optional) Update Firebase Auth profile
7. Xóa avatar cũ nếu có

---

### 2.3B. API Endpoints MỚI (Advanced Features)

#### 2.3.7. POST `/api/roleplay/start`
**Mục đích**: Bắt đầu cuộc hội thoại AI Role-Play

**Request Body**:
```json
{
  "userId": "user-abc",
  "scenarioId": "restaurant"
}
```

**Response**:
```json
{
  "success": true,
  "conversationId": "conv-123",
  "firstMessage": {
    "text": "Hi, welcome to our restaurant. What can I get for you?",
    "audioUrl": "https://..."
  }
}
```

#### 2.3.8. POST `/api/roleplay/respond`
**Mục đích**: Xử lý câu trả lời của user trong Role-Play

**Request Body**:
```json
{
  "conversationId": "conv-123",
  "audioUrl": "https://...",
  "userId": "user-abc"
}
```

**Xử lý**:
1. Speech-to-Text: Convert audio → text
2. Pronunciation Assessment: Chấm điểm phát âm
3. Gemini AI: Tạo câu phản hồi tiếp theo dựa trên context
4. Text-to-Speech: Tạo audio cho câu phản hồi
5. Lưu vào Firestore

**Response**:
```json
{
  "success": true,
  "userText": "I'd like a cappuccino please",
  "pronunciationScore": 85,
  "aiResponse": {
    "text": "Great choice! Would you like that hot or iced?",
    "audioUrl": "https://..."
  }
}
```

#### 2.3.9. POST `/api/freestyle/create`
**Mục đích**: Tạo bài học freestyle từ văn bản user nhập

**Request Body**:
```json
{
  "userId": "user-abc",
  "text": "The quick brown fox jumps over the lazy dog. This is a sample sentence.",
  "title": "My Custom Lesson"
}
```

**Xử lý**:
1. Tách văn bản thành các câu (dùng NLP)
2. Tạo audio mẫu cho mỗi câu (Azure TTS)
3. Lưu vào Firestore với expiresAt = 7 ngày

**Response**:
```json
{
  "success": true,
  "lessonId": "freestyle-789",
  "totalExercises": 2,
  "exercises": [
    {
      "id": "ex-1",
      "text": "The quick brown fox jumps over the lazy dog.",
      "audioUrl": "https://..."
    }
  ]
}
```

#### 2.3.10. POST `/api/chatbot/message`
**Mục đích**: Chat với AI trợ lý

**Request Body**:
```json
{
  "userId": "user-abc",
  "message": "Dịch: Hello, how are you?",
  "conversationId": "chat-456"
}
```

**Response**:
```json
{
  "success": true,
  "reply": "📝 Dịch: \"Xin chào, bạn khỏe không?\"\n\n💡 Giải thích:\n- \"How are you?\" là câu hỏi thăm hỏi phổ biến...",
  "conversationId": "chat-456"
}
```

#### 2.3.11. GET `/api/vocabulary/:userId/words`
**Mục đích**: Lấy danh sách từ vựng đã lưu

**Response**:
```json
{
  "success": true,
  "words": [
    {
      "word": "implement",
      "phonetic": "/ˈɪmplɪment/",
      "definition": "Thực hiện, triển khai",
      "example": "The company will implement new policies",
      "savedAt": "2024-01-15T10:30:00Z",
      "mastered": false
    }
  ]
}
```

#### 2.3.12. POST `/api/vocabulary/lookup`
**Mục đích**: Tra cứu từ vựng

**Request Body**:
```json
{
  "word": "implement"
}
```

**Response**:
```json
{
  "success": true,
  "word": "implement",
  "phonetic": "/ˈɪmplɪment/",
  "definitions": [
    {
      "partOfSpeech": "verb",
      "definition": "Put (a decision, plan, agreement, etc.) into effect",
      "example": "The company implemented a new policy"
    }
  ],
  "synonyms": ["execute", "carry out", "put into practice"]
}
```

#### 2.3.13. POST `/api/vocabulary/save`
**Mục đích**: Lưu từ vào flashcard

**Request Body**:
```json
{
  "userId": "user-abc",
  "word": "implement",
  "phonetic": "/ˈɪmplɪment/",
  "definition": "Thực hiện, triển khai",
  "example": "...",
  "sourceExerciseId": "ex-123"
}
```

#### 2.3.14. GET `/api/scenarios`
**Mục đích**: Lấy danh sách scenarios cho Role-Play

**Response**:
```json
{
  "success": true,
  "scenarios": [
    {
      "id": "restaurant",
      "title": "At a Restaurant",
      "description": "Order food, ask questions, pay the bill",
      "icon": "🍽️",
      "level": "beginner",
      "estimatedTime": 5
    }
  ]
}
```

---

### 2.4. Azure Speech Service Integration

**File: `services/azureSpeechService.js`**

Chức năng chính:
- Sử dụng Pronunciation Assessment API
- Gửi file audio + reference text
- Nhận về điểm số chi tiết cho từng từ
- Parse kết quả JSON từ Azure

**Tham số cấu hình**:
```javascript
{
  gradingSystem: "HundredMark",
  granularity: "Word",
  enableMiscue: true,
  scenarioId: "..."
}
```

---

## 📱 PHẦN 3: FRONTEND (REACT NATIVE)

### 3.1. Cấu trúc thư mục
```
frontend/
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.js      # Main navigation
│   │   ├── AuthNavigator.js     # Auth screens
│   │   ├── MainNavigator.js     # Authenticated screens (Tab Navigator)
│   │   └── RolePlayNavigator.js # Role-play flow
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── lessons/
│   │   │   ├── LessonsListScreen.js
│   │   │   ├── LessonDetailScreen.js
│   │   │   └── PracticeScreen.js
│   │   ├── results/
│   │   │   ├── ResultScreen.js
│   │   │   └── HistoryScreen.js
│   │   ├── profile/
│   │   │   └── ProfileScreen.js
│   │   ├── roleplay/              # MỚI
│   │   │   ├── ScenariosListScreen.js
│   │   │   ├── RolePlayScreen.js
│   │   │   └── ConversationHistoryScreen.js
│   │   ├── freestyle/             # MỚI
│   │   │   ├── FreestyleScreen.js
│   │   │   └── FreestylePracticeScreen.js
│   │   ├── chatbot/               # MỚI
│   │   │   └── ChatbotScreen.js
│   │   └── vocabulary/            # MỚI
│   │       ├── VocabularyScreen.js
│   │       ├── FlashcardScreen.js
│   │       └── VocabularyQuizScreen.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── Loading.js
│   │   ├── audio/
│   │   │   ├── RecordButton.js
│   │   │   ├── AudioPlayer.js
│   │   │   └── WaveformVisualizer.js
│   │   ├── lessons/
│   │   │   ├── LessonCard.js
│   │   │   └── ExerciseItem.js
│   │   ├── results/
│   │   │   ├── ScoreCard.js
│   │   │   ├── WordAnalysis.js
│   │   │   ├── ProgressChart.js
│   │   │   └── ProsodyChart.js      # MỚI
│   │   ├── roleplay/                # MỚI
│   │   │   ├── ScenarioCard.js
│   │   │   ├── ConversationBubble.js
│   │   │   └── ScoreIndicator.js
│   │   ├── chatbot/                 # MỚI
│   │   │   ├── ChatMessage.js
│   │   │   ├── QuickActions.js
│   │   │   └── ActionButtons.js
│   │   └── vocabulary/              # MỚI
│   │       ├── VocabularyCard.js
│   │       ├── FlashcardItem.js
│   │       └── WordDefinitionModal.js
│   ├── services/
│   │   ├── authService.js       # Firebase Auth
│   │   ├── firestoreService.js  # Firestore operations
│   │   ├── storageService.js    # Firebase Storage
│   │   ├── audioService.js      # Recording & playback
│   │   ├── apiService.js        # Backend API calls
│   │   ├── roleplayService.js   # MỚI - Role-play API
│   │   ├── freestyleService.js  # MỚI - Freestyle API
│   │   ├── chatbotService.js    # MỚI - Chatbot API
│   │   └── vocabularyService.js # MỚI - Vocabulary API
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAudioRecorder.js
│   │   ├── useLessons.js
│   │   ├── useScores.js
│   │   ├── useRolePlay.js       # MỚI
│   │   ├── useChatbot.js        # MỚI
│   │   └── useVocabulary.js     # MỚI
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── config/
│   │   └── firebase.js
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── sounds/
├── App.js
├── package.json
└── README.md
```

### 3.2. Dependencies cần cài đặt
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/auth": "^19.0.0",
    "@react-native-firebase/firestore": "^19.0.0",
    "@react-native-firebase/storage": "^19.0.0",
    "react-native-audio-recorder-player": "^3.6.0",
    "react-native-sound": "^0.11.2",
    "axios": "^1.6.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "^14.1.0",
    "react-native-gifted-chat": "^2.4.0",
    "react-native-modal": "^13.0.1",
    "react-native-linear-gradient": "^2.8.3",
    "lottie-react-native": "^6.5.1",
    "react-native-image-picker": "^7.1.0",
    "react-native-fast-image": "^8.6.3",
    "i18n-js": "^4.3.2",
    "react-native-localize": "^3.0.3"
  }
}
```

### 3.3. Các màn hình chính

#### 3.3.1. LoginScreen
- Email/Password input
- Login button
- "Forgot Password" link
- "Register" link
- Social login (optional)

#### 3.3.2. HomeScreen
- Hiển thị overview: tổng số bài học, điểm trung bình, streak
- Quick access đến lessons
- Recent practice history

#### 3.3.3. LessonsListScreen
- Danh sách bài học theo category/level
- Filter và search
- Progress indicator cho mỗi bài

#### 3.3.4. PracticeScreen (Quan trọng nhất!)
**Chức năng**:
1. Hiển thị câu mẫu cần đọc
2. Hiển thị phiên âm IPA
3. Button phát audio mẫu
4. Button ghi âm (hold to record)
5. Visualizer hiển thị waveform khi ghi
6. Upload progress
7. Waiting for results (loading)

**Luồng xử lý**:
```javascript
// 1. User nhấn và giữ nút Record
onStartRecording()

// 2. User thả nút, dừng ghi âm
onStopRecording()
  -> Tạo file .wav
  
// 3. Upload lên Firebase Storage
uploadToStorage(audioFile)
  -> Nhận downloadURL
  
// 4. Gọi API backend
callScoringAPI({
  fileUrl: downloadURL,
  userId, lessonId, exerciseId,
  referenceText
})
  -> Nhận scoreId
  
// 5. Listen Firestore realtime
listenToScore(scoreId)
  -> Khi status = "completed"
  -> Navigate to ResultScreen
```

#### 3.3.5. ResultScreen
**Hiển thị**:
- Overall score (lớn, nổi bật)
- Accuracy, Fluency, Completeness, Pronunciation scores
- Word-by-word analysis (từ nào đúng, từ nào sai)
- Màu sắc: xanh (tốt), vàng (trung bình), đỏ (cần cải thiện)
- Button "Try Again"
- Button "Next Exercise"

#### 3.3.6. HistoryScreen
- List các lần luyện tập trước
- Filter theo lesson, date
- Xem lại kết quả chi tiết

---

## 🌍 PHẦN 4: ĐA NGÔN NGỮ (INTERNATIONALIZATION - i18n)

### 4.1. Tại sao cần 100% tiếng Việt?

**Đối tượng người dùng**: Người Việt học tiếng Anh
- ✅ Dễ hiểu hướng dẫn
- ✅ Dễ sử dụng app
- ✅ Giảm rào cản ngôn ngữ
- ✅ Tăng tỷ lệ sử dụng

**Nội dung tiếng Việt**:
- Tất cả UI/UX (buttons, labels, messages)
- Hướng dẫn sử dụng
- Thông báo lỗi
- Feedback từ AI Chatbot
- Giải thích ngữ pháp, từ vựng

**Nội dung tiếng Anh**:
- Bài học (lessons) - Nội dung cần học
- Exercises - Câu mẫu cần đọc
- Audio mẫu
- Kết quả phát âm (từng từ)

### 4.2. Cấu trúc i18n

**File: `src/i18n/index.js`**

```javascript
import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import vi from './locales/vi.json';
import en from './locales/en.json';

const i18n = new I18n({
  vi,
  en
});

// Mặc định tiếng Việt
i18n.locale = 'vi';
i18n.enableFallback = true;
i18n.defaultLocale = 'vi';

export default i18n;
```

### 4.3. File ngôn ngữ tiếng Việt

**File: `src/i18n/locales/vi.json`**

```json
{
  "common": {
    "app_name": "EnTalk",
    "ok": "Đồng ý",
    "cancel": "Hủy",
    "save": "Lưu",
    "delete": "Xóa",
    "edit": "Sửa",
    "back": "Quay lại",
    "next": "Tiếp theo",
    "skip": "Bỏ qua",
    "done": "Hoàn thành",
    "loading": "Đang tải...",
    "error": "Lỗi",
    "success": "Thành công",
    "retry": "Thử lại"
  },
  
  "auth": {
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "email": "Email",
    "password": "Mật khẩu",
    "confirm_password": "Xác nhận mật khẩu",
    "forgot_password": "Quên mật khẩu?",
    "display_name": "Tên hiển thị",
    "login_success": "Đăng nhập thành công!",
    "register_success": "Đăng ký thành công!",
    "invalid_email": "Email không hợp lệ",
    "password_too_short": "Mật khẩu phải có ít nhất 6 ký tự",
    "passwords_not_match": "Mật khẩu không khớp",
    "email_already_exists": "Email đã tồn tại",
    "invalid_credentials": "Email hoặc mật khẩu không đúng",
    "logout": "Đăng xuất"
  },
  
  "home": {
    "welcome": "Xin chào, {{name}}!",
    "your_progress": "Tiến độ của bạn",
    "total_lessons": "Tổng số bài học",
    "completed_lessons": "Bài đã hoàn thành",
    "average_score": "Điểm trung bình",
    "practice_streak": "Chuỗi ngày luyện tập",
    "days": "ngày",
    "continue_learning": "Tiếp tục học",
    "start_practicing": "Bắt đầu luyện tập"
  },
  
  "lessons": {
    "all_lessons": "Tất cả bài học",
    "my_lessons": "Bài học của tôi",
    "search_lessons": "Tìm kiếm bài học...",
    "filter_by_level": "Lọc theo cấp độ",
    "beginner": "Sơ cấp",
    "intermediate": "Trung cấp",
    "advanced": "Nâng cao",
    "lesson_detail": "Chi tiết bài học",
    "exercises": "Bài tập",
    "start_lesson": "Bắt đầu bài học",
    "continue_lesson": "Tiếp tục bài học",
    "completed": "Đã hoàn thành"
  },
  
  "practice": {
    "practice": "Luyện tập",
    "read_this_sentence": "Hãy đọc câu này:",
    "listen_sample": "Nghe mẫu",
    "tap_to_record": "Nhấn để ghi âm",
    "hold_to_record": "Giữ để ghi âm",
    "recording": "Đang ghi âm...",
    "processing": "Đang xử lý...",
    "uploading": "Đang tải lên...",
    "scoring": "Đang chấm điểm...",
    "try_again": "Thử lại",
    "next_exercise": "Bài tiếp theo",
    "submit": "Gửi",
    "recording_permission": "Bạn cần cấp quyền microphone để ghi âm",
    "recording_error": "Lỗi khi ghi âm. Vui lòng thử lại.",
    "upload_error": "Lỗi khi tải lên. Vui lòng kiểm tra kết nối mạng."
  },
  
  "results": {
    "your_score": "Điểm của bạn",
    "excellent": "Xuất sắc!",
    "good": "Tốt!",
    "not_bad": "Khá!",
    "need_improvement": "Cần cải thiện",
    "accuracy": "Độ chính xác",
    "fluency": "Độ trôi chảy",
    "completeness": "Độ hoàn chỉnh",
    "pronunciation": "Phát âm",
    "prosody": "Ngữ điệu",
    "word_analysis": "Phân tích từng từ",
    "correct": "Đúng",
    "incorrect": "Sai",
    "feedback": "Nhận xét",
    "view_history": "Xem lịch sử"
  },
  
  "history": {
    "practice_history": "Lịch sử luyện tập",
    "recent": "Gần đây",
    "this_week": "Tuần này",
    "this_month": "Tháng này",
    "all_time": "Tất cả",
    "no_history": "Chưa có lịch sử luyện tập",
    "score": "Điểm",
    "date": "Ngày"
  },
  
  "profile": {
    "profile": "Hồ sơ",
    "edit_profile": "Chỉnh sửa hồ sơ",
    "change_avatar": "Đổi ảnh đại diện",
    "upload_avatar": "Tải lên ảnh đại diện",
    "display_name": "Tên hiển thị",
    "email": "Email",
    "level": "Cấp độ",
    "joined": "Tham gia",
    "statistics": "Thống kê",
    "settings": "Cài đặt",
    "language": "Ngôn ngữ",
    "vietnamese": "Tiếng Việt",
    "english": "Tiếng Anh",
    "notifications": "Thông báo",
    "sound_effects": "Hiệu ứng âm thanh",
    "about": "Về ứng dụng",
    "version": "Phiên bản",
    "logout": "Đăng xuất"
  },
  
  "roleplay": {
    "ai_roleplay": "Đóng vai với AI",
    "scenarios": "Tình huống",
    "select_scenario": "Chọn tình huống",
    "start_conversation": "Bắt đầu hội thoại",
    "end_conversation": "Kết thúc hội thoại",
    "your_turn": "Đến lượt bạn",
    "ai_response": "AI trả lời",
    "conversation_history": "Lịch sử hội thoại",
    "restaurant": "Nhà hàng",
    "shopping": "Mua sắm",
    "airport": "Sân bay",
    "hospital": "Bệnh viện",
    "interview": "Phỏng vấn",
    "school": "Trường học",
    "hotel": "Khách sạn"
  },
  
  "freestyle": {
    "freestyle": "Tự do",
    "import_text": "Nhập văn bản",
    "paste_text": "Dán văn bản vào đây...",
    "create_lesson": "Tạo bài học",
    "my_lessons": "Bài học của tôi",
    "text_too_long": "Văn bản quá dài (tối đa 500 từ)",
    "creating": "Đang tạo bài học...",
    "created_success": "Tạo bài học thành công!",
    "delete_lesson": "Xóa bài học",
    "confirm_delete": "Bạn có chắc muốn xóa bài học này?"
  },
  
  "chatbot": {
    "ai_assistant": "Trợ lý AI",
    "ask_anything": "Hỏi bất cứ điều gì về tiếng Anh...",
    "quick_actions": "Gợi ý nhanh",
    "translate": "Dịch từ/câu",
    "explain_grammar": "Giải thích ngữ pháp",
    "check_pronunciation": "Kiểm tra phát âm",
    "suggest_lessons": "Gợi ý bài học",
    "study_tips": "Mẹo học tập",
    "type_message": "Nhập tin nhắn...",
    "send": "Gửi"
  },
  
  "vocabulary": {
    "vocabulary": "Từ vựng",
    "my_vocabulary": "Từ vựng của tôi",
    "saved_words": "Từ đã lưu",
    "flashcards": "Thẻ ghi nhớ",
    "quiz": "Trắc nghiệm",
    "search_word": "Tìm từ...",
    "definition": "Định nghĩa",
    "example": "Ví dụ",
    "synonyms": "Từ đồng nghĩa",
    "save_word": "Lưu từ",
    "remove_word": "Xóa từ",
    "practice_now": "Luyện tập ngay",
    "no_words": "Chưa có từ vựng nào",
    "start_learning": "Bắt đầu học"
  },
  
  "errors": {
    "network_error": "Lỗi kết nối mạng. Vui lòng kiểm tra internet.",
    "server_error": "Lỗi máy chủ. Vui lòng thử lại sau.",
    "permission_denied": "Bạn không có quyền truy cập.",
    "not_found": "Không tìm thấy.",
    "unknown_error": "Đã xảy ra lỗi. Vui lòng thử lại.",
    "file_too_large": "File quá lớn.",
    "invalid_format": "Định dạng không hợp lệ.",
    "quota_exceeded": "Đã vượt quá giới hạn. Vui lòng thử lại sau."
  },
  
  "notifications": {
    "practice_reminder": "Đã đến giờ luyện tập! 💪",
    "new_lesson": "Có bài học mới cho bạn!",
    "achievement_unlocked": "Bạn đã mở khóa thành tựu mới!",
    "streak_reminder": "Duy trì chuỗi ngày luyện tập của bạn!"
  }
}
```

### 4.4. Sử dụng i18n trong Components

**Example: LoginScreen.js**

```javascript
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import i18n from '../i18n';

const LoginScreen = () => {
  return (
    <View>
      <Text>{i18n.t('auth.login')}</Text>
      <TextInput placeholder={i18n.t('auth.email')} />
      <TextInput 
        placeholder={i18n.t('auth.password')} 
        secureTextEntry 
      />
      <Button 
        title={i18n.t('auth.login')} 
        onPress={handleLogin} 
      />
      <Text>{i18n.t('auth.forgot_password')}</Text>
    </View>
  );
};
```

### 4.5. Chatbot AI trả lời bằng tiếng Việt

**Backend: `services/geminiService.js`**

```javascript
const systemPrompt = `
Bạn là trợ lý AI của ứng dụng EnTalk - ứng dụng học phát âm tiếng Anh.

QUY TẮC QUAN TRỌNG:
- TRẢ LỜI HOÀN TOÀN BẰNG TIẾNG VIỆT
- Giải thích dễ hiểu, ngắn gọn
- Sử dụng emoji phù hợp
- Đưa ra ví dụ cụ thể bằng tiếng Anh (có dịch tiếng Việt)

NHIỆM VỤ:
- Giúp người dùng học tiếng Anh
- Dịch từ/câu (Anh → Việt hoặc Việt → Anh)
- Giải thích ngữ pháp bằng tiếng Việt
- Giải thích từ vựng bằng tiếng Việt
- Gợi ý cách học

VÍ DỤ:
User: "Dịch: Hello"
Bot: "📝 'Hello' nghĩa là 'Xin chào'

🎯 Cách dùng:
• Hello! (Xin chào!)
• Hello everyone (Chào mọi người)

💡 Từ tương tự: Hi, Hey, Greetings"
`;
```

### 4.6. Feedback kết quả bằng tiếng Việt

**Backend: Tạo feedback tiếng Việt**

```javascript
function generateVietnameseFeedback(score) {
  if (score >= 90) {
    return "🎉 Xuất sắc! Phát âm của bạn rất tốt!";
  } else if (score >= 75) {
    return "👍 Tốt lắm! Tiếp tục phát huy nhé!";
  } else if (score >= 60) {
    return "😊 Khá đấy! Còn một chút nữa thôi!";
  } else {
    return "💪 Cố gắng lên! Hãy nghe lại audio mẫu và thử lại nhé!";
  }
}

function generateWordFeedback(word, accuracyScore) {
  if (accuracyScore >= 80) {
    return `✅ Từ "${word}" phát âm chính xác`;
  } else if (accuracyScore >= 60) {
    return `⚠️ Từ "${word}" cần chú ý thêm`;
  } else {
    return `❌ Từ "${word}" cần luyện tập lại`;
  }
}
```

### 4.7. Đổi ngôn ngữ trong Settings

**SettingsScreen.js**

```javascript
const SettingsScreen = () => {
  const [language, setLanguage] = useState(i18n.locale);
  
  const changeLanguage = async (lang) => {
    i18n.locale = lang;
    setLanguage(lang);
    
    // Lưu vào Firestore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({ language: lang });
  };
  
  return (
    <View>
      <Text>{i18n.t('profile.language')}</Text>
      <Button 
        title={i18n.t('profile.vietnamese')}
        onPress={() => changeLanguage('vi')}
        disabled={language === 'vi'}
      />
      <Button 
        title={i18n.t('profile.english')}
        onPress={() => changeLanguage('en')}
        disabled={language === 'en'}
      />
    </View>
  );
};
```

### 4.8. Lưu ý quan trọng

**Nội dung tiếng Việt**:
- ✅ Tất cả UI (buttons, labels, titles)
- ✅ Thông báo, alerts, errors
- ✅ Hướng dẫn sử dụng
- ✅ Feedback từ AI
- ✅ Giải thích ngữ pháp, từ vựng
- ✅ Định nghĩa từ điển

**Nội dung tiếng Anh** (không dịch):
- ✅ Lessons content (nội dung bài học)
- ✅ Exercise sentences (câu mẫu cần đọc)
- ✅ Pronunciation results (từng từ trong kết quả)
- ✅ Example sentences (ví dụ minh họa)

**Ví dụ màn hình kết quả**:
```
┌─────────────────────────────┐
│ Kết quả của bạn            │ ← Tiếng Việt
├─────────────────────────────┤
│                             │
│ Câu bạn đọc:               │ ← Tiếng Việt
│ "Hello, how are you?"      │ ← Tiếng Anh (nội dung học)
│                             │
│ Điểm tổng: 85/100          │ ← Tiếng Việt
│ 👍 Tốt lắm!                │ ← Tiếng Việt
│                             │
│ Phân tích từng từ:         │ ← Tiếng Việt
│ • Hello: 90 ✅ Chính xác   │ ← Tiếng Anh + Việt
│ • how: 85 ✅ Tốt           │
│ • are: 80 ⚠️ Cần chú ý     │
│ • you: 85 ✅ Tốt           │
│                             │
│ [Thử lại] [Bài tiếp theo] │ ← Tiếng Việt
└─────────────────────────────┘
```

---

## 🔄 PHẦN 5: LUỒNG HOẠT ĐỘNG CHI TIẾT

### 4.1. User Registration Flow
```
1. User nhập email/password trong RegisterScreen
2. App gọi Firebase Auth createUserWithEmailAndPassword()
3. Nếu thành công, tạo document trong Firestore users/{userId}
4. Navigate to HomeScreen
```

### 4.2. User Login Flow
```
1. User nhập email/password trong LoginScreen
2. App gọi Firebase Auth signInWithEmailAndPassword()
3. Lưu user state vào AuthContext
4. Navigate to HomeScreen
```

### 4.3. Practice & Scoring Flow (Chi tiết nhất)
```
[React Native App]
1. User chọn lesson → LessonDetailScreen
2. User chọn exercise → PracticeScreen
3. User xem câu mẫu, nghe audio mẫu
4. User nhấn giữ nút Record → Bắt đầu ghi âm
5. User thả nút → Dừng ghi âm, tạo file recording.wav

6. Upload file lên Firebase Storage:
   Path: /audio/recordings/{userId}/{timestamp}_{exerciseId}.wav
   → Nhận downloadURL

7. Gọi Backend API:
   POST /api/scoring/request
   Body: { fileUrl, userId, lessonId, exerciseId, referenceText }
   → Nhận scoreId

8. Setup Firestore listener:
   onSnapshot(doc(`scores/${scoreId}`))
   → Đợi status chuyển từ "processing" → "completed"

[Node.js Backend]
9. Nhận request từ app
10. Validate token, tạo score document với status="processing"
11. Download file từ Firebase Storage về server
12. Gửi file + referenceText đến Azure Speech API
13. Azure xử lý và trả về JSON kết quả
14. Parse kết quả, tính toán feedback
15. Update score document với đầy đủ kết quả, status="completed"

[React Native App - Realtime]
16. Firestore listener phát hiện thay đổi
17. Lấy dữ liệu mới (scores, feedback)
18. Navigate to ResultScreen với data
19. Hiển thị kết quả đẹp mắt với animation
```

---

## 📅 PHẦN 5: TIMELINE & PRIORITY (CẬP NHẬT)

### 🎯 TỔNG QUAN TIMELINE
**Tổng thời gian**: 13-14 tuần
**Phân chia**: 
- Core Features (Tuần 1-8): BẮT BUỘC
- Advanced Features (Tuần 9-12): NÊN CÓ
- Polish & Deploy (Tuần 12-14): HOÀN THIỆN

---

### Phase 1: Foundation & Setup (Tuần 1-2)
**Priority: CRITICAL** ⭐⭐⭐⭐⭐

**Backend Setup:**
- [ ] Setup Firebase project (Authentication, Firestore, Storage)
- [ ] Setup Azure Speech Service account (FREE tier)
- [ ] Setup Google Gemini API key (FREE)
- [ ] Thiết kế database schema chi tiết (11 collections)
- [ ] Setup Backend project structure
- [ ] Cài đặt dependencies (Express, Firebase Admin, Azure SDK, Gemini SDK)
- [ ] Cấu hình environment variables
- [ ] Setup Firebase Admin SDK

**Frontend Setup:**
- [ ] Setup React Native project (npx react-native init)
- [ ] Cài đặt dependencies (Navigation, Firebase, Audio, Charts)
- [ ] Setup Firebase SDK
- [ ] Cấu hình navigation structure
- [ ] Setup folder structure

**Deliverable**: Project skeleton hoàn chỉnh, có thể chạy được

---

### Phase 2: Backend Core APIs (Tuần 3-4)
**Priority: HIGH** ⭐⭐⭐⭐⭐

**Core Services:**
- [ ] Implement Azure Speech Service (Pronunciation Assessment)
- [ ] Implement Firebase Admin operations
- [ ] Build authentication middleware
- [ ] Build error handling middleware
- [ ] Build rate limiter middleware

**Core APIs:**
- [ ] POST `/api/scoring/request` - Chấm điểm phát âm
- [ ] GET `/api/lessons` - Lấy danh sách bài học
- [ ] GET `/api/lessons/:id/exercises` - Lấy exercises
- [ ] GET `/api/users/:id/progress` - Tiến độ user
- [ ] GET `/api/users/:id/scores` - Lịch sử điểm
- [ ] POST `/api/users/upload-avatar` - Upload avatar

**Testing:**
- [ ] Test Azure API với sample audio files
- [ ] Test authentication flow
- [ ] Deploy backend lên cloud (Railway/Render - FREE tier)

**Deliverable**: Backend APIs core hoạt động, đã deploy

---

### Phase 3: Frontend Authentication (Tuần 4-5)
**Priority: HIGH** ⭐⭐⭐⭐⭐

- [ ] Build AuthContext với Firebase Auth
- [ ] Build LoginScreen (UI + logic)
- [ ] Build RegisterScreen (UI + logic)
- [ ] Build ForgotPasswordScreen
- [ ] Implement Firebase Authentication
- [ ] Build AppNavigator (Auth vs Main flow)
- [ ] Handle auth state persistence
- [ ] Error handling cho auth

**Deliverable**: User có thể đăng ký, đăng nhập thành công

---

### Phase 4: Frontend Core - Lessons & Practice (Tuần 5-7)
**Priority: HIGH** ⭐⭐⭐⭐⭐

**Week 5:**
- [ ] Build HomeScreen với stats overview
- [ ] Build LessonsListScreen (list + filter)
- [ ] Build LessonDetailScreen
- [ ] Implement Firestore listeners cho lessons

**Week 6:**
- [ ] Implement audio recording (react-native-audio-recorder-player)
- [ ] Build RecordButton component với animations
- [ ] Build WaveformVisualizer
- [ ] Test recording trên cả iOS và Android

**Week 7:**
- [ ] Build PracticeScreen (QUAN TRỌNG NHẤT)
- [ ] Implement Firebase Storage upload
- [ ] Implement API call to backend
- [ ] Implement Firestore realtime listener cho scores
- [ ] Handle loading states

**Deliverable**: User có thể luyện tập và nhận điểm

---

### Phase 5: Frontend Results & History (Tuần 7-8)
**Priority: HIGH** ⭐⭐⭐⭐

**Week 7-8:**
- [ ] Build ResultScreen với detailed analysis
- [ ] Build ScoreCard component
- [ ] Build WordAnalysis component (từng từ)
- [ ] Build HistoryScreen với filter
- [ ] Implement charts (react-native-chart-kit)
- [ ] Build ProfileScreen với stats
- [ ] Build ProgressChart component

**Deliverable**: User có thể xem kết quả chi tiết và lịch sử

---

### Phase 6: Content & Data Preparation (Tuần 8)
**Priority: MEDIUM** ⭐⭐⭐⭐

- [ ] Tạo 15-20 lessons với các level khác nhau
- [ ] Tạo 100-150 exercises (5-10 exercises/lesson)
- [ ] Thu âm hoặc tìm audio mẫu (có thể dùng Azure TTS)
- [ ] Viết phonetic (IPA) cho các exercises
- [ ] Viết tips/hints cho exercises khó
- [ ] Import data vào Firestore
- [ ] Test với data thật

**Deliverable**: App có đủ nội dung để demo

---

### ✨ Phase 7: Advanced Feature 1 - Freestyle & Chatbot (Tuần 9-10)
**Priority: HIGH** ⭐⭐⭐⭐⭐

**Week 9: Freestyle Import**
- [ ] Setup Google Gemini API
- [ ] Build nlpService.js (sentence splitting với Compromise)
- [ ] Build freestyleController.js
- [ ] Implement Azure Text-to-Speech
- [ ] POST `/api/freestyle/create` endpoint
- [ ] Build FreestyleScreen (Frontend)
- [ ] Build text input với validation
- [ ] Implement create freestyle lesson flow
- [ ] Test với văn bản khác nhau

**Week 10: AI Chatbot**
- [ ] Build geminiService.js
- [ ] Build chatbotController.js với system prompt
- [ ] POST `/api/chatbot/message` endpoint
- [ ] Build ChatbotScreen với react-native-gifted-chat
- [ ] Build QuickActions buttons
- [ ] Implement conversation history
- [ ] Handle actionable responses (navigate to lessons)
- [ ] Test với các câu hỏi khác nhau

**Deliverable**: User có thể import văn bản và chat với AI

---

### ✨ Phase 8: Advanced Feature 2 - AI Role-Play (Tuần 10-11)
**Priority: HIGH** ⭐⭐⭐⭐⭐

**Week 10-11:**
- [ ] Tạo 7 scenarios data trong Firestore
- [ ] Build roleplayController.js
- [ ] Implement Speech-to-Text (Azure)
- [ ] Implement Gemini conversation với context
- [ ] Implement Text-to-Speech cho AI responses
- [ ] POST `/api/roleplay/start` endpoint
- [ ] POST `/api/roleplay/respond` endpoint
- [ ] Build ScenariosListScreen
- [ ] Build RolePlayScreen với chat UI
- [ ] Build ConversationBubble component
- [ ] Implement realtime scoring display
- [ ] Build ConversationHistoryScreen
- [ ] Test end-to-end flow

**Deliverable**: User có thể hội thoại với AI trong các tình huống

---

### ✨ Phase 9: Advanced Feature 3 - Vocabulary (Tuần 11-12)
**Priority: MEDIUM** ⭐⭐⭐⭐

**Week 11-12:**
- [ ] Setup Free Dictionary API
- [ ] Build dictionaryService.js
- [ ] Build vocabularyController.js
- [ ] POST `/api/vocabulary/lookup` endpoint
- [ ] POST `/api/vocabulary/save` endpoint
- [ ] GET `/api/vocabulary/:userId/words` endpoint
- [ ] Build WordDefinitionModal component
- [ ] Integrate vào ResultScreen (tap word to see definition)
- [ ] Build VocabularyScreen (list saved words)
- [ ] Build FlashcardScreen với swipe
- [ ] Implement spaced repetition algorithm (basic)
- [ ] Build VocabularyQuizScreen

**Deliverable**: User có thể học từ vựng qua flashcards

---

### ✨ Phase 10: Advanced Feature 4 - Prosody Analysis (Tuần 12)
**Priority: LOW** ⭐⭐⭐

**Week 12:**
- [ ] Extract Prosody Score từ Azure response
- [ ] Update ResultScreen để hiển thị Prosody Score
- [ ] Build ProsodyChart component (basic line chart)
- [ ] Add feedback text cho prosody
- [ ] (Optional) Implement pitch extraction nếu có thời gian

**Deliverable**: User có thể thấy điểm ngữ điệu

---

### Phase 11: Polish & Testing (Tuần 12-13)
**Priority: MEDIUM** ⭐⭐⭐

**UI/UX Polish:**
- [ ] Add loading animations (Lottie)
- [ ] Add transitions giữa screens
- [ ] Improve color scheme và typography
- [ ] Add empty states
- [ ] Add error states với retry
- [ ] Improve button feedback

**Testing:**
- [ ] End-to-end testing cho core flow
- [ ] Test trên nhiều devices (iOS + Android)
- [ ] Test với network chậm
- [ ] Test với nhiều giọng nói khác nhau
- [ ] Test error cases
- [ ] Performance testing
- [ ] Fix bugs

**Deliverable**: App mượt mà, ít bugs

---

### Phase 12: Deployment & Documentation (Tuần 13-14)
**Priority: MEDIUM** ⭐⭐⭐

**Deployment:**
- [ ] Build APK cho Android
- [ ] (Optional) Build IPA cho iOS
- [ ] Deploy backend production
- [ ] Setup Firebase Security Rules
- [ ] Setup monitoring và logging

**Documentation:**
- [ ] Viết README.md chi tiết
- [ ] Viết API documentation
- [ ] Viết user guide (tiếng Việt)
- [ ] Tạo demo video
- [ ] Prepare presentation slides
- [ ] Viết báo cáo ĐATN (50-80 trang)

**Deliverable**: App sẵn sàng demo và nộp

---

## 📊 PRIORITY MATRIX

### MUST HAVE (Không thể thiếu)
- ✅ Authentication
- ✅ Lessons & Practice
- ✅ Pronunciation Scoring
- ✅ Results & History
- ✅ Basic Profile

### SHOULD HAVE (Nên có để nổi bật)
- ✅ Freestyle Import
- ✅ AI Chatbot
- ✅ AI Role-Play

### NICE TO HAVE (Tốt nếu có)
- ⭐ Vocabulary Flashcards
- ⭐ Prosody Analysis
- ⭐ Gamification
- ⭐ Social Features

---

## ⏱️ TIMELINE SUMMARY

| Phase | Tuần | Nội dung | Priority |
|-------|------|----------|----------|
| 1 | 1-2 | Foundation & Setup | CRITICAL |
| 2 | 3-4 | Backend Core APIs | HIGH |
| 3 | 4-5 | Frontend Auth | HIGH |
| 4 | 5-7 | Frontend Core (Lessons & Practice) | HIGH |
| 5 | 7-8 | Results & History | HIGH |
| 6 | 8 | Content & Data | MEDIUM |
| 7 | 9-10 | Freestyle + Chatbot | HIGH |
| 8 | 10-11 | AI Role-Play | HIGH |
| 9 | 11-12 | Vocabulary | MEDIUM |
| 10 | 12 | Prosody Analysis | LOW |
| 11 | 12-13 | Polish & Testing | MEDIUM |
| 12 | 13-14 | Deployment & Docs | MEDIUM |

**Tổng: 13-14 tuần (3-3.5 tháng)**

---

## 🎯 PHẦN 6: ĐIỂM QUAN TRỌNG CẦN LƯU Ý

### 6.1. Bảo mật
- ✅ LUÔN validate Firebase token ở Backend
- ✅ Sử dụng Firebase Security Rules cho Firestore và Storage
- ✅ Không expose Azure API key ở Frontend
- ✅ Implement rate limiting cho API

### 6.2. Performance
- ✅ Compress audio files trước khi upload (nếu cần)
- ✅ Sử dụng pagination cho lists
- ✅ Cache lessons data
- ✅ Optimize images và assets

### 6.3. User Experience
- ✅ Hiển thị loading states rõ ràng
- ✅ Handle errors gracefully với messages dễ hiểu
- ✅ Offline support (cache lessons đã tải)
- ✅ Smooth animations

### 6.4. Testing
- ✅ Test với nhiều giọng nói khác nhau
- ✅ Test với background noise
- ✅ Test với network chậm
- ✅ Test error cases

### 6.5. Error Handling Strategy

**Backend Error Handling:**
- ✅ Sử dụng try-catch cho tất cả async functions
- ✅ Centralized error handler middleware
- ✅ Log errors với Winston (file + console)
- ✅ Trả về error codes rõ ràng:
  - `400`: Bad Request (validation errors)
  - `401`: Unauthorized (no token/invalid token)
  - `403`: Forbidden (không có quyền truy cập)
  - `404`: Not Found
  - `429`: Too Many Requests (rate limit exceeded)
  - `500`: Internal Server Error
  - `503`: Service Unavailable (Azure/Firebase down)

**Frontend Error Handling:**
- ✅ Global error boundary cho React components
- ✅ Toast/Alert messages dễ hiểu cho user
- ✅ Retry mechanism cho network errors (3 lần)
- ✅ Fallback UI cho errors
- ✅ Log errors đến Firebase Analytics (optional)
- ✅ Graceful degradation (app vẫn dùng được khi một feature lỗi)

**Common Errors cần handle:**
- Network timeout (> 30s)
- Firebase quota exceeded
- Azure API errors (invalid audio, quota exceeded)
- Audio recording permission denied
- File upload failed (network, size limit)
- Invalid audio format
- Token expired
- User not authenticated

**Error Messages Examples:**
```javascript
// Bad ❌
"Error 500"

// Good ✅
"Không thể chấm điểm lúc này. Vui lòng thử lại sau."
"Bạn cần cấp quyền microphone để ghi âm."
"File audio quá lớn. Vui lòng ghi âm ngắn hơn."
```

### 6.6. Testing Strategy

**Backend Testing:**
- **Unit Tests** (Jest):
  - Test services (azureSpeechService, geminiService, etc.)
  - Test utilities và helpers
  - Mock Firebase Admin và Azure SDK
  - Target coverage: > 70%

- **Integration Tests** (Supertest):
  - Test API endpoints
  - Test với real Firebase (test environment)
  - Test authentication flow
  - Test error responses

**Frontend Testing:**
- **Component Tests** (React Native Testing Library):
  - Test UI components (Button, Input, Card, etc.)
  - Test screens (LoginScreen, PracticeScreen, etc.)
  - Mock Firebase SDK và API calls
  
- **Navigation Tests**:
  - Test navigation flow
  - Test deep linking (nếu có)

- **Snapshot Tests**:
  - Test UI không thay đổi ngoài ý muốn

**E2E Testing:**
- Test complete user flow:
  1. Register → Login
  2. Browse lessons → Select lesson
  3. Practice → Record audio → Get score
  4. View results → View history
  5. Upload avatar → Update profile
  6. Chat with AI → AI Role-Play
  
- Test trên cả iOS và Android
- Test với real Firebase (test environment)

**Manual Testing Checklist:**
- [ ] Test với giọng nói khác nhau (nam/nữ, giọng địa phương)
- [ ] Test với background noise (quán cà phê, đường phố)
- [ ] Test với network chậm (3G, 2G)
- [ ] Test offline mode (cache lessons)
- [ ] Test với nhiều devices (iPhone, Android, tablet)
- [ ] Test memory leaks (long session)
- [ ] Test battery consumption
- [ ] Test với user có/không có avatar
- [ ] Test với lessons có/không có audio mẫu

**Test Data:**
- Tạo test users với data khác nhau
- Tạo test lessons với nhiều levels
- Tạo sample audio files (tốt, trung bình, kém)

---

## 📚 PHẦN 7: TÀI LIỆU THAM KHẢO

### Firebase
- Firebase Authentication: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Storage: https://firebase.google.com/docs/storage
- Security Rules: https://firebase.google.com/docs/rules

### Azure AI Services
- Pronunciation Assessment: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment
- Speech-to-Text: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text
- Text-to-Speech: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech
- Azure Free Tier: https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/

### Google Gemini API
- Gemini API Docs: https://ai.google.dev/docs
- Gemini Free Tier: https://ai.google.dev/pricing
- Node.js SDK: https://www.npmjs.com/package/@google/generative-ai

### Dictionary API
- Free Dictionary API: https://dictionaryapi.dev/
- Merriam-Webster API: https://dictionaryapi.com/

### React Native
- React Native Docs: https://reactnative.dev/docs/getting-started
- Audio Recorder: https://github.com/hyochan/react-native-audio-recorder-player
- Firebase for RN: https://rnfirebase.io/
- React Navigation: https://reactnavigation.org/
- Gifted Chat: https://github.com/FaridSafi/react-native-gifted-chat

### Node.js Libraries
- Express: https://expressjs.com/
- Compromise (NLP): https://github.com/spencermountain/compromise
- Winston (Logging): https://github.com/winstonjs/winston

---

## 🔍 PHẦN 8: MONITORING & ANALYTICS (OPTIONAL)

### 8.1. Backend Monitoring

**Logging với Winston:**
```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

**HTTP Request Logging:**
- Sử dụng **Morgan** middleware
- Log tất cả requests (method, URL, status, response time)

**Performance Monitoring:**
- Track API response times
- Monitor Azure API call durations
- Monitor Firebase operations

### 8.2. Frontend Analytics

**Firebase Analytics:**
```javascript
// Track screen views
analytics().logScreenView({
  screen_name: 'PracticeScreen',
  screen_class: 'PracticeScreen'
});

// Track events
analytics().logEvent('practice_completed', {
  lesson_id: 'lesson-123',
  score: 85,
  duration: 120 // seconds
});

// Track user properties
analytics().setUserProperty('level', 'intermediate');
```

**Key Events to Track:**
- `app_open`: User mở app
- `sign_up`: User đăng ký
- `login`: User đăng nhập
- `lesson_started`: Bắt đầu bài học
- `practice_completed`: Hoàn thành luyện tập
- `score_received`: Nhận điểm
- `avatar_uploaded`: Upload avatar
- `ai_chat_started`: Bắt đầu chat với AI
- `roleplay_started`: Bắt đầu role-play
- `freestyle_created`: Tạo freestyle lesson

**Firebase Crashlytics:**
- Tự động track crashes
- Log non-fatal errors
- Track custom keys (userId, lessonId, etc.)

### 8.3. Key Metrics to Track

**User Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- New users per day
- Retention rate (Day 1, Day 7, Day 30)

**Engagement Metrics:**
- Practice sessions per user
- Average session duration
- Lessons completed per user
- Average score per user
- Completion rate (% users hoàn thành bài)

**Feature Usage:**
- Most popular lessons
- AI Chatbot usage rate
- AI Role-Play usage rate
- Freestyle Import usage rate
- Vocabulary save rate

**Performance Metrics:**
- API response times (p50, p95, p99)
- Error rates per endpoint
- Azure API success rate
- Firebase operation latency
- App crash rate
- App launch time

**Business Metrics:**
- User growth rate
- Churn rate
- Feature adoption rate
- Cost per user (Firebase, Azure)

### 8.4. Dashboard & Alerts

**Firebase Console:**
- Real-time user count
- Crash-free users %
- Top screens
- Top events

**Custom Dashboard (Optional):**
- Grafana + Prometheus
- Real-time metrics
- Custom alerts

**Alerts to Setup:**
- Error rate > 5%
- API response time > 3s
- Crash rate > 1%
- Azure quota > 80%
- Firebase quota > 80%

---

## 🔄 PHẦN 9: BACKUP & DISASTER RECOVERY

### 9.1. Firebase Backup Strategy

**Firestore Backup:**
- **Automated**: Setup scheduled exports (Firebase Console)
  - Frequency: Weekly (every Sunday 2 AM)
  - Location: Google Cloud Storage bucket
  - Retention: Keep last 4 backups (1 month)

- **Manual Backup** (before major changes):
```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

**Collections to Backup:**
- ✅ `users` - Critical
- ✅ `lessons` - Critical
- ✅ `scores` - Important
- ✅ `scenarios` - Important
- ⚠️ `conversations` - Optional (có thể xóa sau 30 ngày)
- ⚠️ `freestyle_lessons` - Optional (tự động xóa sau 7 ngày)

**Firebase Storage Backup:**
- Backup audio samples (lessons) - Critical
- Backup user avatars - Optional
- User recordings - Optional (có thể xóa sau 30 ngày)

**Firebase Authentication:**
- Export user list monthly
```bash
firebase auth:export users.json --project [PROJECT_ID]
```

### 9.2. Code Backup

**Git Repository:**
- ✅ Push code lên GitHub/GitLab daily
- ✅ Create branches cho features mới
- ✅ Tag releases (v1.0.0, v1.1.0, etc.)
- ✅ Never commit `.env` files
- ✅ Use `.gitignore` properly

**Repository Structure:**
```
entalk-project/
├── backend/          # Backend code
├── frontend/         # Frontend code
├── docs/             # Documentation
├── scripts/          # Utility scripts
└── README.md
```

### 9.3. Configuration Backup

**Backup Files:**
- Firebase config files
- Azure keys (encrypted)
- Environment variables template
- Security rules (Firestore & Storage)
- API documentation

**Store in:**
- Private Git repository
- Encrypted cloud storage (Google Drive, Dropbox)
- Password manager (for keys)

### 9.4. Disaster Recovery Plan

**Scenario 1: Firestore Data Loss**
```
1. Stop all write operations
2. Restore from latest backup:
   gcloud firestore import gs://[BUCKET]/[EXPORT_FOLDER]
3. Verify data integrity
4. Resume operations
5. Post-mortem: Analyze what happened
```

**Scenario 2: Backend Server Down**
```
1. Check server logs
2. Restart server
3. If persistent: Deploy to new server
4. Update DNS/Load balancer
5. Verify all endpoints working
```

**Scenario 3: Firebase Quota Exceeded**
```
1. Upgrade to Blaze plan (pay-as-you-go)
2. Optimize queries to reduce reads
3. Implement better caching
4. Add rate limiting
```

**Scenario 4: Azure API Key Compromised**
```
1. Immediately regenerate key in Azure Portal
2. Update .env in backend
3. Redeploy backend
4. Monitor for unusual usage
5. Review access logs
```

### 9.5. Recovery Time Objectives (RTO)

- **Critical Services** (Auth, Scoring): < 1 hour
- **Important Services** (Lessons, Profile): < 4 hours
- **Optional Services** (Chatbot, Role-Play): < 24 hours

### 9.6. Backup Testing

- ✅ Test restore process quarterly
- ✅ Verify backup integrity monthly
- ✅ Document restore procedures
- ✅ Train team on recovery process

---

## ✅ CHECKLIST TỔNG HỢP (CẬP NHẬT)

### 📊 Database (11 Collections)
- [ ] Thiết kế schema cho 11 collections
- [ ] Setup Firebase project
- [ ] Configure Security Rules
- [ ] Tạo indexes cho queries
- [ ] Import sample lessons data
- [ ] Import scenarios data cho Role-Play

### 🔧 Backend (14 API Endpoints)
**Setup:**
- [ ] Project setup với folder structure
- [ ] Firebase Admin SDK integration
- [ ] Azure Speech SDK integration (STT, TTS, Assessment)
- [ ] Google Gemini API integration
- [ ] Free Dictionary API integration
- [ ] Environment variables config
- [ ] Middleware (auth, error, rate limiter)

**Core APIs (6 endpoints):**
- [ ] POST `/api/scoring/request`
- [ ] GET `/api/lessons`
- [ ] GET `/api/lessons/:id/exercises`
- [ ] GET `/api/users/:id/progress`
- [ ] GET `/api/users/:id/scores`
- [ ] POST `/api/users/upload-avatar`

**Advanced APIs (8 endpoints):**
- [ ] POST `/api/roleplay/start`
- [ ] POST `/api/roleplay/respond`
- [ ] POST `/api/freestyle/create`
- [ ] POST `/api/chatbot/message`
- [ ] GET `/api/vocabulary/:userId/words`
- [ ] POST `/api/vocabulary/lookup`
- [ ] POST `/api/vocabulary/save`
- [ ] GET `/api/scenarios`

**Deployment:**
- [ ] Deploy lên Railway/Render (FREE tier)
- [ ] Setup environment variables production
- [ ] Setup logging và monitoring

### 📱 Frontend (21 Screens)
**Setup:**
- [ ] React Native project setup
- [ ] Install 15+ dependencies
- [ ] Firebase SDK config
- [ ] Navigation structure (4 navigators)
- [ ] Folder structure (30+ folders)

**Core Screens (14 screens):**
- [ ] SplashScreen
- [ ] WelcomeScreen
- [ ] LoginScreen
- [ ] RegisterScreen
- [ ] ForgotPasswordScreen
- [ ] HomeScreen
- [ ] LessonsListScreen
- [ ] LessonDetailScreen
- [ ] PracticeScreen (QUAN TRỌNG)
- [ ] ResultScreen
- [ ] HistoryScreen
- [ ] ProgressScreen
- [ ] ProfileScreen
- [ ] SettingsScreen

**Advanced Screens (7 screens):**
- [ ] ScenariosListScreen (Role-Play)
- [ ] RolePlayScreen
- [ ] ConversationHistoryScreen
- [ ] FreestyleScreen
- [ ] ChatbotScreen
- [ ] VocabularyScreen
- [ ] FlashcardScreen

**Components (25+ components):**
- [ ] Common components (Button, Input, Card, Loading)
- [ ] Audio components (RecordButton, AudioPlayer, Waveform)
- [ ] Lesson components (LessonCard, ExerciseItem)
- [ ] Result components (ScoreCard, WordAnalysis, Charts, ProsodyChart)
- [ ] Role-play components (ScenarioCard, ConversationBubble)
- [ ] Chatbot components (ChatMessage, QuickActions)
- [ ] Vocabulary components (VocabularyCard, FlashcardItem)

**Services & Hooks:**
- [ ] 9 services (auth, firestore, storage, audio, api, roleplay, freestyle, chatbot, vocabulary)
- [ ] 7 hooks (useAuth, useAudioRecorder, useLessons, useScores, useRolePlay, useChatbot, useVocabulary)

**Build:**
- [ ] Test trên Android
- [ ] Test trên iOS (optional)
- [ ] Build APK
- [ ] Build IPA (optional)

### 🧪 Testing & QA
- [ ] Unit tests cho services
- [ ] Integration tests cho APIs
- [ ] End-to-end testing core flow
- [ ] Test với nhiều giọng nói
- [ ] Test với network chậm
- [ ] Test error cases
- [ ] Performance testing
- [ ] Fix bugs

### 📝 Documentation
- [ ] README.md chi tiết
- [ ] API documentation
- [ ] Database schema documentation
- [ ] User guide (tiếng Việt)
- [ ] Demo video (5-10 phút)
- [ ] Presentation slides
- [ ] Báo cáo ĐATN (50-80 trang)

### 🎯 Content Creation
- [ ] 15-20 lessons
- [ ] 100-150 exercises
- [ ] Audio mẫu cho exercises (hoặc dùng Azure TTS)
- [ ] Phonetic (IPA) cho exercises
- [ ] 7 scenarios cho Role-Play
- [ ] System prompts cho AI

---

## 📈 THỐNG KÊ DỰ ÁN

### Quy mô code ước tính:
- **Backend**: ~5,000-7,000 lines
  - 7 controllers
  - 6 services
  - 4 middleware
  - 7 routes
  
- **Frontend**: ~15,000-20,000 lines
  - 21 screens
  - 25+ components
  - 9 services
  - 7 hooks
  
- **Tổng**: ~20,000-27,000 lines of code

### Công nghệ sử dụng:
- **Languages**: JavaScript/TypeScript
- **Frontend**: React Native
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (Audio + Images)
- **AI Services**: Azure Speech + Google Gemini
- **APIs**: 14 endpoints (6 core + 8 advanced)

### Chi phí (FREE tier):
- Azure Speech: $0 (5h audio/month)
- Google Gemini: $0 (1500 req/day)
- Firebase: $0-25 (Spark plan)
- Dictionary API: $0
- **Tổng: $0-25/tháng** 🎉

---

## 🎓 GIÁ TRỊ ĐỒÁN TỐT NGHIỆP

### Điểm mạnh của dự án:
1. ✅ **Công nghệ hiện đại**: React Native, Node.js, AI (Azure + Gemini)
2. ✅ **Tính năng độc đáo**: AI Role-Play, Freestyle Import, AI Chatbot
3. ✅ **Quy mô lớn**: 21 screens, 14 APIs, 11 collections
4. ✅ **Thực tế**: Giải quyết vấn đề học phát âm tiếng Anh
5. ✅ **Scalable**: Kiến trúc tốt, có thể mở rộng
6. ✅ **Chi phí thấp**: Hầu hết dùng FREE tier

### Điểm nổi bật so với các ĐATN thông thường:
- 🌟 Tích hợp 3 AI services (Azure Speech, Gemini, Dictionary)
- 🌟 Có tính năng AI Role-Play (rất ít app làm được)
- 🌟 Freestyle Import (cá nhân hóa 100%)
- 🌟 AI Chatbot trợ lý thông minh
- 🌟 Phân tích phát âm chi tiết đến từng từ
- 🌟 UI/UX đẹp, hiện đại

### Phù hợp cho:
- ✅ Đồ án tốt nghiệp Đại học (Khoa CNTT)
- ✅ Luận văn Thạc sĩ (nếu mở rộng thêm research)
- ✅ Portfolio để xin việc
- ✅ Startup MVP

---

## 🚀 BƯỚC TIẾP THEO

### Ngay bây giờ:
1. **Đọc kỹ toàn bộ kế hoạch** ✅
2. **Setup môi trường dev**:
   - Install Node.js, npm
   - Install React Native CLI
   - Setup Android Studio / Xcode
3. **Tạo accounts**:
   - Firebase account
   - Azure account (FREE tier)
   - Google AI Studio (Gemini API)
4. **Clone/Create project structure**

### Tuần 1:
- Setup Firebase project
- Setup Backend structure
- Setup Frontend structure
- Test basic connection

### Mỗi tuần:
- Follow timeline trong Phase tương ứng
- Commit code lên Git thường xuyên
- Test features vừa làm xong
- Document lại những gì đã làm

---

**Tổng thời gian: 13-14 tuần (3-3.5 tháng)**

**Lưu ý quan trọng**:
- ⏰ Đây là timeline lý tưởng. Có thể mất 15-16 tuần nếu làm part-time
- 🎯 Ưu tiên Core Features (Tuần 1-8) trước
- ✨ Advanced Features (Tuần 9-12) làm nếu còn thời gian
- 🔥 Nếu gấp, có thể bỏ Prosody Analysis và Vocabulary
- 💪 Quan trọng nhất: HOÀN THÀNH CORE, sau đó mới làm Advanced

**Chúc bạn thành công với ĐATN! 🎉**

