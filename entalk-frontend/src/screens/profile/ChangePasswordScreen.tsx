/**
 * Change Password Screen
 * Màn hình đổi mật khẩu
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateInputs = () => {
    if (!currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return false;
    }

    if (!newPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const user = auth().currentUser;
      if (!user || !user.email) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Re-authenticate user with current password
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);

      Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Change password error:', error);
      let message = 'Không thể đổi mật khẩu. Vui lòng thử lại.';

      if (error.code === 'auth/wrong-password') {
        message = 'Mật khẩu hiện tại không đúng';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mật khẩu mới quá yếu';
      } else if (error.code === 'auth/requires-recent-login') {
        message = 'Vui lòng đăng nhập lại để đổi mật khẩu';
      }

      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoTitle}>Đổi mật khẩu</Text>
          <Text style={styles.infoText}>
            Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại và mật khẩu
            mới của bạn.
          </Text>
        </View>

        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              secureTextEntry={!showCurrentPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Text style={styles.eyeIcon}>
                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              secureTextEntry={!showNewPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}>
              <Text style={styles.eyeIcon}>
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIcon}>
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
          <Text style={styles.requirementItem}>• Tối thiểu 6 ký tự</Text>
          <Text style={styles.requirementItem}>
            • Khác với mật khẩu hiện tại
          </Text>
          <Text style={styles.requirementItem}>
            • Nên bao gồm chữ hoa, chữ thường và số
          </Text>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={[
            styles.changeButton,
            loading && styles.changeButtonDisabled,
          ]}
          onPress={handleChangePassword}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.changeButtonText}>Đổi mật khẩu</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  content: {
    padding: SPACING.LG,
  },
  infoCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    marginBottom: SPACING.XL,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: SPACING.SM,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  eyeButton: {
    padding: SPACING.MD,
  },
  eyeIcon: {
    fontSize: 20,
  },
  requirementsCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.XL,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  requirementItem: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  changeButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  changeButtonDisabled: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  cancelButton: {
    padding: SPACING.LG,
    alignItems: 'center',
    marginTop: SPACING.SM,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default ChangePasswordScreen;

