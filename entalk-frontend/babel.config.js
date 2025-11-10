module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@config': './src/config',
          '@assets': './src/assets',
          '@locales': './src/locales',
        },
      },
    ],
  ],
};

