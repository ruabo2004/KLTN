# TÀI LIỆU API - ENTALK BACKEND

## 📋 TỔNG QUAN

**Base URL**: `https://api.entalk.app` (hoặc `http://localhost:3000` cho development)

**Phiên bản**: v1.0.0

**Authentication**: Firebase ID Token (Bearer Token)

**Content-Type**: `application/json`

---

## 🔐 XÁC THỰC (AUTHENTICATION)

Tất cả các API endpoints (trừ health check) đều yêu cầu Firebase ID Token trong header:

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

**Lấy Firebase ID Token**:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

**Error Responses**:
- `401 Unauthorized`: Token không hợp lệ hoặc đã hết hạn
- `403 Forbidden`: Không có quyền truy cập

---

## 📊 DANH SÁCH API ENDPOINTS

### **Core APIs** (6 endpoints)
1. POST `/api/scoring/request` - Yêu cầu chấm điểm phát âm
2. GET `/api/lessons` - Lấy danh sách bài học
3. GET `/api/lessons/:lessonId/exercises` - Lấy bài tập của bài học
4. GET `/api/users/:userId/progress` - Lấy tiến độ học tập
5. GET `/api/users/:userId/scores` - Lấy lịch sử điểm số
6. POST `/api/users/upload-avatar` - Upload ảnh đại diện

### **Advanced APIs** (8 endpoints)
7. POST `/api/roleplay/start` - Bắt đầu hội thoại AI Role-Play
8. POST `/api/roleplay/respond` - Phản hồi trong Role-Play
9. POST `/api/freestyle/create` - Tạo bài học Freestyle
10. POST `/api/chatbot/message` - Chat với AI trợ lý
11. GET `/api/vocabulary/:userId/words` - Lấy danh sách từ vựng
12. POST `/api/vocabulary/lookup` - Tra cứu từ vựng
13. POST `/api/vocabulary/save` - Lưu từ vào flashcard
14. GET `/api/scenarios` - Lấy danh sách tình huống Role-Play

---

## 🎯 CHI TIẾT API ENDPOINTS

---

## 1️⃣ CHẤM ĐIỂM PHÁT ÂM

### POST `/api/scoring/request`

Gửi yêu cầu chấm điểm phát âm cho một bài tập.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "fileUrl": "https://firebasestorage.googleapis.com/v0/b/.../audio.wav",
  "userId": "user123",
  "lessonId": "lesson456",
  "exerciseId": "exercise789",
  "referenceText": "Hello, how are you today?"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fileUrl | string | ✅ | URL của file audio trên Firebase Storage |
| userId | string | ✅ | ID của người dùng |
| lessonId | string | ✅ | ID của bài học |
| exerciseId | string | ✅ | ID của bài tập |
| referenceText | string | ✅ | Câu mẫu cần đọc |

**Response** (200 OK):
```json
{
  "success": true,
  "scoreId": "score_abc123",
  "message": "Đang xử lý. Kết quả sẽ có trong giây lát.",
  "estimatedTime": 5
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Trạng thái thành công |
| scoreId | string | ID của kết quả chấm điểm |
| message | string | Thông báo |
| estimatedTime | number | Thời gian ước tính (giây) |

**Luồng xử lý**:
1. Validate request data
2. Tạo document trong Firestore `scores` với status="processing"
3. Download file audio từ Firebase Storage
4. Gửi đến Azure Speech API để chấm điểm
5. Parse kết quả từ Azure
6. Update document với kết quả và status="completed"
7. Client lắng nghe Firestore realtime để nhận kết quả

**Error Responses**:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "referenceText là bắt buộc"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "SCORING_FAILED",
  "message": "Không thể chấm điểm. Vui lòng thử lại."
}
```

**Example Usage** (JavaScript):
```javascript
const response = await fetch('https://api.entalk.app/api/scoring/request', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileUrl: audioUrl,
    userId: currentUser.uid,
    lessonId: 'lesson123',
    exerciseId: 'ex456',
    referenceText: 'Hello, how are you?'
  })
});

const data = await response.json();
console.log('Score ID:', data.scoreId);

// Lắng nghe kết quả realtime
const unsubscribe = firestore()
  .collection('scores')
  .doc(data.scoreId)
  .onSnapshot(doc => {
    if (doc.data().status === 'completed') {
      console.log('Kết quả:', doc.data());
      unsubscribe();
    }
  });
```

---

## 2️⃣ QUẢN LÝ BÀI HỌC

### GET `/api/lessons`

Lấy danh sách tất cả bài học.

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| level | string | ❌ | Lọc theo cấp độ: `beginner`, `intermediate`, `advanced` |
| category | string | ❌ | Lọc theo danh mục: `pronunciation`, `vocabulary`, `sentence` |
| limit | number | ❌ | Số lượng kết quả (mặc định: 20) |
| offset | number | ❌ | Vị trí bắt đầu (mặc định: 0) |

**Example Request**:
```http
GET /api/lessons?level=beginner&category=pronunciation&limit=10
```

**Response** (200 OK):
```json
{
  "success": true,
  "total": 45,
  "lessons": [
    {
      "id": "lesson_001",
      "title": "Nguyên âm cơ bản",
      "description": "Học cách phát âm các nguyên âm tiếng Anh",
      "level": "beginner",
      "category": "pronunciation",
      "order": 1,
      "totalExercises": 10,
      "estimatedTime": 15,
      "thumbnailUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "lesson_002",
      "title": "Phụ âm đầu câu",
      "description": "Luyện phát âm phụ âm",
      "level": "beginner",
      "category": "pronunciation",
      "order": 2,
      "totalExercises": 12,
      "estimatedTime": 18,
      "thumbnailUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ]
}
```

**Error Responses**:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "INVALID_PARAMETER",
  "message": "level phải là: beginner, intermediate, hoặc advanced"
}
```

---

### GET `/api/lessons/:lessonId/exercises`

Lấy danh sách bài tập của một bài học.

**Headers**:
```http
Authorization: Bearer <token>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| lessonId | string | ID của bài học |

**Example Request**:
```http
GET /api/lessons/lesson_001/exercises
```

**Response** (200 OK):
```json
{
  "success": true,
  "lessonId": "lesson_001",
  "lessonTitle": "Nguyên âm cơ bản",
  "exercises": [
    {
      "id": "ex_001",
      "text": "Hello, how are you?",
      "phonetic": "/həˈloʊ, haʊ ɑːr juː/",
      "audioUrl": "https://firebasestorage.../sample.wav",
      "order": 1,
      "difficulty": "easy",
      "tips": "Chú ý phát âm 'how' với âm /haʊ/",
      "estimatedTime": 2
    },
    {
      "id": "ex_002",
      "text": "Good morning, everyone!",
      "phonetic": "/ɡʊd ˈmɔːrnɪŋ, ˈevriwʌn/",
      "audioUrl": "https://firebasestorage.../sample2.wav",
      "order": 2,
      "difficulty": "easy",
      "tips": "Nhấn mạnh vào 'mor' trong morning",
      "estimatedTime": 2
    }
  ]
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "success": false,
  "error": "LESSON_NOT_FOUND",
  "message": "Không tìm thấy bài học"
}
```

---

## 3️⃣ QUẢN LÝ NGƯỜI DÙNG

### GET `/api/users/:userId/progress`

Lấy tiến độ học tập của người dùng.

**Headers**:
```http
Authorization: Bearer <token>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | ID của người dùng |

**Example Request**:
```http
GET /api/users/user123/progress
```

**Response** (200 OK):
```json
{
  "success": true,
  "userId": "user123",
  "statistics": {
    "totalPractices": 156,
    "totalLessons": 45,
    "completedLessons": 12,
    "averageScore": 82.5,
    "streak": 7,
    "totalTimeSpent": 3600,
    "level": "intermediate"
  },
  "recentLessons": [
    {
      "lessonId": "lesson_005",
      "lessonTitle": "Câu hỏi thường gặp",
      "completedExercises": 8,
      "totalExercises": 10,
      "bestScore": 85,
      "lastPracticeAt": "2024-01-20T14:30:00Z",
      "isCompleted": false
    }
  ],
  "achievements": [
    {
      "id": "streak_7",
      "title": "Kiên trì 7 ngày",
      "description": "Luyện tập liên tục 7 ngày",
      "icon": "🔥",
      "unlockedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### GET `/api/users/:userId/scores`

Lấy lịch sử điểm số của người dùng.

**Headers**:
```http
Authorization: Bearer <token>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | ID của người dùng |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | ❌ | Số lượng kết quả (mặc định: 20) |
| offset | number | ❌ | Vị trí bắt đầu (mặc định: 0) |
| lessonId | string | ❌ | Lọc theo bài học |
| startDate | string | ❌ | Ngày bắt đầu (ISO 8601) |
| endDate | string | ❌ | Ngày kết thúc (ISO 8601) |

**Example Request**:
```http
GET /api/users/user123/scores?limit=10&lessonId=lesson_001
```

**Response** (200 OK):
```json
{
  "success": true,
  "total": 156,
  "scores": [
    {
      "id": "score_abc123",
      "lessonId": "lesson_001",
      "lessonTitle": "Nguyên âm cơ bản",
      "exerciseId": "ex_001",
      "exerciseText": "Hello, how are you?",
      "audioUrl": "https://...",
      "createdAt": "2024-01-20T14:30:00Z",
      "overallScore": 85,
      "accuracyScore": 88,
      "fluencyScore": 82,
      "completenessScore": 90,
      "pronunciationScore": 85,
      "prosodyScore": 80,
      "feedback": "👍 Tốt lắm! Tiếp tục phát huy nhé!"
    }
  ]
}
```

---

### POST `/api/users/upload-avatar`

Upload ảnh đại diện cho người dùng.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body** (Form Data):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | ✅ | File ảnh (JPEG/PNG, max 5MB) |

**Example Request** (JavaScript):
```javascript
const formData = new FormData();
formData.append('file', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'avatar.jpg'
});

const response = await fetch('https://api.entalk.app/api/users/upload-avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

**Response** (200 OK):
```json
{
  "success": true,
  "photoURL": "https://firebasestorage.googleapis.com/.../avatar_1234567890.jpg",
  "message": "Cập nhật ảnh đại diện thành công"
}
```

**Xử lý**:
1. Validate file (type, size)
2. Resize về 300x300px
3. Upload lên Firebase Storage: `/avatars/{userId}/avatar_{timestamp}.jpg`
4. Lấy public URL
5. Update Firestore `users.photoURL`
6. Xóa avatar cũ (nếu có)

**Error Responses**:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "INVALID_FILE",
  "message": "File phải là ảnh JPEG hoặc PNG"
}
```

**413 Payload Too Large**:
```json
{
  "success": false,
  "error": "FILE_TOO_LARGE",
  "message": "File ảnh không được vượt quá 5MB"
}
```

---

## 4️⃣ AI ROLE-PLAY

### POST `/api/roleplay/start`

Bắt đầu một cuộc hội thoại AI Role-Play.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "user123",
  "scenarioId": "restaurant"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | ID của người dùng |
| scenarioId | string | ✅ | ID của tình huống |

**Response** (200 OK):
```json
{
  "success": true,
  "conversationId": "conv_xyz789",
  "scenario": {
    "id": "restaurant",
    "title": "Nhà hàng",
    "description": "Gọi món ăn tại nhà hàng"
  },
  "firstMessage": {
    "role": "ai",
    "text": "Hi, welcome to our restaurant. What can I get for you today?",
    "audioUrl": "https://firebasestorage.../ai_msg_001.mp3",
    "translation": "Xin chào, chào mừng đến nhà hàng. Tôi có thể lấy gì cho bạn?"
  }
}
```

**Xử lý**:
1. Validate scenario exists
2. Tạo conversation document trong Firestore
3. Generate câu mở đầu bằng Gemini AI
4. Convert text → audio bằng Azure TTS
5. Lưu message vào conversation

---

### POST `/api/roleplay/respond`

Gửi phản hồi của người dùng trong Role-Play.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "conversationId": "conv_xyz789",
  "audioUrl": "https://firebasestorage.../user_audio.wav",
  "userId": "user123"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| conversationId | string | ✅ | ID của cuộc hội thoại |
| audioUrl | string | ✅ | URL file audio của user |
| userId | string | ✅ | ID của người dùng |

**Response** (200 OK):
```json
{
  "success": true,
  "userMessage": {
    "role": "user",
    "text": "I'd like to order a cappuccino, please.",
    "audioUrl": "https://...",
    "pronunciationScore": 85,
    "feedback": "👍 Phát âm tốt!"
  },
  "aiResponse": {
    "role": "ai",
    "text": "Great choice! Would you like that hot or iced?",
    "audioUrl": "https://firebasestorage.../ai_msg_002.mp3",
    "translation": "Lựa chọn tuyệt vời! Bạn muốn nóng hay đá?"
  }
}
```

**Xử lý**:
1. Download audio từ Firebase Storage
2. Speech-to-Text (Azure) → Convert audio thành text
3. Pronunciation Assessment (Azure) → Chấm điểm phát âm
4. Lưu user message vào conversation
5. Gemini AI → Generate câu trả lời tiếp theo (dựa trên context)
6. Text-to-Speech (Azure) → Tạo audio cho AI response
7. Lưu AI message vào conversation
8. Return kết quả

---

## 5️⃣ FREESTYLE IMPORT

### POST `/api/freestyle/create`

Tạo bài học Freestyle từ văn bản người dùng nhập.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "user123",
  "text": "The quick brown fox jumps over the lazy dog. This is a sample sentence for practicing English pronunciation.",
  "title": "My Custom Lesson"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | ID của người dùng |
| text | string | ✅ | Văn bản cần tạo bài học (max 500 từ) |
| title | string | ❌ | Tiêu đề bài học (mặc định: "Bài học tự do") |

**Response** (200 OK):
```json
{
  "success": true,
  "lessonId": "freestyle_abc123",
  "title": "My Custom Lesson",
  "totalExercises": 2,
  "estimatedTime": 4,
  "expiresAt": "2024-01-27T10:00:00Z",
  "exercises": [
    {
      "id": "ex_001",
      "text": "The quick brown fox jumps over the lazy dog.",
      "audioUrl": "https://firebasestorage.../tts_001.mp3",
      "order": 1
    },
    {
      "id": "ex_002",
      "text": "This is a sample sentence for practicing English pronunciation.",
      "audioUrl": "https://firebasestorage.../tts_002.mp3",
      "order": 2
    }
  ]
}
```

**Xử lý**:
1. Validate text length (max 500 từ)
2. Tách văn bản thành các câu (dùng NLP - Compromise.js)
3. Với mỗi câu:
   - Tạo audio mẫu bằng Azure Text-to-Speech
   - Upload lên Firebase Storage
   - Tạo exercise document
4. Tạo freestyle_lesson document (tự động xóa sau 7 ngày)
5. Return lesson info

**Error Responses**:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "TEXT_TOO_LONG",
  "message": "Văn bản không được vượt quá 500 từ"
}
```

**429 Too Many Requests**:
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Bạn chỉ có thể tạo 3 bài học freestyle mỗi ngày"
}
```

---

## 6️⃣ AI CHATBOT

### POST `/api/chatbot/message`

Gửi tin nhắn đến AI Chatbot trợ lý.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "user123",
  "message": "Dịch: Hello, how are you?",
  "conversationId": "chat_abc123"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | ID của người dùng |
| message | string | ✅ | Tin nhắn của user |
| conversationId | string | ❌ | ID cuộc trò chuyện (tạo mới nếu không có) |

**Response** (200 OK):
```json
{
  "success": true,
  "conversationId": "chat_abc123",
  "reply": "📝 Dịch: \"Xin chào, bạn khỏe không?\"\n\n💡 Giải thích:\n- \"Hello\" là lời chào phổ biến\n- \"How are you?\" là câu hỏi thăm hỏi sức khỏe\n\n🎯 Cách dùng:\n• Hello! (Xin chào!)\n• How are you? (Bạn khỏe không?)\n• I'm fine, thank you. (Tôi khỏe, cảm ơn.)\n\n💡 Từ tương tự: Hi, Hey, Greetings",
  "timestamp": "2024-01-20T15:30:00Z"
}
```

**Xử lý**:
1. Load conversation history (nếu có)
2. Gửi message + history đến Gemini AI
3. Gemini trả lời bằng tiếng Việt (theo system prompt)
4. Lưu cả user message và AI reply vào Firestore
5. Return reply

**System Prompt** (Backend):
```
Bạn là trợ lý AI của EnTalk - app học phát âm tiếng Anh.

QUY TẮC:
- TRẢ LỜI HOÀN TOÀN BẰNG TIẾNG VIỆT
- Giải thích dễ hiểu, ngắn gọn
- Sử dụng emoji phù hợp
- Đưa ra ví dụ cụ thể

NHIỆM VỤ:
- Dịch từ/câu (Anh ↔ Việt)
- Giải thích ngữ pháp
- Giải thích từ vựng
- Gợi ý cách học
```

**Error Responses**:

**429 Too Many Requests**:
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Bạn chỉ có thể gửi 50 tin nhắn mỗi ngày"
}
```

---

## 7️⃣ TỪ VỰNG (VOCABULARY)

### GET `/api/vocabulary/:userId/words`

Lấy danh sách từ vựng đã lưu của người dùng.

**Headers**:
```http
Authorization: Bearer <token>
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | ID của người dùng |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | ❌ | Số lượng kết quả (mặc định: 50) |
| offset | number | ❌ | Vị trí bắt đầu (mặc định: 0) |
| mastered | boolean | ❌ | Lọc từ đã thuộc (true/false) |

**Example Request**:
```http
GET /api/vocabulary/user123/words?limit=20&mastered=false
```

**Response** (200 OK):
```json
{
  "success": true,
  "total": 45,
  "words": [
    {
      "id": "word_001",
      "word": "implement",
      "phonetic": "/ˈɪmplɪment/",
      "definition": "Thực hiện, triển khai (một kế hoạch, chính sách)",
      "example": "The company will implement new policies next month.",
      "exampleTranslation": "Công ty sẽ triển khai chính sách mới vào tháng sau.",
      "synonyms": ["execute", "carry out", "put into practice"],
      "savedAt": "2024-01-15T10:00:00Z",
      "lastReviewedAt": "2024-01-20T14:00:00Z",
      "reviewCount": 3,
      "mastered": false,
      "sourceExerciseId": "ex_123"
    }
  ]
}
```

---

### POST `/api/vocabulary/lookup`

Tra cứu nghĩa của một từ.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "word": "implement"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "word": "implement",
  "phonetic": "/ˈɪmplɪment/",
  "definitions": [
    {
      "partOfSpeech": "verb",
      "definition": "Put (a decision, plan, agreement, etc.) into effect",
      "definitionVi": "Thực hiện, triển khai (một quyết định, kế hoạch, thỏa thuận, v.v.)",
      "example": "The company implemented a new policy.",
      "exampleVi": "Công ty đã triển khai một chính sách mới."
    },
    {
      "partOfSpeech": "noun",
      "definition": "A tool, utensil, or other piece of equipment",
      "definitionVi": "Một công cụ, dụng cụ hoặc thiết bị khác",
      "example": "Garden implements",
      "exampleVi": "Dụng cụ làm vườn"
    }
  ],
  "synonyms": ["execute", "carry out", "put into practice"],
  "antonyms": ["abandon", "cancel"],
  "audioUrl": "https://api.dictionaryapi.dev/media/pronunciations/implement.mp3"
}
```

**Data Source**: Free Dictionary API (`https://api.dictionaryapi.dev`)

**Error Responses**:

**404 Not Found**:
```json
{
  "success": false,
  "error": "WORD_NOT_FOUND",
  "message": "Không tìm thấy từ này trong từ điển"
}
```

---

### POST `/api/vocabulary/save`

Lưu một từ vào danh sách từ vựng của người dùng.

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "user123",
  "word": "implement",
  "phonetic": "/ˈɪmplɪment/",
  "definition": "Thực hiện, triển khai",
  "example": "The company will implement new policies.",
  "sourceExerciseId": "ex_123"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | ✅ | ID của người dùng |
| word | string | ✅ | Từ cần lưu |
| phonetic | string | ❌ | Phiên âm IPA |
| definition | string | ✅ | Định nghĩa tiếng Việt |
| example | string | ❌ | Câu ví dụ |
| sourceExerciseId | string | ❌ | ID bài tập nguồn |

**Response** (200 OK):
```json
{
  "success": true,
  "wordId": "word_abc123",
  "message": "Đã lưu từ vào danh sách của bạn"
}
```

**Error Responses**:

**409 Conflict**:
```json
{
  "success": false,
  "error": "WORD_ALREADY_EXISTS",
  "message": "Từ này đã có trong danh sách của bạn"
}
```

---

## 8️⃣ TÌNH HUỐNG ROLE-PLAY

### GET `/api/scenarios`

Lấy danh sách các tình huống Role-Play.

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| level | string | ❌ | Lọc theo cấp độ |

**Example Request**:
```http
GET /api/scenarios?level=beginner
```

**Response** (200 OK):
```json
{
  "success": true,
  "scenarios": [
    {
      "id": "restaurant",
      "title": "Nhà hàng",
      "titleEn": "At a Restaurant",
      "description": "Luyện tập gọi món, hỏi về thực đơn, thanh toán",
      "icon": "🍽️",
      "level": "beginner",
      "estimatedTime": 5,
      "topics": ["ordering food", "asking questions", "paying bill"],
      "isActive": true
    },
    {
      "id": "shopping",
      "title": "Mua sắm",
      "titleEn": "Shopping",
      "description": "Luyện tập hỏi giá, thử đồ, mặc cả",
      "icon": "🛍️",
      "level": "beginner",
      "estimatedTime": 5,
      "topics": ["asking price", "trying clothes", "bargaining"],
      "isActive": true
    },
    {
      "id": "airport",
      "title": "Sân bay",
      "titleEn": "At the Airport",
      "description": "Check-in, hỏi đường, làm thủ tục hải quan",
      "icon": "✈️",
      "level": "intermediate",
      "estimatedTime": 7,
      "topics": ["check-in", "asking directions", "customs"],
      "isActive": true
    },
    {
      "id": "hospital",
      "title": "Bệnh viện",
      "titleEn": "At the Hospital",
      "description": "Mô tả triệu chứng, hẹn khám, lấy thuốc",
      "icon": "🏥",
      "level": "intermediate",
      "estimatedTime": 8,
      "topics": ["symptoms", "appointment", "prescription"],
      "isActive": true
    },
    {
      "id": "interview",
      "title": "Phỏng vấn xin việc",
      "titleEn": "Job Interview",
      "description": "Giới thiệu bản thân, trả lời câu hỏi phỏng vấn",
      "icon": "💼",
      "level": "advanced",
      "estimatedTime": 10,
      "topics": ["self-introduction", "experience", "skills"],
      "isActive": true
    },
    {
      "id": "school",
      "title": "Trường học",
      "titleEn": "At School",
      "description": "Hỏi bài, thảo luận nhóm, nộp bài tập",
      "icon": "🎓",
      "level": "beginner",
      "estimatedTime": 5,
      "topics": ["asking questions", "group discussion", "homework"],
      "isActive": true
    },
    {
      "id": "hotel",
      "title": "Khách sạn",
      "titleEn": "At a Hotel",
      "description": "Đặt phòng, yêu cầu dịch vụ, check-out",
      "icon": "🏨",
      "level": "intermediate",
      "estimatedTime": 6,
      "topics": ["booking", "room service", "check-out"],
      "isActive": true
    }
  ]
}
```

---

## 🔒 BẢO MẬT & RATE LIMITING

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST `/api/scoring/request` | 30 requests | 15 phút |
| POST `/api/roleplay/*` | 20 requests | 15 phút |
| POST `/api/freestyle/create` | 3 requests | 24 giờ |
| POST `/api/chatbot/message` | 50 requests | 24 giờ |
| POST `/api/vocabulary/save` | 100 requests | 24 giờ |
| GET `/*` | 100 requests | 15 phút |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1705756800
```

**Rate Limit Exceeded Response** (429):
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Bạn đã vượt quá giới hạn. Vui lòng thử lại sau.",
  "retryAfter": 300
}
```

---

## ❌ ERROR CODES

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request không hợp lệ |
| `UNAUTHORIZED` | 401 | Chưa xác thực |
| `FORBIDDEN` | 403 | Không có quyền truy cập |
| `NOT_FOUND` | 404 | Không tìm thấy resource |
| `CONFLICT` | 409 | Xung đột dữ liệu |
| `PAYLOAD_TOO_LARGE` | 413 | File quá lớn |
| `RATE_LIMIT_EXCEEDED` | 429 | Vượt quá giới hạn |
| `INTERNAL_ERROR` | 500 | Lỗi máy chủ |
| `SERVICE_UNAVAILABLE` | 503 | Dịch vụ không khả dụng |

**Standard Error Response**:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Mô tả lỗi bằng tiếng Việt",
  "details": {
    "field": "Thông tin chi tiết (optional)"
  }
}
```

---

## 📝 TESTING

### Health Check

**GET** `/health`

Kiểm tra trạng thái server (không cần authentication).

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T15:30:00Z",
  "version": "1.0.0",
  "services": {
    "firebase": "connected",
    "azure": "connected",
    "gemini": "connected"
  }
}
```

### Postman Collection

Import collection từ: `https://api.entalk.app/postman/collection.json`

### Example cURL Commands

**1. Chấm điểm phát âm**:
```bash
curl -X POST https://api.entalk.app/api/scoring/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileUrl": "https://firebasestorage.../audio.wav",
    "userId": "user123",
    "lessonId": "lesson456",
    "exerciseId": "ex789",
    "referenceText": "Hello, how are you?"
  }'
```

**2. Lấy danh sách bài học**:
```bash
curl -X GET "https://api.entalk.app/api/lessons?level=beginner&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Chat với AI**:
```bash
curl -X POST https://api.entalk.app/api/chatbot/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "Dịch: Hello"
  }'
```

---

## 📞 HỖ TRỢ

**Email**: support@entalk.app

**Documentation**: https://docs.entalk.app

**Status Page**: https://status.entalk.app

---

**Phiên bản**: v1.0.0  
**Cập nhật lần cuối**: 20/01/2024  
**© 2024 EnTalk. All rights reserved.**

