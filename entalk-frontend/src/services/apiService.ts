/**
 * API Service
 * Xử lý các request đến backend API
 */

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {API_BASE_URL} from '../config/firebase';
import auth from '@react-native-firebase/auth';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error
          const {status, data} = error.response;
          console.error(`API Error ${status}:`, data);
          
          if (status === 401) {
            // Unauthorized - redirect to login
            // You can emit an event or use navigation here
          }
        } else if (error.request) {
          // Request made but no response
          console.error('Network Error:', error.message);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
      },
    );
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(url: string, file: any, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response: AxiosResponse<T> = await this.api.post(url, formData, config);
    return response.data;
  }

  // ============ LESSONS API ============
  
  /**
   * Get all lessons
   */
  async getLessons(params?: {level?: string; category?: string; limit?: number}) {
    return this.get('/lessons', {params});
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(lessonId: string) {
    return this.get(`/lessons/${lessonId}`);
  }

  /**
   * Get lesson exercises
   */
  async getLessonExercises(lessonId: string) {
    return this.get(`/lessons/${lessonId}/exercises`);
  }

  // ============ SCORING API ============
  
  /**
   * Request pronunciation scoring
   */
  async requestScoring(data: {
    userId: string;
    lessonId?: string;
    exerciseId?: string;
    audioUrl: string;
    referenceText: string;
  }) {
    const formData = new FormData();
    formData.append('userId', data.userId);
    if (data.lessonId) formData.append('lessonId', data.lessonId);
    if (data.exerciseId) formData.append('exerciseId', data.exerciseId);
    formData.append('audioUrl', data.audioUrl);
    formData.append('referenceText', data.referenceText);

    return this.post('/scoring/request', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  // ============ USER API ============
  
  /**
   * Get user progress
   */
  async getUserProgress(userId: string) {
    return this.get(`/users/${userId}/progress`);
  }

  /**
   * Get user scores
   */
  async getUserScores(userId: string, params?: {limit?: number; offset?: number}) {
    return this.get(`/users/${userId}/scores`, {params});
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: any, onProgress?: (progress: number) => void) {
    return this.uploadFile('/users/upload-avatar', file, onProgress);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, data: any) {
    return this.put(`/users/${userId}`, data);
  }

  // ============ ROLEPLAY API ============
  
  /**
   * Start roleplay conversation
   */
  async startRolePlay(data: {userId: string; scenarioId: string}) {
    return this.post('/roleplay/start', data);
  }

  /**
   * Respond in roleplay
   */
  async respondRolePlay(data: {conversationId: string; audioUrl: string; userId: string}) {
    return this.post('/roleplay/respond', data);
  }

  /**
   * Get scenarios
   */
  async getScenarios() {
    return this.get('/scenarios');
  }

  // ============ FREESTYLE API ============
  
  /**
   * Create freestyle lesson
   */
  async createFreestyleLesson(data: {userId: string; text: string; title?: string}) {
    return this.post('/freestyle/create', data);
  }

  // ============ CHATBOT API ============
  
  /**
   * Send message to chatbot
   */
  async sendChatbotMessage(data: {userId: string; message: string; conversationId?: string}) {
    return this.post('/chatbot/message', data);
  }

  // ============ VOCABULARY API ============
  
  /**
   * Lookup word
   */
  async lookupWord(word: string) {
    return this.post('/vocabulary/lookup', {word});
  }

  /**
   * Save word to vocabulary
   */
  async saveWord(data: any) {
    return this.post('/vocabulary/save', data);
  }

  /**
   * Get user vocabulary
   */
  async getUserVocabulary(userId: string) {
    return this.get(`/vocabulary/${userId}/words`);
  }
}

export default new ApiService();

