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

const CATEGORIES = ['All', 'Self-Care', 'Habits', 'Mindfulness', 'Daily Life'];
const PRIORITIES = [
  { id: 'gentle', label: 'Gentle', color: '#68B39B', bg: '#EDF8F4' },
  { id: 'normal', label: 'Regular', color: '#7E68AA', bg: '#F2EDFA' },
  { id: 'important', label: 'Priority', color: '#D46A6A', bg: '#FDF0F0' },
];

export default function TodoScreen({ onBack }) {
  const [todos, setTodos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'Pending' | 'Completed'
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [todoCategory, setTodoCategory] = useState('Self-Care');
  const [todoPriority, setTodoPriority] = useState('normal');

  useEffect(() => {
    loadTodos();
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

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkTodoList');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading todos:', e);
    }
  };

  const saveTodosToStorage = async (updated) => {
    try {
      setTodos(updated);
      await AsyncStorage.setItem('souLinkTodoList', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving todos:', e);
      Alert.alert('Error', 'Could not save task.');
    }
  };

  const handleToggleComplete = async (id) => {
    const updated = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await saveTodosToStorage(updated);
  };

  const handleAddTodo = async () => {
    const trimmed = todoText.trim();
    if (!trimmed) {
      Alert.alert('Empty Task', 'Please enter a task name.');
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: trimmed,
      category: todoCategory,
      priority: todoPriority,
      completed: false,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
    };

    await saveTodosToStorage([newTodo, ...todos]);
    setTodoText('');
    setModalVisible(false);
  };

  const handleDeleteTodo = (id) => {
    Alert.alert('Delete Task', 'Remove this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = todos.filter((item) => item.id !== id);
          await saveTodosToStorage(updated);
        },
      },
    ]);
  };

  const handleClearCompleted = () => {
    const hasCompleted = todos.some((t) => t.completed);
    if (!hasCompleted) return;

    Alert.alert(
      'Clear Completed Tasks',
      'Remove all completed tasks from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const updated = todos.filter((t) => !t.completed);
            await saveTodosToStorage(updated);
          },
        },
      ]
    );
  };

  // Calculations
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Filtered List
  const filteredTodos = todos.filter((t) => {
    if (selectedFilter === 'Pending' && t.completed) return false;
    if (selectedFilter === 'Completed' && !t.completed) return false;
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
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
          <Text style={styles.headerTitle}>To-do Lists</Text>
          <Text style={styles.headerSubtitle}>
            Gentle steps towards your everyday peace
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

      {/* PROGRESS CARD */}
      <View style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <View>
            <Text style={styles.progressTitle}>Today's Pace</Text>
            <Text style={styles.progressSubtitle}>
              {totalCount === 0
                ? 'No tasks yet. Take it easy today!'
                : `${completedCount} of ${totalCount} completed (${Math.round(progressPercent)}%)`}
            </Text>
          </View>
          {completedCount > 0 && (
            <TouchableOpacity onPress={handleClearCompleted} activeOpacity={0.7}>
              <Text style={styles.clearCompletedText}>Clear finished</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      {/* STATUS TABS (All / Pending / Completed) */}
      <View style={styles.statusTabs}>
        {['All', 'Pending', 'Completed'].map((tab) => {
          const isActive = selectedFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.statusTabBtn, isActive && styles.statusTabBtnActive]}
              onPress={() => setSelectedFilter(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusTabBtnText,
                  isActive && styles.statusTabBtnTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CATEGORY FILTER CHIPS */}
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
                style={[styles.catChip, isSelected && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.catChipText,
                    isSelected && styles.catChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TODOS LIST */}
      <ScrollView
        contentContainerStyle={styles.todosList}
        showsVerticalScrollIndicator={false}
      >
        {filteredTodos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="checkbox-outline" size={42} color="#8875B7" />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'Completed'
                ? 'No completed tasks yet'
                : 'All clear for now!'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'Completed'
                ? 'Check off your tasks as you finish them.'
                : 'Break your day into gentle, mindful steps.'}
            </Text>
            {selectedFilter !== 'Completed' && (
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.emptyAddBtnText}>Add a new task</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredTodos.map((item) => {
            const prio =
              PRIORITIES.find((p) => p.id === item.priority) || PRIORITIES[1];

            return (
              <View
                key={item.id}
                style={[
                  styles.todoCard,
                  item.completed && styles.todoCardCompleted,
                ]}
              >
                <TouchableOpacity
                  style={styles.checkboxTouch}
                  onPress={() => handleToggleComplete(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.completed && styles.checkboxChecked,
                    ]}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.todoContent}>
                  <Text
                    style={[
                      styles.todoText,
                      item.completed && styles.todoTextCompleted,
                    ]}
                  >
                    {item.text}
                  </Text>

                  <View style={styles.todoMetaRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {item.category || 'General'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: prio.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityBadgeText,
                          { color: prio.color },
                        ]}
                      >
                        {prio.label}
                      </Text>
                    </View>

                    <Text style={styles.todoDate}>{item.createdAt}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteTodo(item.id)}
                  style={styles.deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={17} color="#B8ABB8" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ADD TODO MODAL */}
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

              <Text style={styles.modalHeading}>New Task</Text>

              <TouchableOpacity
                onPress={handleAddTodo}
                style={styles.modalSaveBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalTextInput}
              placeholder="What do you want to accomplish?"
              placeholderTextColor="#A89FB3"
              value={todoText}
              onChangeText={setTodoText}
              autoFocus
            />

            {/* Category selection */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.modalCatRow}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.modalCatChip,
                    todoCategory === c && styles.modalCatChipActive,
                  ]}
                  onPress={() => setTodoCategory(c)}
                >
                  <Text
                    style={[
                      styles.modalCatChipText,
                      todoCategory === c && styles.modalCatChipTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority selection */}
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.modalPrioRow}>
              {PRIORITIES.map((p) => {
                const isSelected = todoPriority === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.modalPrioChip,
                      { borderColor: p.color },
                      isSelected && { backgroundColor: p.bg, borderWidth: 2 },
                    ]}
                    onPress={() => setTodoPriority(p.id)}
                  >
                    <Text style={[styles.modalPrioChipText, { color: p.color }]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#77717F',
    marginTop: 2,
  },
  clearCompletedText: {
    fontSize: 12,
    color: '#8875B7',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F0EAF5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8875B7',
    borderRadius: 4,
  },
  statusTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F0EAF5',
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
  },
  statusTabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  statusTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statusTabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7E6E8D',
  },
  statusTabBtnTextActive: {
    color: '#62417D',
    fontWeight: '700',
  },
  categoryWrapper: {
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFEE',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  catChipText: {
    fontSize: 12,
    color: '#62417D',
    fontWeight: '500',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todosList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 4,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  todoCardCompleted: {
    backgroundColor: '#FBF9FD',
    borderColor: '#F0EAF5',
    opacity: 0.75,
  },
  checkboxTouch: {
    paddingRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B8A8CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8875B7',
    borderColor: '#8875B7',
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3440',
    lineHeight: 20,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E94A7',
  },
  todoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryBadge: {
    backgroundColor: '#F3EEF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#62417D',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  todoDate: {
    fontSize: 10,
    color: '#A198AA',
  },
  deleteBtn: {
    paddingLeft: 10,
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
  modalTextInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3A3440',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  modalCatRow: {
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
  modalPrioRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalPrioChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  modalPrioChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

