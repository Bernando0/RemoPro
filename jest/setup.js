// jest/setup.js

import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Мокаем react-native-screens
jest.mock('react-native-screens', () => {
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(),
    Screen: ({ children }) => children,
    ScreenContainer: ({ children }) => children,
  };
});

// Мокаем react-native-safe-area-context полностью
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');

  return {
    SafeAreaProvider: ({ children }) => <>{children}</>,
    SafeAreaView: ({ children }) => <>{children}</>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 375,
      height: 812,
    }),
    SafeAreaContext: React.createContext({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 375, height: 812 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    },
  };
});

// Мокаем expo векторные иконки
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Icon',
    MaterialIcons: 'Icon',
    FontAwesome: 'Icon',
    MaterialCommunityIcons: 'Icon',
    Feather: 'Icon',
    Entypo: 'Icon',
    AntDesign: 'Icon',
    // Добавь сюда другие, если ты их используешь в проекте
  };
});

// Мокаем react-native-reanimated (если используешь Reanimated 2+)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Для использования работы с gesture-handler в новых версиях
  Reanimated.default.call = () => {};

  return Reanimated;
});


