/**
 * Validation Functions
 * Các hàm validate input
 */

/**
 * Validate email
 */
export const validateEmail = (email: string): {valid: boolean; message?: string} => {
  if (!email) {
    return {valid: false, message: 'Email không được để trống'};
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {valid: false, message: 'Email không hợp lệ'};
  }

  return {valid: true};
};

/**
 * Validate password
 */
export const validatePassword = (password: string): {valid: boolean; message?: string} => {
  if (!password) {
    return {valid: false, message: 'Mật khẩu không được để trống'};
  }

  if (password.length < 6) {
    return {valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự'};
  }

  return {valid: true};
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): {valid: boolean; message?: string} => {
  if (!confirmPassword) {
    return {valid: false, message: 'Xác nhận mật khẩu không được để trống'};
  }

  if (password !== confirmPassword) {
    return {valid: false, message: 'Mật khẩu không khớp'};
  }

  return {valid: true};
};

/**
 * Validate display name
 */
export const validateDisplayName = (name: string): {valid: boolean; message?: string} => {
  if (!name) {
    return {valid: false, message: 'Tên hiển thị không được để trống'};
  }

  if (name.length < 2) {
    return {valid: false, message: 'Tên hiển thị phải có ít nhất 2 ký tự'};
  }

  if (name.length > 50) {
    return {valid: false, message: 'Tên hiển thị không được quá 50 ký tự'};
  }

  return {valid: true};
};

/**
 * Validate text length
 */
export const validateTextLength = (
  text: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'Văn bản',
): {valid: boolean; message?: string} => {
  if (!text) {
    return {valid: false, message: `${fieldName} không được để trống`};
  }

  if (text.length < minLength) {
    return {valid: false, message: `${fieldName} phải có ít nhất ${minLength} ký tự`};
  }

  if (text.length > maxLength) {
    return {valid: false, message: `${fieldName} không được quá ${maxLength} ký tự`};
  }

  return {valid: true};
};

/**
 * Validate file size
 */
export const validateFileSize = (
  fileSize: number,
  maxSize: number,
): {valid: boolean; message?: string} => {
  if (fileSize > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {valid: false, message: `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`};
  }

  return {valid: true};
};

/**
 * Validate file type
 */
export const validateFileType = (
  fileName: string,
  allowedTypes: string[],
): {valid: boolean; message?: string} => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (!extension || !allowedTypes.includes(extension)) {
    return {
      valid: false,
      message: `Định dạng file không hợp lệ. Cho phép: ${allowedTypes.join(', ')}`,
    };
  }

  return {valid: true};
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDisplayName,
  validateTextLength,
  validateFileSize,
  validateFileType,
};

