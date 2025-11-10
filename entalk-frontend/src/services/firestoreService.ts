/**
 * Firestore Service
 * Xử lý các operations với Firestore
 */

import firestore from '@react-native-firebase/firestore';

class FirestoreService {
  /**
   * Get user data
   */
  async getUserData(userId: string) {
    try {
      const doc = await firestore().collection('users').doc(userId).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      throw error;
    }
  }

  /**
   * Get user recent scores
   */
  async getUserRecentScores(userId: string, limit: number = 10) {
    try {
      const snapshot = await firestore()
        .collection('scores')
        .where('userId', '==', userId)
        .where('status', '==', 'completed')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get user recent scores error:', error);
      throw error;
    }
  }

  /**
   * Get score data
   */
  async getScoreData(scoreId: string) {
    try {
      const doc = await firestore().collection('scores').doc(scoreId).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Get score data error:', error);
      throw error;
    }
  }

  /**
   * Get lessons
   */
  async getLessons(filters?: {level?: string; category?: string}) {
    try {
      let query = firestore().collection('lessons').where('isActive', '==', true);

      if (filters?.level) {
        query = query.where('level', '==', filters.level);
      }

      if (filters?.category) {
        query = query.where('category', '==', filters.category);
      }

      const snapshot = await query.orderBy('order', 'asc').get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get lessons error:', error);
      throw error;
    }
  }

  /**
   * Get lesson exercises
   */
  async getLessonExercises(lessonId: string) {
    try {
      const snapshot = await firestore()
        .collection('lessons')
        .doc(lessonId)
        .collection('exercises')
        .orderBy('order', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get lesson exercises error:', error);
      throw error;
    }
  }

  /**
   * Get user progress
   */
  async getUserProgress(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('userProgress')
        .doc(userId)
        .collection('lessons')
        .get();

      return snapshot.docs.map(doc => ({
        lessonId: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get user progress error:', error);
      throw error;
    }
  }

  /**
   * Get user scores
   */
  async getUserScores(userId: string, limit: number = 20) {
    try {
      const snapshot = await firestore()
        .collection('scores')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get user scores error:', error);
      throw error;
    }
  }

  /**
   * Listen to score updates (realtime)
   */
  listenToScore(scoreId: string, callback: (data: any) => void) {
    return firestore()
      .collection('scores')
      .doc(scoreId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback({id: doc.id, ...doc.data()});
          }
        },
        (error) => {
          console.error('Listen to score error:', error);
        },
      );
  }

  /**
   * Get scenarios
   */
  async getScenarios() {
    try {
      const snapshot = await firestore()
        .collection('scenarios')
        .where('isActive', '==', true)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get scenarios error:', error);
      throw error;
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('conversations')
        .where('userId', '==', userId)
        .orderBy('startedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get user conversations error:', error);
      throw error;
    }
  }

  /**
   * Get user vocabulary
   */
  async getUserVocabulary(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('vocabulary')
        .doc(userId)
        .collection('words')
        .orderBy('savedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get user vocabulary error:', error);
      throw error;
    }
  }

  /**
   * Get user freestyle lessons
   */
  async getFreestyleLessons(userId: string) {
    try {
      const snapshot = await firestore()
        .collection('freestyle_lessons')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get freestyle lessons error:', error);
      throw error;
    }
  }

  /**
   * Update user data
   */
  async updateUserData(userId: string, data: any) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Update user data error:', error);
      throw error;
    }
  }
}

export default new FirestoreService();

