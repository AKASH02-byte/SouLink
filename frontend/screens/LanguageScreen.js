import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Kannada', code: 'kn' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Malayalam', code: 'ml' },
];

export default function LanguageScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(language => language.code === i18n.language)?.code || 'en'
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      console.log('1. AsyncStorage:', typeof AsyncStorage);
      console.log(
        '2. AsyncStorage.setItem:',
        typeof AsyncStorage?.setItem
      );
      console.log(
        '3. i18n.changeLanguage:',
        typeof i18n?.changeLanguage
      );

      console.log('4. Saving language:', selectedLanguage);

      await AsyncStorage.setItem(
        'souLinkLanguage',
        selectedLanguage
      );

      console.log('5. Language saved successfully!');

      await i18n.changeLanguage(selectedLanguage);

      console.log('6. App language changed successfully!');

      Alert.alert(
        'Language Updated',
        'Your language preference has been saved!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error('LANGUAGE SAVE ERROR:', error);

      Alert.alert(
        'Language Error',
        String(error)
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#62417D"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Language</Text>

        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.heading}>
        Choose your language
      </Text>

      <Text style={styles.subtitle}>
        Select your preferred language for your SouLink experience.
      </Text>

      <View style={styles.languageCard}>
        {languages.map((language, index) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              index !== languages.length - 1 && styles.border,
            ]}
            onPress={() => setSelectedLanguage(language.code)}
          >
            <Text style={styles.languageText}>
              {language.name}
            </Text>

            <Ionicons
              name={
                selectedLanguage === language.code
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={22}
              color={
                selectedLanguage === language.code
                  ? '#9273B5'
                  : '#BDB4C5'
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
    paddingHorizontal: 22,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 55,
    marginBottom: 35,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#62417D',
  },

  heading: {
    fontSize: 25,
    fontWeight: '600',
    color: '#49345D',
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 14,
    color: '#95899F',
    lineHeight: 21,
    marginBottom: 25,
  },

  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },

  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 19,
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF3',
  },

  languageText: {
    fontSize: 16,
    color: '#554763',
  },

  saveButton: {
    backgroundColor: '#9273B5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});