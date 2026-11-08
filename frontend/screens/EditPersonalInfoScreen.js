import React, { useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'souLinkProfileInfo';

export default function EditPersonalInfoScreen({ navigation, route }) {
  const { t } = useTranslation();

  const initialInfo = route.params?.profileInfo || {
    fullName: 'Your Name',
    email: '',
    phone: '',
    dob: '',
  };

  const [fullName, setFullName] = useState(initialInfo.fullName || '');
  const [email, setEmail] = useState(initialInfo.email || '');
  const [phone, setPhone] = useState(initialInfo.phone || '');
  const [dob, setDob] = useState(initialInfo.dob || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialInfo.dob) {
      const [day, month, year] = initialInfo.dob.split('/');
      const parsedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    return new Date(2005, 0, 1);
  });

  // SAVE PERSONAL INFORMATION
  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(
        t('missingInformation'),
        t('enterFullName')
      );

      return;
    }

    if (isSaving) {
      return;
    }

    const updatedInfo = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob.trim(),
    };

    try {
      setIsSaving(true);

      // SAVE INFORMATION PERMANENTLY ON THE DEVICE
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedInfo)
      );

      // RETURN TO PERSONAL INFORMATION
      navigation.goBack();

    } catch (error) {
      console.log('Error saving profile information:', error);

      Alert.alert(
        t('saveErrorTitle'),
        t('saveErrorMessage')
      );
    } finally {
      setIsSaving(false);
    }
  };

  // REUSABLE INPUT FIELD
  const renderField = (
    label,
    value,
    setter,
    icon,
    placeholder,
    keyboardType = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name={icon}
          size={21}
          color="#9273B5"
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setter}
          placeholder={placeholder}
          placeholderTextColor="#B5A5C5"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  // DATE PICKER
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);

    if (event.type === 'set' && date) {
      setSelectedDate(date);

      const formattedDate = [
        String(date.getDate()).padStart(2, '0'),
        String(date.getMonth() + 1).padStart(2, '0'),
        date.getFullYear(),
      ].join('/');

      setDob(formattedDate);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
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
        {t('editInformation')}
      </Text>

      <Text style={styles.subtitle}>
        {t('editInfoSubtitle')}
      </Text>

      {/* PERSONAL INFORMATION FORM */}
      <View style={styles.formCard}>
        {renderField(
          t('fullName'),
          fullName,
          setFullName,
          'person-outline',
          t('enterYourFullName')
        )}

        {renderField(
          t('emailAddress'),
          email,
          setEmail,
          'mail-outline',
          t('enterYourEmail'),
          'email-address'
        )}

        {renderField(
          t('phoneNumber'),
          phone,
          setPhone,
          'call-outline',
          t('enterYourPhone'),
          'phone-pad'
        )}

        {/* DATE OF BIRTH */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {t('dateOfBirth')}
          </Text>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={21}
              color="#9273B5"
            />

            <Text
              style={[
                styles.input,
                {
                  color: dob ? '#51465C' : '#B5A5C5',
                },
              ]}
            >
              {dob || t('selectBirthday')}
            </Text>

            <Ionicons
              name="chevron-down"
              size={18}
              color="#9273B5"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CALENDAR POPUP */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={
            Platform.OS === 'ios' ? 'spinner' : 'calendar'
          }
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          isSaving && styles.disabledButton,
        ]}
        onPress={handleSave}
        activeOpacity={0.8}
        disabled={isSaving}
      >
        <Ionicons
          name="checkmark-circle-outline"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.saveButtonText}>
          {isSaving ? t('saving') : t('saveChanges')}
        </Text>
      </TouchableOpacity>

      {/* CANCEL BUTTON */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>
          {t('cancel')}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// STYLES
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
    fontSize: 30,
    fontWeight: '600',
    color: '#62417D',
  },

  subtitle: {
    fontSize: 14,
    color: '#9273B5',
    marginTop: 8,
    marginBottom: 28,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },

  fieldContainer: {
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F4FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 54,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#51465C',
    marginLeft: 12,
    paddingVertical: 12,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#62417D',
    padding: 17,
    borderRadius: 14,
    marginTop: 28,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  cancelButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 35,
  },

  cancelText: {
    color: '#9273B5',
    fontSize: 14,
    fontWeight: '600',
  },
});