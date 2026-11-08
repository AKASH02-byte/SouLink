import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = 'souLinkProfileInfo';

export default function PersonalInfoScreen({ navigation }) {
  const { t } = useTranslation();

  const [profileInfo, setProfileInfo] = useState({
    fullName: 'Your Name',
    email: '',
    phone: '',
    dob: '',
  });

  // LOAD SAVED INFORMATION WHENEVER SCREEN OPENS
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfileInfo = async () => {
        try {
          const savedInfo = await AsyncStorage.getItem(STORAGE_KEY);

          if (savedInfo && isActive) {
            const parsedInfo = JSON.parse(savedInfo);

            setProfileInfo({
              fullName: parsedInfo.fullName || 'Your Name',
              email: parsedInfo.email || '',
              phone: parsedInfo.phone || '',
              dob: parsedInfo.dob || '',
            });
          }
        } catch (error) {
          console.log('Error loading profile information:', error);
        }
      };

      loadProfileInfo();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const profileFields = [
    {
      icon: 'person-outline',
      label: t('fullName'),
      value: profileInfo.fullName || t('notAddedYet'),
    },
    {
      icon: 'mail-outline',
      label: t('emailAddress'),
      value: profileInfo.email || t('notAddedYet'),
    },
    {
      icon: 'call-outline',
      label: t('phoneNumber'),
      value: profileInfo.phone || t('notAddedYet'),
    },
    {
      icon: 'calendar-outline',
      label: t('dateOfBirth'),
      value: profileInfo.dob || t('notAddedYet'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK BUTTON */}
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

      {/* PAGE TITLE */}
      <Text style={styles.title}>
        {t('personalInfo')}
      </Text>

      <Text style={styles.subtitle}>
        {t('personalInfoSubtitle')}
      </Text>

      {/* PROFILE AVATAR */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={45}
            color="#62417D"
          />
        </View>

        <Text style={styles.avatarText}>
          {t('yourProfile')}
        </Text>

        <Text style={styles.avatarSubtext}>
          {t('makeProfileFeelLikeYou')}
        </Text>
      </View>

      {/* PERSONAL DETAILS */}
      <Text style={styles.sectionTitle}>
        {t('personalDetails')}
      </Text>

      <View style={styles.detailsCard}>
        {profileFields.map((field, index) => (
          <View
            key={field.label}
            style={[
              styles.field,
              index !== profileFields.length - 1 &&
                styles.fieldBorder,
            ]}
          >
            <View style={styles.fieldIcon}>
              <Ionicons
                name={field.icon}
                size={21}
                color="#9273B5"
              />
            </View>

            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>
                {field.label}
              </Text>

              <Text style={styles.fieldValue}>
                {field.value}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#B5A5C5"
            />
          </View>
        ))}
      </View>

      {/* EDIT BUTTON */}
      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('EditPersonalInfo', {
            profileInfo,
          })
        }
      >
        <Ionicons
          name="create-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.editButtonText}>
          {t('editInformation')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        {t('personalInfoPrivacy')}
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
    fontSize: 29,
    fontWeight: '600',
    color: '#62417D',
  },

  subtitle: {
    fontSize: 14,
    color: '#9273B5',
    marginTop: 8,
    lineHeight: 21,
  },

  avatarSection: {
    alignItems: 'center',
    marginVertical: 32,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#EAE1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#62417D',
    marginTop: 12,
  },

  avatarSubtext: {
    fontSize: 13,
    color: '#A18BB9',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#A18BB9',
    marginBottom: 12,
    marginLeft: 5,
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 15,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
  },

  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1EDF4',
  },

  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  fieldContent: {
    flex: 1,
    minWidth: 0,
  },

  fieldLabel: {
    fontSize: 13,
    color: '#A18BB9',
    flexShrink: 1,
  },

  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#51465C',
    marginTop: 5,
    flexShrink: 1,
  },

  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62417D',
    padding: 16,
    borderRadius: 14,
    marginTop: 25,
  },

  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 9,
  },

  footer: {
    fontSize: 12,
    color: '#A18BB9',
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 35,
  },
});