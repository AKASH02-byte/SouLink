import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MySpace from './components/MySpace';

const wellnessSections = [
  {
    title: 'Mind & Relaxation',
    subtitle: 'Slow down and find your calm',
    icon: 'leaf-outline',
    items: [
      { name: 'Meditation', icon: 'flower-outline' },
      { name: 'Yoga', icon: 'body-outline' },
      { name: 'Breathing', icon: 'cloud-outline' },
      { name: 'Relaxing Music', icon: 'musical-notes-outline' },
    ],
  },
  {
    title: 'Fitness & Movement',
    subtitle: 'Move your body, your way',
    icon: 'fitness-outline',
    items: [
      { name: 'Workouts', icon: 'barbell-outline' },
      { name: 'Activities', icon: 'walk-outline' },
    ],
  },
  {
    title: 'Daily Trackers',
    subtitle: 'Little steps towards better habits',
    icon: 'stats-chart-outline',
    items: [
      { name: 'Water Intake', icon: 'water-outline' },
      { name: 'Sleep', icon: 'moon-outline' },
      { name: 'Mood', icon: 'happy-outline' },
      { name: 'Habits', icon: 'checkbox-outline' },
      { name: 'Stress', icon: 'heart-outline' },
    ],
  },
  {
    title: "Women's Wellness",
    subtitle: 'A little more care for yourself',
    icon: 'flower-outline',
    items: [
      { name: 'Period Tracker', icon: 'calendar-outline' },
    ],
  },
  {
    title: 'Nutrition',
    subtitle: 'Stay mindful of what you eat',
    icon: 'nutrition-outline',
    items: [
      { name: 'Meal Tracker', icon: 'restaurant-outline' },
      { name: 'Calories', icon: 'flame-outline' },
    ],
  },
];

export default function WellnessScreen() {
  const [showMySpace, setShowMySpace] = useState(false);

  // HANDLE ANDROID PHYSICAL BACK BUTTON
  useEffect(() => {
    if (!showMySpace) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setShowMySpace(false);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [showMySpace]);

  if (showMySpace) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: 45 },
          ]}
        >
          <MySpace onBack={() => setShowMySpace(false)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Wellness
            </Text>

            <Text style={styles.subtitle}>
              Take a little time for yourself. You deserve it.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles-outline"
              size={23}
              color="#62417D"
            />
          </View>
        </View>

        {/* WELCOME CARD */}

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Make yourself a priority.
            </Text>

            <Text style={styles.welcomeDescription}>
              Explore at your own pace. Every little step counts.
            </Text>
          </View>

          <View style={styles.welcomeIcon}>
            <Ionicons
              name="heart-outline"
              size={31}
              color="#9273B5"
            />
          </View>
        </View>

        {/* MY SPACE */}

        <TouchableOpacity
          style={styles.mySpaceCard}
          onPress={() => setShowMySpace(true)}
          activeOpacity={0.85}
        >
          <View style={styles.mySpaceIcon}>
            <Ionicons
              name="book-outline"
              size={25}
              color="#62417D"
            />
          </View>

          <View style={styles.mySpaceContent}>
            <Text style={styles.mySpaceTitle}>
              My Space
            </Text>

            <Text style={styles.mySpaceDescription}>
              Your little corner for thoughts, plans and memories.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9273B5"
          />
        </TouchableOpacity>

        {/* EXPLORE WELLNESS */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              Explore Wellness
            </Text>

            <Text style={styles.sectionSubtitle}>
              Find what feels right for you.
            </Text>
          </View>

          <Text style={styles.flowerDecoration}>
            🌸
          </Text>
        </View>

        {/* WELLNESS CATEGORIES */}

        {wellnessSections.map((section, index) => (
          <View
            key={index}
            style={styles.categoryCard}
          >

            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <Ionicons
                  name={section.icon}
                  size={23}
                  color="#62417D"
                />
              </View>

              <View style={styles.categoryHeading}>
                <Text style={styles.categoryTitle}>
                  {section.title}
                </Text>

                <Text style={styles.categorySubtitle}>
                  {section.subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.itemsContainer}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.featureItem}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#9273B5"
                  />

                  <Text style={styles.featureText}>
                    {item.name}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#A394B5"
                  />
                </TouchableOpacity>
              ))}
            </View>

          </View>
        ))}

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with love, for your little moments. 💜
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // MAIN BACKGROUND

  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 25,
  },

  // HEADER — MATCHES HOME SCREEN

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 30,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  greeting: {
    fontSize: 25,
    color: '#62417D',
    fontWeight: '600',
    flexShrink: 1,
  },

  subtitle: {
    fontSize: 13,
    color: '#9273B5',
    marginTop: 8,
    flexWrap: 'wrap',
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  // WELCOME CARD

  welcomeCard: {
    backgroundColor: '#F0EAF5',
    padding: 22,
    borderRadius: 22,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ECE4F4',
  },

  welcomeContent: {
    flex: 1,
    marginRight: 12,
  },

  welcomeTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#62417D',
  },

  welcomeDescription: {
    fontSize: 12,
    color: '#82758D',
    lineHeight: 19,
    marginTop: 7,
  },

  welcomeIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // MY SPACE CARD

  mySpaceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  mySpaceIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#F0EAF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mySpaceContent: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 13,
  },

  mySpaceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#62417D',
  },

  mySpaceDescription: {
    fontSize: 12,
    color: '#82758D',
    lineHeight: 18,
    marginTop: 5,
  },

  // SECTION HEADINGS

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionHeading: {
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#62417D',
    flexShrink: 1,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#968BA1',
    marginTop: 5,
    flexShrink: 1,
  },

  flowerDecoration: {
    fontSize: 23,
    marginLeft: 8,
  },

  // CATEGORY CARDS

  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 22,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  categoryIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#F0EAF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryHeading: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#62417D',
  },

  categorySubtitle: {
    fontSize: 12,
    color: '#968BA1',
    marginTop: 4,
  },

  // INDIVIDUAL WELLNESS FEATURES

  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0EAF5',
  },

  featureItem: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F1F8',
  },

  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#62417D',
    marginLeft: 12,
  },

  // FOOTER

  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  footerText: {
    color: '#B0A4BB',
    fontSize: 11,
  },

});