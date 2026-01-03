/**
 * Settings Screen
 * Màn hình cài đặt ứng dụng
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, SPACING, BORDER_RADIUS, STORAGE_KEYS} from '../../utils/constants';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Xóa bộ nhớ đệm',
      'Bạn có chắc muốn xóa bộ nhớ đệm? Điều này sẽ xóa dữ liệu tạm thời nhưng không ảnh hưởng đến tiến trình học tập của bạn.',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear cache but keep user token
              const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
              await AsyncStorage.clear();
              if (token) {
                await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
              }
              Alert.alert('Thành công', 'Đã xóa bộ nhớ đệm');
            } catch (error) {
              console.error('Clear cache error:', error);
              Alert.alert('Lỗi', 'Không thể xóa bộ nhớ đệm');
            }
          },
        },
      ],
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Đặt lại cài đặt',
      'Bạn có chắc muốn đặt lại tất cả cài đặt về mặc định?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: () => {
            setNotificationsEnabled(true);
            setSoundEnabled(true);
            setAutoPlayEnabled(true);
            Alert.alert('Thành công', 'Đã đặt lại cài đặt về mặc định');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Cài đặt chung</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Thông báo</Text>
            <Text style={styles.settingDescription}>
              Nhận thông báo về tiến trình học tập
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{false: COLORS.BORDER, true: COLORS.PRIMARY}}
            thumbColor={COLORS.BACKGROUND}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Âm thanh</Text>
            <Text style={styles.settingDescription}>
              Bật/tắt hiệu ứng âm thanh
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{false: COLORS.BORDER, true: COLORS.PRIMARY}}
            thumbColor={COLORS.BACKGROUND}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Tự động phát</Text>
            <Text style={styles.settingDescription}>
              Tự động phát audio mẫu khi vào bài tập
            </Text>
          </View>
          <Switch
            value={autoPlayEnabled}
            onValueChange={setAutoPlayEnabled}
            trackColor={{false: COLORS.BORDER, true: COLORS.PRIMARY}}
            thumbColor={COLORS.BACKGROUND}
          />
        </View>
      </View>

      {/* Language Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Ngôn ngữ</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert('Ngôn ngữ', 'Hiện tại chỉ hỗ trợ Tiếng Việt')
          }>
          <Text style={styles.menuIcon}>🇻🇳</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Ngôn ngữ giao diện</Text>
            <Text style={styles.menuValue}>Tiếng Việt</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Data & Storage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Dữ liệu & Bộ nhớ</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
          <Text style={styles.menuIcon}>🗑️</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Xóa bộ nhớ đệm</Text>
            <Text style={styles.menuDescription}>
              Giải phóng không gian lưu trữ
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Dung lượng',
              'Bộ nhớ đệm: ~5 MB\nDữ liệu người dùng: ~2 MB\n\nTổng: ~7 MB',
            )
          }>
          <Text style={styles.menuIcon}>📊</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Dung lượng sử dụng</Text>
            <Text style={styles.menuDescription}>Xem chi tiết dung lượng</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Thông tin</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Điều khoản sử dụng',
              'Bằng việc sử dụng ứng dụng EnTalk, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.',
            )
          }>
          <Text style={styles.menuIcon}>📄</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Điều khoản sử dụng</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Chính sách bảo mật',
              'EnTalk cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi không chia sẻ dữ liệu của bạn với bên thứ ba.',
            )
          }>
          <Text style={styles.menuIcon}>🔒</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Chính sách bảo mật</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Liên hệ hỗ trợ',
              'Email: support@entalk.com\nHotline: 1900-xxxx\n\nChúng tôi luôn sẵn sàng hỗ trợ bạn!',
            )
          }>
          <Text style={styles.menuIcon}>📧</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Liên hệ hỗ trợ</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>📱</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Phiên bản</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Advanced */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Nâng cao</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleResetSettings}>
          <Text style={styles.menuIcon}>🔄</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Đặt lại cài đặt</Text>
            <Text style={styles.menuDescription}>
              Khôi phục cài đặt mặc định
            </Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>EnTalk - Luyện phát âm tiếng Anh với AI</Text>
        <Text style={styles.footerText}>© 2025 EnTalk Team</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  section: {
    marginTop: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: SPACING.SM,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  menuDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  menuValue: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
  },
  footer: {
    padding: SPACING.XL,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
});

export default SettingsScreen;

