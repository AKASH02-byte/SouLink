import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DiaryScreen from './MySpace/DiaryScreen';
import QuickNotesScreen from './MySpace/QuickNotesScreen';
import CalendarScreen from './MySpace/CalendarScreen';
import TodoScreen from './MySpace/TodoScreen';
import MemoriesScreen from './MySpace/MemoriesScreen';

const mySpaceFeatures = [
  {
    title: 'My Diary',
    screenId: 'diary',
    description: 'Write about your day and feelings.',
    icon: 'book-outline',
    color: '#F0EAF5',
  },
  {
    title: 'Quick Notes',
    screenId: 'notes',
    description: 'Save random thoughts and little ideas.',
    icon: 'create-outline',
    color: '#F7EDF3',
  },
  {
    title: 'My Calendar',
    screenId: 'calendar',
    description: 'Keep track of your important dates.',
    icon: 'calendar-outline',
    color: '#F0EAF5',
  },
  {
    title: 'To-do Lists',
    screenId: 'todo',
    description: 'Organise your tasks and priorities.',
    icon: 'checkbox-outline',
    color: '#F7EDF3',
  },
  {
    title: 'My Memories',
    screenId: 'memories',
    description: 'Keep your favourite moments close.',
    icon: 'images-outline',
    color: '#F0EAF5',
  },
];

export default function MySpace({ onBack }) {
  const [activeScreen, setActiveScreen] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeScreen) {
        setActiveScreen(null);
        return true;
      }
      if (onBack) {
        onBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [activeScreen, onBack]);

  const handleFeaturePress = (screenId) => {
    setActiveScreen(screenId);
  };

  // Render individual feature screens
  if (activeScreen === 'diary') {
    return <DiaryScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'notes') {
    return <QuickNotesScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'calendar') {
    return <CalendarScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'todo') {
    return <TodoScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'memories') {
    return <MemoriesScreen onBack={() => setActiveScreen(null)} />;
  }

  // MY SPACE MAIN SCREEN
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={23} color="#62417D" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.heading}>My Space</Text>
          <Text style={styles.subtitle}>
            A little space that belongs to you.
          </Text>
        </View>
      </View>

      {/* WELCOME CARD */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Your space, your story.</Text>
          <Text style={styles.welcomeDescription}>
            Write, plan, remember and organise your little world.
          </Text>
        </View>

        <Ionicons name="sparkles-outline" size={35} color="#9273B5" />
      </View>

      {/* FEATURES */}
      <Text style={styles.sectionTitle}>Your Personal Space</Text>
      <Text style={styles.sectionSubtitle}>
        What would you like to do today?
      </Text>

      <View style={styles.featuresContainer}>
        {mySpaceFeatures.map((feature) => (
          <TouchableOpacity
            key={feature.screenId}
            style={styles.featureCard}
            onPress={() => handleFeaturePress(feature.screenId)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: feature.color },
              ]}
            >
              <Ionicons name={feature.icon} size={25} color="#62417D" />
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#A394B5" />
          </TouchableOpacity>
        ))}
      </View>

      {/* PRIVACY MESSAGE */}
      <View style={styles.privacyCard}>
        <Ionicons name="lock-closed-outline" size={19} color="#9273B5" />
        <Text style={styles.privacyText}>
          Your My Space is personal. All entries and tasks belong completely to you and are stored securely on your device.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3440',
  },
  subtitle: {
    fontSize: 13,
    color: '#82758D',
    marginTop: 2,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF9',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8DEF0',
  },
  welcomeContent: {
    flex: 1,
    paddingRight: 12,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A345B',
    marginBottom: 4,
  },
  welcomeDescription: {
    fontSize: 12,
    color: '#7B6F88',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#77717F',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 12,
    color: '#7E7588',
    lineHeight: 17,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAF5',
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: '#82758D',
    marginLeft: 10,
    lineHeight: 17,
  },
});
