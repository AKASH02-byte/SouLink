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

const NOTE_COLORS = [
  { id: 'lavender', bg: '#F4EEFA', border: '#D8C7EB', accent: '#62417D' },
  { id: 'mint', bg: '#EEF8F5', border: '#C0E7DA', accent: '#2E7D68' },
  { id: 'rose', bg: '#FDF0F4', border: '#F4C8D8', accent: '#A0426A' },
  { id: 'peach', bg: '#FEF4ED', border: '#FAD5C0', accent: '#A85A28' },
  { id: 'sky', bg: '#EFF6FC', border: '#C7E0F4', accent: '#2B6A99' },
];

const CATEGORIES = ['All', 'Thoughts', 'Ideas', 'Gratitude', 'Reminders'];

export default function QuickNotesScreen({ onBack }) {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteCategory, setNoteCategory] = useState('Thoughts');
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0].id);

  useEffect(() => {
    loadNotes();
  }, []);

  // Physical Back Button
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

  const loadNotes = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkQuickNotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading quick notes:', e);
    }
  };

  const saveNotesToStorage = async (updatedNotes) => {
    try {
      setNotes(updatedNotes);
      await AsyncStorage.setItem('souLinkQuickNotes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.log('Error saving quick notes:', e);
      Alert.alert('Error', 'Could not save note.');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteBody('');
    setNoteCategory('Thoughts');
    setNoteColor(NOTE_COLORS[0].id);
    setModalVisible(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title || '');
    setNoteBody(note.body || '');
    setNoteCategory(note.category || 'Thoughts');
    setNoteColor(note.color || NOTE_COLORS[0].id);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    const trimmedTitle = noteTitle.trim();
    const trimmedBody = noteBody.trim();

    if (!trimmedTitle && !trimmedBody) {
      Alert.alert('Empty Note', 'Please enter some text for your note.');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (editingNoteId) {
      // Edit existing note
      const updated = notes.map((item) =>
        item.id === editingNoteId
          ? {
              ...item,
              title: trimmedTitle || 'Untitled Note',
              body: trimmedBody,
              category: noteCategory,
              color: noteColor,
              updatedAt: formattedDate,
            }
          : item
      );
      await saveNotesToStorage(updated);
    } else {
      // Create new note
      const newNote = {
        id: Date.now().toString(),
        title: trimmedTitle || 'Untitled Note',
        body: trimmedBody,
        category: noteCategory,
        color: noteColor,
        isPinned: false,
        createdAt: formattedDate,
      };
      await saveNotesToStorage([newNote, ...notes]);
    }

    setModalVisible(false);
  };

  const handleTogglePin = async (noteId) => {
    const updated = notes.map((item) =>
      item.id === noteId ? { ...item, isPinned: !item.isPinned } : item
    );
    // Sort so pinned are first
    updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    await saveNotesToStorage(updated);
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = notes.filter((item) => item.id !== noteId);
            await saveNotesToStorage(updated);
            if (editingNoteId === noteId) {
              setModalVisible(false);
            }
          },
        },
      ]
    );
  };

  // Filter notes based on search & category
  const filteredNotes = notes
    .filter((n) => {
      if (selectedCategory !== 'All' && n.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.body && n.body.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

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
          <Text style={styles.headerTitle}>Quick Notes</Text>
          <Text style={styles.headerSubtitle}>
            Capture little sparks, quotes & thoughts
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleOpenCreateModal}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={19} color="#8F8599" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your notes..."
          placeholderTextColor="#A89FB3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color="#8F8599" />
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORY CHIPS */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* NOTES LIST */}
      <ScrollView
        contentContainerStyle={styles.notesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bulb-outline" size={42} color="#8875B7" />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matching notes found' : 'No notes here yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try a different search word or category.'
                : 'Write down random thoughts, affirmations, or ideas before they slip away.'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyCreateButton}
                onPress={handleOpenCreateModal}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.emptyCreateButtonText}>Create your first note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredNotes.map((item) => {
            const colorScheme =
              NOTE_COLORS.find((c) => c.id === item.color) || NOTE_COLORS[0];

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: colorScheme.bg,
                    borderColor: colorScheme.border,
                  },
                ]}
                onPress={() => handleOpenEditModal(item)}
                activeOpacity={0.85}
              >
                <View style={styles.noteCardHeader}>
                  <View style={styles.noteCategoryTag}>
                    <Text
                      style={[
                        styles.noteCategoryText,
                        { color: colorScheme.accent },
                      ]}
                    >
                      {item.category || 'Thought'}
                    </Text>
                  </View>

                  <View style={styles.noteActions}>
                    <TouchableOpacity
                      onPress={() => handleTogglePin(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginRight: 10 }}
                    >
                      <Ionicons
                        name={item.isPinned ? 'pin' : 'pin-outline'}
                        size={18}
                        color={item.isPinned ? '#62417D' : '#A499B3'}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteNote(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={17} color="#B38F9F" />
                    </TouchableOpacity>
                  </View>
                </View>

                {item.title ? (
                  <Text style={styles.noteTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                ) : null}

                {item.body ? (
                  <Text style={styles.noteBody} numberOfLines={4}>
                    {item.body}
                  </Text>
                ) : null}

                <View style={styles.noteCardFooter}>
                  <Text style={styles.noteDate}>
                    {item.updatedAt ? `Updated ${item.updatedAt}` : item.createdAt}
                  </Text>
                  {item.isPinned && (
                    <View style={styles.pinnedBadge}>
                      <Text style={styles.pinnedBadgeText}>Pinned</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* CREATE / EDIT MODAL */}
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>

              <Text style={styles.modalHeading}>
                {editingNoteId ? 'Edit Note' : 'New Note'}
              </Text>

              <TouchableOpacity
                onPress={handleSaveNote}
                style={styles.modalSaveBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Category Selector in Modal */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.modalCategoryRow}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.modalCatChip,
                    noteCategory === c && styles.modalCatChipActive,
                  ]}
                  onPress={() => setNoteCategory(c)}
                >
                  <Text
                    style={[
                      styles.modalCatChipText,
                      noteCategory === c && styles.modalCatChipTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Theme Selector in Modal */}
            <Text style={styles.inputLabel}>Card Color</Text>
            <View style={styles.modalColorRow}>
              {NOTE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.bg, borderColor: color.border },
                    noteColor === color.id && styles.colorCircleActive,
                  ]}
                  onPress={() => setNoteColor(color.id)}
                >
                  {noteColor === color.id && (
                    <Ionicons name="checkmark" size={16} color={color.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Note Inputs */}
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Note title..."
              placeholderTextColor="#A89FB3"
              value={noteTitle}
              onChangeText={setNoteTitle}
              maxLength={80}
            />

            <TextInput
              style={styles.modalBodyInput}
              placeholder="What's on your mind? Capture the spark..."
              placeholderTextColor="#B0A8BB"
              value={noteBody}
              onChangeText={setNoteBody}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3A3440',
    padding: 0,
  },
  categoryWrapper: {
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFEE',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#62417D',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notesList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  noteCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  noteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteCategoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  noteCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34293E',
    marginBottom: 6,
    lineHeight: 22,
  },
  noteBody: {
    fontSize: 13,
    color: '#554C60',
    lineHeight: 19,
    marginBottom: 12,
  },
  noteCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    paddingTop: 8,
  },
  noteDate: {
    fontSize: 11,
    color: '#8A8095',
  },
  pinnedBadge: {
    backgroundColor: 'rgba(98, 65, 125, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinnedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#62417D',
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
  emptyCreateButton: {
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
  emptyCreateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  modalCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F7F5FA',
    borderWidth: 1,
    borderColor: '#E8E1F0',
    marginRight: 8,
    marginBottom: 6,
  },
  modalCatChipActive: {
    backgroundColor: '#8875B7',
    borderColor: '#8875B7',
  },
  modalCatChipText: {
    fontSize: 12,
    color: '#62417D',
    fontWeight: '500',
  },
  modalCatChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalColorRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleActive: {
    borderWidth: 2.5,
    borderColor: '#62417D',
    transform: [{ scale: 1.1 }],
  },
  modalTitleInput: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A3440',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
    paddingVertical: 10,
    marginBottom: 14,
  },
  modalBodyInput: {
    fontSize: 14,
    color: '#4A4252',
    minHeight: 120,
    maxHeight: 180,
    lineHeight: 22,
  },
});

