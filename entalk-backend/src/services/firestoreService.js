const { db } = require('../config/firebase');

class FirestoreService {
  /**
   * Lưu kết quả chấm điểm
   */
  async saveScore(scoreData) {
    try {
      const scoreRef = await db.collection('scores').add({
        ...scoreData,
        createdAt: new Date().toISOString(),
      });
      return scoreRef.id;
    } catch (error) {
      console.error('❌ Error saving score:', error);
      throw error;
    }
  }

  /**
   * Cập nhật kết quả chấm điểm
   */
  async updateScore(scoreId, updateData) {
    try {
      await db.collection('scores').doc(scoreId).update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error updating score:', error);
      throw error;
    }
  }

  /**
   * Lưu conversation Role-Play
   */
  async saveRolePlayConversation(conversationData) {
    try {
      const convRef = await db.collection('roleplay_conversations').add({
        ...conversationData,
        createdAt: new Date().toISOString(),
      });
      return convRef.id;
    } catch (error) {
      console.error('❌ Error saving roleplay conversation:', error);
      throw error;
    }
  }

  /**
   * Cập nhật conversation Role-Play
   */
  async updateRolePlayConversation(conversationId, updateData) {
    try {
      await db.collection('roleplay_conversations').doc(conversationId).update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error updating roleplay conversation:', error);
      throw error;
    }
  }

  /**
   * Lưu Freestyle lesson
   */
  async saveFreestyleLesson(lessonData) {
    try {
      const lessonRef = await db.collection('freestyle_lessons').add({
        ...lessonData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ngày
      });
      return lessonRef.id;
    } catch (error) {
      console.error('❌ Error saving freestyle lesson:', error);
      throw error;
    }
  }

  /**
   * Lưu Chatbot conversation
   */
  async saveChatbotConversation(conversationId, conversationData) {
    try {
      await db.collection('chatbot_conversations').doc(conversationId).set(
        conversationData,
        { merge: true }
      );
    } catch (error) {
      console.error('❌ Error saving chatbot conversation:', error);
      throw error;
    }
  }

  /**
   * Lấy Chatbot conversation
   */
  async getChatbotConversation(conversationId) {
    try {
      const doc = await db.collection('chatbot_conversations').doc(conversationId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('❌ Error getting chatbot conversation:', error);
      throw error;
    }
  }

  /**
   * Cập nhật user statistics
   */
  async updateUserStats(userId, stats) {
    try {
      await db.collection('users').doc(userId).update({
        ...stats,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
      throw error;
    }
  }

  /**
   * Lưu từ vựng
   */
  async saveVocabulary(userId, wordData) {
    try {
      const vocabRef = await db.collection('vocabulary').add({
        userId,
        ...wordData,
        createdAt: new Date().toISOString(),
      });
      return vocabRef.id;
    } catch (error) {
      console.error('❌ Error saving vocabulary:', error);
      throw error;
    }
  }

  /**
   * Lấy từ vựng của user
   */
  async getUserVocabulary(userId, limit = 50) {
    try {
      const snapshot = await db
        .collection('vocabulary')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const vocabulary = [];
      snapshot.forEach((doc) => {
        vocabulary.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return vocabulary;
    } catch (error) {
      console.error('❌ Error getting vocabulary:', error);
      throw error;
    }
  }

  /**
   * Lấy một document
   */
  async getDocument(collection, docId) {
    try {
      const doc = await db.collection(collection).doc(docId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error(`❌ Error getting document from ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách documents với query
   */
  async getDocuments(collection, queryParams = {}) {
    try {
      let query = db.collection(collection);

      // Apply where clauses
      if (queryParams.where) {
        queryParams.where.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }

      // Apply orderBy
      if (queryParams.orderBy) {
        const [field, direction] = queryParams.orderBy;
        query = query.orderBy(field, direction || 'asc');
      }

      // Apply limit
      if (queryParams.limit) {
        query = query.limit(queryParams.limit);
      }

      const snapshot = await query.get();
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return documents;
    } catch (error) {
      console.error(`❌ Error getting documents from ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Tạo document mới
   */
  async createDocument(collection, data) {
    try {
      const docRef = await db.collection(collection).add({
        ...data,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error creating document in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Cập nhật document
   */
  async updateDocument(collection, docId, data) {
    try {
      await db.collection(collection).doc(docId).update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`❌ Error updating document in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Xóa document
   */
  async deleteDocument(collection, docId) {
    try {
      await db.collection(collection).doc(docId).delete();
    } catch (error) {
      console.error(`❌ Error deleting document from ${collection}:`, error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();

