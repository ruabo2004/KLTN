/**
 * i18n Configuration
 * Cấu hình đa ngôn ngữ cho app
 */

import {I18n} from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import vi from './vi.json';

const i18n = new I18n({
  vi,
  en: vi, // Tạm thời dùng tiếng Việt cho cả 2 (vì app chủ yếu tiếng Việt)
});

// Detect device language
const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode || 'vi';

// Set default locale to Vietnamese
i18n.locale = 'vi';
i18n.enableFallback = true;
i18n.defaultLocale = 'vi';

/**
 * Translate function
 */
export const t = (key: string, options?: any): string => {
  return i18n.t(key, options);
};

/**
 * Change language
 */
export const changeLanguage = (locale: string): void => {
  i18n.locale = locale;
};

/**
 * Get current locale
 */
export const getCurrentLocale = (): string => {
  return i18n.locale;
};

export default i18n;

