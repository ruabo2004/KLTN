/**
 * Helper Functions
 * Các hàm tiện ích chung
 */

import {SCORE_THRESHOLDS} from './constants';

/**
 * Format điểm số (0-100)
 */
export const formatScore = (score: number): string => {
  return Math.round(score).toString();
};

/**
 * Lấy nhãn feedback dựa trên điểm
 */
export const getScoreLabel = (score: number): string => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    return 'excellent';
  } else if (score >= SCORE_THRESHOLDS.GOOD) {
    return 'good';
  } else if (score >= SCORE_THRESHOLDS.NOT_BAD) {
    return 'not_bad';
  } else {
    return 'need_improvement';
  }
};

/**
 * Lấy màu dựa trên điểm
 */
export const getScoreColor = (score: number): string => {
  const {COLORS} = require('./constants');
  
  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    return COLORS.SCORE_EXCELLENT;
  } else if (score >= SCORE_THRESHOLDS.GOOD) {
    return COLORS.SCORE_GOOD;
  } else if (score >= SCORE_THRESHOLDS.NOT_BAD) {
    return COLORS.SCORE_NOT_BAD;
  } else {
    return COLORS.SCORE_NEED_IMPROVEMENT;
  }
};

/**
 * Format thời gian (seconds -> mm:ss)
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format ngày tháng
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format thời gian chi tiết
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

/**
 * Tính thời gian tương đối (time ago)
 */
export const getTimeAgo = (date: Date | string | number, locale: string = 'vi'): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === 'vi') {
    if (diffSecs < 60) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return formatDate(date);
  } else {
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(date);
  }
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password (min 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Convert file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Shuffle array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Delay function (sleep)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default {
  formatScore,
  getScoreLabel,
  getScoreColor,
  formatDuration,
  formatDate,
  formatDateTime,
  getTimeAgo,
  truncateText,
  capitalizeFirst,
  isValidEmail,
  isValidPassword,
  formatFileSize,
  shuffleArray,
  delay,
  deepClone,
  isEmpty,
  generateId,
};

