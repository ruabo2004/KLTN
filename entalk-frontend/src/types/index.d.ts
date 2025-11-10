/**
 * Type declarations for modules without TypeScript definitions
 */

declare module 'react-native-audio-recorder-player' {
  export interface AudioEncoderAndroidType {
    AAC: string;
  }

  export interface AudioSourceAndroidType {
    MIC: number;
  }

  export interface AVEncoderAudioQualityIOSType {
    high: number;
  }

  export interface AVEncodingOption {
    aac: number;
  }

  export const AudioEncoderAndroidType: AudioEncoderAndroidType;
  export const AudioSourceAndroidType: AudioSourceAndroidType;
  export const AVEncoderAudioQualityIOSType: AVEncoderAudioQualityIOSType;
  export const AVEncodingOption: AVEncodingOption;

  export default class AudioRecorderPlayer {
    startRecorder(path?: string, audioSet?: any): Promise<string>;
    stopRecorder(): Promise<string>;
    startPlayer(path: string): Promise<string>;
    stopPlayer(): Promise<string>;
    pausePlayer(): Promise<string>;
    resumePlayer(): Promise<string>;
    addRecordBackListener(listener: (data: any) => void): void;
    removeRecordBackListener(): void;
    addPlayBackListener(listener: (data: any) => void): void;
    removePlayBackListener(): void;
  }
}

declare module 'react-native-sound' {
  export default class Sound {
    constructor(filename: string, basePath: string, callback: (error: Error | null, sound: Sound) => void);
    static setCategory(category: string): void;
    play(callback?: (success: boolean) => void): void;
    pause(callback?: () => void): void;
    stop(callback?: () => void): void;
    release(): void;
    getDuration(): number;
    getCurrentTime(callback: (seconds: number) => void): void;
    setVolume(value: number): void;
    isPlaying(): boolean;
  }
}

declare module '@react-native-firebase/firestore' {
  const firestore: any;
  export default firestore;
}

declare module '@react-native-firebase/storage' {
  const storage: any;
  export default storage;
}

declare module '@react-native-firebase/auth' {
  const auth: any;
  export default auth;
}

declare module 'i18n-js' {
  export class I18n {
    constructor(translations: any);
    locale: string;
    enableFallback: boolean;
    defaultLocale: string;
    t(key: string, options?: any): string;
  }
}

declare module 'react-native-localize' {
  export function getLocales(): Array<{languageCode: string; countryCode: string}>;
}

declare module 'console' {
  const console: any;
  export = console;
}

