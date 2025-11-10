/**
 * Lessons Stack Navigator
 * Stack navigation cho luồng Lessons → Detail → Practice → Result
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../utils/constants';

// Import screens
import LessonsListScreen from '../screens/lessons/LessonsListScreen';
import LessonDetailScreen from '../screens/lessons/LessonDetailScreen';
import PracticeScreen from '../screens/lessons/PracticeScreen';
import ResultScreen from '../screens/results/ResultScreen';

const Stack = createStackNavigator();

const LessonsStackNavigator = () => {
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
        name="LessonsList"
        component={LessonsListScreen}
        options={{
          title: 'Bài học',
        }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{
          title: 'Chi tiết bài học',
        }}
      />
      <Stack.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          title: 'Luyện tập',
          headerLeft: () => null, // Disable back button during practice
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: 'Kết quả',
          headerLeft: () => null, // Disable back button on result screen
        }}
      />
    </Stack.Navigator>
  );
};

export default LessonsStackNavigator;

