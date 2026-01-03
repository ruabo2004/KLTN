/**
 * Profile Screen
 * Màn hình thông tin cá nhân
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import firestoreService from '../../services/firestoreService';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';

interface ProfileScreenProps {
  navigation: any;
}

interface UserStats {
  totalPractices: number;
  averageScore: number;
  practiceStreak: number;
  completedLessons: number;
  totalVocabulary: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {user, logout} = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalPractices: 0,
    averageScore: 0,
    practiceStreak: 0,
    completedLessons: 0,
    totalVocabulary: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Load user data from Firestore
      const data = await firestoreService.getUserData(user.uid);
      setUserData(data);

      // Load user stats
      await loadUserStats();
    } catch (error) {
      console.error('Load user data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user?.uid) return;

    try {
      // Get scores
      const scores = await firestoreService.getUserScores(user.uid, 100);
      const completedScores = scores.filter(
        (s: any) => s.status === 'completed',
      );

      // Calculate average score
      let avgScore = 0;
      if (completedScores.length > 0) {
        const totalScore = completedScores.reduce(
          (sum: number, s: any) => sum + (s.overallScore || 0),
          0,
        );
        avgScore = Math.round(totalScore / completedScores.length);
      }

      // Calculate practice streak
      const streak = calculatePracticeStreak(completedScores);

      // Get unique lessons completed
      const uniqueLessons = new Set(
        completedScores.map((s: any) => s.lessonId).filter(Boolean),
      );

      // Get vocabulary count
      const vocabulary = await firestoreService.getUserVocabulary(user.uid);

      setStats({
        totalPractices: completedScores.length,
        averageScore: avgScore,
        practiceStreak: streak,
        completedLessons: uniqueLessons.size,
        totalVocabulary: vocabulary.length,
      });
    } catch (error) {
      console.error('Load user stats error:', error);
    }
  };

  const calculatePracticeStreak = (scores: any[]): number => {
    if (scores.length === 0) return 0;

    // Sort by date descending
    const sortedScores = [...scores].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const score of sortedScores) {
      const scoreDate = score.createdAt?.toDate?.() || new Date(0);
      scoreDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - scoreDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.PRIMARY]}
        />
      }>
      {/* User Info Card */}
      <View style={styles.userCard}>
        {userData?.photoURL ? (
          <Image source={{uri: userData.photoURL}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>
        )}
        <Text style={styles.displayName}>
          {userData?.displayName || user?.displayName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {userData?.level === 'beginner' && '🌱 Người mới'}
            {userData?.level === 'intermediate' && '🌿 Trung cấp'}
            {userData?.level === 'advanced' && '🌳 Nâng cao'}
            {!userData?.level && '🌱 Người mới'}
          </Text>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>📊 Thống kê</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedLessons}</Text>
            <Text style={styles.statLabel}>Bài học</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averageScore}</Text>
            <Text style={styles.statLabel}>Điểm TB</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.practiceStreak}</Text>
            <Text style={styles.statLabel}>Ngày liên tục</Text>
          </View>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalPractices}</Text>
            <Text style={styles.statLabel}>Lần luyện tập</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalVocabulary}</Text>
            <Text style={styles.statLabel}>Từ vựng</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userData?.createdAt
                ? Math.floor(
                    (Date.now() -
                      userData.createdAt.toDate().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                : 0}
            </Text>
            <Text style={styles.statLabel}>Ngày tham gia</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.menuIcon}>✏️</Text>
          <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Cài đặt</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Về EnTalk',
              'EnTalk - Ứng dụng luyện phát âm tiếng Anh với AI\n\nVersion: 1.0.0\n\n© 2025 EnTalk Team',
            )
          }>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>Về ứng dụng</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>EnTalk v1.0.0</Text>
        <Text style={styles.footerText}>© 2025 EnTalk Team</Text>
      </View>
    </ScrollView>
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
  userCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.XL,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.MD,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  email: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  levelBadge: {
    backgroundColor: COLORS.PRIMARY + '20',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.XS,
  },
  levelText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.SM,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: COLORS.BACKGROUND,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    margin: SPACING.MD,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  footer: {
    padding: SPACING.XL,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
});

export default ProfileScreen;

