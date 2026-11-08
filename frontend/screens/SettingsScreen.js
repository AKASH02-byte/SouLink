import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const settingsSections = [
  {
    title: 'account',
    items: [
      {
        icon: 'person-outline',
        label: 'personalInfo',
        color: '#9273B5',
      },
      {
        icon: 'key-outline',
        label: 'changePassword',
        color: '#9273B5',
      },
    ],
  },
  {
    title: 'preferences',
    items: [
      {
        icon: 'language-outline',
        label: 'language',
        color: '#829B91',
      },
      {
        icon: 'color-palette-outline',
        label: 'appearance',
        color: '#829B91',
      },
    ],
  },
  {
    title: 'notifications',
    items: [
      {
        icon: 'notifications-outline',
        label: 'notificationSettings',
        color: '#D29B83',
      },
      {
        icon: 'time-outline',
        label: 'reminders',
        color: '#D29B83',
      },
    ],
  },
  {
    title: 'privacySecurity',
    items: [
      {
        icon: 'shield-checkmark-outline',
        label: 'privacySettings',
        color: '#829B91',
      },
      {
        icon: 'lock-closed-outline',
        label: 'security',
        color: '#829B91',
      },
    ],
  },
  {
    title: 'support',
    items: [
      {
        icon: 'help-circle-outline',
        label: 'helpSupport',
        color: '#9273B5',
      },
      {
        icon: 'chatbubble-ellipses-outline',
        label: 'sendFeedback',
        color: '#9273B5',
      },
    ],
  },
  {
    title: 'about',
    items: [
      {
        icon: 'information-circle-outline',
        label: 'aboutSouLink',
        color: '#D29B83',
      },
      {
        icon: 'document-text-outline',
        label: 'termsPrivacy',
        color: '#D29B83',
      },
    ],
  },
];

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();

  const handleSettingPress = (label) => {
    switch (label) {
      case 'personalInfo':
        navigation.navigate('PersonalInfo');
        break;

      case 'language':
        navigation.navigate('Language');
        break;

      default:
        break;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#62417D"
        />
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.title}>
        {t('settings')}
      </Text>

      <Text style={styles.subtitle}>
        {t('settingsSubtitle')}
      </Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={28}
            color="#62417D"
          />
        </View>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>
            {t('yourAccount')}
          </Text>

          <Text style={styles.profileDescription}>
            {t('accountDescription')}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#A18BB9"
        />
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <View
          key={section.title}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>
            {t(section.title)}
          </Text>

          <View style={styles.sectionCard}>
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingItem,
                  index !== section.items.length - 1 &&
                    styles.itemBorder,
                ]}
                activeOpacity={0.7}
                onPress={() => handleSettingPress(item.label)}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={item.icon}
                      size={21}
                      color={item.color}
                    />
                  </View>

                  <Text style={styles.itemLabel}>
                    {t(item.label)}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#B5A5C5"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color="#C46F76"
        />

        <Text style={styles.logoutText}>
          {t('logout')}
        </Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>
        SouLink · Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
    paddingHorizontal: 22,
  },

  backButton: {
    marginTop: 45,
    marginBottom: 25,
    alignSelf: 'flex-start',
  },

  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#62417D',
  },

  subtitle: {
    fontSize: 14,
    color: '#9273B5',
    marginTop: 7,
    marginBottom: 25,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAF6',
    padding: 17,
    borderRadius: 18,
    marginBottom: 28,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2D6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    flexShrink: 0,
  },

  profileText: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#62417D',
    flexShrink: 1,
  },

  profileDescription: {
    fontSize: 12,
    color: '#9273B5',
    marginTop: 4,
    flexWrap: 'wrap',
    flexShrink: 1,
  },

  section: {
    marginBottom: 23,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#A18BB9',
    marginBottom: 10,
    marginLeft: 5,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    flexShrink: 0,
  },

  itemLabel: {
    fontSize: 14,
    color: '#51465C',
    fontWeight: '500',
    flexShrink: 1,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1EDF4',
  },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9EEEE',
    padding: 16,
    borderRadius: 14,
    marginTop: 5,
  },

  logoutText: {
    color: '#C46F76',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 9,
  },

  version: {
    textAlign: 'center',
    color: '#B5A5C5',
    fontSize: 12,
    marginTop: 23,
    marginBottom: 35,
  },
});