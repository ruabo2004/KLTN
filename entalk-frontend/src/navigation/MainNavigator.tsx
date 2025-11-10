/**
 * Main Navigator
 * Bottom Tab Navigation cho app chính
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../utils/constants';
import {Text} from 'react-native';

// Import screens and navigators
import HomeScreen from '../screens/home/HomeScreen';
import LessonsStackNavigator from './LessonsStackNavigator';
import HistoryScreen from '../screens/results/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AdvancedStackNavigator from './AdvancedStackNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        headerShown: false, // Stacks have their own headers
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.PRIMARY,
          },
          headerTintColor: COLORS.TEXT_LIGHT,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarIcon: ({color, focused}) => (
            <Text style={{fontSize: focused ? 28 : 24}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="LessonsTab"
        component={LessonsStackNavigator}
        options={{
          title: 'Bài học',
          tabBarIcon: ({color, focused}) => (
            <Text style={{fontSize: focused ? 28 : 24}}>📚</Text>
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          title: 'Lịch sử',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.PRIMARY,
          },
          headerTintColor: COLORS.TEXT_LIGHT,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarIcon: ({color, focused}) => (
            <Text style={{fontSize: focused ? 28 : 24}}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={AdvancedStackNavigator}
        options={{
          title: 'Thêm',
          tabBarIcon: ({color, focused}) => (
            <Text style={{fontSize: focused ? 28 : 24}}>⭐</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.PRIMARY,
          },
          headerTintColor: COLORS.TEXT_LIGHT,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarIcon: ({color, focused}) => (
            <Text style={{fontSize: focused ? 28 : 24}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

