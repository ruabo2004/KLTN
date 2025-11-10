/**
 * Home Screen
 * Màn hình chính sau khi đăng nhập
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS, SCORE_THRESHOLDS} from '../../utils/constants';
import firestoreService from '../../services/firestoreService';

interface UserStats {
  totalPractices: number;
  averageScore: number;
  completedLessons: number;
  totalLessons: number;
  recentScores: any[];
}

const HomeScreen = ({navigation}: any) => {
  const {user, logout} = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPractices: 0,
    averageScore: 0,
    completedLessons: 0,
    totalLessons: 0,
    recentScores: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (!user) return;

      setLoading(true);

      // Get user data
      const userData = await firestoreService.getUserData(user.uid);

      // Get recent scores
      const recentScores = await firestoreService.getUserRecentScores(user.uid, 5);

      setStats({
        totalPractices: userData.totalPractices || 0,
        averageScore: userData.averageScore || 0,
        completedLessons: userData.completedLessons || 0,
        totalLessons: 20, // TODO: Get from lessons collection
        recentScores,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserStats();
  };

  const handleStartPractice = () => {
    navigation.navigate('LessonsTab');
  };

  const handleViewProgress = () => {
    // TODO: Implement Progress screen
    navigation.navigate('HistoryTab');
  };

  const handleViewHistory = () => {
    navigation.navigate('HistoryTab');
  };

  const getScoreColor = (score: number) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return COLORS.SCORE_EXCELLENT;
    if (score >= SCORE_THRESHOLDS.GOOD) return COLORS.SCORE_GOOD;
    if (score >= SCORE_THRESHOLDS.NOT_BAD) return COLORS.SCORE_NOT_BAD;
    return COLORS.SCORE_NEED_IMPROVEMENT;
  };

  const getScoreLabel = (score: number) => {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return t('results.excellent');
    if (score >= SCORE_THRESHOLDS.GOOD) return t('results.good');
    if (score >= SCORE_THRESHOLDS.NOT_BAD) return t('results.not_bad');
    return t('results.need_improvement');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.welcome', {name: user?.displayName || 'Bạn'})}</Text>
          <Text style={styles.subtitle}>Hãy luyện tập mỗi ngày để tiến bộ!</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPractices}</Text>
          <Text style={styles.statLabel}>Lần luyện tập</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statValue, {color: getScoreColor(stats.averageScore)}]}>
            {stats.averageScore.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Điểm TB</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.completedLessons}/{stats.totalLessons}
          </Text>
          <Text style={styles.statLabel}>Bài học</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hành động nhanh</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleStartPractice}>
          <View style={styles.buttonIcon}>
            <Text style={styles.buttonIconText}>🎯</Text>
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.primaryButtonText}>Bắt đầu luyện tập</Text>
            <Text style={styles.primaryButtonSubtext}>Chọn bài học và bắt đầu ngay</Text>
          </View>
          <Text style={styles.buttonArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewProgress}>
            <Text style={styles.secondaryButtonIcon}>📊</Text>
            <Text style={styles.secondaryButtonText}>Tiến độ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
            <Text style={styles.secondaryButtonIcon}>📝</Text>
            <Text style={styles.secondaryButtonText}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Scores */}
      {stats.recentScores.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kết quả gần đây</Text>
            <TouchableOpacity onPress={handleViewHistory}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {stats.recentScores.map((score: any, index: number) => (
            <View key={index} style={styles.scoreItem}>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreExercise} numberOfLines={1}>
                  {score.exerciseText || 'Bài tập'}
                </Text>
                <Text style={styles.scoreDate}>
                  {new Date(score.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View style={[styles.scoreValueContainer, {backgroundColor: getScoreColor(score.overallScore) + '20'}]}>
                <Text style={[styles.scoreValue, {color: getScoreColor(score.overallScore)}]}>
                  {score.overallScore}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {stats.totalPractices === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎤</Text>
          <Text style={styles.emptyStateTitle}>Chưa có luyện tập nào</Text>
          <Text style={styles.emptyStateText}>
            Bắt đầu luyện tập ngay để cải thiện phát âm của bạn!
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={handleStartPractice}>
            <Text style={styles.emptyStateButtonText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.XL,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  buttonIconText: {
    fontSize: 24,
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  primaryButtonSubtext: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    opacity: 0.8,
    marginTop: SPACING.XS,
  },
  buttonArrow: {
    fontSize: 32,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '300',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    marginHorizontal: SPACING.XS,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonIcon: {
    fontSize: 32,
    marginBottom: SPACING.SM,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
  },
  scoreInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  scoreExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  scoreDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  scoreValueContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.ROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
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
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  emptyStateButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  emptyStateButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
