/**
 * Vocabulary Screen
 * Màn hình từ vựng - Tra từ và quản lý từ đã lưu
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import apiService from '../../services/apiService';
import firestoreService from '../../services/firestoreService';

interface WordData {
  word: string;
  phonetic?: string;
  meaning?: string;
  partOfSpeech?: string;
  example?: string;
  translation?: string;
}

interface SavedWord extends WordData {
  id: string;
  savedAt: any;
}

interface VocabularyScreenProps {
  navigation: any;
}

const VocabularyScreen: React.FC<VocabularyScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState<'lookup' | 'saved'>('lookup');
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedWords();
    }
  }, [activeTab]);

  const loadSavedWords = async () => {
    try {
      if (!user) return;
      setLoadingSaved(true);
      const words = await firestoreService.getVocabulary(user.uid);
      setSavedWords(words);
    } catch (error) {
      console.error('Error loading saved words:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleLookup = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập từ cần tra');
      return;
    }

    try {
      setLoading(true);
      setLookupResult(null);

      const response = await apiService.lookupWord({
        word: searchQuery.trim().toLowerCase(),
      });

      if (response.success && response.data) {
        setLookupResult(response.data);
      } else {
        Alert.alert('Không tìm thấy', 'Không tìm thấy từ này trong từ điển');
      }
    } catch (error: any) {
      console.error('Error looking up word:', error);
      Alert.alert('Lỗi', 'Không thể tra từ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!lookupResult || !user) return;

    try {
      const response = await apiService.saveWord({
        userId: user.uid,
        wordData: lookupResult,
      });

      if (response.success) {
        Alert.alert('Thành công', 'Đã lưu từ vào sổ tay của bạn');
        // Refresh saved words if on that tab
        if (activeTab === 'saved') {
          loadSavedWords();
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error saving word:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu từ');
    }
  };

  const handlePlayAudio = (word: string) => {
    // TODO: Implement TTS for word pronunciation
    Alert.alert('Coming soon', 'Chức năng phát âm đang phát triển');
  };

  const renderLookupTab = () => (
    <View style={styles.tabContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập từ tiếng Anh..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleLookup}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.buttonDisabled]}
          onPress={handleLookup}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.searchButtonText}>🔍</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Lookup Result */}
      {lookupResult && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultHeaderLeft}>
              <Text style={styles.resultWord}>{lookupResult.word}</Text>
              {lookupResult.phonetic && (
                <Text style={styles.resultPhonetic}>{lookupResult.phonetic}</Text>
              )}
            </View>
            <View style={styles.resultHeaderRight}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handlePlayAudio(lookupResult.word)}>
                <Text style={styles.iconButtonText}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleSaveWord}>
                <Text style={styles.iconButtonText}>⭐</Text>
              </TouchableOpacity>
            </View>
          </View>

          {lookupResult.partOfSpeech && (
            <Text style={styles.partOfSpeech}>({lookupResult.partOfSpeech})</Text>
          )}

          {lookupResult.meaning && (
            <View style={styles.meaningSection}>
              <Text style={styles.sectionTitle}>Nghĩa:</Text>
              <Text style={styles.meaningText}>{lookupResult.meaning}</Text>
            </View>
          )}

          {lookupResult.translation && (
            <View style={styles.meaningSection}>
              <Text style={styles.sectionTitle}>Dịch:</Text>
              <Text style={styles.meaningText}>{lookupResult.translation}</Text>
            </View>
          )}

          {lookupResult.example && (
            <View style={styles.exampleSection}>
              <Text style={styles.sectionTitle}>Ví dụ:</Text>
              <Text style={styles.exampleText}>{lookupResult.example}</Text>
            </View>
          )}
        </View>
      )}

      {/* Quick Search Suggestions */}
      {!lookupResult && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Gợi ý tra cứu:</Text>
          {['hello', 'beautiful', 'important', 'practice', 'vocabulary'].map(
            (word, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => {
                  setSearchQuery(word);
                  handleLookup();
                }}>
                <Text style={styles.suggestionText}>{word}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}
    </View>
  );

  const renderSavedWord = ({item}: {item: SavedWord}) => (
    <View style={styles.savedWordCard}>
      <View style={styles.savedWordHeader}>
        <View style={styles.savedWordInfo}>
          <Text style={styles.savedWordText}>{item.word}</Text>
          {item.phonetic && (
            <Text style={styles.savedPhonetic}>{item.phonetic}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handlePlayAudio(item.word)}>
          <Text style={styles.playButtonText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {item.meaning && (
        <Text style={styles.savedMeaning} numberOfLines={2}>
          {item.meaning}
        </Text>
      )}

      {item.translation && (
        <Text style={styles.savedTranslation} numberOfLines={1}>
          💬 {item.translation}
        </Text>
      )}
    </View>
  );

  const renderSavedTab = () => (
    <View style={styles.tabContent}>
      {loadingSaved ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : savedWords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Chưa có từ nào</Text>
          <Text style={styles.emptyText}>
            Tra từ và lưu lại để xem ở đây
          </Text>
          <TouchableOpacity
            style={styles.switchTabButton}
            onPress={() => setActiveTab('lookup')}>
            <Text style={styles.switchTabButtonText}>Tra từ ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedWords}
          renderItem={renderSavedWord}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.savedWordsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lookup' && styles.activeTab]}
          onPress={() => setActiveTab('lookup')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'lookup' && styles.activeTabText,
            ]}>
            🔍 Tra từ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'saved' && styles.activeTabText,
            ]}>
            📚 Từ đã lưu ({savedWords.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'lookup' ? renderLookupTab() : renderSavedTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.MD,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
  },
  tabContent: {
    flex: 1,
    padding: SPACING.MD,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.LG,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginRight: SPACING.SM,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  resultCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },
  resultHeaderLeft: {
    flex: 1,
  },
  resultHeaderRight: {
    flexDirection: 'row',
  },
  resultWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  resultPhonetic: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.SM,
  },
  iconButtonText: {
    fontSize: 24,
  },
  partOfSpeech: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontStyle: 'italic',
    marginBottom: SPACING.MD,
  },
  meaningSection: {
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  meaningText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },
  exampleSection: {
    backgroundColor: COLORS.INFO + '15',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.INFO,
  },
  exampleText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  suggestionsContainer: {
    marginTop: SPACING.LG,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  suggestionChip: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  savedWordsList: {
    paddingBottom: SPACING.XL,
  },
  savedWordCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  savedWordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  savedWordInfo: {
    flex: 1,
  },
  savedWordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  savedPhonetic: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  playButton: {
    padding: SPACING.SM,
  },
  playButtonText: {
    fontSize: 24,
  },
  savedMeaning: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  savedTranslation: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.LG,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  switchTabButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  switchTabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
});

export default VocabularyScreen;

