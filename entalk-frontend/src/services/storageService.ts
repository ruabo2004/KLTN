/**
 * Storage Service
 * Xử lý Firebase Storage (upload/download files)
 */

import storage from '@react-native-firebase/storage';

class StorageService {
  /**
   * Upload audio recording
   */
  async uploadAudioRecording(
    userId: string,
    audioFile: any,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${audioFile.name || 'recording.wav'}`;
      const path = `audio/recordings/${userId}/${fileName}`;

      const reference = storage().ref(path);
      const task = reference.putFile(audioFile.uri);

      // Listen to upload progress
      if (onProgress) {
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        });
      }

      await task;

      // Get download URL
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Upload audio error:', error);
      throw error;
    }
  }

  /**
   * Upload audio file (alias for uploadAudioRecording)
   */
  async uploadAudio(
    audioPath: string,
    storagePath: string,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    try {
      const reference = storage().ref(storagePath);
      const task = reference.putFile(audioPath);

      // Listen to upload progress
      if (onProgress) {
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        });
      }

      await task;

      // Get download URL
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Upload audio error:', error);
      throw error;
    }
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(
    userId: string,
    imageFile: any,
    onProgress?: (progress: number) => void,
  ): Promise<{url: string; path: string}> {
    try {
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}.jpg`;
      const path = `avatars/${userId}/${fileName}`;

      const reference = storage().ref(path);
      const task = reference.putFile(imageFile.uri);

      // Listen to upload progress
      if (onProgress) {
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        });
      }

      await task;

      // Get download URL
      const downloadURL = await reference.getDownloadURL();
      
      return {
        url: downloadURL,
        path: path,
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const reference = storage().ref(path);
      await reference.delete();
    } catch (error) {
      console.error('Delete file error:', error);
      // Don't throw error if file doesn't exist
      if ((error as any).code !== 'storage/object-not-found') {
        throw error;
      }
    }
  }

  /**
   * Get download URL
   */
  async getDownloadURL(path: string): Promise<string> {
    try {
      const reference = storage().ref(path);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Get download URL error:', error);
      throw error;
    }
  }
}

export default new StorageService();

