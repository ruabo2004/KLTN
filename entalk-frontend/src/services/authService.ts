/**
 * Auth Service
 * Xử lý Firebase Authentication
 */

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../utils/constants';

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<FirebaseAuthTypes.User> {
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password,
      );

      const user = userCredential.user;

      // Update display name
      await user.updateProfile({
        displayName: data.displayName,
      });

      // Create user document in Firestore
      await firestore().collection('users').doc(user.uid).set({
        email: data.email,
        displayName: data.displayName,
        photoURL: null,
        photoStoragePath: null,
        language: 'vi',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
        totalPractices: 0,
        averageScore: 0,
        level: 'beginner',
      });

      return user;
    } catch (error: any) {
      console.error('Register error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<FirebaseAuthTypes.User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        data.email,
        data.password,
      );

      const user = userCredential.user;

      // Update last login time
      await firestore().collection('users').doc(user.uid).update({
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
      });

      // Save token to AsyncStorage
      const token = await user.getIdToken();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);

      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Get current user token
   */
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return auth().currentUser !== null;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not logged in');
      }

      await user.updateProfile(data);

      // Update Firestore
      await firestore().collection('users').doc(user.uid).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Handle auth errors
   */
  private handleAuthError(error: any): Error {
    let message = 'Đã xảy ra lỗi. Vui lòng thử lại.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email đã được sử dụng';
        break;
      case 'auth/invalid-email':
        message = 'Email không hợp lệ';
        break;
      case 'auth/weak-password':
        message = 'Mật khẩu quá yếu';
        break;
      case 'auth/user-not-found':
        message = 'Người dùng không tồn tại';
        break;
      case 'auth/wrong-password':
        message = 'Mật khẩu không đúng';
        break;
      case 'auth/too-many-requests':
        message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
        break;
      case 'auth/network-request-failed':
        message = 'Lỗi kết nối mạng';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}

export default new AuthService();

