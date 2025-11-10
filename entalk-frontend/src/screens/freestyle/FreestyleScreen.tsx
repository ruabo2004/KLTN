/**
 * Freestyle Screen
 * Màn hình import text tự do và tạo bài học
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import apiService from '../../services/apiService';

interface FreestyleScreenProps {
  navigation: any;
}

const FreestyleScreen: React.FC<FreestyleScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [previewSentences, setPreviewSentences] = useState<string[]>([]);

  const splitIntoSentences = (text: string): string[] => {
    // Split by period, question mark, exclamation mark
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    return sentences;
  };

  const handlePreview = () => {
    if (!inputText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập văn bản');
      return;
    }

    const sentences = splitIntoSentences(inputText);
    if (sentences.length === 0) {
      Alert.alert('Lỗi', 'Không tìm thấy câu nào trong văn bản');
      return;
    }

    setPreviewSentences(sentences);
  };

  const handleCreateLesson = async () => {
    try {
      if (!user) {
        Alert.alert('Lỗi', 'Bạn cần đăng nhập');
        return;
      }

      if (!title.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề bài học');
        return;
      }

      if (previewSentences.length === 0) {
        Alert.alert('Lỗi', 'Vui lòng xem trước câu trước khi tạo');
        return;
      }

      setCreating(true);

      const response = await apiService.createFreestyleLesson({
        userId: user.uid,
        title: title.trim(),
        sentences: previewSentences,
      });

      if (response.success) {
        Alert.alert(
          'Thành công',
          `Đã tạo ${previewSentences.length} bài tập mới!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to lesson detail
                navigation.navigate('LessonsTab', {
                  screen: 'LessonDetail',
                  params: {lessonId: response.data.lessonId},
                });
              },
            },
          ],
        );

        // Reset form
        setInputText('');
        setTitle('');
        setPreviewSentences([]);
      } else {
        throw new Error(response.message || 'Tạo bài học thất bại');
      }
    } catch (error: any) {
      console.error('Error creating freestyle lesson:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tạo bài học');
    } finally {
      setCreating(false);
    }
  };

  const handleClearPreview = () => {
    setPreviewSentences([]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✍️</Text>
        <Text style={styles.headerTitle}>Tạo bài học tự do</Text>
        <Text style={styles.headerSubtitle}>
          Dán văn bản bất kỳ và chúng tôi sẽ tự động tạo bài tập cho bạn
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📝 Hướng dẫn:</Text>
        <Text style={styles.instructionText}>1. Nhập tiêu đề bài học</Text>
        <Text style={styles.instructionText}>
          2. Dán hoặc gõ văn bản tiếng Anh (đoạn văn, bài hát, bài báo, v.v.)
        </Text>
        <Text style={styles.instructionText}>
          3. Nhấn "Xem trước" để hệ thống tách câu
        </Text>
        <Text style={styles.instructionText}>
          4. Kiểm tra và nhấn "Tạo bài học"
        </Text>
      </View>

      {/* Title Input */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Tiêu đề bài học *</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="VD: My Favorite Song, News Article, etc."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>

      {/* Text Input */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Văn bản tiếng Anh *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Dán hoặc gõ văn bản ở đây...&#10;&#10;VD: Hello, my name is John. I love learning English. It's fun and useful."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={inputText}
          onChangeText={setInputText}
          multiline
          textAlignVertical="top"
          maxLength={5000}
        />
        <Text style={styles.charCount}>
          {inputText.length}/5000 ký tự
        </Text>
      </View>

      {/* Preview Button */}
      <TouchableOpacity
        style={[styles.previewButton, !inputText.trim() && styles.buttonDisabled]}
        onPress={handlePreview}
        disabled={!inputText.trim()}>
        <Text style={styles.previewButtonText}>👁️ Xem trước câu</Text>
      </TouchableOpacity>

      {/* Preview Section */}
      {previewSentences.length > 0 && (
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              📋 Tìm thấy {previewSentences.length} câu:
            </Text>
            <TouchableOpacity onPress={handleClearPreview}>
              <Text style={styles.clearButton}>Xóa</Text>
            </TouchableOpacity>
          </View>

          {previewSentences.map((sentence, index) => (
            <View key={index} style={styles.sentenceCard}>
              <Text style={styles.sentenceNumber}>{index + 1}.</Text>
              <Text style={styles.sentenceText}>{sentence}</Text>
            </View>
          ))}

          {/* Create Lesson Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!title.trim() || creating) && styles.buttonDisabled,
            ]}
            onPress={handleCreateLesson}
            disabled={!title.trim() || creating}>
            {creating ? (
              <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
            ) : (
              <Text style={styles.createButtonText}>
                ✨ Tạo bài học ({previewSentences.length} bài tập)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsIcon}>💡</Text>
        <View style={styles.tipsContent}>
          <Text style={styles.tipsTitle}>Mẹo:</Text>
          <Text style={styles.tipsText}>
            • Chọn văn bản phù hợp trình độ của bạn
          </Text>
          <Text style={styles.tipsText}>
            • Mỗi câu sẽ trở thành một bài tập riêng
          </Text>
          <Text style={styles.tipsText}>
            • Tối đa 50 câu cho một bài học
          </Text>
          <Text style={styles.tipsText}>
            • Câu ngắn (5-15 từ) sẽ dễ luyện tập hơn
          </Text>
        </View>
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
    padding: SPACING.MD,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: SPACING.SM,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: SPACING.LG,
  },
  instructionsCard: {
    backgroundColor: COLORS.INFO + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  titleInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  textInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'right',
    marginTop: SPACING.XS,
  },
  previewButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  previewSection: {
    marginBottom: SPACING.LG,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  clearButton: {
    fontSize: 14,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  sentenceCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sentenceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginRight: SPACING.SM,
    minWidth: 30,
  },
  sentenceText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginTop: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WARNING + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.WARNING,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.XL,
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: SPACING.SM,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  tipsText: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    lineHeight: 18,
  },
});

export default FreestyleScreen;

