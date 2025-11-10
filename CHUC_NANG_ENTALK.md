# CÁC CHỨC NĂNG CỦA APP ENTALK

## 🎯 TỔNG QUAN
**EnTalk** - Ứng dụng học phát âm tiếng Anh thông minh với AI

---

## 📱 DANH SÁCH CHỨC NĂNG CHÍNH

### 1. 🔐 QUẢN LÝ TÀI KHOẢN & XÁC THỰC

#### 1.1. Đăng ký tài khoản
- Đăng ký bằng Email/Password
- Xác thực email
- Tạo profile người dùng tự động

#### 1.2. Đăng nhập
- Đăng nhập bằng Email/Password
- Tùy chọn: Đăng nhập bằng Google/Facebook (nếu implement)
- Remember me / Auto login

#### 1.3. Quên mật khẩu
- Gửi email reset password
- Đặt lại mật khẩu mới

#### 1.4. Quản lý Profile
- Xem thông tin cá nhân
- Chỉnh sửa tên hiển thị
- Upload/thay đổi ảnh đại diện
- Xem thống kê tổng quan (tổng số bài học, điểm TB, streak)

---

### 2. 📚 QUẢN LÝ BÀI HỌC

#### 2.1. Danh sách bài học
- Hiển thị tất cả bài học có sẵn
- Phân loại theo:
  - Level: Beginner / Intermediate / Advanced
  - Category: Pronunciation / Vocabulary / Sentence
- Hiển thị tiến độ hoàn thành cho mỗi bài (%)
- Icon trạng thái: Chưa học / Đang học / Hoàn thành

#### 2.2. Tìm kiếm & Lọc bài học
- Search bar tìm kiếm theo tên bài
- Filter theo level
- Filter theo category
- Sort theo: Mới nhất / Phổ biến / Độ khó

#### 2.3. Chi tiết bài học
- Xem thông tin bài học: Title, Description, Level
- Xem danh sách exercises trong bài
- Hiển thị số lượng exercises đã hoàn thành
- Button "Bắt đầu học" / "Tiếp tục"

---

### 3. 🎤 LUYỆN TẬP PHÁT ÂM (CORE FEATURE)

#### 3.1. Màn hình luyện tập
- Hiển thị câu mẫu cần đọc (Reference Text)
- Hiển thị phiên âm IPA
- Hiển thị tips/gợi ý phát âm (nếu có)

#### 3.2. Phát audio mẫu
- Button phát audio mẫu chuẩn
- Có thể nghe lại nhiều lần
- Hiển thị trạng thái đang phát

#### 3.3. Ghi âm giọng nói
- Button ghi âm (Hold to Record / Tap to Record)
- Hiển thị waveform/visualizer khi đang ghi
- Hiển thị thời gian ghi âm
- Có thể ghi lại nếu không hài lòng
- Tự động dừng sau thời gian giới hạn (vd: 30s)

#### 3.4. Upload & Xử lý
- Upload file âm thanh lên Firebase Storage
- Hiển thị progress bar khi upload
- Gửi request chấm điểm đến backend
- Hiển thị loading state "Đang chấm điểm..."

#### 3.5. Nhận kết quả realtime
- Tự động nhận kết quả khi Azure xử lý xong
- Không cần refresh hoặc chờ đợi lâu
- Navigate tự động đến màn hình kết quả

---

### 4. 📊 XEM KẾT QUẢ & PHÂN TÍCH

#### 4.1. Điểm số tổng quan
- **Overall Score** (0-100): Điểm tổng thể, hiển thị lớn và nổi bật
- Màu sắc theo mức:
  - 90-100: Xuất sắc (Xanh lá đậm)
  - 75-89: Tốt (Xanh lá)
  - 60-74: Khá (Vàng)
  - 40-59: Trung bình (Cam)
  - 0-39: Cần cải thiện (Đỏ)

#### 4.2. Điểm chi tiết
- **Accuracy Score**: Độ chính xác phát âm
- **Fluency Score**: Độ trơn tru, tự nhiên
- **Completeness Score**: Độ hoàn chỉnh (đọc đủ từ không)
- **Pronunciation Score**: Điểm phát âm tổng hợp
- Hiển thị dạng progress bar hoặc circular chart

#### 4.3. Phân tích từng từ
- Hiển thị từng từ trong câu
- Màu sắc cho mỗi từ:
  - Xanh: Phát âm tốt
  - Vàng: Phát âm chấp nhận được
  - Đỏ: Phát âm sai, cần cải thiện
- Hiển thị điểm cho từng từ
- Hiển thị loại lỗi (nếu có): Mispronunciation, Omission, Insertion

#### 4.4. Feedback & Gợi ý
- Feedback tổng quan bằng văn bản
- Gợi ý cải thiện cụ thể
- Highlight các từ cần tập trung luyện

#### 4.5. Actions
- Button "Thử lại" - Luyện lại exercise này
- Button "Bài tiếp theo" - Chuyển sang exercise tiếp theo
- Button "Xem lại bài học" - Quay lại lesson detail
- Button "Lưu kết quả" (nếu chưa tự động lưu)

---

### 5. 📈 LỊCH SỬ & TIẾN ĐỘ

#### 5.1. Lịch sử luyện tập
- Xem tất cả các lần luyện tập trước đó
- Hiển thị:
  - Ngày giờ luyện tập
  - Tên bài học / Exercise
  - Điểm số đạt được
  - Trạng thái (Pass/Fail)
- Có thể xem lại chi tiết kết quả cũ
- Có thể nghe lại file ghi âm cũ

#### 5.2. Filter & Sort lịch sử
- Filter theo:
  - Ngày (Hôm nay / Tuần này / Tháng này / Tất cả)
  - Lesson cụ thể
  - Điểm số (Cao đến thấp / Thấp đến cao)
- Search theo tên bài

#### 5.3. Thống kê tiến độ
- Tổng số bài học đã hoàn thành
- Tổng số exercises đã làm
- Điểm trung bình
- Điểm cao nhất
- Streak (số ngày luyện tập liên tục)
- Biểu đồ tiến bộ theo thời gian

#### 5.4. Biểu đồ & Visualization
- Line chart: Điểm số theo thời gian
- Bar chart: Số lần luyện tập theo ngày/tuần
- Pie chart: Phân bố theo level/category
- Progress rings: % hoàn thành từng level

---

### 6. 🏠 TRANG CHỦ (HOME/DASHBOARD)

#### 6.1. Welcome section
- Chào mừng user với tên
- Quote/tip ngẫu nhiên về học phát âm

#### 6.2. Quick Stats
- Tổng số bài học đã hoàn thành
- Điểm trung bình gần đây
- Streak hiện tại
- Level hiện tại của user

#### 6.3. Continue Learning
- Hiển thị bài học đang học dở
- Quick access để tiếp tục ngay

#### 6.4. Recent Activity
- 5-10 lần luyện tập gần nhất
- Quick view điểm số
- Tap để xem chi tiết

#### 6.5. Recommended Lessons
- Gợi ý bài học phù hợp với level
- Bài học phổ biến
- Bài học mới

---

### 7. 🎨 CÀI ĐẶT & TÙY CHỈNH

#### 7.1. Cài đặt tài khoản
- Đổi mật khẩu
- Đổi email
- Xóa tài khoản

#### 7.2. Cài đặt ứng dụng
- Bật/tắt thông báo
- Bật/tắt âm thanh
- Chọn chất lượng audio (High/Medium/Low)
- Chọn thời gian ghi âm tối đa

#### 7.3. Giao diện
- Chọn theme (Light/Dark mode) - Optional
- Chọn ngôn ngữ interface (Tiếng Việt/English) - Optional
- Kích thước font

#### 7.4. Về ứng dụng
- Phiên bản app
- Điều khoản sử dụng
- Chính sách bảo mật
- Liên hệ/Hỗ trợ

---

## 🔔 CHỨC NĂNG PHỤ (OPTIONAL - NẾU CÓ THỜI GIAN)

### 8. Thông báo (Notifications)
- Nhắc nhở luyện tập hàng ngày
- Thông báo khi có bài học mới
- Thông báo khi đạt milestone

### 9. Gamification
- Hệ thống điểm kinh nghiệm (XP)
- Level system (Level 1, 2, 3...)
- Badges/Achievements (Hoàn thành 10 bài, Streak 7 ngày...)
- Leaderboard (Xếp hạng với bạn bè)

### 10. Social Features
- Chia sẻ kết quả lên social media
- Thêm bạn bè
- So sánh tiến độ với bạn bè
- Challenge bạn bè

### 11. Offline Mode
- Tải bài học về để học offline
- Cache audio mẫu
- Đồng bộ khi có internet

### 12. Favorite/Bookmark
- Đánh dấu bài học yêu thích
- Tạo playlist riêng
- Luyện tập lại các bài đã bookmark

### 13. Notes
- Ghi chú cho từng bài học
- Ghi chú các từ khó
- Tạo flashcards từ notes

---

## 📊 TỔNG KẾT CHỨC NĂNG

### ✅ Chức năng BẮT BUỘC (Must Have)
1. ✅ Đăng ký/Đăng nhập/Quên mật khẩu
2. ✅ Xem danh sách bài học
3. ✅ Xem chi tiết bài học & exercises
4. ✅ Ghi âm giọng nói
5. ✅ Upload lên Firebase Storage
6. ✅ Gọi API chấm điểm
7. ✅ Nhận kết quả realtime từ Firestore
8. ✅ Hiển thị kết quả chi tiết (điểm số, phân tích từng từ)
9. ✅ Xem lịch sử luyện tập
10. ✅ Xem tiến độ học tập
11. ✅ Profile cơ bản

### 🎯 Chức năng NÊN CÓ (Should Have)
1. 🎯 Tìm kiếm & lọc bài học
2. 🎯 Biểu đồ thống kê tiến độ
3. 🎯 Phát audio mẫu
4. 🎯 Waveform visualizer khi ghi âm
5. 🎯 Gợi ý bài học phù hợp
6. 🎯 Cài đặt ứng dụng cơ bản

### 💡 Chức năng TỐT NẾU CÓ (Nice to Have)
1. 💡 Thông báo nhắc nhở
2. 💡 Gamification (XP, Badges, Leaderboard)
3. 💡 Social features
4. 💡 Offline mode
5. 💡 Dark mode
6. 💡 Bookmark/Favorite
7. 💡 Notes & Flashcards

---

## 🎬 USER FLOWS CHÍNH

### Flow 1: Đăng ký & Đăng nhập lần đầu
```
1. Mở app → Màn hình Welcome
2. Chọn "Đăng ký"
3. Nhập email, password, tên
4. Xác thực email (optional)
5. Tự động đăng nhập → Home Screen
6. Xem tutorial (optional)
7. Bắt đầu học
```

### Flow 2: Luyện tập phát âm (Core Flow)
```
1. Home → Chọn "Bài học"
2. Lessons List → Chọn 1 lesson
3. Lesson Detail → Chọn 1 exercise
4. Practice Screen:
   - Đọc câu mẫu
   - Nghe audio mẫu
   - Nhấn nút ghi âm
   - Nói vào mic
   - Thả nút hoặc dừng
   - Xem preview (optional)
   - Nhấn "Gửi chấm điểm"
5. Loading... "Đang chấm điểm"
6. Result Screen:
   - Xem điểm tổng
   - Xem phân tích chi tiết
   - Xem từng từ sai/đúng
7. Chọn "Thử lại" hoặc "Bài tiếp theo"
```

### Flow 3: Xem lịch sử & tiến độ
```
1. Home → Tab "Lịch sử" hoặc "Tiến độ"
2. Xem danh sách các lần luyện tập
3. Filter/Sort nếu cần
4. Tap vào 1 item → Xem chi tiết kết quả cũ
5. Có thể nghe lại audio
6. Có thể luyện lại exercise đó
```

---

## 🎨 MÀN HÌNH CHÍNH CẦN THIẾT

1. **SplashScreen** - Màn hình khởi động
2. **WelcomeScreen** - Giới thiệu app (lần đầu)
3. **LoginScreen** - Đăng nhập
4. **RegisterScreen** - Đăng ký
5. **ForgotPasswordScreen** - Quên mật khẩu
6. **HomeScreen** - Trang chủ/Dashboard
7. **LessonsListScreen** - Danh sách bài học
8. **LessonDetailScreen** - Chi tiết bài học
9. **PracticeScreen** - Màn hình luyện tập (QUAN TRỌNG NHẤT)
10. **ResultScreen** - Kết quả chấm điểm
11. **HistoryScreen** - Lịch sử luyện tập
12. **ProgressScreen** - Tiến độ & thống kê
13. **ProfileScreen** - Thông tin cá nhân
14. **SettingsScreen** - Cài đặt

**Tổng: 14 màn hình chính**

---

## 🔧 CÔNG NGHỆ SỬ DỤNG

### Frontend (React Native)
- React Navigation - Điều hướng
- React Native Audio Recorder Player - Ghi âm
- Firebase SDK - Auth, Firestore, Storage
- React Native Chart Kit - Biểu đồ
- React Native Vector Icons - Icons
- Axios - API calls

### Backend (Node.js)
- Express - Framework
- Firebase Admin SDK - Quản lý Firebase
- Azure Speech SDK - AI chấm điểm
- Axios - Download files

### Database & Services
- Firebase Authentication - Xác thực
- Firebase Firestore - Database
- Firebase Storage - Lưu trữ audio
- Azure AI Speech - Chấm điểm phát âm

---

## 🚀 CHỨC NĂNG NÂNG CAO (ADVANCED FEATURES)

### 14. AI Đối Thoại - Role-Play (AI Conversation)
**Priority: HIGH** ⭐⭐⭐⭐⭐

#### 14.1. Mô tả
- Chế độ luyện tập hội thoại với AI trong các tình huống thực tế
- AI đóng vai một nhân vật (waiter, shopkeeper, friend, interviewer...)
- User nói, AI phản hồi tự nhiên như người thật

#### 14.2. Các tình huống (Scenarios)
- 🍽️ **Nhà hàng**: Gọi món, thanh toán, phàn nàn
- 🛍️ **Mua sắm**: Hỏi giá, thử đồ, mặc cả
- ✈️ **Sân bay**: Check-in, hỏi đường, hải quan
- 🏥 **Bệnh viện**: Mô tả triệu chứng, hẹn khám
- 💼 **Phỏng vấn**: Giới thiệu bản thân, trả lời câu hỏi
- 🎓 **Trường học**: Hỏi bài, thảo luận nhóm
- 🏨 **Khách sạn**: Đặt phòng, yêu cầu dịch vụ

#### 14.3. Luồng hoạt động
```
1. User chọn scenario (vd: Restaurant)
2. AI nói câu mở đầu: "Hi, welcome to our restaurant..."
3. User ghi âm câu trả lời
4. Backend xử lý song song:
   a) Azure Speech-to-Text → chuyển audio thành text
   b) Azure Pronunciation Assessment → chấm điểm phát âm
   c) Google Gemini AI → tạo câu phản hồi tiếp theo
   d) Azure Text-to-Speech → tạo audio cho câu phản hồi
5. App hiển thị:
   - Câu AI phản hồi (text + audio)
   - Điểm phát âm của user
   - Gợi ý sửa lỗi (nếu có)
6. Tiếp tục hội thoại cho đến khi kết thúc scenario
```

#### 14.4. Tính năng đặc biệt
- **Adaptive Difficulty**: AI điều chỉnh độ khó theo level user
- **Context Awareness**: AI nhớ ngữ cảnh hội thoại trước đó
- **Real-time Feedback**: Chấm điểm ngay sau mỗi câu
- **Conversation History**: Lưu lại toàn bộ hội thoại để xem lại

#### 14.5. Công nghệ sử dụng
- **Azure Speech-to-Text**: Convert audio → text
- **Azure Pronunciation Assessment**: Chấm điểm phát âm
- **Google Gemini API**: Tạo câu trả lời AI (FREE)
- **Azure Text-to-Speech**: Tạo giọng nói cho AI

#### 14.6. Màn hình mới
- **ScenariosListScreen**: Danh sách các tình huống
- **RolePlayScreen**: Màn hình hội thoại với AI
- **ConversationHistoryScreen**: Xem lại các cuộc hội thoại

---

### 15. Luyện Tập Freestyle - Import Nội Dung (Custom Content)
**Priority: HIGH** ⭐⭐⭐⭐⭐

#### 15.1. Mô tả
- Cho phép user import bất kỳ đoạn văn bản nào để luyện phát âm
- Không bị giới hạn bởi nội dung có sẵn trong app
- Tự động tạo audio mẫu cho văn bản đó

#### 15.2. Nguồn nội dung
- Paste text trực tiếp vào app
- Copy từ email, báo, sách, website
- Lyrics bài hát yêu thích
- Script phim, TED talks
- Email công việc cần thuyết trình
- Bài thuyết trình sắp tới

#### 15.3. Luồng hoạt động
```
1. User mở tab "Freestyle" hoặc "Import"
2. Paste đoạn văn bản (tối đa 500 từ)
3. App tự động:
   - Tách thành từng câu
   - Gửi lên backend
4. Backend xử lý:
   - Dùng Azure Text-to-Speech tạo audio mẫu cho mỗi câu
   - Lưu vào Firebase Storage
   - Tạo "Freestyle Lesson" tạm thời trong Firestore
5. User luyện tập như bình thường:
   - Nghe audio mẫu
   - Ghi âm
   - Nhận điểm
6. Lesson tự động xóa sau 7 ngày (để tiết kiệm storage)
```

#### 15.4. Tính năng đặc biệt
- **Smart Sentence Splitting**: Tách câu thông minh (không tách nhầm)
- **Highlight Keywords**: Highlight các từ khó, từ quan trọng
- **Speed Control**: Điều chỉnh tốc độ audio mẫu (0.5x, 0.75x, 1x, 1.25x)
- **Save as Lesson**: Lưu thành bài học riêng nếu thích
- **Share with Friends**: Chia sẻ bài học custom với bạn bè

#### 15.5. Giới hạn hợp lý
- Tối đa 500 từ/lần import (để tiết kiệm TTS quota)
- Tối đa 3 lần import/ngày (cho free users)
- Unlimited cho premium users (nếu có)

#### 15.6. Công nghệ sử dụng
- **Azure Text-to-Speech**: Tạo audio mẫu (FREE 0.5M chars/tháng)
- **Natural.js** hoặc **Compromise.js**: Tách câu thông minh
- **Firebase Storage**: Lưu audio tạm thời

#### 15.7. Màn hình mới
- **FreestyleScreen**: Import và quản lý nội dung custom
- **FreestylePracticeScreen**: Luyện tập với nội dung đã import

---

### 16. Phân Tích Ngữ Điệu & Trọng Âm (Prosody Analysis)
**Priority: MEDIUM** ⭐⭐⭐⭐

#### 16.1. Mô tả
- Phân tích ngữ điệu, nhịp điệu, trọng âm khi nói
- So sánh với giọng mẫu chuẩn
- Giúp sửa lỗi "nói ngang" (flat intonation)

#### 16.2. Các chỉ số phân tích
- **Prosody Score**: Điểm ngữ điệu tổng thể (0-100)
- **Pitch Contour**: Đường cong cao độ giọng nói
- **Stress Pattern**: Vị trí trọng âm trong câu
- **Rhythm**: Nhịp điệu, tốc độ nói
- **Intonation**: Ngữ điệu lên xuống (đặc biệt ở cuối câu)

#### 16.3. Visualization (Trực quan hóa)
```
Phase 1 (Cơ bản - Dễ làm):
- Hiển thị Prosody Score từ Azure
- Text feedback: "Ngữ điệu tốt" / "Cần cải thiện ngữ điệu"

Phase 2 (Nâng cao - Khó hơn):
- Biểu đồ đường (Line Chart):
  • Đường xanh: Pitch của giọng mẫu
  • Đường đỏ: Pitch của user
- Highlight các điểm khác biệt lớn
- Gợi ý: "Câu hỏi cần lên giọng ở cuối"
```

#### 16.4. Tính năng đặc biệt
- **Side-by-side Comparison**: Nghe giọng mẫu và giọng mình cạnh nhau
- **Slow Motion**: Nghe chậm để phân tích rõ hơn
- **Focus Mode**: Luyện riêng phần ngữ điệu sai

#### 16.5. Công nghệ sử dụng
- **Azure Prosody Score**: Có sẵn trong Pronunciation Assessment
- **Web Audio API**: Phân tích pitch (Frontend)
- **Librosa** (Python): Phân tích chi tiết (Backend - optional)
- **React Native Chart Kit**: Vẽ biểu đồ

#### 16.6. Cập nhật màn hình
- **ResultScreen**: Thêm section Prosody Analysis
- **DetailedAnalysisScreen**: Màn hình phân tích chi tiết với biểu đồ

---

### 17. Từ Vựng Trong Bối Cảnh (Vocabulary in Context)
**Priority: MEDIUM** ⭐⭐⭐⭐

#### 17.1. Mô tả
- Học từ vựng tự nhiên qua việc luyện phát âm
- Sau khi luyện xong một câu, hỏi user có biết nghĩa các từ không
- Tạo flashcards tự động

#### 17.2. Luồng hoạt động
```
1. User luyện xong câu: "The company will implement new policies"
2. Đạt điểm tốt (>80)
3. App hiển thị popup:
   "🎉 Phát âm tốt! Bạn có biết nghĩa của những từ này không?"
   
4. Hiển thị 2-3 từ khó trong câu:
   [implement] [policies]
   
5. User tap vào từ → Hiển thị:
   📖 Implement /ˈɪmplɪment/
   
   Nghĩa: Thực hiện, triển khai
   
   Ví dụ:
   • The company will implement new policies
   • We need to implement these changes immediately
   
   Từ đồng nghĩa: execute, carry out
   
   [Lưu vào Flashcard] [Đã hiểu]
   
6. Nếu chọn "Lưu vào Flashcard":
   - Lưu vào collection vocabulary
   - Có thể ôn tập sau trong tab Vocabulary
```

#### 17.3. Tính năng Flashcards
- **Spaced Repetition**: Ôn tập theo thuật toán lặp lại ngắt quãng
- **Quiz Mode**: Trắc nghiệm từ vựng
- **Audio Pronunciation**: Nghe phát âm từng từ
- **Example Sentences**: Ví dụ câu có ngữ cảnh
- **Progress Tracking**: Theo dõi từ đã học, đã nhớ

#### 17.4. Công nghệ sử dụng
- **Free Dictionary API**: Lấy định nghĩa, phát âm, ví dụ (FREE)
- **Google Gemini**: Tạo ví dụ câu đơn giản hơn (nếu cần)
- **Firebase Firestore**: Lưu flashcards của user

#### 17.5. Màn hình mới
- **VocabularyScreen**: Danh sách từ vựng đã lưu
- **FlashcardScreen**: Ôn tập flashcards
- **VocabularyQuizScreen**: Quiz từ vựng

---

### 18. AI Chatbot Trợ Lý Học Tập (Learning Assistant)
**Priority: HIGH** ⭐⭐⭐⭐⭐

#### 18.1. Mô tả
- Chatbot AI thông minh hỗ trợ học tập 24/7
- Trả lời mọi câu hỏi về tiếng Anh
- Dịch thuật, giải thích ngữ pháp, tư vấn học tập

#### 18.2. Các chức năng chính

**A. Dịch thuật thông minh**
```
User: "Dịch: I'm looking forward to seeing you"

Bot: 
📝 Dịch: "Tôi đang mong được gặp bạn"

💡 Giải thích:
- "look forward to" + V-ing: mong chờ điều gì
- Không dùng "to see" mà phải dùng "to seeing"

🎯 Ví dụ khác:
• I'm looking forward to hearing from you
• We're looking forward to the party
```

**B. Giải thích từ vựng**
```
User: "Từ 'implement' nghĩa là gì?"

Bot:
📖 Implement /ˈɪmplɪment/

Động từ: Thực hiện, triển khai (kế hoạch, chính sách)

🎯 Ví dụ:
• The company will implement new policies next month
  (Công ty sẽ triển khai chính sách mới tháng sau)

💡 Từ đồng nghĩa: execute, carry out, put into practice

🎤 [Luyện phát âm từ này]
```

**C. Kiểm tra ngữ pháp**
```
User: "Câu này đúng không: I have go to school yesterday"

Bot:
❌ Câu sai!

✅ Sửa: "I went to school yesterday"

💡 Lý do:
- "Yesterday" → dùng thì quá khứ đơn
- "Have" + V3 → thì hiện tại hoàn thành (không dùng với yesterday)
- Go → Went (quá khứ)
```

**D. Hỏi về phát âm**
```
User: "Phát âm 'schedule' khác nhau thế nào giữa Mỹ và Anh?"

Bot:
🇺🇸 Mỹ: /ˈskedʒuːl/ (SKED-jool)
🇬🇧 Anh: /ˈʃedjuːl/ (SHED-yool)

💡 Mẹo:
- Mỹ: Âm "sk" như "school"
- Anh: Âm "sh" như "she"

🎤 Bạn muốn luyện phát âm từ này?
[Luyện ngay]
```

**E. Tư vấn học tập**
```
User: "Làm sao để cải thiện phát âm?"

Bot:
🎯 5 cách cải thiện phát âm hiệu quả:

1. 🎧 Nghe và bắt chước
   - Nghe audio mẫu nhiều lần
   - Ghi âm và so sánh

2. 📱 Luyện đều đặn trên EnTalk
   - 10-15 phút/ngày
   - Tập trung từng âm riêng lẻ

3. 🎬 Xem phim có phụ đề
   - Chú ý cách phát âm
   - Lặp lại theo

4. 🗣️ Thực hành AI Role-Play
   - Luyện phản xạ hội thoại

5. 📝 Ghi chú từ khó
   - Lưu Flashcard
   - Ôn tập thường xuyên

💪 Bạn muốn bắt đầu bài nào?
```

**F. Giải thích ngữ pháp**
```
User: "Khi nào dùng Present Perfect?"

Bot:
⏰ Thì Hiện Tại Hoàn Thành (Present Perfect)

📝 Công thức: have/has + V3

✅ Dùng khi:
1. Hành động vừa mới xảy ra
   • I have just finished my homework

2. Kinh nghiệm trong đời
   • I have been to Japan twice

3. Hành động bắt đầu quá khứ, tiếp tục hiện tại
   • I have lived here for 5 years

❌ KHÔNG dùng với: yesterday, last week, ago...

🎯 Bạn muốn làm bài tập về thì này?
[Làm bài tập]
```

#### 18.3. Tính năng đặc biệt

**Quick Actions (Gợi ý nhanh)**
- 💬 Dịch từ/câu
- 📖 Giải thích từ vựng
- ✍️ Kiểm tra ngữ pháp
- 🎤 Hỏi về phát âm
- 💡 Mẹo học tập
- 🎯 Gợi ý bài học

**Context-Aware (Hiểu ngữ cảnh)**
- Nhớ lịch sử hội thoại
- Liên kết với tiến độ học của user
- Gợi ý bài học phù hợp với level

**Actionable Responses (Hành động trực tiếp)**
- [Luyện phát âm từ này] → Chuyển đến PracticeScreen
- [Làm bài tập] → Tạo quiz ngay
- [Xem bài học] → Navigate đến lesson liên quan

#### 18.4. Giới hạn hợp lý
- **Free users**: 50 tin nhắn/ngày
- **Premium users**: Unlimited
- Rate limit: 10 tin nhắn/phút (chống spam)

#### 18.5. Công nghệ sử dụng
- **Google Gemini API**: AI chatbot (FREE - 1500 requests/ngày)
- **Free Dictionary API**: Tra từ điển
- **Firebase Firestore**: Lưu lịch sử chat

#### 18.6. Màn hình mới
- **ChatbotScreen**: Màn hình chat với AI
- **ChatHistoryScreen**: Lịch sử các cuộc hội thoại

#### 18.7. Giao diện

```
┌─────────────────────────────────┐
│  ← EnTalk Assistant        [⋮]  │
├─────────────────────────────────┤
│                                 │
│  [Bot Avatar]                   │
│  Xin chào! Tôi là trợ lý AI    │
│  của EnTalk. Hãy hỏi tôi bất   │
│  cứ điều gì về tiếng Anh! 😊   │
│                     [10:30 AM]  │
│                                 │
│ 💬 Gợi ý câu hỏi:               │
│  [Dịch từ/câu]  [Giải thích]   │
│  [Kiểm tra ngữ pháp] [Phát âm] │
│                                 │
│              [User Avatar]      │
│              Dịch: Hello        │
│              [10:31 AM]         │
│                                 │
│  [Bot Avatar]                   │
│  📝 "Hello" = "Xin chào"       │
│                                 │
│  🎯 Cách dùng:                  │
│  • Hello! (Chào bạn!)          │
│  • Hello everyone              │
│                                 │
│  [Luyện phát âm] [Lưu từ]      │
│                     [10:31 AM]  │
│                                 │
├─────────────────────────────────┤
│  [📎] [Type message...] [🎤][>]│
└─────────────────────────────────┘
```

---

## 📊 CẬP NHẬT TỔNG KẾT

### ✅ Chức năng CHÍNH (Must Have) - 7 modules
1. ✅ Quản lý tài khoản & Xác thực
2. ✅ Quản lý bài học
3. ✅ Luyện tập phát âm (Core)
4. ✅ Xem kết quả & Phân tích
5. ✅ Lịch sử & Tiến độ
6. ✅ Trang chủ/Dashboard
7. ✅ Cài đặt & Tùy chỉnh

### 🚀 Chức năng NÂNG CAO (Advanced) - 5 modules MỚI
8. 🚀 **AI Đối Thoại Role-Play** (Priority: HIGH) ⭐⭐⭐⭐⭐
9. 🚀 **Luyện Tập Freestyle** (Priority: HIGH) ⭐⭐⭐⭐⭐
10. 🚀 **Phân Tích Ngữ Điệu** (Priority: MEDIUM) ⭐⭐⭐⭐
11. 🚀 **Từ Vựng Trong Bối Cảnh** (Priority: MEDIUM) ⭐⭐⭐⭐
12. 🚀 **AI Chatbot Trợ Lý** (Priority: HIGH) ⭐⭐⭐⭐⭐

### 💡 Chức năng PHỤ (Optional) - 6 modules
13. 💡 Thông báo
14. 💡 Gamification
15. 💡 Social Features
16. 💡 Offline Mode
17. 💡 Favorite/Bookmark
18. 💡 Notes & Flashcards (đã tích hợp vào module 11)

---

## 🎯 ƯU TIÊN PHÁT TRIỂN MỚI

### Phase 1: Core Features (Tuần 1-8) - BẮT BUỘC
- Modules 1-7

### Phase 2: High Priority Advanced (Tuần 8-11) - NÊN CÓ
- **Tuần 8-9**: Freestyle Import + AI Chatbot
- **Tuần 10-11**: AI Role-Play

### Phase 3: Medium Priority (Tuần 11-12) - TỐT NẾU CÓ
- **Tuần 11**: Vocabulary in Context
- **Tuần 12**: Prosody Analysis (basic)

### Phase 4: Polish & Deploy (Tuần 12-13)

---

## 📱 CẬP NHẬT DANH SÁCH MÀN HÌNH

### Màn hình gốc (14 màn hình)
1-14. (Giữ nguyên như trước)

### Màn hình mới (7 màn hình)
15. **ScenariosListScreen** - Danh sách tình huống Role-Play
16. **RolePlayScreen** - Hội thoại với AI
17. **ConversationHistoryScreen** - Lịch sử hội thoại AI
18. **FreestyleScreen** - Import nội dung tự do
19. **ChatbotScreen** - Chat với AI trợ lý
20. **VocabularyScreen** - Quản lý từ vựng đã lưu
21. **FlashcardScreen** - Ôn tập flashcards

**Tổng: 21 màn hình**

---

## 💻 CẬP NHẬT CÔNG NGHỆ

### AI & NLP Services
- **Google Gemini API** - AI Chatbot & Role-Play (FREE)
- **Azure Speech-to-Text** - Convert audio → text
- **Azure Text-to-Speech** - Tạo audio mẫu (FREE 0.5M chars)
- **Azure Pronunciation Assessment** - Chấm điểm phát âm
- **Free Dictionary API** - Tra từ điển (FREE)

### Frontend Libraries (Thêm)
- **React Native Gifted Chat** - UI cho chatbot
- **React Native Sound** - Phát audio nâng cao
- **React Native Chart Kit** - Biểu đồ prosody

### Backend Services (Thêm)
- **Natural.js** hoặc **Compromise.js** - Xử lý ngôn ngữ tự nhiên
- **@google/generative-ai** - Google Gemini SDK

---

## 💰 CHI PHÍ CẬP NHẬT

### Với 1000 users active/tháng:

**Trước** (Core only):
- Azure Speech: $50-100
- Firebase: $25
- **Total: $75-125/tháng**

**Sau** (Full features với FREE tier):
- Azure Speech: $0 (trong FREE quota)
- Google Gemini: $0 (FREE 1500 req/day)
- Firebase: $25-30
- **Total: $25-30/tháng** 🎉

**Khi vượt FREE quota** (>100 users/day):
- Azure Speech: $50-100
- Google Gemini: $0 (vẫn FREE)
- Firebase: $30-50
- **Total: $80-150/tháng**

---

**Tổng số chức năng: 12 modules chính + 6 modules optional = 18 modules**
**Tổng số màn hình: 21 màn hình**
**Ưu tiên: Core (7) → Advanced High Priority (3) → Medium Priority (2) → Optional (6)**

