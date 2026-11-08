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

const MOODS = [
  { id: 'grateful', label: 'Grateful', icon: 'flower-outline', color: '#7E3E8C', bg: '#F5EEF7' },
  { id: 'joyful', label: 'Joyful', icon: 'sunny-outline', color: '#B37B18', bg: '#FFF8EB' },
  { id: 'peaceful', label: 'Peaceful', icon: 'leaf-outline', color: '#2C7D68', bg: '#EDF8F4' },
  { id: 'loved', label: 'Loved', icon: 'heart-outline', color: '#A83B68', bg: '#FDF0F5' },
  { id: 'proud', label: 'Proud', icon: 'sparkles-outline', color: '#2F6E9E', bg: '#EFF6FC' },
];

export default function MemoriesScreen({ onBack }) {
  const [memories, setMemories] = useState([]);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMood, setSelectedMood] = useState('grateful');

  useEffect(() => {
    loadMemories();
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

  const loadMemories = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkMemories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMemories(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading memories:', e);
    }
  };

  const saveMemoriesToStorage = async (updated) => {
    try {
      setMemories(updated);
      await AsyncStorage.setItem('souLinkMemories', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving memories:', e);
      Alert.alert('Error', 'Could not save memory.');
    }
  };

  const handleAddMemory = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      Alert.alert('Memory Title', 'Please give this memory a title.');
      return;
    }

    const newMemory = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: trimmedDesc,
      mood: selectedMood,
      isFavorite: false,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    await saveMemoriesToStorage([newMemory, ...memories]);
    setTitle('');
    setDescription('');
    setSelectedMood('grateful');
    setModalVisible(false);
  };

  const handleToggleFavorite = async (id) => {
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    await saveMemoriesToStorage(updated);
  };

  const handleDeleteMemory = (id) => {
    Alert.alert('Delete Memory', 'Are you sure you want to remove this memory?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = memories.filter((m) => m.id !== id);
          await saveMemoriesToStorage(updated);
        },
      },
    ]);
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedMoodFilter === 'All') return true;
    if (selectedMoodFilter === 'Favorites') return m.isFavorite;
    return m.mood === selectedMoodFilter;
  });

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
          <Text style={styles.headerTitle}>My Memories</Text>
          <Text style={styles.headerSubtitle}>
            Cherish your precious milestones & little moments
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

      {/* MOOD FILTER CHIPS */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedMoodFilter === 'All' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedMoodFilter('All')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedMoodFilter === 'All' && styles.filterChipTextActive,
              ]}
            >
              All Moments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedMoodFilter === 'Favorites' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedMoodFilter('Favorites')}
          >
            <Ionicons
              name="heart"
              size={13}
              color={selectedMoodFilter === 'Favorites' ? '#FFFFFF' : '#A83B68'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedMoodFilter === 'Favorites' && styles.filterChipTextActive,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>

          {MOODS.map((m) => {
            const isSelected = selectedMoodFilter === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedMoodFilter(m.id)}
              >
                <Ionicons
                  name={m.icon}
                  size={13}
                  color={isSelected ? '#FFFFFF' : m.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* MEMORIES LIST */}
      <ScrollView
        contentContainerStyle={styles.memoriesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredMemories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="images-outline" size={42} color="#8875B7" />
            </View>
            <Text style={styles.emptyTitle}>No memories saved yet</Text>
            <Text style={styles.emptySubtitle}>
              Capture a heartfelt feeling, a breakthrough, a warm compliment, or a moment that made you smile today.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="heart-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddBtnText}>Save a cherished memory</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredMemories.map((item) => {
            const mood = MOODS.find((m) => m.id === item.mood) || MOODS[0];

            return (
              <View key={item.id} style={styles.memoryCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.moodBadge, { backgroundColor: mood.bg }]}>
                    <Ionicons name={mood.icon} size={14} color={mood.color} style={{ marginRight: 5 }} />
                    <Text style={[styles.moodBadgeText, { color: mood.color }]}>
                      {mood.label}
                    </Text>
                  </View>

                  <View style={styles.headerActions}>
                    <TouchableOpacity
                      onPress={() => handleToggleFavorite(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginRight: 12 }}
                    >
                      <Ionicons
                        name={item.isFavorite ? 'heart' : 'heart-outline'}
                        size={19}
                        color={item.isFavorite ? '#E04F78' : '#B8A8CC'}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteMemory(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={17} color="#B8ABB8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.memoryTitle}>{item.title}</Text>

                {item.description ? (
                  <Text style={styles.memoryDescription}>{item.description}</Text>
                ) : null}

                <View style={styles.cardFooter}>
                  <Ionicons name="time-outline" size={13} color="#9A90A5" style={{ marginRight: 4 }} />
                  <Text style={styles.memoryDate}>{item.date}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ADD MEMORY MODAL */}
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

              <Text style={styles.modalHeading}>Cherish a Moment</Text>

              <TouchableOpacity
                onPress={handleAddMemory}
                style={styles.modalSaveBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalTitleInput}
              placeholder="What made this moment special?"
              placeholderTextColor="#A89FB3"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            {/* Mood selector */}
            <Text style={styles.inputLabel}>How did it make you feel?</Text>
            <View style={styles.modalMoodRow}>
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.moodSelectorChip,
                      isSelected && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 2 },
                    ]}
                    onPress={() => setSelectedMood(m.id)}
                  >
                    <Ionicons name={m.icon} size={15} color={m.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.moodSelectorText, { color: m.color }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.modalDescInput}
              placeholder="Write the little story behind this memory... who was there, what was felt, why you want to remember it forever."
              placeholderTextColor="#B0A8BB"
              value={description}
              onChangeText={setDescription}
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
  filterWrapper: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFEE',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  filterChipText: {
    fontSize: 12,
    color: '#62417D',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  memoriesList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 6,
  },
  memoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34293E',
    marginBottom: 6,
    lineHeight: 22,
  },
  memoryDescription: {
    fontSize: 13,
    color: '#554C60',
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4EFF7',
    paddingTop: 8,
  },
  memoryDate: {
    fontSize: 11,
    color: '#9A90A5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#77717F',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8875B7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#8875B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyAddBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
    marginBottom: 16,
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
  modalTitleInput: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
    paddingVertical: 10,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalMoodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  moodSelectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DFEF',
    backgroundColor: '#FAF8FC',
    marginRight: 8,
    marginBottom: 8,
  },
  moodSelectorText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalDescInput: {
    fontSize: 14,
    color: '#4A4252',
    minHeight: 110,
    maxHeight: 170,
    lineHeight: 21,
  },
});
