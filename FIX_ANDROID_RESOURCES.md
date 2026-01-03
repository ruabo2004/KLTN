# 🔧 FIX ANDROID RESOURCES

## ✅ ĐÃ TẠO:
- ✅ strings.xml
- ✅ styles.xml

## ⏳ CẦN LÀM TIẾP:

### Cách 1: Dùng React Native CLI (KHUYẾN NGHỊ - DỄ NHẤT)

Mở terminal mới và chạy:

```bash
cd E:\datl
npx react-native init TempApp
```

Sau khi tạo xong, copy các file resources:

```bash
# Copy icons
xcopy /E /I TempApp\android\app\src\main\res\mipmap-* entalk-frontend\android\app\src\main\res\

# Copy drawable
xcopy /E /I TempApp\android\app\src\main\res\drawable entalk-frontend\android\app\src\main\res\drawable

# Xóa temp project
rmdir /S /Q TempApp
```

### Cách 2: Download icons từ Android Asset Studio

1. Vào: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload logo hoặc dùng text "ET"
3. Download ZIP
4. Giải nén và copy các thư mục `mipmap-*` vào:
   ```
   E:\datl\entalk-frontend\android\app\src\main\res\
   ```

### Cách 3: Tạo debug keystore

Mở terminal và chạy:

```bash
cd E:\datl\entalk-frontend\android\app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

Khi được hỏi thông tin, nhấn Enter để skip hết.

---

## 🎯 SAU KHI HOÀN THÀNH:

Trong Android Studio:
1. **File** → **Sync Project with Gradle Files**
2. **Build** → **Clean Project**
3. **Build** → **Rebuild Project**
4. Nhấn **Shift + F10** để build

---

## ⚡ CÁCH NHANH NHẤT (KHUYẾN NGHỊ):

Chạy lệnh này trong terminal:

```bash
cd E:\datl
npx react-native init TempApp --skip-install
xcopy /E /I TempApp\android\app\src\main\res entalk-frontend\android\app\src\main\res
rmdir /S /Q TempApp
```

Sau đó trong Android Studio:
- **File** → **Sync Project with Gradle Files**
- **Shift + F10** để build

Good luck! 💪
