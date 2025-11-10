/**
 * Constants
 * Các hằng số sử dụng trong app
 */

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Lessons
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lessons/:id',
  LESSON_EXERCISES: '/lessons/:id/exercises',
  
  // Scoring
  SCORING_REQUEST: '/scoring/request',
  
  // Users
  USER_PROGRESS: '/users/:id/progress',
  USER_SCORES: '/users/:id/scores',
  UPLOAD_AVATAR: '/users/upload-avatar',
  
  // Roleplay
  ROLEPLAY_START: '/roleplay/start',
  ROLEPLAY_RESPOND: '/roleplay/respond',
  
  // Scenarios
  SCENARIOS: '/scenarios',
  
  // Freestyle
  FREESTYLE_CREATE: '/freestyle/create',
  
  // Vocabulary
  VOCABULARY_LOOKUP: '/vocabulary/lookup',
  VOCABULARY_SAVE: '/vocabulary/save',
  VOCABULARY_WORDS: '/vocabulary/:userId/words',
  
  // Chatbot
  CHATBOT_MESSAGE: '/chatbot/message',
};

// User Levels
export const USER_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  NOT_BAD: 60,
  NEED_IMPROVEMENT: 0,
};

// Audio Settings
export const AUDIO_SETTINGS = {
  MAX_RECORDING_DURATION: 60, // seconds
  SAMPLE_RATE: 44100,
  CHANNELS: 1,
  BIT_DEPTH: 16,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// Image Settings
export const IMAGE_SETTINGS = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  AVATAR_DIMENSIONS: {
    width: 300,
    height: 300,
  },
};

// Colors
export const COLORS = {
  PRIMARY: '#4A90E2',
  SECONDARY: '#50C878',
  ACCENT: '#FF6B6B',
  
  SUCCESS: '#28A745',
  WARNING: '#FFC107',
  ERROR: '#DC3545',
  INFO: '#17A2B8',
  
  TEXT_PRIMARY: '#212529',
  TEXT_SECONDARY: '#6C757D',
  TEXT_LIGHT: '#FFFFFF',
  
  BACKGROUND: '#FFFFFF',
  BACKGROUND_GRAY: '#F8F9FA',
  
  BORDER: '#DEE2E6',
  
  SCORE_EXCELLENT: '#28A745',
  SCORE_GOOD: '#50C878',
  SCORE_NOT_BAD: '#FFC107',
  SCORE_NEED_IMPROVEMENT: '#DC3545',
};

// Fonts
export const FONTS = {
  REGULAR: 'System',
  MEDIUM: 'System',
  BOLD: 'System',
  LIGHT: 'System',
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
};

// Animation Duration
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Lesson Categories
export const LESSON_CATEGORIES = {
  PRONUNCIATION: 'pronunciation',
  VOCABULARY: 'vocabulary',
  SENTENCE: 'sentence',
  CONVERSATION: 'conversation',
};

// Storage Keys (AsyncStorage)
export const STORAGE_KEYS = {
  USER_TOKEN: '@entalk:userToken',
  USER_DATA: '@entalk:userData',
  LANGUAGE: '@entalk:language',
  THEME: '@entalk:theme',
  ONBOARDING_COMPLETED: '@entalk:onboardingCompleted',
};

export default {
  API_ENDPOINTS,
  USER_LEVELS,
  SCORE_THRESHOLDS,
  AUDIO_SETTINGS,
  IMAGE_SETTINGS,
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  ANIMATION_DURATION,
  LESSON_CATEGORIES,
  STORAGE_KEYS,
};

