import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MySpace from './components/MySpace';

const wellnessSections = [
  {
    id: 'mind',
    title: 'Mind & Relaxation',
    subtitle: 'Slow down and find your calm',
    icon: 'leaf-outline',
    items: [
      { id: 'breathing', name: 'Breathing Exercises', icon: 'cloud-outline', color: '#8875B7' },
      { id: 'meditation', name: 'Meditation & Soundscapes', icon: 'flower-outline', color: '#62417D' },
      { id: 'yoga', name: 'Mindful Yoga & Stretching', icon: 'body-outline', color: '#2D7B66' },
      { id: 'music', name: 'Relaxing Music', icon: 'musical-notes-outline', color: '#9C3D6E' },
    ],
  },
  {
    id: 'fitness',
    title: 'Fitness & Movement',
    subtitle: 'Move your body gently, your way',
    icon: 'fitness-outline',
    items: [
      { id: 'workouts', name: 'Gentle Workouts', icon: 'barbell-outline', color: '#B05E2B' },
      { id: 'activities', name: 'Physical Activities', icon: 'walk-outline', color: '#2F6E9E' },
    ],
  },
  {
    id: 'trackers',
    title: 'Daily Trackers',
    subtitle: 'Gentle check-ins without pressure or guilt',
    icon: 'stats-chart-outline',
    items: [
      { id: 'water', name: 'Water Intake', icon: 'water-outline', color: '#2B6A99' },
      { id: 'sleep', name: 'Sleep Log', icon: 'moon-outline', color: '#62417D' },
      { id: 'mood', name: 'Mood & Stress Check', icon: 'happy-outline', color: '#A85A28' },
      { id: 'habits', name: 'Daily Habits', icon: 'checkbox-outline', color: '#2E7D68' },
    ],
  },
  {
    id: 'women',
    title: "Women's Wellness",
    subtitle: 'A little more care for your cycle',
    icon: 'flower-outline',
    items: [
      { id: 'period', name: 'Period & Cycle Tracker', icon: 'calendar-outline', color: '#A0426A' },
    ],
  },
  {
    id: 'nutrition',
    title: 'Mindful Nutrition',
    subtitle: 'Nourish yourself with kindness',
    icon: 'nutrition-outline',
    items: [
      { id: 'meals', name: 'Meal & Nutrition Log', icon: 'restaurant-outline', color: '#569E87' },
    ],
  },
];

export default function WellnessScreen() {
  const [showMySpace, setShowMySpace] = useState(false);
  const [activeModalTool, setActiveModalTool] = useState(null); // 'breathing' | 'water' | 'sleep' | 'period' | 'meals' | 'meditation' | 'habits'

  // TOOL STATES
  // 1. Water Tracker
  const [waterGlasses, setWaterGlasses] = useState(4);

  // 2. Breathing Exercise
  const [breathingPhase, setBreathingPhase] = useState('Ready'); // 'Inhale' | 'Hold' | 'Exhale' | 'Rest'
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(4);

  // 3. Sleep Log
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepQuality, setSleepQuality] = useState('Restful');

  // 4. Period Tracker
  const [cycleDay, setCycleDay] = useState(14);
  const [cyclePhase, setCyclePhase] = useState('Ovulatory Phase');

  // 5. Mindful Meals
  const [breakfastText, setBreakfastText] = useState('Oats with berries & almonds');
  const [lunchText, setLunchText] = useState('Rice, dal & sauteed greens');
  const [dinnerText, setDinnerText] = useState('Warm vegetable soup & toast');
  const [snacksText, setSnacksText] = useState('Green tea & roasted walnuts');
  const [dailyCalories, setDailyCalories] = useState('1850');

  // 6. Gentle Habits
  const [habitsList, setHabitsList] = useState([
    { id: 'h1', text: 'Stood in natural sunlight for 10 mins', done: true },
    { id: 'h2', text: 'Took 3 conscious deep belly breaths', done: true },
    { id: 'h3', text: 'Drank a warm glass of water upon waking', done: false },
    { id: 'h4', text: 'Spoke with compassion to myself', done: true },
  ]);

  // Load saved wellness data
  useEffect(() => {
    loadWellnessData();
  }, []);

  // Physical Back Button
  useEffect(() => {
    if (!showMySpace && !activeModalTool) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeModalTool) {
        setActiveModalTool(null);
        return true;
      }
      if (showMySpace) {
        setShowMySpace(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [showMySpace, activeModalTool]);

  // Interactive Breathing Exercise Timer
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phases
          setBreathingPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold';
            if (currentPhase === 'Hold') return 'Exhale';
            if (currentPhase === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const loadWellnessData = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkWellnessData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.waterGlasses !== undefined) setWaterGlasses(parsed.waterGlasses);
        if (parsed.sleepHours) setSleepHours(parsed.sleepHours);
        if (parsed.sleepQuality) setSleepQuality(parsed.sleepQuality);
        if (parsed.cycleDay) setCycleDay(parsed.cycleDay);
        if (parsed.habitsList) setHabitsList(parsed.habitsList);
      }
    } catch (e) {
      console.log('Error loading wellness data:', e);
    }
  };

  const saveWellnessData = async (updates) => {
    try {
      const current = await AsyncStorage.getItem('souLinkWellnessData');
      const parsed = current ? JSON.parse(current) : {};
      const merged = { ...parsed, ...updates };
      await AsyncStorage.setItem('souLinkWellnessData', JSON.stringify(merged));
    } catch (e) {
      console.log('Error saving wellness data:', e);
    }
  };

  const handleUpdateWater = async (delta) => {
    const updated = Math.max(0, waterGlasses + delta);
    setWaterGlasses(updated);
    await saveWellnessData({ waterGlasses: updated });
  };

  const handleToggleHabit = async (id) => {
    const updated = habitsList.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabitsList(updated);
    await saveWellnessData({ habitsList: updated });
  };

  const handleItemPress = (itemId) => {
    if (itemId === 'breathing') {
      setBreathingPhase('Inhale');
      setBreathingTimer(4);
      setIsBreathingActive(true);
      setActiveModalTool('breathing');
    } else if (itemId === 'meditation' || itemId === 'music' || itemId === 'yoga') {
      setActiveModalTool('meditation');
    } else if (itemId === 'water') {
      setActiveModalTool('water');
    } else if (itemId === 'sleep') {
      setActiveModalTool('sleep');
    } else if (itemId === 'mood') {
      setActiveModalTool('sleep');
    } else if (itemId === 'habits' || itemId === 'workouts' || itemId === 'activities') {
      setActiveModalTool('habits');
    } else if (itemId === 'period') {
      setActiveModalTool('period');
    } else if (itemId === 'meals') {
      setActiveModalTool('meals');
    }
  };

  // IF MY SPACE IS ACTIVE
  if (showMySpace) {
    return <MySpace onBack={() => setShowMySpace(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Wellness Space</Text>
            <Text style={styles.subtitle}>
              Take a little time for yourself. You deserve it.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="sparkles-outline" size={23} color="#62417D" />
          </View>
        </View>

        {/* 3.5 GUILT-FREE WELLNESS PHILOSOPHY BANNER */}
        <View style={styles.guiltFreeBanner}>
          <Ionicons name="leaf" size={17} color="#2D7B66" style={{ marginRight: 8 }} />
          <Text style={styles.guiltFreeBannerText}>
            Every activity and tracker is 100% optional. Nothing is compulsory, and there is zero guilt if you miss a day. Take only what serves your peace.
          </Text>
        </View>

        {/* MY SPACE ENTRY CARD */}
        <TouchableOpacity
          style={styles.mySpaceCard}
          onPress={() => setShowMySpace(true)}
          activeOpacity={0.85}
        >
          <View style={styles.mySpaceIcon}>
            <Ionicons name="book-outline" size={25} color="#62417D" />
          </View>

          <View style={styles.mySpaceContent}>
            <Text style={styles.mySpaceTitle}>My Space</Text>
            <Text style={styles.mySpaceDescription}>
              Your private sanctuary for Diary, Notes, Calendar, To-dos & Memories.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9273B5" />
        </TouchableOpacity>

        {/* QUICK DAILY GLANCE (Water & Breathing Shortcuts) */}
        <View style={styles.quickGlanceRow}>
          {/* Water Glass Quick Tile */}
          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => setActiveModalTool('water')}
            activeOpacity={0.8}
          >
            <View style={styles.quickTileTop}>
              <Ionicons name="water" size={18} color="#2B6A99" />
              <Text style={styles.quickTileValue}>{waterGlasses} Glasses</Text>
            </View>
            <Text style={styles.quickTileLabel}>Gentle Hydration</Text>
          </TouchableOpacity>

          {/* Breathing Quick Tile */}
          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => {
              setBreathingPhase('Inhale');
              setBreathingTimer(4);
              setIsBreathingActive(true);
              setActiveModalTool('breathing');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.quickTileTop}>
              <Ionicons name="cloud" size={18} color="#8875B7" />
              <Text style={styles.quickTileValue}>Box Breath</Text>
            </View>
            <Text style={styles.quickTileLabel}>4-4-4 Grounding</Text>
          </TouchableOpacity>
        </View>

        {/* WELLNESS SECTIONS & CATEGORIES (3.5) */}
        {wellnessSections.map((section) => (
          <View key={section.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <Ionicons name={section.icon} size={22} color="#62417D" />
              </View>

              <View style={styles.categoryHeading}>
                <Text style={styles.categoryTitle}>{section.title}</Text>
                <Text style={styles.categorySubtitle}>{section.subtitle}</Text>
              </View>
            </View>

            <View style={styles.itemsContainer}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.featureItem}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.itemIconCircle, { backgroundColor: '#F0EAF5' }]}>
                    <Ionicons name={item.icon} size={19} color={item.color || '#62417D'} />
                  </View>

                  <Text style={styles.featureText}>{item.name}</Text>

                  <Ionicons name="chevron-forward" size={17} color="#B4A6C4" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerQuote}>
            "Breathe in calm, exhale expectations."
          </Text>
        </View>
      </ScrollView>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 1: BREATHING EXERCISE (BOX BREATHING)
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'breathing'}
        animationType="slide"
        onRequestClose={() => {
          setIsBreathingActive(false);
          setActiveModalTool(null);
        }}
      >
        <View style={styles.toolModalContainer}>
          <View style={styles.toolModalHeader}>
            <TouchableOpacity
              onPress={() => {
                setIsBreathingActive(false);
                setActiveModalTool(null);
              }}
              style={styles.toolCloseBtn}
            >
              <Ionicons name="close" size={24} color="#62417D" />
            </TouchableOpacity>
            <Text style={styles.toolModalTitle}>Mindful Box Breathing</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.breathingCanvas}>
            <Text style={styles.breathingHintText}>
              Follow the gentle rhythm. Settle your shoulders.
            </Text>

            <View style={styles.breathingCircle}>
              <Text style={styles.breathingPhaseText}>{breathingPhase}</Text>
              <Text style={styles.breathingSecondsText}>{breathingTimer}s</Text>
            </View>

            <View style={styles.breathingControlRow}>
              <TouchableOpacity
                style={styles.breathingToggleBtn}
                onPress={() => setIsBreathingActive(!isBreathingActive)}
              >
                <Ionicons
                  name={isBreathingActive ? 'pause' : 'play'}
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.breathingToggleBtnText}>
                  {isBreathingActive ? 'Pause Exercise' : 'Start Rhythm'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.breathingInfoNote}>
              Inhale 4s • Hold 4s • Exhale 4s • Rest 4s
            </Text>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 2: GENTLE WATER INTAKE TRACKER
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'water'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModalTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.toolCardModal}>
            <View style={styles.toolCardHeader}>
              <Text style={styles.toolCardHeading}>Gentle Water Intake</Text>
              <TouchableOpacity onPress={() => setActiveModalTool(null)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.toolCardSub}>
              Drink when you feel thirsty. Every cup is nourishment without pressure.
            </Text>

            <View style={styles.waterCounterRow}>
              <TouchableOpacity
                style={styles.waterBtn}
                onPress={() => handleUpdateWater(-1)}
              >
                <Ionicons name="remove" size={22} color="#62417D" />
              </TouchableOpacity>

              <View style={styles.waterGlassDisplay}>
                <Ionicons name="water" size={38} color="#2B6A99" />
                <Text style={styles.waterCountValue}>{waterGlasses}</Text>
                <Text style={styles.waterCountUnit}>Glasses Today</Text>
              </View>

              <TouchableOpacity
                style={styles.waterBtn}
                onPress={() => handleUpdateWater(1)}
              >
                <Ionicons name="add" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={() => setActiveModalTool(null)}
            >
              <Text style={styles.toolDoneBtnText}>Save Hydration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 3: SLEEP LOG
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'sleep'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModalTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.toolCardModal}>
            <View style={styles.toolCardHeader}>
              <Text style={styles.toolCardHeading}>Sleep & Rest Log</Text>
              <TouchableOpacity onPress={() => setActiveModalTool(null)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.toolCardSub}>
              Honor your body's need for replenishment.
            </Text>

            <Text style={styles.toolInputLabel}>Hours of Rest Last Night</Text>
            <TextInput
              style={styles.toolTextInput}
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="numeric"
              placeholder="e.g. 7.5"
            />

            <Text style={styles.toolInputLabel}>Sleep Quality</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              {['Deep & Restful', 'Fair & Calm', 'Interrupted'].map((q) => {
                const isSelected = sleepQuality === q;
                return (
                  <TouchableOpacity
                    key={q}
                    style={[
                      styles.choicePill,
                      isSelected && styles.choicePillSelected,
                    ]}
                    onPress={() => setSleepQuality(q)}
                  >
                    <Text
                      style={[
                        styles.choicePillText,
                        isSelected && styles.choicePillTextSelected,
                      ]}
                    >
                      {q}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={async () => {
                await saveWellnessData({ sleepHours, sleepQuality });
                setActiveModalTool(null);
                Alert.alert('Rest Logged', 'May tonight bring you peaceful and restorative sleep.');
              }}
            >
              <Text style={styles.toolDoneBtnText}>Save Rest Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 4: PERIOD & CYCLE TRACKER (WOMEN'S WELLNESS)
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'period'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModalTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.toolCardModal}>
            <View style={styles.toolCardHeader}>
              <Text style={styles.toolCardHeading}>Menstrual Cycle Care</Text>
              <TouchableOpacity onPress={() => setActiveModalTool(null)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.toolCardSub}>
              Track your hormonal phases with tenderness and self-care.
            </Text>

            <View style={styles.cycleCardPreview}>
              <Text style={styles.cycleDayNumber}>Day {cycleDay}</Text>
              <Text style={styles.cyclePhaseLabel}>{cyclePhase}</Text>
              <Text style={styles.cycleCareTip}>
                Tip: High natural energy today. Perfect for creative ideas and social connection.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.cycleAdjustBtn}
                onPress={() => setCycleDay(Math.max(1, cycleDay - 1))}
              >
                <Text style={styles.cycleAdjustBtnText}>- 1 Day</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cycleAdjustBtn}
                onPress={() => setCycleDay(cycleDay + 1)}
              >
                <Text style={styles.cycleAdjustBtnText}>+ 1 Day</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={async () => {
                await saveWellnessData({ cycleDay });
                setActiveModalTool(null);
              }}
            >
              <Text style={styles.toolDoneBtnText}>Save Cycle Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 5: MINDFUL NUTRITION & MEAL TRACKER
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'meals'}
        animationType="slide"
        onRequestClose={() => setActiveModalTool(null)}
      >
        <SafeAreaView style={styles.toolModalContainer}>
          <View style={styles.toolModalHeader}>
            <TouchableOpacity
              onPress={() => setActiveModalTool(null)}
              style={styles.toolCloseBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#62417D" />
            </TouchableOpacity>
            <Text style={styles.toolModalTitle}>Mindful Nutrition</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.mealScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.nutritionGuiltFreeBox}>
              <Ionicons name="heart" size={17} color="#569E87" style={{ marginRight: 6 }} />
              <Text style={styles.nutritionGuiltFreeText}>
                Food is nourishment, energy, and joy. Log what felt good for your body today without judgment.
              </Text>
            </View>

            {/* Breakfast */}
            <Text style={styles.mealLabel}>☀️ Breakfast</Text>
            <TextInput
              style={styles.mealInput}
              value={breakfastText}
              onChangeText={setBreakfastText}
              placeholder="What nourished you this morning?"
            />

            {/* Lunch */}
            <Text style={styles.mealLabel}>🌤️ Lunch</Text>
            <TextInput
              style={styles.mealInput}
              value={lunchText}
              onChangeText={setLunchText}
              placeholder="What gave you energy mid-day?"
            />

            {/* Dinner */}
            <Text style={styles.mealLabel}>🌙 Dinner</Text>
            <TextInput
              style={styles.mealInput}
              value={dinnerText}
              onChangeText={setDinnerText}
              placeholder="Evening meal & warmth..."
            />

            {/* Snacks */}
            <Text style={styles.mealLabel}>🍵 Snacks & Hydration</Text>
            <TextInput
              style={styles.mealInput}
              value={snacksText}
              onChangeText={setSnacksText}
              placeholder="Fruits, tea, nuts..."
            />

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={() => {
                setActiveModalTool(null);
                Alert.alert('Meals Logged', 'Thank you for honoring your body with food and rest.');
              }}
            >
              <Text style={styles.toolDoneBtnText}>Save Mindful Meals</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 6: GENTLE HABITS
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'habits'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModalTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.toolCardModal}>
            <View style={styles.toolCardHeader}>
              <Text style={styles.toolCardHeading}>Daily Acts of Kindness</Text>
              <TouchableOpacity onPress={() => setActiveModalTool(null)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.toolCardSub}>
              Small, loving gestures toward yourself today.
            </Text>

            {habitsList.map((h) => (
              <TouchableOpacity
                key={h.id}
                style={styles.habitRow}
                onPress={() => handleToggleHabit(h.id)}
              >
                <Ionicons
                  name={h.done ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={h.done ? '#2E7D68' : '#A89FB3'}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.habitText,
                    h.done && { textDecorationLine: 'line-through', color: '#93899E' },
                  ]}
                >
                  {h.text}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={() => setActiveModalTool(null)}
            >
              <Text style={styles.toolDoneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          INTERACTIVE TOOL MODAL 7: MEDITATION & SOUNDSCAPES
         ========================================================================= */}
      <Modal
        visible={activeModalTool === 'meditation'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModalTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.toolCardModal}>
            <View style={styles.toolCardHeader}>
              <Text style={styles.toolCardHeading}>Mindful Soundscapes</Text>
              <TouchableOpacity onPress={() => setActiveModalTool(null)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.toolCardSub}>
              Close your eyes and let soothing ambient tones wash over you.
            </Text>

            {[
              { title: 'Gentle Rain on Forest Leaves', icon: 'rainy-outline', time: '10 mins' },
              { title: 'Tibetan Singing Bowls & Resonance', icon: 'musical-notes-outline', time: '15 mins' },
              { title: 'Soft Evening Ocean Waves', icon: 'water-outline', time: '8 mins' },
            ].map((track, i) => (
              <TouchableOpacity
                key={i}
                style={styles.trackItem}
                onPress={() => {
                  Alert.alert('Playing Soundscape 🌿', `Now streaming "${track.title}". Close your eyes and enjoy the stillness.`);
                }}
              >
                <Ionicons name={track.icon} size={22} color="#62417D" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackTime}>{track.time}</Text>
                </View>
                <Ionicons name="play-circle" size={24} color="#8875B7" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.toolDoneBtn}
              onPress={() => setActiveModalTool(null)}
            >
              <Text style={styles.toolDoneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3440',
  },
  subtitle: {
    fontSize: 12,
    color: '#82758D',
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guiltFreeBanner: {
    flexDirection: 'row',
    backgroundColor: '#EDF8F4',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4EFE6',
  },
  guiltFreeBannerText: {
    fontSize: 11,
    color: '#2D7B66',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  mySpaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  mySpaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mySpaceContent: {
    flex: 1,
  },
  mySpaceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 3,
  },
  mySpaceDescription: {
    fontSize: 12,
    color: '#7E7588',
    lineHeight: 17,
  },
  quickGlanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  quickTileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickTileValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
    marginLeft: 6,
  },
  quickTileLabel: {
    fontSize: 11,
    color: '#82758D',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryHeading: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A3440',
  },
  categorySubtitle: {
    fontSize: 11,
    color: '#82758D',
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F4EFF7',
    paddingTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#4A4252',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#93899E',
  },

  // TOOL MODAL STYLES
  toolModalContainer: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  toolModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
  },
  toolCloseBtn: {
    padding: 4,
  },
  toolModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A3440',
  },
  breathingCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  breathingHintText: {
    fontSize: 14,
    color: '#77717F',
    textAlign: 'center',
    marginBottom: 40,
  },
  breathingCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F3EEF9',
    borderWidth: 4,
    borderColor: '#8875B7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  breathingPhaseText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#62417D',
  },
  breathingSecondsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8875B7',
    marginTop: 6,
  },
  breathingControlRow: {
    marginBottom: 20,
  },
  breathingToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#62417D',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
  },
  breathingToggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  breathingInfoNote: {
    fontSize: 11,
    color: '#9E94A7',
  },

  // CARD MODAL (FOR TRACKERS)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  toolCardModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  toolCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  toolCardHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
  },
  toolCardSub: {
    fontSize: 12,
    color: '#77717F',
    marginBottom: 20,
    lineHeight: 18,
  },
  waterCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  waterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterGlassDisplay: {
    alignItems: 'center',
  },
  waterCountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2B6A99',
    marginTop: 4,
  },
  waterCountUnit: {
    fontSize: 12,
    color: '#82758D',
  },
  toolDoneBtn: {
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  toolDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // SLEEP LOG
  toolInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62417D',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  toolTextInput: {
    backgroundColor: '#FAF8FC',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: '#3A3440',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginBottom: 16,
  },
  choicePill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginHorizontal: 3,
  },
  choicePillSelected: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  choicePillText: {
    fontSize: 11,
    color: '#554C60',
    fontWeight: '500',
  },
  choicePillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // PERIOD TRACKER
  cycleCardPreview: {
    backgroundColor: '#FDF0F5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F7CAD4',
  },
  cycleDayNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A0426A',
  },
  cyclePhaseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#62417D',
    marginTop: 2,
  },
  cycleCareTip: {
    fontSize: 11,
    color: '#82758D',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  cycleAdjustBtn: {
    backgroundColor: '#F0EAF5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  cycleAdjustBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },

  // NUTRITION
  mealScrollContent: {
    padding: 20,
  },
  nutritionGuiltFreeBox: {
    flexDirection: 'row',
    backgroundColor: '#EDF8F4',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  nutritionGuiltFreeText: {
    fontSize: 11,
    color: '#2D7B66',
    flex: 1,
    lineHeight: 16,
  },
  mealLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 6,
    marginTop: 8,
  },
  mealInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#3A3440',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginBottom: 12,
  },

  // HABITS
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFF7',
  },
  habitText: {
    fontSize: 13,
    color: '#4A4252',
    flex: 1,
  },

  // SOUNDSCAPES
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3440',
  },
  trackTime: {
    fontSize: 10,
    color: '#82758D',
    marginTop: 2,
  },
});
