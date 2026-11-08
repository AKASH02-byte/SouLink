import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const moods = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'overwhelmed', emoji: '🥺', label: 'Overwhelmed' },
];

// SAMPLE REMINDERS FOR UI TESTING
// These will later be replaced with actual backend data.

const reminders = [
  {
    id: '1',
    type: 'session',
    icon: 'videocam-outline',
    title: 'Upcoming Guide Session',
    description: 'Your session with your Guide',
    date: 'Tomorrow • 4:00 PM',
    action: 'View session',
    color: '#F0EAF8',
    iconColor: '#8870AD',
  },
  {
    id: '2',
    type: 'payment',
    icon: 'wallet-outline',
    title: 'Payment Reminder',
    description: 'Payment for your upcoming session',
    date: 'Due in 2 days',
    action: 'View payment',
    color: '#FFF0E9',
    iconColor: '#D58F72',
  },
  {
    id: '3',
    type: 'event',
    icon: 'calendar-outline',
    title: 'Personal Event',
    description: 'Your important event is coming up!',
    date: 'Saturday • 10:00 AM',
    action: 'View event',
    color: '#FCEEF5',
    iconColor: '#C47FA1',
  },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  const [selectedMood, setSelectedMood] = useState(null);

  // GUIDE NOTIFICATION STATE

  const [guideNotification, setGuideNotification] = useState({
    visible: false,
    type: 'message',
    guideName: '',
    message: '',
  });

  const notificationOpacity = useRef(
    new Animated.Value(0)
  ).current;

  // SHOW GUIDE NOTIFICATION

  const showGuideNotification = (type, guideName, message) => {
    setGuideNotification({
      visible: true,
      type,
      guideName,
      message,
    });

    notificationOpacity.setValue(0);

    Animated.timing(notificationOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // DISMISS NOTIFICATION

  const dismissGuideNotification = () => {
    Animated.timing(notificationOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setGuideNotification({
        visible: false,
        type: 'message',
        guideName: '',
        message: '',
      });
    });
  };

  // MOOD CHECK-IN

  const handleCheckIn = () => {
    if (!selectedMood) {
      Alert.alert(
        'How are you feeling?',
        'Choose a mood before checking in.'
      );

      return;
    }

    Alert.alert(
      'Mood checked in! 💜',
      'Thank you for taking a moment for yourself today.'
    );
  };

  // GUIDE NOTIFICATION ACTION

  const handleGuideNotification = () => {
    if (guideNotification.type === 'call') {
      Alert.alert(
        'Incoming Guide Call',
        `${guideNotification.guideName} is calling you.`,
        [
          {
            text: 'Decline',
            style: 'cancel',
            onPress: dismissGuideNotification,
          },
          {
            text: 'Answer',
            onPress: () => {
              dismissGuideNotification();
              navigation.navigate('Guides');
            },
          },
        ]
      );
    } else {
      const guideName = guideNotification.guideName;

      dismissGuideNotification();
      navigation.navigate('Guides');
    }
  };

  // REMINDER ACTION

  const handleReminderPress = (reminder) => {
    Alert.alert(
      reminder.title,
      reminder.description + '\n\n' + reminder.date
    );
  };

  // REMINDER CARD

  const renderReminder = (reminder) => (
    <TouchableOpacity
      key={reminder.id}
      style={styles.reminderCard}
      onPress={() => handleReminderPress(reminder)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.reminderIcon,
          { backgroundColor: reminder.color },
        ]}
      >
        <Ionicons
          name={reminder.icon}
          size={23}
          color={reminder.iconColor}
        />
      </View>

      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>
          {reminder.title}
        </Text>

        <Text style={styles.reminderDescription}>
          {reminder.description}
        </Text>

        <View style={styles.reminderDateRow}>
          <Ionicons
            name="time-outline"
            size={13}
            color="#9273B5"
          />

          <Text style={styles.reminderDate}>
            {reminder.date}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color="#A394B5"
      />
    </TouchableOpacity>
  );

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
              {t('goodMorning', {
                explorerRole: t('explorerRole'),
              })}
            </Text>

            <Text style={styles.subtitle}>
              {t('journeyMessage')}
            </Text>
          </View>

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

        </View>


        {/* GUIDE NOTIFICATION POPUP */}

        {guideNotification.visible && (
          <Animated.View
            style={[
              styles.notificationBanner,
              {
                opacity: notificationOpacity,
                transform: [
                  {
                    translateY: notificationOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-15, 0],
                    }),
                  },
                ],
              },
            ]}
          >

            <View style={styles.notificationIcon}>
              <Ionicons
                name={
                  guideNotification.type === 'call'
                    ? 'call'
                    : 'chatbubble'
                }
                size={23}
                color="#8870AD"
              />
            </View>

            <TouchableOpacity
              style={styles.notificationContent}
              onPress={handleGuideNotification}
              activeOpacity={0.8}
            >

              <Text style={styles.notificationTitle}>
                {guideNotification.type === 'call'
                  ? 'Incoming Guide Call'
                  : 'New message from your Guide'}
              </Text>

              <Text style={styles.notificationDescription}>
                {guideNotification.guideName}
              </Text>

              <Text style={styles.notificationMessage}>
                {guideNotification.type === 'call'
                  ? 'Your Guide is trying to reach you.'
                  : guideNotification.message}
              </Text>

              <Text style={styles.notificationAction}>
                {guideNotification.type === 'call'
                  ? 'View call →'
                  : 'View message →'}
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={dismissGuideNotification}
              style={styles.dismissButton}
            >
              <Ionicons
                name="close-circle-outline"
                size={22}
                color="#A394B5"
              />
            </TouchableOpacity>

          </Animated.View>
        )}


        {/* DAILY REMINDER */}

        <View style={styles.quoteCard}>

          <View style={styles.quoteHeader}>
            <View style={styles.quoteIcon}>
              <Ionicons
                name="sparkles"
                size={17}
                color="#9273B5"
              />
            </View>

            <Text style={styles.quoteLabel}>
              {t('littleReminder')}
            </Text>
          </View>

          <Text style={styles.quote}>
            {t('dailyQuote')}
          </Text>

          <Text style={styles.quoteDecoration}>
            ✨
          </Text>

        </View>


        {/* MOOD CHECK-IN */}

        <View style={styles.sectionHeader}>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              {t('feelingToday')}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {t('checkInMessage')}
            </Text>
          </View>

          <Text style={styles.flowerDecoration}>
            🌷
          </Text>

        </View>


        <View style={styles.moodCard}>

          <View style={styles.moodRow}>

            {moods.map((mood) => {
              const isSelected = selectedMood === mood.id;

              return (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    isSelected && styles.selectedMood,
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                  activeOpacity={0.7}
                >

                  <Text style={styles.moodEmoji}>
                    {mood.emoji}
                  </Text>

                  <Text
                    style={[
                      styles.moodLabel,
                      isSelected && styles.selectedMoodLabel,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {t(`mood${mood.id}`, {
                      defaultValue: mood.label,
                    })}
                  </Text>

                </TouchableOpacity>
              );
            })}

          </View>


          <TouchableOpacity
            style={styles.checkInButton}
            onPress={handleCheckIn}
            activeOpacity={0.8}
          >

            <Text style={styles.checkInButtonText}>
              {t('checkIn', {
                defaultValue: 'Check in',
              })}
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#FFFFFF"
            />

          </TouchableOpacity>


          <Text style={styles.moodFooter}>
            Every feeling deserves a little space. 💜
          </Text>

        </View>


        {/* UPCOMING & REMINDERS */}

        <View style={styles.sectionHeader}>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              Upcoming & Reminders
            </Text>

            <Text style={styles.sectionSubtitle}>
              Little things to keep in mind. 🌸
            </Text>
          </View>

          <View style={styles.reminderHeaderIcon}>
            <Ionicons
              name="notifications-outline"
              size={21}
              color="#9273B5"
            />
          </View>

        </View>


        <View style={styles.remindersContainer}>

          {reminders.length > 0 ? (
            reminders.map(renderReminder)
          ) : (

            <View style={styles.emptyReminder}>

              <Text style={styles.emptyReminderEmoji}>
                🌷
              </Text>

              <Text style={styles.emptyReminderTitle}>
                You're all caught up!
              </Text>

              <Text style={styles.emptyReminderText}>
                Enjoy your little moments.
              </Text>

            </View>

          )}

        </View>


        {/* WELLNESS JOURNEY */}

        <View style={styles.sectionHeader}>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              {t('wellnessJourney')}
            </Text>

            <Text style={styles.sectionSubtitle}>
              Little things that make you feel good.
            </Text>
          </View>

          <Text style={styles.flowerDecoration}>
            🌸
          </Text>

        </View>


        <TouchableOpacity
          style={styles.wellnessCard}
          onPress={() =>
            navigation.navigate('ExplorerTabs', {
              screen: 'Wellness',
            })
          }
          activeOpacity={0.85}
        >

          <View style={styles.wellnessIcon}>
            <Text style={styles.wellnessEmoji}>
              🧘🏻‍♀️
            </Text>
          </View>

          <View style={styles.wellnessContent}>

            <Text style={styles.wellnessTitle}>
              {t('makeTimeForYourself')}
            </Text>

            <Text style={styles.wellnessText}>
              {t('wellnessDescription')}
            </Text>

            <Text style={styles.exploreText}>
              Explore wellness →
            </Text>

          </View>

          <Text style={styles.wellnessDecoration}>
            ✨
          </Text>

        </TouchableOpacity>


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

  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 25,
  },

  // HEADER

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

  // ORIGINAL SETTINGS BUTTON POSITION

  settingsButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: -50,
    marginRight: -10,
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

  // GUIDE NOTIFICATION

  notificationBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9DFF3',

    shadowColor: '#62417D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  notificationIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F0EAF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  notificationContent: {
    flex: 1,
    minWidth: 0,
  },

  notificationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62417D',
  },

  notificationDescription: {
    fontSize: 12,
    color: '#9273B5',
    marginTop: 4,
  },

  notificationMessage: {
    fontSize: 11,
    color: '#82758D',
    marginTop: 4,
  },

  notificationAction: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9273B5',
    marginTop: 7,
  },

  dismissButton: {
    padding: 5,
    alignSelf: 'flex-start',
  },

  // DAILY REMINDER

  quoteCard: {
    backgroundColor: '#F0EAF5',
    padding: 22,
    borderRadius: 22,
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },

  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  quoteIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  quoteLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#9273B5',
    fontWeight: '600',
  },

  quote: {
    fontSize: 20,
    color: '#62417D',
    lineHeight: 29,
    flexShrink: 1,
    paddingRight: 15,
  },

  quoteDecoration: {
    position: 'absolute',
    right: 18,
    bottom: 12,
    fontSize: 23,
    opacity: 0.7,
  },

  // SECTION HEADERS

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

  // MOOD CARD

  moodCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 22,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  moodOption: {
    width: '19%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#FAF7FC',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  selectedMood: {
    backgroundColor: '#F0EAF8',
    borderColor: '#9273B5',
  },

  moodEmoji: {
    fontSize: 25,
    marginBottom: 7,
  },

  moodLabel: {
    fontSize: 10,
    color: '#82758D',
    fontWeight: '500',
  },

  selectedMoodLabel: {
    color: '#62417D',
    fontWeight: '700',
  },

  checkInButton: {
    backgroundColor: '#9273B5',
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },

  moodFooter: {
    textAlign: 'center',
    color: '#A49AAF',
    fontSize: 11,
    marginTop: 13,
  },

  // REMINDERS

  remindersContainer: {
    marginBottom: 30,
  },

  reminderCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  reminderIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  reminderContent: {
    flex: 1,
    minWidth: 0,
  },

  reminderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#62417D',
  },

  reminderDescription: {
    fontSize: 11,
    color: '#82758D',
    marginTop: 4,
  },

  reminderDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  reminderDate: {
    fontSize: 11,
    color: '#9273B5',
    marginLeft: 5,
    fontWeight: '500',
  },

  reminderHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  emptyReminder: {
    backgroundColor: '#F3EFF7',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },

  emptyReminderEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },

  emptyReminderTitle: {
    fontSize: 15,
    color: '#62417D',
    fontWeight: '600',
  },

  emptyReminderText: {
    fontSize: 12,
    color: '#9273B5',
    marginTop: 6,
  },

  // WELLNESS CARD

  wellnessCard: {
    backgroundColor: '#F3EFF7',
    padding: 18,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4F4',
    position: 'relative',
    overflow: 'hidden',
  },

  wellnessIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  wellnessEmoji: {
    fontSize: 30,
  },

  wellnessContent: {
    flex: 1,
    minWidth: 0,
  },

  wellnessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#62417D',
    flexShrink: 1,
  },

  wellnessText: {
    fontSize: 12,
    color: '#82758D',
    marginTop: 6,
    lineHeight: 18,
    flexShrink: 1,
  },

  exploreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9273B5',
    marginTop: 10,
  },

  wellnessDecoration: {
    position: 'absolute',
    right: 13,
    top: 10,
    fontSize: 16,
  },

  // FOOTER

  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },

  footerText: {
    color: '#B0A4BB',
    fontSize: 11,
  },

});