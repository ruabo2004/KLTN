/**
 * Lessons List Screen
 * Màn hình danh sách bài học
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS, USER_LEVELS} from '../../utils/constants';
import apiService from '../../services/apiService';

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  totalExercises: number;
  completedExercises: number;
  isActive: boolean;
}

const LessonsListScreen = ({navigation}: any) => {
  const {user} = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [searchQuery, selectedLevel, lessons]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLessons();
      if (response.success) {
        setLessons(response.data.lessons);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...lessons];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        lesson =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel) {
      filtered = filtered.filter(lesson => lesson.level === selectedLevel);
    }

    setFilteredLessons(filtered);
  };

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('LessonDetail', {lessonId: lesson.id});
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case USER_LEVELS.BEGINNER:
        return COLORS.SUCCESS;
      case USER_LEVELS.INTERMEDIATE:
        return COLORS.WARNING;
      case USER_LEVELS.ADVANCED:
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case USER_LEVELS.BEGINNER:
        return t('lessons.beginner');
      case USER_LEVELS.INTERMEDIATE:
        return t('lessons.intermediate');
      case USER_LEVELS.ADVANCED:
        return t('lessons.advanced');
      default:
        return level;
    }
  };

  const getProgressPercentage = (lesson: Lesson) => {
    if (lesson.totalExercises === 0) return 0;
    return Math.round((lesson.completedExercises / lesson.totalExercises) * 100);
  };

  const renderLessonItem = ({item}: {item: Lesson}) => {
    const progress = getProgressPercentage(item);
    const isCompleted = progress === 100;

    return (
      <TouchableOpacity
        style={styles.lessonCard}
        onPress={() => handleLessonPress(item)}
        activeOpacity={0.7}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.lessonTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {isCompleted && <Text style={styles.completedBadge}>✓</Text>}
            </View>
            <Text style={styles.lessonDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.lessonMeta}>
          <View style={[styles.levelBadge, {backgroundColor: getLevelColor(item.level) + '20'}]}>
            <Text style={[styles.levelText, {color: getLevelColor(item.level)}]}>
              {getLevelLabel(item.level)}
            </Text>
          </View>

          <Text style={styles.exerciseCount}>
            {item.completedExercises}/{item.totalExercises} bài tập
          </Text>
        </View>

        {/* Progress Bar */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: isCompleted ? COLORS.SUCCESS : COLORS.PRIMARY,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('lessons.search_lessons')}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Level Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === null && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel(null)}>
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === null && styles.filterButtonTextActive,
            ]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === USER_LEVELS.BEGINNER && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel(USER_LEVELS.BEGINNER)}>
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === USER_LEVELS.BEGINNER && styles.filterButtonTextActive,
            ]}>
            {t('lessons.beginner')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === USER_LEVELS.INTERMEDIATE && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel(USER_LEVELS.INTERMEDIATE)}>
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === USER_LEVELS.INTERMEDIATE && styles.filterButtonTextActive,
            ]}>
            {t('lessons.intermediate')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === USER_LEVELS.ADVANCED && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel(USER_LEVELS.ADVANCED)}>
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === USER_LEVELS.ADVANCED && styles.filterButtonTextActive,
            ]}>
            {t('lessons.advanced')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsText}>
        {filteredLessons.length} bài học
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredLessons}
        renderItem={renderLessonItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateText}>Không tìm thấy bài học nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  listContent: {
    padding: SPACING.LG,
  },
  header: {
    marginBottom: SPACING.MD,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.SM,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.BACKGROUND,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  filterButtonTextActive: {
    color: COLORS.TEXT_LIGHT,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  lessonCard: {
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
  lessonHeader: {
    marginBottom: SPACING.MD,
  },
  lessonInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  completedBadge: {
    fontSize: 20,
    color: COLORS.SUCCESS,
    marginLeft: SPACING.SM,
  },
  lessonDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  levelBadge: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseCount: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderRadius: BORDER_RADIUS.SM,
    marginRight: SPACING.SM,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.SM,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    width: 40,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XXL,
    marginTop: SPACING.XXL,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default LessonsListScreen;



