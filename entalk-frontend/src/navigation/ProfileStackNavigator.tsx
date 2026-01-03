/**
 * Profile Stack Navigator
 * Stack Navigator cho Profile và các màn hình liên quan
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../utils/constants';

// Import screens
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
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
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Chỉnh sửa thông tin',
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: 'Đổi mật khẩu',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Cài đặt',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;

