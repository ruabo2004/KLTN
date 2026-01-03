# 📱 HƯỚNG DẪN TEST APP ENTALK TRÊN THIẾT BỊ ANDROID

## ✅ BƯỚC 1: CHUẨN BỊ THIẾT BỊ ANDROID

### 1.1. Bật Developer Options (Tùy chọn nhà phát triển)

1. Vào **Settings** (Cài đặt) trên điện thoại
2. Tìm **About phone** (Thông tin điện thoại)
3. Tìm **Build number** (Số bản dựng)
4. **Nhấn 7 lần** vào Build number
5. Nhập mật khẩu/PIN nếu được yêu cầu
6. Thông báo "You are now a developer!" sẽ xuất hiện

### 1.2. Bật USB Debugging

1. Quay lại **Settings** → **System** → **Developer options**
2. Bật **Developer options** (nếu đang tắt)
3. Bật **USB debugging**
4. Bật **Install via USB** (nếu có)
5. Bật **USB debugging (Security settings)** (nếu có)

### 1.3. Kết nối USB với Laptop

1. Dùng cáp USB kết nối điện thoại với laptop
2. Chọn **File Transfer** hoặc **MTP** mode (không phải Charging only)
3. Trên điện thoại sẽ hiện popup "Allow USB debugging?"
4. Tick "Always allow from this computer"
5. Nhấn **OK**

---

## ✅ BƯỚC 2: KIỂM TRA KẾT NỐI

### 2.1. Kiểm tra ADB nhận thiết bị

Mở Command Prompt/PowerShell và chạy:

```bash
adb devices
```

**Kết quả mong đợi:**
```
List of devices attached
ABC123XYZ    device
```

**Nếu hiện "unauthorized":**
- Kiểm tra lại popup trên điện thoại
- Nhấn "Allow" và thử lại

**Nếu không thấy thiết bị:**
- Thử cáp USB khác
- Thử cổng USB khác trên laptop
- Cài đặt USB drivers cho điện thoại (Google "your phone model USB driver")

---

## ✅ BƯỚC 3: CẬP NHẬT CẤU HÌNH BACKEND URL

### 3.1. Lấy IP Address của Laptop

**Trên Windows:**
```bash
ipconfig
```

Tìm dòng **IPv4 Address** (ví dụ: `192.168.1.100`)

**Trên Mac/Linux:**
```bash
ifconfig
```

### 3.2. Cập nhật API_BASE_URL

Mở file: `entalk-frontend/src/utils/constants.ts`

Thay đổi:
```typescript
// TỪ (cho emulator):
export const API_BASE_URL = 'http://10.0.2.2:3000/api';

// THÀNH (cho thiết bị thật):
export const API_BASE_URL = 'http://192.168.1.100:3000/api';
// ⚠️ Thay 192.168.1.100 bằng IP thật của laptop bạn
```

**Lưu file!**

---

## ✅ BƯỚC 4: CHẠY BACKEND

### 4.1. Mở Terminal 1 - Backend

```bash
cd entalk-backend
npm start
```

**Kiểm tra:**
- Backend chạy tại `http://localhost:3000`
- Không có errors trong logs
- Thấy thông báo "Server đang chạy..."

### 4.2. Test Backend từ Laptop

Mở browser, vào: `http://localhost:3000/health`

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0",
  "services": {
    "firebase": "connected",
    "azure": "connected",
    "gemini": "connected"
  }
}
```

### 4.3. Test Backend từ Điện Thoại

Mở browser trên điện thoại, vào: `http://192.168.1.100:3000/health`
(Thay IP bằng IP laptop của bạn)

**Nếu không kết nối được:**
- Kiểm tra laptop và điện thoại cùng mạng WiFi
- Tắt Firewall trên laptop (tạm thời)
- Thử lại

---

## ✅ BƯỚC 5: CHẠY REACT NATIVE APP

### 5.1. Mở Terminal 2 - Metro Bundler

```bash
cd entalk-frontend
npm start
```

Hoặc:
```bash
npx react-native start
```

**Để Metro chạy, không tắt terminal này!**

### 5.2. Mở Terminal 3 - Build & Install App

```bash
cd entalk-frontend
npm run android
```

Hoặc:
```bash
npx react-native run-android
```

**Quá trình:**
1. Gradle build (~2-5 phút lần đầu)
2. Install APK lên điện thoại
3. Launch app tự động

**Nếu thành công:**
- App mở trên điện thoại
- Thấy màn hình Login

---

## ✅ BƯỚC 6: TEST CÁC TÍNH NĂNG

### 6.1. Test Authentication

**Đăng ký tài khoản mới:**
1. Nhấn "Đăng ký"
2. Nhập:
   - Email: `test@example.com`
   - Password: `123456`
   - Display Name: `Test User`
3. Nhấn "Đăng ký"
4. Chờ ~2-3 giây
5. **Mong đợi:** Navigate đến HomeScreen

**Kiểm tra Firebase Console:**
- Vào: https://console.firebase.google.com/project/app-entalk
- Authentication → Users
- Thấy user mới được tạo

**Đăng xuất và đăng nhập lại:**
1. Vào Profile tab
2. Nhấn "Đăng xuất"
3. Đăng nhập lại với email/password vừa tạo

### 6.2. Test Home Screen

**Kiểm tra:**
- [ ] Stats cards hiển thị (Bài học, Điểm TB, Chuỗi ngày)
- [ ] Recent practices (có thể empty nếu chưa luyện)
- [ ] Quick actions buttons hoạt động

### 6.3. Test Lessons Flow

**Xem danh sách bài học:**
1. Nhấn "Bắt đầu học" hoặc tab "Lessons"
2. **Mong đợi:** Thấy 5 bài học mẫu
3. Filter by level (A1, A2, B1, B2, C1, C2)
4. Search bar

**Xem chi tiết bài học:**
1. Tap vào 1 lesson
2. **Mong đợi:** Thấy danh sách exercises (3 exercises/lesson)
3. Nhấn "Bắt đầu luyện tập"

### 6.4. Test Practice Screen (QUAN TRỌNG NHẤT!)

**Luyện phát âm:**
1. Đọc câu mẫu trên màn hình
2. Nhấn nút "Nghe mẫu" (🔊) - Audio phát
3. Nhấn nút "Ghi âm" (🎤)
4. **Cấp quyền Microphone** nếu được hỏi
5. Nói câu tiếng Anh vào mic
6. Nhấn "Dừng"
7. Nhấn "Gửi chấm điểm"

**Quá trình xử lý:**
- Upload audio lên Firebase Storage (~2-5s)
- Gọi API backend (~1-2s)
- Backend gọi Azure Speech API (~3-5s)
- Nhận kết quả từ Firestore (realtime)
- **Tổng: ~10-15 giây**

**Mong đợi:**
- Thấy "Đang tải lên..." với progress bar
- Thấy "Đang chấm điểm..."
- Auto-navigate đến ResultScreen

### 6.5. Test Result Screen

**Kiểm tra:**
- [ ] Overall score hiển thị (0-100)
- [ ] 4 detailed scores: Accuracy, Fluency, Completeness, Prosody
- [ ] Word-by-word analysis với màu sắc:
  - 🟢 Xanh: Phát âm tốt
  - 🟡 Vàng: Trung bình
  - 🔴 Đỏ: Cần cải thiện
- [ ] Buttons: "Luyện lại", "Về danh sách", "Về trang chủ"

### 6.6. Test History Screen

1. Vào tab "History"
2. **Mong đợi:** Thấy lần luyện tập vừa rồi
3. Tap vào item → Xem lại kết quả chi tiết

### 6.7. Test Profile & Settings

**Profile:**
1. Vào tab "Profile"
2. Kiểm tra stats hiển thị đúng
3. Nhấn "Chỉnh sửa thông tin"
4. Upload avatar (chọn ảnh từ thư viện)
5. Đổi display name
6. Lưu → Kiểm tra avatar và name cập nhật

**Change Password:**
1. Nhấn "Đổi mật khẩu"
2. Nhập current password: `123456`
3. Nhập new password: `123456789`
4. Confirm password: `123456789`
5. Lưu → Thành công

**Settings:**
1. Nhấn "Cài đặt"
2. Toggle các switches
3. Kiểm tra các menu items

### 6.8. Test Advanced Features

**Freestyle:**
1. Vào tab "More" → "Freestyle"
2. Paste đoạn văn bản tiếng Anh
3. Nhấn "Tạo bài học"
4. **Mong đợi:** Tạo exercises tự động

**AI Chatbot:**
1. Vào "More" → "AI Chatbot"
2. Gửi tin nhắn: "Dịch: Hello, how are you?"
3. **Mong đợi:** AI trả lời bằng tiếng Việt

**AI Role-Play:**
1. Vào "More" → "AI Role-Play"
2. Chọn scenario (vd: Restaurant)
3. AI nói câu đầu tiên
4. Ghi âm câu trả lời
5. **Mong đợi:** AI phản hồi + điểm phát âm

**Vocabulary:**
1. Vào "More" → "Vocabulary"
2. Tab "Tra từ": Nhập "hello"
3. **Mong đợi:** Hiển thị nghĩa, phát âm, ví dụ
4. Nhấn "Lưu từ"
5. Tab "Từ đã lưu": Thấy từ vừa lưu

---

## ✅ BƯỚC 7: KIỂM TRA LOGS

### 7.1. Backend Logs

**Terminal Backend:**
- Xem requests đến: `POST /api/scoring/request`
- Xem responses
- Xem errors (nếu có)

**Log files:**
```bash
# Xem all logs
type entalk-backend\logs\combined.log

# Xem error logs
type entalk-backend\logs\error.log
```

### 7.2. React Native Logs

**Terminal Metro:**
- Xem console.log từ app
- Xem errors/warnings

**Hoặc chạy:**
```bash
npx react-native log-android
```

### 7.3. Firebase Console

**Kiểm tra:**
1. **Authentication:** Users được tạo
2. **Firestore:** 
   - Collection `users` có user mới
   - Collection `scores` có kết quả chấm điểm
3. **Storage:**
   - Folder `audio/recordings/{userId}` có file audio
   - Folder `avatars/{userId}` có avatar (nếu đã upload)

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Unable to connect to development server"

**Giải pháp:**
1. Kiểm tra Metro bundler đang chạy
2. Trên điện thoại: Shake device → Dev Settings → Change Bundle Location
3. Nhập: `192.168.1.100:8081` (IP laptop của bạn)
4. Reload app

### Lỗi: "Network request failed"

**Giải pháp:**
1. Kiểm tra backend đang chạy
2. Kiểm tra API_BASE_URL đúng IP
3. Test backend từ browser điện thoại
4. Tắt Firewall trên laptop
5. Kiểm tra cùng mạng WiFi

### Lỗi: "Microphone permission denied"

**Giải pháp:**
1. Vào Settings → Apps → EnTalk → Permissions
2. Bật Microphone
3. Hoặc uninstall app và install lại

### Lỗi: "Firebase error"

**Giải pháp:**
1. Kiểm tra `google-services.json` trong `android/app/`
2. Kiểm tra Firebase config trong `firebase.ts`
3. Rebuild app:
   ```bash
   cd entalk-frontend\android
   gradlew clean
   cd ..
   npm run android
   ```

### Lỗi: "Azure Speech API error"

**Giải pháp:**
1. Kiểm tra backend logs
2. Kiểm tra `.env` có AZURE_SPEECH_KEY
3. Kiểm tra API key còn quota

### App crash khi mở

**Giải pháp:**
1. Xem logs: `npx react-native log-android`
2. Uninstall app trên điện thoại
3. Clear cache:
   ```bash
   cd entalk-frontend
   npx react-native start --reset-cache
   ```
4. Rebuild:
   ```bash
   npm run android
   ```

---

## 📋 CHECKLIST TEST

### Authentication:
- [ ] Đăng ký thành công
- [ ] Đăng nhập thành công
- [ ] Quên mật khẩu gửi email
- [ ] Auto-login khi mở lại app
- [ ] Đăng xuất thành công

### Core Features:
- [ ] Xem danh sách lessons
- [ ] Xem chi tiết lesson
- [ ] Ghi âm audio
- [ ] Upload audio lên Storage
- [ ] Chấm điểm phát âm
- [ ] Xem kết quả chi tiết
- [ ] Xem lịch sử

### Advanced Features:
- [ ] Freestyle tạo bài học
- [ ] AI Chatbot trả lời
- [ ] AI Role-Play hội thoại
- [ ] Vocabulary tra từ

### Profile:
- [ ] Upload avatar
- [ ] Đổi display name
- [ ] Đổi mật khẩu
- [ ] Settings toggle

### Performance:
- [ ] App mở nhanh (<3s)
- [ ] Không lag khi scroll
- [ ] Audio phát mượt
- [ ] Upload nhanh

---

## 🎉 HOÀN THÀNH!

Nếu tất cả test cases pass, app của bạn đã sẵn sàng! 🚀

**Next steps:**
1. Fix bugs nếu có
2. Polish UI/UX
3. Build APK release
4. Deploy backend lên cloud

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, cung cấp:
1. Screenshot lỗi
2. Backend logs
3. React Native logs
4. Bước tái hiện lỗi

Good luck! 💪
