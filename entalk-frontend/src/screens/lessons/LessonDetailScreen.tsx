/**
 * Lesson Detail Screen
 * Màn hình chi tiết bài học
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import apiService from '../../services/apiService';

interface Exercise {
  id: string;
  text: string;
  phonetic: string;
  audioUrl: string;
  order: number;
  difficulty: string;
  tips: string;
  isCompleted: boolean;
  bestScore: number | null;
}

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  totalExercises: number;
  completedExercises: number;
}

const LessonDetailScreen = ({route, navigation}: any) => {
  const {lessonId} = route.params;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonDetail();
  }, [lessonId]);

  const loadLessonDetail = async () => {
    try {
      setLoading(true);
      
      // Load lesson info
      const lessonResponse = await apiService.getLessonById(lessonId);
      if (lessonResponse.success) {
        setLesson(lessonResponse.data.lesson);
      }

      // Load exercises
      const exercisesResponse = await apiService.getLessonExercises(lessonId);
      if (exercisesResponse.success) {
        setExercises(exercisesResponse.data.exercises);
      }
    } catch (error) {
      console.error('Error loading lesson detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExercise = (exercise: Exercise) => {
    navigation.navigate('Practice', {
      lessonId,
      exerciseId: exercise.id,
      exercise,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return COLORS.SUCCESS;
      case 'medium':
        return COLORS.WARNING;
      case 'hard':
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy bài học</Text>
      </View>
    );
  }

  const progress = lesson.totalExercises > 0
    ? Math.round((lesson.completedExercises / lesson.totalExercises) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Lesson Info */}
      <View style={styles.lessonInfo}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description}>{lesson.description}</Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Tiến độ</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? COLORS.SUCCESS : COLORS.PRIMARY,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {lesson.completedExercises}/{lesson.totalExercises} bài tập đã hoàn thành
          </Text>
        </View>
      </View>

      {/* Exercises List */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Bài tập ({exercises.length})</Text>

        {exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseText} numberOfLines={2}>
                  {exercise.text}
                </Text>
                {exercise.phonetic && (
                  <Text style={styles.exercisePhonetic}>{exercise.phonetic}</Text>
                )}
              </View>
              {exercise.isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedIcon}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.exerciseMeta}>
              <View
                style={[
                  styles.difficultyBadge,
                  {backgroundColor: getDifficultyColor(exercise.difficulty) + '20'},
                ]}>
                <Text
                  style={[
                    styles.difficultyText,
                    {color: getDifficultyColor(exercise.difficulty)},
                  ]}>
                  {getDifficultyLabel(exercise.difficulty)}
                </Text>
              </View>

              {exercise.bestScore !== null && (
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreIcon}>⭐</Text>
                  <Text style={styles.scoreText}>{exercise.bestScore}</Text>
                </View>
              )}
            </View>

            {exercise.tips && (
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsIcon}>💡</Text>
                <Text style={styles.tipsText}>{exercise.tips}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                exercise.isCompleted && styles.retryButton,
              ]}
              onPress={() => handleStartExercise(exercise)}>
              <Text style={styles.startButtonText}>
                {exercise.isCompleted ? 'Luyện lại' : 'Bắt đầu'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {exercises.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateText}>
            Bài học này chưa có bài tập nào
          </Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  lessonInfo: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.LG,
  },
  progressSection: {
    marginTop: SPACING.MD,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderRadius: BORDER_RADIUS.SM,
    overflow: 'hidden',
    marginBottom: SPACING.SM,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.SM,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  exercisesSection: {
    marginBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  exerciseCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  exercisePhonetic: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.SM,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WARNING + '20',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  scoreIcon: {
    fontSize: 12,
    marginRight: SPACING.XS,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.WARNING,
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.INFO + '10',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
  },
  tipsIcon: {
    fontSize: 16,
    marginRight: SPACING.SM,
  },
  tipsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.SECONDARY,
  },
  startButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XXL,
    marginTop: SPACING.XL,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default LessonDetailScreen;



