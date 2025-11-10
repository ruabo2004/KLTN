/**
 * More Screen
 * Màn hình menu với các tính năng nâng cao
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';

interface MoreScreenProps {
  navigation: any;
}

const MoreScreen: React.FC<MoreScreenProps> = ({navigation}) => {
  const features = [
    {
      id: 'freestyle',
      icon: '✍️',
      title: 'Tạo bài tự do',
      description: 'Nhập văn bản và tạo bài tập riêng',
      screen: 'Freestyle',
      color: COLORS.PRIMARY,
    },
    {
      id: 'chatbot',
      icon: '🤖',
      title: 'AI Trợ lý',
      description: 'Chat với AI để học tiếng Anh',
      screen: 'Chatbot',
      color: COLORS.SECONDARY,
    },
    {
      id: 'roleplay',
      icon: '🎭',
      title: 'Đối thoại AI',
      description: 'Luyện hội thoại theo kịch bản',
      screen: 'RolePlay',
      color: COLORS.SUCCESS,
    },
    {
      id: 'vocabulary',
      icon: '📚',
      title: 'Từ vựng',
      description: 'Tra từ và sổ tay từ vựng',
      screen: 'Vocabulary',
      color: COLORS.INFO,
    },
  ];

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tính năng nâng cao</Text>
        <Text style={styles.headerSubtitle}>
          Khám phá các công cụ học tập thông minh
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        {features.map(feature => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => handleNavigate(feature.screen)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.featureIconContainer,
                {backgroundColor: feature.color + '20'},
              ]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>
              {feature.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Mẹo học tập</Text>
        <Text style={styles.tipText}>
          • Luyện tập mỗi ngày 15-30 phút để tiến bộ nhanh
        </Text>
        <Text style={styles.tipText}>
          • Ghi âm và nghe lại để cải thiện phát âm
        </Text>
        <Text style={styles.tipText}>
          • Sử dụng AI Chatbot để giải đáp thắc mắc
        </Text>
        <Text style={styles.tipText}>
          • Thực hành đối thoại với AI Role-Play
        </Text>
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
    marginBottom: SPACING.XL,
    paddingTop: SPACING.LG,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.SM,
  },
  featureCard: {
    width: '50%',
    padding: SPACING.SM,
  },
  featureIconContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 60,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipsCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.WARNING,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: SPACING.SM,
  },
});

export default MoreScreen;

