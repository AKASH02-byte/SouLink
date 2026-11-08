import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import HomeScreen from './screens/HomeScreen';
import GuidesScreen from './screens/tabs/GuidesScreen';
import CommunityScreen from './screens/tabs/CommunityScreen';
import WellnessScreen from './screens/tabs/WellnessScreen/index';
import ProfileScreen from './screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function ExplorerTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarLabel: t(route.name.toLowerCase()),

        tabBarActiveTintColor: '#8875B7',
        tabBarInactiveTintColor: '#A9A3B5',

        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEAF5',
          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '500',
          textAlign: 'center',
          includeFontPadding: false,
        },

        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          paddingHorizontal: 0,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Guides') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Wellness') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Guides" component={GuidesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}