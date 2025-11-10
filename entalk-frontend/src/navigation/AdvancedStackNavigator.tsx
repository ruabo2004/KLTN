/**
 * Advanced Stack Navigator
 * Stack navigation cho các tính năng nâng cao
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../utils/constants';

// Import screens
import MoreScreen from '../screens/home/MoreScreen';
import FreestyleScreen from '../screens/freestyle/FreestyleScreen';
import ChatbotScreen from '../screens/chatbot/ChatbotScreen';
import RolePlayScreen from '../screens/roleplay/RolePlayScreen';
import VocabularyScreen from '../screens/vocabulary/VocabularyScreen';

const Stack = createStackNavigator();

const AdvancedStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.TEXT_LIGHT,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="MoreList"
        component={MoreScreen}
        options={{
          title: 'Thêm',
        }}
      />
      <Stack.Screen
        name="Freestyle"
        component={FreestyleScreen}
        options={{
          title: 'Tạo bài tự do',
        }}
      />
      <Stack.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          title: 'AI Trợ lý',
        }}
      />
      <Stack.Screen
        name="RolePlay"
        component={RolePlayScreen}
        options={{
          title: 'Đối thoại AI',
        }}
      />
      <Stack.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{
          title: 'Từ vựng',
        }}
      />
    </Stack.Navigator>
  );
};

export default AdvancedStackNavigator;

