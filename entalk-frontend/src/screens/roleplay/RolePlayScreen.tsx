/**
 * Role Play Screen
 * Màn hình luyện đối thoại với AI theo kịch bản
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {COLORS, SPACING, BORDER_RADIUS} from '../../utils/constants';
import apiService from '../../services/apiService';
import audioService from '../../services/audioService';
import storageService from '../../services/storageService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  audioUrl?: string;
  score?: number;
  timestamp: Date;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  situation: string;
}

interface RolePlayScreenProps {
  navigation: any;
}

const RolePlayScreen: React.FC<RolePlayScreenProps> = ({navigation}) => {
  const {user} = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await apiService.getScenarios();
      if (response.success && response.data) {
        setScenarios(response.data);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      Alert.alert('Lỗi', 'Không thể tải kịch bản');
    } finally {
      setLoading(false);
    }
  };

  const handleStartScenario = async (scenario: Scenario) => {
    try {
      if (!user) return;

      setProcessing(true);
      const response = await apiService.startRolePlay({
        userId: user.uid,
        scenarioId: scenario.id,
      });

      if (response.success && response.data) {
        setSelectedScenario(scenario);
        setConversationId(response.data.conversationId);
        
        // Add AI's first message
        const aiMessage: Message = {
          id: '0',
          role: 'ai',
          text: response.data.aiResponse,
          timestamp: new Date(),
        };
        setMessages([aiMessage]);
      } else {
        throw new Error(response.message || 'Failed to start role play');
      }
    } catch (error: any) {
      console.error('Error starting role play:', error);
      Alert.alert('Lỗi', error.message || 'Không thể bắt đầu đối thoại');
    } finally {
      setProcessing(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const path = await audioService.startRecording();
      setIsRecording(true);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      Alert.alert('Lỗi', 'Không thể ghi âm');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioPath = await audioService.stopRecording();
      setIsRecording(false);

      if (!user || !conversationId) return;

      // Upload audio
      setProcessing(true);
      const audioUrl = await storageService.uploadAudio(
        audioPath,
        `roleplay/${user.uid}/${Date.now()}.m4a`,
      );

      // Send to backend for STT + AI response
      const response = await apiService.respondRolePlay({
        userId: user.uid,
        conversationId,
        audioUrl,
      });

      if (response.success && response.data) {
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: response.data.userTranscript,
          audioUrl,
          score: response.data.pronunciationScore,
          timestamp: new Date(),
        };

        // Add AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: response.data.aiResponse,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, aiMessage]);
      } else {
        throw new Error(response.message || 'Failed to process response');
      }
    } catch (error: any) {
      console.error('Error processing recording:', error);
      Alert.alert('Lỗi', error.message || 'Không thể xử lý ghi âm');
    } finally {
      setProcessing(false);
    }
  };

  const handleEndConversation = () => {
    Alert.alert(
      'Kết thúc đối thoại',
      'Bạn có chắc muốn kết thúc đối thoại này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Kết thúc',
          style: 'destructive',
          onPress: () => {
            setSelectedScenario(null);
            setMessages([]);
            setConversationId(null);
          },
        },
      ],
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.SUCCESS;
    if (score >= 60) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const renderScenarioCard = ({item}: {item: Scenario}) => (
    <TouchableOpacity
      style={styles.scenarioCard}
      onPress={() => handleStartScenario(item)}
      disabled={processing}>
      <View style={styles.scenarioHeader}>
        <Text style={styles.scenarioIcon}>🎭</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.scenarioTitle}>{item.title}</Text>
      <Text style={styles.scenarioDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.scenarioSituation} numberOfLines={2}>
        💬 {item.situation}
      </Text>
    </TouchableOpacity>
  );

  const renderMessage = ({item}: {item: Message}) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}>
            {item.text}
          </Text>
          {item.score !== undefined && (
            <View
              style={[
                styles.scoreBadge,
                {backgroundColor: getScoreColor(item.score)},
              ]}>
              <Text style={styles.scoreText}>{Math.round(item.score)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải kịch bản...</Text>
      </View>
    );
  }

  if (!selectedScenario) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎭 Chọn kịch bản</Text>
          <Text style={styles.headerSubtitle}>
            Luyện đối thoại thực tế với AI
          </Text>
        </View>
        <FlatList
          data={scenarios}
          renderItem={renderScenarioCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scenariosList}
          numColumns={2}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Conversation Header */}
      <View style={styles.conversationHeader}>
        <View style={styles.conversationInfo}>
          <Text style={styles.conversationTitle}>{selectedScenario.title}</Text>
          <Text style={styles.conversationSubtitle}>
            {messages.length} tin nhắn
          </Text>
        </View>
        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndConversation}
          disabled={processing}>
          <Text style={styles.endButtonText}>Kết thúc</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
      />

      {/* Recording Section */}
      <View style={styles.recordingSection}>
        {processing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Text style={styles.processingText}>Đang xử lý...</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            processing && styles.recordButtonDisabled,
          ]}
          onPress={isRecording ? handleStopRecording : handleStartRecording}
          disabled={processing}>
          <Text style={styles.recordButtonIcon}>
            {isRecording ? '⏹️' : '🎤'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.recordHint}>
          {isRecording ? 'Nhấn để dừng' : 'Nhấn để nói'}
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
  header: {
    padding: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
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
  },
  scenariosList: {
    padding: SPACING.SM,
  },
  scenarioCard: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    margin: SPACING.SM,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  scenarioIcon: {
    fontSize: 32,
  },
  difficultyBadge: {
    backgroundColor: COLORS.INFO + '30',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.INFO,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  scenarioDescription: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    lineHeight: 18,
  },
  scenarioSituation: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontStyle: 'italic',
    marginTop: 'auto',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  conversationSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  endButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.ERROR,
    borderRadius: BORDER_RADIUS.MD,
  },
  endButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  messagesList: {
    padding: SPACING.MD,
  },
  messageContainer: {
    marginBottom: SPACING.MD,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
  },
  userBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: SPACING.XS,
  },
  aiBubble: {
    backgroundColor: COLORS.BACKGROUND,
    borderBottomLeftRadius: SPACING.XS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.TEXT_LIGHT,
  },
  aiMessageText: {
    color: COLORS.TEXT_PRIMARY,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    marginTop: SPACING.SM,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  recordingSection: {
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  processingText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
  },
  recordButton: {
    width: 80,
    height: 80,
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
    opacity: 0.5,
  },
  recordButtonIcon: {
    fontSize: 40,
  },
  recordHint: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
  },
});

export default RolePlayScreen;

