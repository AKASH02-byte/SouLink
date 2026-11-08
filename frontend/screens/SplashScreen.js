import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import {
  useFonts,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';

import { Inter_400Regular } from '@expo-google-fonts/inter';

export default function SplashScreen({ navigation }) {
  const { t } = useTranslation();

  const [fontsLoaded] = useFonts({
    Cormorant: CormorantGaramond_600SemiBold_Italic,
    Inter: Inter_400Regular,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons
          name="settings-outline"
          size={23}
          color="#62417D"
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>
          <Text style={styles.sou}>Sou</Text>
          <Text style={styles.link}>Link</Text>
        </Text>

        <Text style={styles.tagline}>
          {t('splashTagline')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsButton: {
    position: 'absolute',
    top: 32,
    right: 14,
    padding: 10,
    zIndex: 10,
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    fontFamily: 'Cormorant',
    fontSize: 92,
    letterSpacing: -2.5,
  },

  sou: {
    color: '#62417D',
  },

  link: {
    color: '#9273B5',
  },

  tagline: {
    fontFamily: 'Inter',
    fontSize: 17,
    color: '#A18BB9',
    marginTop: -5,
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});