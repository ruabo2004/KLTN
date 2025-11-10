# EnTalk Backend API

Backend API cho ứng dụng EnTalk - Học phát âm tiếng Anh với AI.

## 🚀 Tính năng

- ✅ **AI Chatbot** - Trợ lý học tiếng Anh 24/7 (Google Gemini)
- ✅ **Freestyle Import** - Tạo bài học từ văn bản tùy chỉnh (Azure TTS)
- ✅ **AI Role-Play** - Hội thoại với AI trong tình huống thực tế (Azure STT + TTS + Gemini)
- ✅ **Pronunciation Assessment** - Chấm điểm phát âm tự động (Azure Speech)
- ✅ **Firebase Integration** - Authentication, Firestore, Storage

## 📦 Cài đặt

### 1. Clone repository

```bash
cd entalk-backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

Điền thông tin vào file `.env`:

```bash
# Server
PORT=3000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Azure Speech Service
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

### 4. Lấy API Keys

#### **Firebase Admin SDK**
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project → Settings → Service accounts
3. Click "Generate new private key"
4. Copy thông tin vào `.env`

#### **Azure Speech Service**
1. Vào [Azure Portal](https://portal.azure.com/)
2. Tạo "Speech Service" resource (Free F0 tier)
3. Copy Key và Region vào `.env`

#### **Google Gemini API**
1. Vào [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key vào `.env`

## 🏃 Chạy server

### Development mode (với nodemon)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📋 API Endpoints

### **Health Check**
```http
GET /health
```

### **Chatbot**
```http
POST /api/chatbot/message
Authorization: Bearer <firebase_token>
Content-Type: application/json

{
  "userId": "user123",
  "message": "Dịch: Hello, how are you?",
  "conversationId": "chat_abc123" // optional
}
```

### **Freestyle**
```http
POST /api/freestyle/create
Authorization: Bearer <firebase_token>
Content-Type: application/json

{
  "userId": "user123",
  "text": "The quick brown fox jumps over the lazy dog.",
  "title": "My Custom Lesson" // optional
}
```

### **Role-Play - Start**
```http
POST /api/roleplay/start
Authorization: Bearer <firebase_token>
Content-Type: application/json

{
  "userId": "user123",
  "scenarioId": "restaurant"
}
```

### **Role-Play - Respond**
```http
POST /api/roleplay/respond
Authorization: Bearer <firebase_token>
Content-Type: application/json

{
  "conversationId": "conv_xyz789",
  "audioUrl": "https://firebasestorage.../user_audio.wav",
  "userId": "user123"
}
```

## 🧪 Testing

### Test với cURL

```bash
# Health check
curl http://localhost:3000/health

# Chatbot (cần Firebase token)
curl -X POST http://localhost:3000/api/chatbot/message \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "message": "Dịch: Hello"
  }'
```

### Test với Postman

Import collection từ: `API_DOCUMENTATION.md`

## 📁 Cấu trúc thư mục

```
entalk-backend/
├── src/
│   ├── config/           # Cấu hình Firebase, Azure, Gemini
│   ├── services/         # Business logic services
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, Rate limiting
│   └── utils/            # Helper functions
├── temp/                 # Temporary files (auto-generated)
├── logs/                 # Log files (auto-generated)
├── .env                  # Environment variables
├── server.js             # Main server file
└── package.json          # Dependencies
```

## 🔒 Bảo mật

- ✅ Firebase Authentication (Bearer Token)
- ✅ Rate Limiting (express-rate-limit)
- ✅ Helmet.js (Security headers)
- ✅ CORS configuration
- ✅ Input validation

## 📊 Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/chatbot/message` | 50 requests/24h |
| `/api/freestyle/create` | 3 requests/24h |
| `/api/roleplay/*` | 20 requests/15min |

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "Firebase Admin SDK initialization failed"
- Kiểm tra lại thông tin trong `.env`
- Đảm bảo `FIREBASE_PRIVATE_KEY` có `\n` đúng format

### Lỗi: "Azure Speech Service error"
- Kiểm tra `AZURE_SPEECH_KEY` và `AZURE_SPEECH_REGION`
- Đảm bảo đã enable Speech Service trong Azure Portal

### Lỗi: "Gemini API error"
- Kiểm tra `GEMINI_API_KEY`
- Đảm bảo đã enable Gemini API trong Google AI Studio

## 📝 Logs

Logs được lưu trong thư mục `logs/`:
- `error.log` - Chỉ errors
- `combined.log` - Tất cả logs

## 🚀 Deployment

### Deploy lên Heroku

```bash
heroku create entalk-backend
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=...
# ... set các env vars khác
git push heroku main
```

### Deploy lên Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy

## 📞 Hỗ trợ

- Email: support@entalk.app
- Documentation: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

## 📄 License

MIT License - © 2024 EnTalk Team

