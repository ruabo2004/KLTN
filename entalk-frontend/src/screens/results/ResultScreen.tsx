/**
 * Result Screen
 * Màn hình hiển thị kết quả chấm điểm
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {t} from '../../locales';
import {COLORS, SPACING, BORDER_RADIUS, SCORE_THRESHOLDS} from '../../utils/constants';
import firestoreService from '../../services/firestoreService';

interface WordResult {
  word: string;
  accuracyScore: number;
  errorType?: string;
}

interface ScoreData {
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  prosodyScore?: number;
  detailedResult?: {
    words: WordResult[];
  };
  feedback: string;
  referenceText: string;
}

const ResultScreen = ({route, navigation}: any) => {
  const {scoreId, lessonId, exerciseId} = route.params;
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animation
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    loadScoreData();
  }, [scoreId]);

  useEffect(() => {
    if (scoreData) {
      // Animate entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scoreData]);

  const loadScoreData = async () => {
    try {
      setLoading(true);
      const data = await firestoreService.getScoreData(scoreId);
      setScoreData(data as ScoreData);
    } catch (error) {
      console.error('Error loading score data:', error);
    } finally {
      setLoading(false);
    }
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

  const getWordColor = (accuracyScore: number) => {
    if (accuracyScore >= 80) return COLORS.SUCCESS;
    if (accuracyScore >= 60) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleNextExercise = () => {
    // TODO: Navigate to next exercise
    navigation.navigate('LessonDetail', {lessonId});
  };

  const handleViewHistory = () => {
    navigation.navigate('HistoryTab');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải kết quả...</Text>
      </View>
    );
  }

  if (!scoreData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy kết quả</Text>
      </View>
    );
  }

  const scoreColor = getScoreColor(scoreData.overallScore);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overall Score */}
      <Animated.View
        style={[
          styles.scoreCard,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <Text style={styles.scoreTitle}>{t('results.your_score')}</Text>
        <View style={[styles.scoreCircle, {borderColor: scoreColor}]}>
          <Text style={[styles.scoreValue, {color: scoreColor}]}>
            {Math.round(scoreData.overallScore)}
          </Text>
        </View>
        <Text style={[styles.scoreLabel, {color: scoreColor}]}>
          {getScoreLabel(scoreData.overallScore)}
        </Text>
        <Text style={styles.feedback}>{scoreData.feedback}</Text>
      </Animated.View>

      {/* Detailed Scores */}
      <View style={styles.detailedScores}>
        <Text style={styles.sectionTitle}>Phân tích chi tiết</Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>{t('results.accuracy')}</Text>
          <View style={styles.scoreRowBar}>
            <View
              style={[
                styles.scoreRowFill,
                {
                  width: `${scoreData.accuracyScore}%`,
                  backgroundColor: getScoreColor(scoreData.accuracyScore),
                },
              ]}
            />
          </View>
          <Text style={styles.scoreRowValue}>{Math.round(scoreData.accuracyScore)}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>{t('results.fluency')}</Text>
          <View style={styles.scoreRowBar}>
            <View
              style={[
                styles.scoreRowFill,
                {
                  width: `${scoreData.fluencyScore}%`,
                  backgroundColor: getScoreColor(scoreData.fluencyScore),
                },
              ]}
            />
          </View>
          <Text style={styles.scoreRowValue}>{Math.round(scoreData.fluencyScore)}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>{t('results.completeness')}</Text>
          <View style={styles.scoreRowBar}>
            <View
              style={[
                styles.scoreRowFill,
                {
                  width: `${scoreData.completenessScore}%`,
                  backgroundColor: getScoreColor(scoreData.completenessScore),
                },
              ]}
            />
          </View>
          <Text style={styles.scoreRowValue}>{Math.round(scoreData.completenessScore)}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>{t('results.pronunciation')}</Text>
          <View style={styles.scoreRowBar}>
            <View
              style={[
                styles.scoreRowFill,
                {
                  width: `${scoreData.pronunciationScore}%`,
                  backgroundColor: getScoreColor(scoreData.pronunciationScore),
                },
              ]}
            />
          </View>
          <Text style={styles.scoreRowValue}>{Math.round(scoreData.pronunciationScore)}</Text>
        </View>

        {scoreData.prosodyScore !== undefined && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreRowLabel}>{t('results.prosody')}</Text>
            <View style={styles.scoreRowBar}>
              <View
                style={[
                  styles.scoreRowFill,
                  {
                    width: `${scoreData.prosodyScore}%`,
                    backgroundColor: getScoreColor(scoreData.prosodyScore),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreRowValue}>{Math.round(scoreData.prosodyScore)}</Text>
          </View>
        )}
      </View>

      {/* Word Analysis */}
      {scoreData.detailedResult?.words && scoreData.detailedResult.words.length > 0 && (
        <View style={styles.wordAnalysis}>
          <Text style={styles.sectionTitle}>{t('results.word_analysis')}</Text>
          
          <View style={styles.wordsContainer}>
            {scoreData.detailedResult.words.map((wordResult, index) => (
              <View
                key={index}
                style={[
                  styles.wordChip,
                  {
                    backgroundColor: getWordColor(wordResult.accuracyScore) + '20',
                    borderColor: getWordColor(wordResult.accuracyScore),
                  },
                ]}>
                <Text
                  style={[
                    styles.wordText,
                    {color: getWordColor(wordResult.accuracyScore)},
                  ]}>
                  {wordResult.word}
                </Text>
                <Text
                  style={[
                    styles.wordScore,
                    {color: getWordColor(wordResult.accuracyScore)},
                  ]}>
                  {Math.round(wordResult.accuracyScore)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Reference Text */}
      <View style={styles.referenceCard}>
        <Text style={styles.referenceLabel}>Câu bạn đã đọc:</Text>
        <Text style={styles.referenceText}>{scoreData.referenceText}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleTryAgain}>
          <Text style={styles.secondaryButtonText}>{t('practice.try_again')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNextExercise}>
          <Text style={styles.primaryButtonText}>{t('practice.next_exercise')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
          <Text style={styles.historyButtonText}>{t('results.view_history')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.homeButtonText}>🏠 Về trang chủ</Text>
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
  scoreCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.XXL,
    alignItems: 'center',
    marginBottom: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: BORDER_RADIUS.ROUND,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.MD,
  },
  feedback: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  detailedScores: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  scoreRowLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  scoreRowBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    borderRadius: BORDER_RADIUS.SM,
    overflow: 'hidden',
    marginHorizontal: SPACING.MD,
  },
  scoreRowFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.SM,
  },
  scoreRowValue: {
    width: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
  },
  wordAnalysis: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    marginRight: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: SPACING.SM,
  },
  wordScore: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  referenceCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  referenceLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  referenceText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginLeft: SPACING.SM,
  },
  primaryButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    marginRight: SPACING.SM,
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.LG,
  },
  historyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    marginRight: SPACING.SM,
  },
  historyButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginLeft: SPACING.SM,
  },
  homeButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResultScreen;



