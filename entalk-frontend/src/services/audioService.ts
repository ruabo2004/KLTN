/**
 * Audio Service
 * Xử lý ghi âm và phát âm thanh
 */

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Platform, PermissionsAndroid} from 'react-native';
import Sound from 'react-native-sound';
import {AUDIO_SETTINGS} from '../utils/constants';

class AudioService {
  private audioRecorderPlayer: AudioRecorderPlayer;
  private currentSound: Sound | null = null;

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    Sound.setCategory('Playback');
  }

  /**
   * Request microphone permission
   */
  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Quyền ghi âm',
            message: 'Ứng dụng cần quyền truy cập microphone để ghi âm',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true; // iOS permissions handled in Info.plist
  }

  /**
   * Start recording
   */
  async startRecording(
    onProgress?: (data: {currentPosition: number; currentMetering: number}) => void,
  ): Promise<string> {
    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: AUDIO_SETTINGS.CHANNELS,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };

      const path = await this.audioRecorderPlayer.startRecorder(undefined, audioSet);

      if (onProgress) {
        this.audioRecorderPlayer.addRecordBackListener((e) => {
          onProgress({
            currentPosition: e.currentPosition,
            currentMetering: e.currentMetering || 0,
          });
        });
      }

      return path;
    } catch (error) {
      console.error('Start recording error:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<string> {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      return result;
    } catch (error) {
      console.error('Stop recording error:', error);
      throw error;
    }
  }

  /**
   * Play audio from URL
   */
  async playAudio(
    url: string,
    onProgress?: (data: {currentPosition: number; duration: number}) => void,
    onFinish?: () => void,
  ): Promise<void> {
    try {
      // Stop previous sound if any
      await this.stopAudio();

      if (onProgress || onFinish) {
        // Use AudioRecorderPlayer for progress tracking
        await this.audioRecorderPlayer.startPlayer(url);
        
        this.audioRecorderPlayer.addPlayBackListener((e) => {
          if (onProgress) {
            onProgress({
              currentPosition: e.currentPosition,
              duration: e.duration,
            });
          }

          if (e.currentPosition >= e.duration && onFinish) {
            onFinish();
            this.audioRecorderPlayer.stopPlayer();
            this.audioRecorderPlayer.removePlayBackListener();
          }
        });
      } else {
        // Use Sound for simple playback
        this.currentSound = new Sound(url, '', (error) => {
          if (error) {
            console.error('Load sound error:', error);
            return;
          }
          this.currentSound?.play((success) => {
            if (!success) {
              console.error('Playback failed');
            }
            this.currentSound?.release();
            this.currentSound = null;
          });
        });
      }
    } catch (error) {
      console.error('Play audio error:', error);
      throw error;
    }
  }

  /**
   * Stop audio playback
   */
  async stopAudio(): Promise<void> {
    try {
      if (this.currentSound) {
        this.currentSound.stop(() => {
          this.currentSound?.release();
          this.currentSound = null;
        });
      }

      await this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.error('Stop audio error:', error);
    }
  }

  /**
   * Pause audio
   */
  async pauseAudio(): Promise<void> {
    try {
      await this.audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.error('Pause audio error:', error);
      throw error;
    }
  }

  /**
   * Resume audio
   */
  async resumeAudio(): Promise<void> {
    try {
      await this.audioRecorderPlayer.resumePlayer();
    } catch (error) {
      console.error('Resume audio error:', error);
      throw error;
    }
  }

  /**
   * Get recording duration
   */
  getCurrentPosition(): number {
    return this.audioRecorderPlayer.mmss(
      Math.floor(this.audioRecorderPlayer.mmssss(0).currentPosition / 1000),
    );
  }

  /**
   * Stop playing audio (alias for stopAudio)
   */
  async stopPlaying(): Promise<void> {
    return this.stopAudio();
  }

  /**
   * Play audio from URL (alias for playAudio)
   */
  async playFromUrl(url: string): Promise<void> {
    return this.playAudio(url);
  }
}

export default new AudioService();

