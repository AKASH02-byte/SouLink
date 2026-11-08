import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from './i18n';
import ExplorerTabs from './ExplorerTabs';

import SplashScreen from './screens/SplashScreen';
import SettingsScreen from './screens/SettingsScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import EditPersonalInfoScreen from './screens/EditPersonalInfoScreen';
import LanguageScreen from './screens/LanguageScreen';

const Stack = createNativeStackNavigator();

function SplashRoute({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('ExplorerTabs');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return <SplashScreen navigation={navigation} />;
}

export default function App() {
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('souLinkLanguage');

        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Could not load saved language:', error);
      } finally {
        setLanguageReady(true);
      }
    };

    loadLanguage();
  }, []);

  if (!languageReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashRoute}
          />

          <Stack.Screen
            name="ExplorerTabs"
            component={ExplorerTabs}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
          />

          <Stack.Screen
            name="PersonalInfo"
            component={PersonalInfoScreen}
          />

          <Stack.Screen
            name="EditPersonalInfo"
            component={EditPersonalInfoScreen}
          />

          <Stack.Screen
            name="Language"
            component={LanguageScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}