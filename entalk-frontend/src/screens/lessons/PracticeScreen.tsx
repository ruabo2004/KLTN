/**
 * Practice Screen
 * Màn hình luyện tập - QUAN TRỌNG NHẤT
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import audioService from '../../services/audioService';
import apiService from '../../services/apiService';
import storageService from '../../services/storageService';
import firestore from '@react-native-firebase/firestore';

interface PracticeScreenProps {
  route: any;
  navigation: any;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({route, navigation}) => {
  const {user} = useAuth();
  const {lessonId, exerciseId, exercise} = route.params;

  // States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scoreId, setScoreId] = useState<string | null>(null);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  // Animation
  const recordButtonScale = useRef(new Animated.Value(1)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      // Cleanup
      audioService.stopRecording().catch(console.error);
      audioService.stopPlaying().catch(console.error);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Animate waveform
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveformAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(waveformAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      waveformAnimation.setValue(0);
    }
  }, [isRecording]);

  useEffect(() => {
    // Listen to score updates from Firestore
    if (scoreId) {
      const unsubscribe = firestore()
        .collection('scores')
        .doc(scoreId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data?.status === 'completed') {
              // Navigate to result screen
              setProcessing(false);
              navigation.replace('Result', {
                scoreId,
                lessonId,
                exerciseId,
              });
            } else if (data?.status === 'failed') {
              setProcessing(false);
              Alert.alert(
                t('common.error'),
                'Không thể chấm điểm. Vui lòng thử lại.',
              );
            }
          }
        });

      return () => unsubscribe();
    }
  }, [scoreId]);

  const handlePlaySample = async () => {
    try {
      if (isPlayingSample) {
        await audioService.stopPlaying();
        setIsPlayingSample(false);
      } else {
        setIsPlayingSample(true);
        await audioService.playFromUrl(exercise.audioUrl);
        setIsPlayingSample(false);
      }
    } catch (error) {
      console.error('Error playing sample:', error);
      setIsPlayingSample(false);
      Alert.alert(t('common.error'), 'Không thể phát audio mẫu');
    }
  };

  const handleStartRecording = async () => {
    try {
      // Animate button
      Animated.spring(recordButtonScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();

      const path = await audioService.startRecording();
      setRecordingPath(path);
      setIsRecording(true);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      Alert.alert(
        t('common.error'),
        error.message === 'Microphone permission denied'
          ? t('practice.recording_permission')
          : t('practice.recording_error'),
      );
      
      // Reset button
      Animated.spring(recordButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleStopRecording = async () => {
    try {
      // Animate button back
      Animated.spring(recordButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      const path = await audioService.stopRecording();
      setIsRecording(false);
      setRecordingPath(path);

      // Show confirmation
      Alert.alert(
        'Ghi âm hoàn tất',
        'Bạn có muốn gửi bài làm để chấm điểm không?',
        [
          {
            text: 'Ghi lại',
            style: 'cancel',
            onPress: () => setRecordingPath(null),
          },
          {
            text: 'Gửi bài',
            onPress: () => handleSubmit(path),
          },
        ],
      );
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      Alert.alert(t('common.error'), t('practice.recording_error'));
    }
  };

  const handleSubmit = async (audioPath: string) => {
    try {
      if (!user) {
        Alert.alert(t('common.error'), 'User not authenticated');
        return;
      }

      // 1. Upload audio to Firebase Storage
      setUploading(true);
      const audioUrl = await storageService.uploadAudio(
        audioPath,
        `recordings/${user.uid}/${Date.now()}.m4a`,
      );
      setUploading(false);

      // 2. Call backend API to request scoring
      setProcessing(true);
      const response = await apiService.requestScoring({
        userId: user.uid,
        lessonId,
        exerciseId,
        audioUrl,
        referenceText: exercise.text,
      });

      if (response.success) {
        setScoreId(response.data.scoreId);
        // Now wait for Firestore listener to detect completion
      } else {
        throw new Error(response.message || 'Scoring request failed');
      }
    } catch (error: any) {
      console.error('Error submitting:', error);
      setUploading(false);
      setProcessing(false);
      Alert.alert(
        t('common.error'),
        error.message || 'Không thể gửi bài. Vui lòng thử lại.',
      );
    }
  };

  const handleRecordButtonPress = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const waveformOpacity = waveformAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const waveformScale = waveformAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Exercise Content */}
      <View style={styles.content}>
        {/* Instruction */}
        <Text style={styles.instruction}>{t('practice.read_this_sentence')}</Text>

        {/* Reference Text */}
        <View style={styles.textCard}>
          <Text style={styles.referenceText}>{exercise.text}</Text>
          {exercise.phonetic && (
            <Text style={styles.phoneticText}>{exercise.phonetic}</Text>
          )}
        </View>

        {/* Sample Audio Button */}
        <TouchableOpacity
          style={styles.sampleButton}
          onPress={handlePlaySample}
          disabled={isPlayingSample || isRecording || uploading || processing}>
          <Text style={styles.sampleIcon}>{isPlayingSample ? '⏸️' : '🔊'}</Text>
          <Text style={styles.sampleButtonText}>
            {isPlayingSample ? 'Đang phát...' : t('practice.listen_sample')}
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        {exercise.tips && (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsIcon}>💡</Text>
            <Text style={styles.tipsText}>{exercise.tips}</Text>
          </View>
        )}
      </View>

      {/* Recording Section */}
      <View style={styles.recordingSection}>
        {/* Waveform Animation */}
        {isRecording && (
          <View style={styles.waveformContainer}>
            {[...Array(5)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.waveformBar,
                  {
                    opacity: waveformOpacity,
                    transform: [{scaleY: waveformScale}],
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* Status Text */}
        {uploading && (
          <Text style={styles.statusText}>{t('practice.uploading')}</Text>
        )}
        {processing && (
          <Text style={styles.statusText}>{t('practice.scoring')}</Text>
        )}
        {isRecording && !uploading && !processing && (
          <Text style={styles.statusText}>{t('practice.recording')}</Text>
        )}
        {!isRecording && !uploading && !processing && (
          <Text style={styles.statusText}>{t('practice.tap_to_record')}</Text>
        )}

        {/* Record Button */}
        <Animated.View style={{transform: [{scale: recordButtonScale}]}}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
              (uploading || processing) && styles.recordButtonDisabled,
            ]}
            onPress={handleRecordButtonPress}
            disabled={uploading || processing}
            activeOpacity={0.8}>
            {uploading || processing ? (
              <ActivityIndicator size="large" color={COLORS.TEXT_LIGHT} />
            ) : (
              <View style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive,
              ]} />
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.recordHint}>
          {isRecording ? 'Nhấn để dừng' : 'Giữ và nói'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
  },
  instruction: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  textCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.XL,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  referenceText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.SM,
  },
  phoneticText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },
  sampleIcon: {
    fontSize: 24,
    marginRight: SPACING.SM,
  },
  sampleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.INFO + '15',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },
  tipsIcon: {
    fontSize: 20,
    marginRight: SPACING.SM,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  recordingSection: {
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
    paddingHorizontal: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: SPACING.MD,
  },
  waveformBar: {
    width: 8,
    height: 40,
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LG,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: COLORS.ERROR,
  },
  recordButtonDisabled: {
    opacity: 0.6,
  },
  recordButtonInner: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  recordButtonInnerActive: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.SM,
  },
  recordHint: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
  },
});

export default PracticeScreen;

