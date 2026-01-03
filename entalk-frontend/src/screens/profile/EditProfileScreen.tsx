/**
 * Edit Profile Screen
 * Màn hình chỉnh sửa thông tin cá nhân
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from '../../context/AuthContext';
import authService from '../../services/authService';
import storageService from '../../services/storageService';
import firestoreService from '../../services/firestoreService';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUri, setAvatarUri] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Load user data from Firestore
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (user?.uid) {
        const userData = await firestoreService.getUserData(user.uid);
        if (userData) {
          setDisplayName(userData.displayName || '');
          setAvatarUri(userData.photoURL || '');
        }
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
          return;
        }

        if (response.assets && response.assets[0]) {
          setAvatarUri(response.assets[0].uri || '');
        }
      },
    );
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên hiển thị');
      return;
    }

    if (!user) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      let photoURL = user.photoURL;
      let photoStoragePath = null;

      // Upload new avatar if changed
      if (avatarUri && avatarUri !== user.photoURL && !avatarUri.startsWith('http')) {
        const result = await storageService.uploadAvatar(
          user.uid,
          {uri: avatarUri},
          (progress) => {
            setUploadProgress(progress);
          },
        );
        photoURL = result.url;
        photoStoragePath = result.path;

        // Delete old avatar if exists
        const userData = await firestoreService.getUserData(user.uid);
        if (userData?.photoStoragePath) {
          await storageService.deleteFile(userData.photoStoragePath);
        }
      }

      // Update Firebase Auth profile
      await authService.updateProfile({
        displayName: displayName.trim(),
        photoURL: photoURL || undefined,
      });

      // Update Firestore
      await firestoreService.updateUserData(user.uid, {
        displayName: displayName.trim(),
        photoURL: photoURL,
        photoStoragePath: photoStoragePath,
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChoosePhoto}
            disabled={loading}>
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {displayName?.charAt(0).toUpperCase() || '👤'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh đại diện</Text>
        </View>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, {width: `${uploadProgress}%`}]}
              />
            </View>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Display Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Nhập tên hiển thị"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            editable={!loading}
          />
        </View>

        {/* Email (Read-only) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email || ''}
            editable={false}
          />
          <Text style={styles.hint}>Email không thể thay đổi</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.SM,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.BORDER,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  cameraIconText: {
    fontSize: 20,
  },
  avatarHint: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: SPACING.LG,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.SM,
    overflow: 'hidden',
    marginBottom: SPACING.XS,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
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
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  inputDisabled: {
    backgroundColor: COLORS.BACKGROUND_GRAY,
    color: COLORS.TEXT_SECONDARY,
  },
  hint: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  saveButtonText: {
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

export default EditProfileScreen;

