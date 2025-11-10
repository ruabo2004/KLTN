/**
 * History Screen
 * Màn hình lịch sử luyện tập
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import firestoreService from '../../services/firestoreService';

interface ScoreRecord {
  id: string;
  lessonTitle: string;
  exerciseText: string;
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  createdAt: any;
}

interface HistoryScreenProps {
  navigation: any;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      const recentScores = await firestoreService.getUserRecentScores(user.uid, 50);
      setScores(recentScores);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.SUCCESS;
    if (score >= 60) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Tốt';
    if (score >= 60) return 'Khá';
    return 'Cần cải thiện';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderScoreItem = ({item}: {item: ScoreRecord}) => {
    const scoreColor = getScoreColor(item.overallScore);
    const scoreLabel = getScoreLabel(item.overallScore);

    return (
      <TouchableOpacity
        style={styles.scoreCard}
        onPress={() => navigation.navigate('Result', {scoreId: item.id})}
        activeOpacity={0.7}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreInfo}>
            <Text style={styles.lessonTitle} numberOfLines={1}>
              {item.lessonTitle}
            </Text>
            <Text style={styles.exerciseText} numberOfLines={2}>
              {item.exerciseText}
            </Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.scoreSection}>
            <Text style={[styles.overallScore, {color: scoreColor}]}>
              {Math.round(item.overallScore)}
            </Text>
            <Text style={[styles.scoreLabel, {color: scoreColor}]}>
              {scoreLabel}
            </Text>
          </View>
        </View>

        <View style={styles.detailScores}>
          <View style={styles.detailScoreItem}>
            <Text style={styles.detailScoreLabel}>Phát âm</Text>
            <Text style={styles.detailScoreValue}>
              {Math.round(item.accuracyScore)}
            </Text>
          </View>
          <View style={styles.detailScoreItem}>
            <Text style={styles.detailScoreLabel}>Lưu loát</Text>
            <Text style={styles.detailScoreValue}>
              {Math.round(item.fluencyScore)}
            </Text>
          </View>
          <View style={styles.detailScoreItem}>
            <Text style={styles.detailScoreLabel}>Hoàn thiện</Text>
            <Text style={styles.detailScoreValue}>
              {Math.round(item.completenessScore)}
            </Text>
          </View>
          <View style={styles.detailScoreItem}>
            <Text style={styles.detailScoreLabel}>Ngữ điệu</Text>
            <Text style={styles.detailScoreValue}>
              {Math.round(item.prosodyScore)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (scores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
        <Text style={styles.emptyText}>
          Hãy hoàn thành bài tập đầu tiên để xem lịch sử luyện tập của bạn
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('LessonsTab')}>
          <Text style={styles.startButtonText}>Bắt đầu học</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
          />
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
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.LG,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
  },
  startButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  listContent: {
    padding: SPACING.MD,
  },
  scoreCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  scoreInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  exerciseText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  scoreSection: {
    alignItems: 'center',
  },
  overallScore: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  detailScoreItem: {
    alignItems: 'center',
  },
  detailScoreLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  detailScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default HistoryScreen;

