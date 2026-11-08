import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mySpaceFeatures = [
  {
    title: 'My Diary',
    description: 'Write about your day and feelings.',
    icon: 'book-outline',
    color: '#F0EAF5',
  },
  {
    title: 'Quick Notes',
    description: 'Save random thoughts and little ideas.',
    icon: 'create-outline',
    color: '#F7EDF3',
  },
  {
    title: 'My Calendar',
    description: 'Keep track of your important dates.',
    icon: 'calendar-outline',
    color: '#F0EAF5',
  },
  {
    title: 'To-do Lists',
    description: 'Organise your tasks and priorities.',
    icon: 'checkbox-outline',
    color: '#F7EDF3',
  },
  {
    title: 'My Memories',
    description: 'Keep your favourite moments close.',
    icon: 'images-outline',
    color: '#F0EAF5',
  },
];

export default function MySpace({ onBack }) {
  const [showDiary, setShowDiary] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [editedEntryText, setEditedEntryText] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [diaryTitle, setDiaryTitle] = useState('Diary');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newDiaryTitle, setNewDiaryTitle] = useState('');

  useEffect(() => {
    const loadDiaryData = async () => {
      try {
        const [savedTitle, savedEntries] = await Promise.all([
          AsyncStorage.getItem('souLinkDiaryTitle'),
          AsyncStorage.getItem('souLinkDiaryEntries'),
        ]);

        if (savedTitle) {
          setDiaryTitle(savedTitle);
        }

        if (savedEntries) {
          const parsedEntries = JSON.parse(savedEntries);

          if (Array.isArray(parsedEntries)) {
            setDiaryEntries(parsedEntries);
          }
        }
      } catch (error) {
        console.log('Could not load diary data:', error);

        Alert.alert(
          'Unable to Load Diary',
          'Your saved diary data could not be loaded.'
        );
      }
    };

    loadDiaryData();
  }, []);

  useEffect(() => {
    if (!showDiary && !showEntries && !selectedEntry) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (selectedEntry && isEditingEntry) {
          handleCancelEdit();
        } else if (selectedEntry) {
          setSelectedEntry(null);
        } else if (showEntries) {
          setShowEntries(false);
        } else if (showDiary) {
          setShowDiary(false);
        }

        return true;
      }
    );

    return () => backHandler.remove();
  }, [showDiary, showEntries, selectedEntry, isEditingEntry]);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatEntryDate = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return date.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleFeaturePress = (feature) => {
    if (feature === 'My Diary') {
      setShowDiary(true);
      return;
    }

    Alert.alert(
      feature,
      'This feature will be available soon!'
    );
  };

  const handleRenamePress = () => {
    setNewDiaryTitle(diaryTitle);
    setShowRenameModal(true);
  };

  const handleRenameSave = async () => {
    const trimmedTitle = newDiaryTitle.trim();

    if (!trimmedTitle) {
      Alert.alert(
        'Name Required',
        'Please enter a name for your diary.'
      );
      return;
    }

    try {
      await AsyncStorage.setItem(
        'souLinkDiaryTitle',
        trimmedTitle
      );

      setDiaryTitle(trimmedTitle);
      setShowRenameModal(false);
    } catch (error) {
      console.log('Could not save diary name:', error);

      Alert.alert(
        'Unable to Save',
        'Your diary name could not be saved. Please try again.'
      );
    }
  };

  const handleSaveEntry = async () => {
    const trimmedEntry = diaryText.trim();

    if (!trimmedEntry) {
      Alert.alert(
        'Empty Diary',
        'Write something about your day first.'
      );
      return;
    }

    if (isSaving) return;

    const newEntry = {
      id: Date.now().toString(),
      content: trimmedEntry,
      createdAt: new Date().toISOString(),
    };

    const updatedEntries = [newEntry, ...diaryEntries];

    try {
      setIsSaving(true);

      await AsyncStorage.setItem(
        'souLinkDiaryEntries',
        JSON.stringify(updatedEntries)
      );

      setDiaryEntries(updatedEntries);
      setDiaryText('');

      Alert.alert(
        'Entry Saved',
        'Your thoughts have been saved in your diary.'
      );
    } catch (error) {
      console.log('Could not save diary entry:', error);

      Alert.alert(
        'Unable to Save',
        'Your diary entry could not be saved. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEntry = () => {
    setEditedEntryText(selectedEntry.content);
    setIsEditingEntry(true);
  };

  const handleCancelEdit = () => {
    setEditedEntryText('');
    setIsEditingEntry(false);
  };

  const handleUpdateEntry = async () => {
    const trimmedContent = editedEntryText.trim();

    if (!trimmedContent) {
      Alert.alert(
        'Empty Entry',
        'Your diary entry cannot be empty.'
      );
      return;
    }

    try {
      const updatedAt = new Date().toISOString();

      const updatedEntries = diaryEntries.map((entry) =>
        entry.id === selectedEntry.id
          ? {
              ...entry,
              content: trimmedContent,
              updatedAt,
            }
          : entry
      );

      await AsyncStorage.setItem(
        'souLinkDiaryEntries',
        JSON.stringify(updatedEntries)
      );

      setDiaryEntries(updatedEntries);

      setSelectedEntry({
        ...selectedEntry,
        content: trimmedContent,
        updatedAt,
      });

      setEditedEntryText('');
      setIsEditingEntry(false);

      Alert.alert(
        'Entry Updated',
        'Your changes have been saved!'
      );
    } catch (error) {
      console.log('Could not update diary entry:', error);

      Alert.alert(
        'Unable to Update',
        'Your changes could not be saved. Please try again.'
      );
    }
  };

  const handleDeleteEntry = () => {
    Alert.alert(
      'Delete Diary Entry?',
      'Are you sure you want to permanently delete this entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedEntries = diaryEntries.filter(
                (entry) => entry.id !== selectedEntry.id
              );

              await AsyncStorage.setItem(
                'souLinkDiaryEntries',
                JSON.stringify(updatedEntries)
              );

              setDiaryEntries(updatedEntries);
              setSelectedEntry(null);
              setIsEditingEntry(false);
              setEditedEntryText('');

              Alert.alert(
                'Entry Deleted',
                'Your diary entry has been deleted.'
              );
            } catch (error) {
              console.log('Could not delete diary entry:', error);

              Alert.alert(
                'Unable to Delete',
                'Your diary entry could not be deleted. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  // SINGLE SAVED ENTRY SCREEN

  if (selectedEntry) {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.diaryScrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedEntry(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={23} color="#62417D" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.heading}>Your Story</Text>
            <Text style={styles.subtitle}>
              A moment you wanted to remember.
            </Text>
          </View>
        </View>

        <View style={styles.entryDetailCard}>
          <View style={styles.entryDateRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#9273B5"
            />

            <Text style={styles.entryDateText}>
              {formatEntryDate(selectedEntry.createdAt)}
            </Text>
          </View>

          <Text style={styles.entryDetailTitle}>
            Dear {diaryTitle},
          </Text>

          {isEditingEntry ? (
            <>
              <TextInput
                style={styles.editEntryInput}
                value={editedEntryText}
                onChangeText={setEditedEntryText}
                multiline
                textAlignVertical="top"
                placeholder="Edit your diary entry..."
                placeholderTextColor="#B4A9BF"
                autoFocus
                maxLength={10000}
              />

              <Text style={styles.characterCount}>
                {editedEntryText.length}/10000 characters
              </Text>
            </>
          ) : (
            <Text style={styles.entryFullContent}>
              {selectedEntry.content}
            </Text>
          )}
        </View>

        {isEditingEntry ? (
          <View style={styles.editEntryActions}>
            <TouchableOpacity
              style={styles.updateEntryButton}
              onPress={handleUpdateEntry}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.updateEntryButtonText}>
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelEditButton}
              onPress={handleCancelEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelEditButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.updateEntryButton}
            onPress={handleEditEntry}
            activeOpacity={0.85}
          >
            <Ionicons
              name="create-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.updateEntryButtonText}>
              Edit Entry
            </Text>
          </TouchableOpacity>
        )}

        {!isEditingEntry && (
          <TouchableOpacity
            style={styles.deleteEntryButton}
            onPress={handleDeleteEntry}
            activeOpacity={0.85}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color="#A77D91"
            />

            <Text style={styles.deleteEntryButtonText}>
              Delete Entry
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryBackButton}
          onPress={() => {
            if (isEditingEntry) handleCancelEdit();
            setSelectedEntry(null);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBackText}>
            Back to My Entries
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
    // MY ENTRIES SCREEN

  if (showEntries) {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.diaryScrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowEntries(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={23} color="#62417D" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.heading}>My Entries</Text>
            <Text style={styles.subtitle}>
              Your little moments, all in one place.
            </Text>
          </View>
        </View>

        <View style={styles.entriesIntroCard}>
          <Ionicons
            name="book-outline"
            size={27}
            color="#9273B5"
          />

          <View style={styles.entriesIntroText}>
            <Text style={styles.welcomeTitle}>
              Your story collection
            </Text>

            <Text style={styles.welcomeDescription}>
              {diaryEntries.length === 1
                ? 'You have saved 1 little moment.'
                : `You have saved ${diaryEntries.length} little moments.`}
            </Text>
          </View>
        </View>

        {diaryEntries.length === 0 ? (
          <View style={styles.emptyEntriesCard}>
            <View style={styles.emptyEntriesIcon}>
              <Ionicons
                name="book-outline"
                size={32}
                color="#9273B5"
              />
            </View>

            <Text style={styles.emptyEntriesTitle}>
              Your pages are waiting.
            </Text>

            <Text style={styles.emptyEntriesText}>
              When you save your first diary entry, it will appear here.
            </Text>

            <TouchableOpacity
              style={styles.emptyEntriesButton}
              onPress={() => setShowEntries(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyEntriesButtonText}>
                Write an entry
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesList}>
            {diaryEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => {
                  setSelectedEntry(entry);
                  setIsEditingEntry(false);
                  setEditedEntryText('');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.entryCardTop}>
                  <View style={styles.entryIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#62417D"
                    />
                  </View>

                  <Text style={styles.entryCardDate}>
                    {formatEntryDate(entry.createdAt)}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#A394B5"
                  />
                </View>

                <Text style={styles.entryPreview} numberOfLines={3}>
                  {entry.content}
                </Text>

                <Text style={styles.readEntryLabel}>
                  Read entry
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.secondaryBackButton}
          onPress={() => setShowEntries(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBackText}>
            Back to My Diary
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // MY DIARY SCREEN

  if (showDiary) {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.diaryScrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowDiary(false)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#62417D"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.heading}>
              My Diary
            </Text>

            <Text style={styles.subtitle}>
              A little place for your thoughts.
            </Text>
          </View>
        </View>

        {/* WELCOME CARD */}

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Your story starts here.
            </Text>

            <Text style={styles.welcomeDescription}>
              Take a moment for yourself. Write freely,
              without worrying about anything.
            </Text>
          </View>

          <Ionicons
            name="book-outline"
            size={35}
            color="#9273B5"
          />
        </View>

        {/* DATE */}

        <View style={styles.dateCard}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#9273B5"
          />

          <View style={styles.dateContent}>
            <Text style={styles.dateLabel}>
              TODAY'S ENTRY
            </Text>

            <Text style={styles.dateText}>
              {today}
            </Text>
          </View>
        </View>

        {/* DIARY WRITING AREA */}

        <View style={styles.diaryCard}>
          <View style={styles.diaryTitleContainer}>
            <Text style={styles.diaryHeading}>
              Dear
            </Text>

            <TouchableOpacity
              onPress={handleRenamePress}
              activeOpacity={0.7}
              style={styles.editableDiaryName}
            >
              <Text style={styles.diaryHeading}>
                {diaryTitle}
              </Text>

              <Ionicons
                name="pencil-outline"
                size={16}
                color="#9273B5"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.diaryHint}>
            Your thoughts are safe here. Let's hear your story!
          </Text>

          <TextInput
            style={styles.diaryInput}
            placeholder="Start writing your thoughts here..."
            placeholderTextColor="#B4A9BF"
            multiline
            textAlignVertical="top"
            value={diaryText}
            onChangeText={setDiaryText}
            maxLength={10000}
          />

          <Text style={styles.characterCount}>
            {diaryText.length}/10000 characters
          </Text>
        </View>

        {/* SAVE BUTTON */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveEntry}
          activeOpacity={0.85}
          disabled={isSaving}
        >
          <Ionicons
            name="bookmark-outline"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>

        {/* MY ENTRIES BUTTON */}

        <TouchableOpacity
          style={styles.myEntriesButton}
          onPress={() => {
            setSelectedEntry(null);
            setShowEntries(true);
          }}
          activeOpacity={0.85}
        >
          <Ionicons
            name="book-outline"
            size={19}
            color="#62417D"
          />

          <Text style={styles.myEntriesButtonText}>
            My Entries
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9273B5"
          />
        </TouchableOpacity>

        {/* PRIVACY MESSAGE */}

        <View style={styles.privacyCard}>
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color="#9273B5"
          />

          <Text style={styles.privacyText}>
            Your diary is personal. Your thoughts belong only to you.
          </Text>
        </View>

        {/* RENAME DIARY MODAL */}

        <Modal
          visible={showRenameModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRenameModal(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.renameModal}>
              <View style={styles.modalIcon}>
                <Ionicons
                  name="book-outline"
                  size={27}
                  color="#62417D"
                />
              </View>

              <Text style={styles.modalTitle}>
                Give your diary a name
              </Text>

              <Text style={styles.modalDescription}>
                Make this little space truly yours.
              </Text>

              <TextInput
                style={styles.renameInput}
                value={newDiaryTitle}
                onChangeText={setNewDiaryTitle}
                placeholder="Enter your diary name"
                placeholderTextColor="#B4A9BF"
                maxLength={35}
                autoFocus
                selectTextOnFocus
              />

              <Text style={styles.renameCharacterCount}>
                {newDiaryTitle.length}/35
              </Text>

              <TouchableOpacity
                style={styles.renameSaveButton}
                onPress={handleRenameSave}
                activeOpacity={0.85}
              >
                <Text style={styles.renameSaveText}>
                  Save Name
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRenameModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    );
  }

  // MY SPACE MAIN SCREEN

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#62417D"
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.heading}>
            My Space
          </Text>

          <Text style={styles.subtitle}>
            A little space that belongs to you.
          </Text>
        </View>
      </View>

      {/* WELCOME CARD */}

      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            Your space, your story.
          </Text>

          <Text style={styles.welcomeDescription}>
            Write, plan, remember and organise your little world.
          </Text>
        </View>

        <Ionicons
          name="sparkles-outline"
          size={35}
          color="#9273B5"
        />
      </View>

      {/* FEATURES */}

      <Text style={styles.sectionTitle}>
        Your Personal Space
      </Text>

      <Text style={styles.sectionSubtitle}>
        What would you like to do today?
      </Text>

      <View style={styles.featuresContainer}>
        {mySpaceFeatures.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => handleFeaturePress(feature.title)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: feature.color },
              ]}
            >
              <Ionicons
                name={feature.icon}
                size={25}
                color="#62417D"
              />
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                {feature.title}
              </Text>

              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#A394B5"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* PRIVACY MESSAGE */}

      <View style={styles.privacyCard}>
        <Ionicons
          name="lock-closed-outline"
          size={19}
          color="#9273B5"
        />

        <Text style={styles.privacyText}>
          Your My Space is personal. Your entries belong to you.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },

  // HEADER

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  heading: {
    fontSize: 25,
    fontWeight: '600',
    color: '#62417D',
  },

  subtitle: {
    fontSize: 13,
    color: '#9273B5',
    marginTop: 5,
  },

  // WELCOME CARD

  welcomeCard: {
    backgroundColor: '#F0EAF5',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#ECE4F4',
  },

  welcomeContent: {
    flex: 1,
    marginRight: 12,
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#62417D',
  },

  welcomeDescription: {
    fontSize: 12,
    color: '#82758D',
    lineHeight: 19,
    marginTop: 7,
  },

  // DIARY DATE

  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EDF3',
    padding: 15,
    borderRadius: 17,
    marginBottom: 18,
  },

  dateContent: {
    marginLeft: 12,
    flex: 1,
  },

  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9273B5',
    letterSpacing: 1,
  },

  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#62417D',
    marginTop: 4,
  },

  // DIARY EDITOR

  diaryScrollContent: {
    paddingBottom: 25,
  },

  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 19,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  diaryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  diaryHeading: {
    fontSize: 19,
    fontWeight: '600',
    color: '#62417D',
  },

  editableDiaryName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
    gap: 7,
  },

  diaryHint: {
    fontSize: 12,
    color: '#968BA1',
    marginTop: 7,
    marginBottom: 14,
  },

  diaryInput: {
    minHeight: 220,
    fontSize: 14,
    color: '#62417D',
    lineHeight: 23,
    padding: 12,
    backgroundColor: '#FAF7FC',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  characterCount: {
    fontSize: 11,
    color: '#A394B5',
    textAlign: 'right',
    marginTop: 10,
  },

  // SAVE BUTTON

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#62417D',
    padding: 16,
    borderRadius: 17,
    marginTop: 20,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 9,
  },

  // MY ENTRIES BUTTON

  myEntriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EAF5',
    padding: 16,
    borderRadius: 17,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E8DFF0',
  },

  myEntriesButtonText: {
    color: '#62417D',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 9,
    marginRight: 9,
    flex: 1,
  },

  // MY ENTRIES AND ENTRY DETAILS

  entriesIntroCard: {
    backgroundColor: '#F0EAF5',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECE4F4',
  },

  entriesIntroText: {
    flex: 1,
    marginLeft: 13,
  },

  entriesList: {
    gap: 12,
  },

  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  entryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  entryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  entryCardDate: {
    flex: 1,
    fontSize: 11,
    color: '#9273B5',
    fontWeight: '500',
  },

  entryPreview: {
    fontSize: 13,
    color: '#62417D',
    lineHeight: 20,
    marginTop: 13,
  },

  readEntryLabel: {
    fontSize: 11,
    color: '#9273B5',
    fontWeight: '600',
    marginTop: 12,
  },

  emptyEntriesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EAF5',
    marginTop: 5,
  },

  emptyEntriesIcon: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyEntriesTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#62417D',
    textAlign: 'center',
  },

  emptyEntriesText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#82758D',
    textAlign: 'center',
    marginTop: 8,
  },

  emptyEntriesButton: {
    backgroundColor: '#62417D',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 18,
  },

  emptyEntriesButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  entryDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  entryDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  entryDateText: {
    fontSize: 12,
    color: '#9273B5',
    marginLeft: 9,
    flex: 1,
  },

  entryDetailTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 17,
  },

  entryFullContent: {
    fontSize: 14,
    lineHeight: 24,
    color: '#62417D',
  },

  // EDIT ENTRY

  editEntryInput: {
    minHeight: 220,
    fontSize: 14,
    lineHeight: 24,
    color: '#62417D',
    padding: 13,
    backgroundColor: '#FAF7FC',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8DFF0',
  },

  editEntryActions: {
    gap: 10,
    marginTop: 18,
  },

  updateEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#62417D',
    padding: 15,
    borderRadius: 16,
    marginTop: 18,
  },

  updateEntryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  cancelEditButton: {
    alignItems: 'center',
    padding: 13,
    borderRadius: 15,
    backgroundColor: '#F7EDF3',
  },

  cancelEditButtonText: {
    color: '#9273B5',
    fontSize: 13,
    fontWeight: '600',
  },

  deleteEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F5FC',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2D8ED',
  },

  deleteEntryButtonText: {
    color: '#A77D91',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  secondaryBackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EFF8',
    padding: 15,
    borderRadius: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E8DFF0',
  },

  secondaryBackText: {
    color: '#62417D',
    fontSize: 13,
    fontWeight: '600',
  },

  // RENAME MODAL

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 24, 45, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  renameModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
  },

  modalIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#F0EAF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#62417D',
    textAlign: 'center',
  },

  modalDescription: {
    fontSize: 12,
    color: '#968BA1',
    marginTop: 7,
    marginBottom: 20,
    textAlign: 'center',
  },

  renameInput: {
    width: '100%',
    backgroundColor: '#FAF7FC',
    borderWidth: 1,
    borderColor: '#E8DFF0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#62417D',
  },

  renameCharacterCount: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#A394B5',
    marginTop: 6,
  },

  renameSaveButton: {
    width: '100%',
    backgroundColor: '#62417D',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  renameSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  cancelButton: {
    padding: 12,
    marginTop: 5,
  },

  cancelText: {
    fontSize: 13,
    color: '#9273B5',
    fontWeight: '500',
  },

  // SECTION HEADING

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#62417D',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#968BA1',
    marginTop: 5,
    marginBottom: 15,
  },

  // FEATURE CARDS

  featuresContainer: {
    gap: 12,
  },

  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EAF5',
  },

  featureIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureContent: {
    flex: 1,
    marginHorizontal: 13,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#62417D',
  },

  featureDescription: {
    fontSize: 11,
    color: '#82758D',
    marginTop: 5,
  },

  // PRIVACY

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAF5',
    padding: 14,
    borderRadius: 16,
    marginTop: 22,
  },

  privacyText: {
    flex: 1,
    fontSize: 11,
    color: '#82758D',
    marginLeft: 10,
    lineHeight: 17,
  },

});