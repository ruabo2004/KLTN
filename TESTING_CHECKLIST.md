# ✅ TESTING CHECKLIST - ENTALK APP

## 📋 Hướng Dẫn Sử Dụng

- [ ] = Chưa test
- [x] = Đã test, hoạt động tốt
- [!] = Có bug, cần fix

---

## 🔧 SETUP & ENVIRONMENT

### Backend Setup:
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created từ `env.example`
- [ ] Backend chạy thành công (`npm start`)
- [ ] Backend accessible tại `http://localhost:3000`
- [ ] Logs hiển thị không có errors

### Frontend Setup:
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `google-services.json` đã copy vào `android/app/`
- [ ] Firebase config updated trong `firebase.ts`
- [ ] API_BASE_URL đúng trong `constants.ts`
- [ ] Android build successful
- [ ] App install trên emulator/device

---

## 🔐 AUTHENTICATION FLOW

### Register Screen:
- [ ] Hiển thị form đăng ký đúng
- [ ] Validate email format
- [ ] Validate password (min 6 chars)
- [ ] Validate confirm password match
- [ ] Validate display name required
- [ ] Show error messages khi validation fail
- [ ] Register thành công với valid data
- [ ] Create user document trong Firestore
- [ ] Auto-login sau khi register
- [ ] Navigate đến HomeScreen

### Login Screen:
- [ ] Hiển thị form đăng nhập đúng
- [ ] Validate email và password required
- [ ] Show error với wrong credentials
- [ ] Login thành công với correct credentials
- [ ] Update lastLoginAt trong Firestore
- [ ] Save token vào AsyncStorage
- [ ] Navigate đến HomeScreen
- [ ] "Forgot Password" link works

### Forgot Password Screen:
- [ ] Hiển thị form reset password
- [ ] Validate email format
- [ ] Send reset email thành công
- [ ] Show success message
- [ ] Navigate back to Login

### Auto-Login:
- [ ] Auto-login khi mở app lại
- [ ] Token persists trong AsyncStorage
- [ ] Navigate đến HomeScreen nếu logged in
- [ ] Navigate đến LoginScreen nếu not logged in

---

## 🏠 HOME SCREEN

### Stats Cards:
- [ ] Hiển thị tổng số bài học
- [ ] Hiển thị điểm trung bình
- [ ] Hiển thị chuỗi ngày luyện tập
- [ ] Stats update real-time từ Firestore
- [ ] Stats hiển thị đúng với data

### Recent Practices:
- [ ] Hiển thị danh sách recent practices
- [ ] Show lesson name, date, score
- [ ] Navigate đến ResultScreen khi tap
- [ ] Empty state khi chưa có practices
- [ ] Refresh khi pull down

### Quick Actions:
- [ ] "Bắt đầu học" navigate đến LessonsListScreen
- [ ] "Lịch sử" navigate đến HistoryScreen
- [ ] "Tính năng nâng cao" navigate đến MoreScreen

---

## 📚 LESSONS FLOW

### LessonsListScreen:
- [ ] Hiển thị danh sách lessons từ Firestore
- [ ] Filter by level works (A1, A2, B1, B2, C1, C2)
- [ ] Search bar filters lessons
- [ ] Lesson cards show: title, level, category, exercises count
- [ ] Navigate đến LessonDetailScreen khi tap
- [ ] Empty state khi không có lessons
- [ ] Pull to refresh works

### LessonDetailScreen:
- [ ] Hiển thị lesson info: title, description, level
- [ ] Hiển thị danh sách exercises
- [ ] Show exercise order, text, phonetic
- [ ] Show best score nếu đã làm
- [ ] "Bắt đầu luyện tập" button works
- [ ] Navigate đến PracticeScreen với exercise đầu tiên

### PracticeScreen (CRITICAL):
- [ ] Hiển thị exercise text và phonetic
- [ ] Play audio mẫu button works
- [ ] Audio plays correctly
- [ ] Record button shows
- [ ] Tap record button bắt đầu recording
- [ ] Waveform animation hiển thị khi recording
- [ ] Timer shows recording duration
- [ ] Tap stop button dừng recording
- [ ] Upload audio lên Firebase Storage
- [ ] Upload progress shows (0-100%)
- [ ] Call backend API `/api/scoring/request`
- [ ] Listen to Firestore for score updates
- [ ] Show "Đang xử lý..." khi chờ
- [ ] Auto-navigate đến ResultScreen khi có score
- [ ] Handle errors gracefully
- [ ] Microphone permission requested

### ResultScreen:
- [ ] Hiển thị overall score với color
- [ ] Show 4 detailed scores: Accuracy, Fluency, Completeness, Prosody
- [ ] Word-by-word analysis với colors:
  - Green: Good
  - Yellow: Fair
  - Red: Needs improvement
- [ ] "Luyện lại" button navigate back to PracticeScreen
- [ ] "Về danh sách bài học" navigate to LessonsListScreen
- [ ] "Về trang chủ" navigate to HomeScreen

---

## 📊 HISTORY SCREEN

- [ ] Hiển thị danh sách tất cả scores
- [ ] Sort by date descending (mới nhất trước)
- [ ] Show: lesson name, date, score
- [ ] Filter by date range works
- [ ] Navigate đến ResultScreen khi tap
- [ ] Empty state khi chưa có history
- [ ] Pull to refresh works

---

## 👤 PROFILE FLOW

### ProfileScreen:
- [ ] Hiển thị avatar (uploaded hoặc placeholder)
- [ ] Hiển thị display name
- [ ] Hiển thị email
- [ ] Hiển thị level badge
- [ ] Stats card shows:
  - Bài học đã hoàn thành
  - Điểm trung bình
  - Chuỗi ngày liên tục
  - Lần luyện tập
  - Từ vựng đã lưu
  - Ngày tham gia
- [ ] Stats calculate correctly
- [ ] Pull to refresh updates stats
- [ ] "Chỉnh sửa thông tin" navigate to EditProfileScreen
- [ ] "Đổi mật khẩu" navigate to ChangePasswordScreen
- [ ] "Cài đặt" navigate to SettingsScreen
- [ ] "Về ứng dụng" shows dialog
- [ ] "Đăng xuất" shows confirmation
- [ ] Logout works correctly

### EditProfileScreen:
- [ ] Load current user data
- [ ] Hiển thị current avatar
- [ ] Tap avatar mở image picker
- [ ] Select image từ library
- [ ] Preview selected image
- [ ] Edit display name field
- [ ] Email field disabled (read-only)
- [ ] "Lưu thay đổi" button works
- [ ] Upload progress shows (0-100%)
- [ ] Upload avatar to Firebase Storage
- [ ] Delete old avatar if exists
- [ ] Update Firebase Auth profile
- [ ] Update Firestore user document
- [ ] Show success message
- [ ] Navigate back to ProfileScreen
- [ ] Changes reflect immediately

### ChangePasswordScreen:
- [ ] Hiển thị 3 password fields
- [ ] Show/hide password toggles work
- [ ] Validate current password required
- [ ] Validate new password min 6 chars
- [ ] Validate confirm password matches
- [ ] Validate new password khác current
- [ ] Show password requirements
- [ ] Re-authenticate với current password
- [ ] Update password successfully
- [ ] Show error nếu current password wrong
- [ ] Show success message
- [ ] Navigate back to ProfileScreen

### SettingsScreen:
- [ ] Toggle "Thông báo" works
- [ ] Toggle "Âm thanh" works
- [ ] Toggle "Tự động phát" works
- [ ] "Ngôn ngữ" shows current language
- [ ] "Xóa bộ nhớ đệm" shows confirmation
- [ ] Clear cache works (keeps token)
- [ ] "Dung lượng sử dụng" shows info
- [ ] "Điều khoản sử dụng" shows dialog
- [ ] "Chính sách bảo mật" shows dialog
- [ ] "Liên hệ hỗ trợ" shows dialog
- [ ] "Phiên bản" shows 1.0.0
- [ ] "Đặt lại cài đặt" shows confirmation
- [ ] Reset settings works

---

## ⭐ ADVANCED FEATURES

### MoreScreen:
- [ ] Hiển thị 4 feature cards:
  - Freestyle
  - AI Chatbot
  - AI Role-Play
  - Vocabulary
- [ ] Each card navigate correctly
- [ ] Tips section shows helpful info

### FreestyleScreen:
- [ ] Text input field works
- [ ] Paste text works
- [ ] "Tách câu" button splits sentences
- [ ] Preview sentences shows
- [ ] Edit sentences works
- [ ] Remove sentences works
- [ ] "Tạo bài học" button works
- [ ] Call API `/api/freestyle/create`
- [ ] Show success message
- [ ] Navigate to lessons

### ChatbotScreen:
- [ ] Chat interface hiển thị
- [ ] Quick action buttons show
- [ ] Tap quick action sends message
- [ ] Type message works
- [ ] Send button works
- [ ] Call API `/api/chatbot/message`
- [ ] AI response shows
- [ ] Typing indicator shows
- [ ] Message history persists
- [ ] Scroll to bottom on new message

### RolePlayScreen:
- [ ] Hiển thị danh sách scenarios
- [ ] Select scenario works
- [ ] Conversation starts
- [ ] AI sends first message
- [ ] Record audio response works
- [ ] Upload audio works
- [ ] Call API `/api/roleplay/respond`
- [ ] STT + Pronunciation scoring works
- [ ] AI response shows
- [ ] Score shows per message
- [ ] "Kết thúc" button works
- [ ] Show conversation summary

### VocabularyScreen:
- [ ] 2 tabs: "Tra từ" và "Từ đã lưu"
- [ ] "Tra từ" tab:
  - Search input works
  - Call API `/api/vocabulary/lookup`
  - Show phonetic, meaning, example
  - "Lưu từ" button works
  - Call API `/api/vocabulary/save`
- [ ] "Từ đã lưu" tab:
  - Load saved words từ Firestore
  - Show word list
  - Tap word shows details
  - Delete word works
  - Empty state shows

---

## 🎯 NAVIGATION

### Bottom Tabs:
- [ ] 5 tabs hiển thị: Home, Lessons, History, More, Profile
- [ ] Icons change khi active/inactive
- [ ] Tab labels correct
- [ ] Navigate between tabs works
- [ ] Tab state persists

### Stack Navigation:
- [ ] Back buttons work
- [ ] Headers show correct titles
- [ ] Header colors consistent (PRIMARY)
- [ ] Navigate between screens smooth
- [ ] No navigation loops

---

## 🔊 AUDIO FEATURES

### Audio Playback:
- [ ] Play audio mẫu works
- [ ] Audio quality good
- [ ] Stop audio works
- [ ] Audio URL loads correctly

### Audio Recording:
- [ ] Microphone permission requested
- [ ] Recording starts on button press
- [ ] Waveform animation shows
- [ ] Timer shows duration
- [ ] Recording stops on button press
- [ ] Audio file created
- [ ] Audio quality good

### Audio Upload:
- [ ] Upload to Firebase Storage works
- [ ] Upload progress shows
- [ ] Download URL returned
- [ ] Audio accessible from URL

---

## 🔥 FIREBASE INTEGRATION

### Authentication:
- [ ] Register creates user
- [ ] Login authenticates user
- [ ] Password reset sends email
- [ ] Auto-login works
- [ ] Logout clears session

### Firestore:
- [ ] Read lessons works
- [ ] Read exercises works
- [ ] Read scores works
- [ ] Write scores works
- [ ] Real-time listeners work
- [ ] Queries filter correctly

### Storage:
- [ ] Upload audio works
- [ ] Upload avatar works
- [ ] Delete files works
- [ ] Download URLs work
- [ ] Files accessible

---

## 🌐 BACKEND API

### Scoring API:
- [ ] POST `/api/scoring/request` works
- [ ] Azure Speech API called
- [ ] Pronunciation assessment returns
- [ ] Score saved to Firestore
- [ ] Response format correct

### Roleplay API:
- [ ] POST `/api/roleplay/start` works
- [ ] POST `/api/roleplay/respond` works
- [ ] Gemini API called
- [ ] AI responses natural
- [ ] Conversation context maintained

### Chatbot API:
- [ ] POST `/api/chatbot/message` works
- [ ] Gemini API called
- [ ] Responses helpful
- [ ] Context maintained

### Vocabulary API:
- [ ] POST `/api/vocabulary/lookup` works
- [ ] Dictionary data correct
- [ ] POST `/api/vocabulary/save` works
- [ ] Saved to Firestore

### Freestyle API:
- [ ] POST `/api/freestyle/create` works
- [ ] Sentences split correctly
- [ ] Lesson created in Firestore

---

## 🎨 UI/UX

### Visual Design:
- [ ] Colors consistent
- [ ] Spacing consistent
- [ ] Fonts readable
- [ ] Icons clear
- [ ] Shadows subtle
- [ ] Borders smooth

### Interactions:
- [ ] Buttons responsive
- [ ] Tap feedback clear
- [ ] Animations smooth
- [ ] Transitions natural
- [ ] Loading states show
- [ ] Error messages clear

### Responsiveness:
- [ ] Works on different screen sizes
- [ ] Landscape orientation works
- [ ] Keyboard handling good
- [ ] ScrollViews scroll smoothly

---

## ⚡ PERFORMANCE

- [ ] App launches quickly (<3s)
- [ ] Screens load fast
- [ ] No lag when scrolling
- [ ] Images load smoothly
- [ ] Audio plays without delay
- [ ] API calls fast (<2s)
- [ ] No memory leaks
- [ ] Battery usage reasonable

---

## 🐛 ERROR HANDLING

- [ ] Network errors handled
- [ ] API errors handled
- [ ] Firebase errors handled
- [ ] Validation errors clear
- [ ] Permission errors handled
- [ ] File upload errors handled
- [ ] Audio errors handled
- [ ] No app crashes

---

## 📱 DEVICE TESTING

### Permissions:
- [ ] Microphone permission works
- [ ] Storage permission works
- [ ] Camera permission works (image picker)

### Features:
- [ ] Works on Android 10+
- [ ] Works on different devices
- [ ] Works on emulator
- [ ] Works on physical device

---

## 🔐 SECURITY

- [ ] Passwords hashed
- [ ] Tokens secure
- [ ] API keys not exposed
- [ ] Firebase rules enforced
- [ ] Re-authentication works
- [ ] Logout clears data

---

## 📊 SUMMARY

### Total Test Cases: ~200+

**Passed:** _____ / _____  
**Failed:** _____ / _____  
**Blocked:** _____ / _____

### Critical Bugs:
1. 
2. 
3. 

### Minor Bugs:
1. 
2. 
3. 

### Improvements Needed:
1. 
2. 
3. 

---

## ✅ SIGN-OFF

- [ ] All critical features tested
- [ ] All critical bugs fixed
- [ ] App ready for production
- [ ] Documentation complete

**Tested by:** _______________  
**Date:** _______________  
**Version:** 1.0.0

---

**Happy Testing! 🧪**

