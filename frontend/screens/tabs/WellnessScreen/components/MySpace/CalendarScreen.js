import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_CATEGORIES = [
  { id: 'mind', label: 'Mindfulness', color: '#8875B7', bg: '#F2EDFA' },
  { id: 'health', label: 'Health & Body', color: '#569E87', bg: '#EDF8F4' },
  { id: 'social', label: 'Social & Fun', color: '#D47E53', bg: '#FEF4ED' },
  { id: 'self', label: 'Self-Care', color: '#B34E7B', bg: '#FDF0F5' },
];

export default function CalendarScreen({ onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventCategory, setEventCategory] = useState('mind');
  const [eventNotes, setEventNotes] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  // Back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      onBack?.();
      return true;
    });

    return () => backHandler.remove();
  }, [modalVisible, onBack]);

  const loadEvents = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkCalendarEvents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEvents(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading calendar events:', e);
    }
  };

  const saveEventsToStorage = async (updated) => {
    try {
      setEvents(updated);
      await AsyncStorage.setItem('souLinkCalendarEvents', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving events:', e);
      Alert.alert('Error', 'Could not save event.');
    }
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());

  // Check which days in current month have events
  const daysWithEvents = new Set(
    events.map((e) => e.dateKey)
  );

  const handleAddEvent = async () => {
    const trimmedTitle = eventTitle.trim();
    if (!trimmedTitle) {
      Alert.alert('Event Title', 'Please enter a title for this event.');
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: trimmedTitle,
      time: eventTime.trim() || 'Anytime',
      category: eventCategory,
      notes: eventNotes.trim(),
      dateKey: selectedDateKey,
      formattedDate: selectedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    await saveEventsToStorage([...events, newEvent]);
    setEventTitle('');
    setEventTime('');
    setEventNotes('');
    setModalVisible(false);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert('Delete Event', 'Remove this event from your calendar?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = events.filter((e) => e.id !== id);
          await saveEventsToStorage(updated);
        },
      },
    ]);
  };

  // Events for selected date
  const selectedDayEvents = events.filter((e) => e.dateKey === selectedDateKey);

  // Build grid days
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ key: `empty-${i}`, empty: true });
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const key = formatDateKey(cellDate);
    calendarCells.push({
      key,
      day: d,
      date: cellDate,
      isToday: key === todayKey,
      isSelected: key === selectedDateKey,
      hasEvents: daysWithEvents.has(key),
    });
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#62417D" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>My Calendar</Text>
          <Text style={styles.headerSubtitle}>
            Track your days, dates & gentle moments
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CALENDAR CARD */}
        <View style={styles.calendarCard}>
          {/* MONTH SELECTOR */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color="#62417D" />
            </TouchableOpacity>

            <Text style={styles.monthText}>
              {monthNames[month]} {year}
            </Text>

            <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={20} color="#62417D" />
            </TouchableOpacity>
          </View>

          {/* DAYS OF WEEK ROW */}
          <View style={styles.weekDaysRow}>
            {DAYS_OF_WEEK.map((d) => (
              <Text key={d} style={styles.weekDayText}>
                {d}
              </Text>
            ))}
          </View>

          {/* DAYS GRID */}
          <View style={styles.daysGrid}>
            {calendarCells.map((cell) => {
              if (cell.empty) {
                return <View key={cell.key} style={styles.dayCell} />;
              }

              return (
                <TouchableOpacity
                  key={cell.key}
                  style={[
                    styles.dayCell,
                    cell.isToday && styles.todayCell,
                    cell.isSelected && styles.selectedCell,
                  ]}
                  onPress={() => setSelectedDate(cell.date)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      cell.isToday && styles.todayNumber,
                      cell.isSelected && styles.selectedNumber,
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {cell.hasEvents && (
                    <View
                      style={[
                        styles.eventDot,
                        cell.isSelected && styles.eventDotSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* EVENTS SECTION */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {selectedDate.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {selectedDayEvents.length === 1
                  ? '1 event scheduled'
                  : `${selectedDayEvents.length} events scheduled`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addSmallBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#62417D" style={{ marginRight: 4 }} />
              <Text style={styles.addSmallBtnText}>Add Event</Text>
            </TouchableOpacity>
          </View>

          {selectedDayEvents.length === 0 ? (
            <View style={styles.noEventsBox}>
              <Ionicons name="calendar-outline" size={32} color="#B3A8C4" style={{ marginBottom: 6 }} />
              <Text style={styles.noEventsText}>No events planned for this day.</Text>
              <Text style={styles.noEventsSubtext}>Tap "Add Event" to schedule something.</Text>
            </View>
          ) : (
            selectedDayEvents.map((item) => {
              const cat =
                EVENT_CATEGORIES.find((c) => c.id === item.category) ||
                EVENT_CATEGORIES[0];

              return (
                <View key={item.id} style={styles.eventCard}>
                  <View
                    style={[
                      styles.eventCategoryBar,
                      { backgroundColor: cat.color },
                    ]}
                  />

                  <View style={styles.eventInfo}>
                    <View style={styles.eventTopRow}>
                      <Text style={styles.eventCardTitle}>{item.title}</Text>
                      <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
                        <Text style={[styles.catBadgeText, { color: cat.color }]}>
                          {cat.label}
                        </Text>
                      </View>
                    </View>

                    {item.time ? (
                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={13} color="#8A8095" style={{ marginRight: 4 }} />
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                    ) : null}

                    {item.notes ? (
                      <Text style={styles.notesText}>{item.notes}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteEvent(item.id)}
                    style={styles.eventDeleteBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#B39EB5" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ADD EVENT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>

              <Text style={styles.modalHeading}>Schedule Event</Text>

              <TouchableOpacity
                onPress={handleAddEvent}
                style={styles.modalSaveBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSelectedDateNote}>
              Date: {selectedDate.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Event title (e.g., Morning Meditation)"
              placeholderTextColor="#A89FB3"
              value={eventTitle}
              onChangeText={setEventTitle}
              autoFocus
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Time (e.g., 8:00 AM, Evening)"
              placeholderTextColor="#A89FB3"
              value={eventTime}
              onChangeText={setEventTime}
            />

            {/* Category selection */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.catPillRow}>
              {EVENT_CATEGORIES.map((c) => {
                const isSelected = eventCategory === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.catPill,
                      isSelected && { backgroundColor: c.color, borderColor: c.color },
                    ]}
                    onPress={() => setEventCategory(c.id)}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        isSelected && { color: '#FFFFFF', fontWeight: '700' },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={[styles.modalInput, styles.modalNotesInput]}
              placeholder="Add optional notes, reflections or reminder details..."
              placeholderTextColor="#A89FB3"
              value={eventNotes}
              onChangeText={setEventNotes}
              multiline
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FAF9FF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3A3440',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#82758D',
    marginTop: 2,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#8875B7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8875B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EDFA',
    paddingBottom: 8,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#9E94A7',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 12,
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: '#8875B7',
  },
  selectedCell: {
    backgroundColor: '#62417D',
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3A3440',
  },
  todayNumber: {
    fontWeight: '700',
    color: '#62417D',
  },
  selectedNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8875B7',
    marginTop: 2,
  },
  eventDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  eventsSection: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#82758D',
    marginTop: 2,
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addSmallBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  noEventsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  noEventsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#554C60',
  },
  noEventsSubtext: {
    fontSize: 12,
    color: '#93899E',
    marginTop: 4,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    alignItems: 'center',
  },
  eventCategoryBar: {
    width: 4,
    height: 38,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
    flex: 1,
    marginRight: 8,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#77717F',
  },
  notesText: {
    fontSize: 12,
    color: '#6E6778',
    marginTop: 4,
    lineHeight: 17,
  },
  eventDeleteBtn: {
    paddingLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
  },
  modalSaveBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  modalSaveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalSelectedDateNote: {
    fontSize: 12,
    color: '#8875B7',
    fontWeight: '600',
    marginBottom: 14,
  },
  modalInput: {
    fontSize: 15,
    color: '#3A3440',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
    paddingVertical: 10,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  catPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2D9EC',
    backgroundColor: '#FAF8FC',
    marginRight: 8,
    marginBottom: 6,
  },
  catPillText: {
    fontSize: 11,
    color: '#62417D',
    fontWeight: '500',
  },
  modalNotesInput: {
    minHeight: 60,
  },
});

