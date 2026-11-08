import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SPECIALISATIONS
const SPECIALISATIONS = [
  'All',
  'Anxiety & Depression',
  'Trauma & PTSD',
  'Relationships & Marriage',
  'Stress & Burnout',
  'Grief & Loss',
  'Youth & Career',
];

// LANGUAGES
const LANGUAGES = [
  'All Languages',
  'English',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Marathi',
];

// AVAILABILITY OPTIONS
const AVAILABILITY_OPTIONS = [
  'Any Time',
  'Available Today',
  'This Weekend',
  'Evening Slots',
];

// MOCK PROFESSIONAL GUIDES DATA
const PROFESSIONALS_DATA = [
  {
    id: 'guide-1',
    name: 'Dr. Ananya Sharma',
    title: 'Licensed Clinical Psychologist',
    qualifications: 'M.Phil in Clinical Psychology (NIMHANS), Ph.D., RCI Registered',
    experience: '9 years clinical experience',
    rating: '4.95',
    reviewCount: 380,
    languages: ['English', 'Hindi'],
    specialisation: 'Anxiety & Depression',
    availabilityTag: 'Available Today',
    availableDates: ['Today', 'Tomorrow', 'Saturday', 'Sunday'],
    slots: ['4:30 PM', '6:00 PM', '7:30 PM'],
    pricing: {
      video: 1500,
      audio: 1200,
      text: 800,
    },
    bio: 'Dr. Ananya Sharma is an RCI-licensed Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and compassion-focused inner child work. She creates a deeply grounded, judgment-free space to untangle overwhelming emotional patterns.',
    clinicalFocus: [
      'Panic attacks & generalized anxiety',
      'High-functioning depression',
      'Perfectionism and self-criticism',
      'Life transitions & identity',
    ],
    avatarColor: '#E8DFF5',
    avatarIconColor: '#62417D',
  },
  {
    id: 'guide-2',
    name: 'Aarav Mehta',
    title: 'Counseling Psychologist & Stress Specialist',
    qualifications: 'M.Sc. Counseling Psychology, Certified REBT & Somatic Coach',
    experience: '6 years experience',
    rating: '4.88',
    reviewCount: 245,
    languages: ['English', 'Hindi', 'Gujarati'],
    specialisation: 'Stress & Burnout',
    availabilityTag: 'Available Today',
    availableDates: ['Today', 'Tomorrow', 'Monday'],
    slots: ['5:00 PM', '6:30 PM', '8:00 PM'],
    pricing: {
      video: 1300,
      audio: 1000,
      text: 700,
    },
    bio: 'Aarav works predominantly with students, engineers, and corporate professionals facing severe workplace fatigue, performance anxiety, and decision paralysis. His approach is practical, warm, and nervous-system centered.',
    clinicalFocus: [
      'Corporate burnout & overthinking',
      'Imposter syndrome & career crossroads',
      'Somatic tension and stress headaches',
      'Mindfulness-based habit formation',
    ],
    avatarColor: '#FCEEF5',
    avatarIconColor: '#9C3D6E',
  },
  {
    id: 'guide-3',
    name: 'Priya Deshmukh',
    title: 'Senior Relationship & Family Therapist',
    qualifications: 'M.A. Clinical Psychology, Certified Emotionally Focused Therapy (EFT)',
    experience: '11 years clinical experience',
    rating: '4.98',
    reviewCount: 490,
    languages: ['English', 'Marathi', 'Hindi'],
    specialisation: 'Relationships & Marriage',
    availabilityTag: 'This Weekend',
    availableDates: ['Tomorrow', 'Saturday', 'Sunday'],
    slots: ['11:00 AM', '2:30 PM', '4:00 PM'],
    pricing: {
      video: 1800,
      audio: 1400,
      text: 950,
    },
    bio: 'Priya specializes in non-violent communication, attachment healing, and boundary dynamics. She has guided hundreds of couples and individuals through relationship rupture, family enmeshment, and codependency recovery.',
    clinicalFocus: [
      'Anxious-avoidant attachment cycles',
      'Communication breakdown & conflict repair',
      'Setting healthy boundaries with family',
      'Post-breakup grief & rebuilding self-worth',
    ],
    avatarColor: '#EDF8F4',
    avatarIconColor: '#2D7B66',
  },
  {
    id: 'guide-4',
    name: 'Dr. Rohan Kulkarni',
    title: 'Neuropsychologist & Trauma Specialist',
    qualifications: 'Ph.D. in Neuropsychology, Certified EMDR & Somatic Experiencing',
    experience: '12 years experience',
    rating: '4.96',
    reviewCount: 520,
    languages: ['English', 'Kannada', 'Hindi'],
    specialisation: 'Trauma & PTSD',
    availabilityTag: 'Evening Slots',
    availableDates: ['Tomorrow', 'Saturday', 'Tuesday'],
    slots: ['6:00 PM', '7:30 PM', '9:00 PM'],
    pricing: {
      video: 2000,
      audio: 1600,
      text: 1000,
    },
    bio: 'Dr. Rohan applies modern neuroscience and bilateral brain stimulation principles (EMDR) to help Explorers process deep-seated emotional trauma, grief, and traumatic stress without feeling re-traumatized.',
    clinicalFocus: [
      'Childhood trauma & emotional neglect',
      'Post-Traumatic Stress (PTSD)',
      'Complex grief & bereavement',
      'Nervous system hyperarousal',
    ],
    avatarColor: '#FEF4ED',
    avatarIconColor: '#B05E2B',
  },
  {
    id: 'guide-5',
    name: 'Kavita Nair',
    title: 'Mental Health Counselor & Youth Mentor',
    qualifications: 'M.Sc. Psychology, Diploma in Expressive Arts Therapy',
    experience: '5 years experience',
    rating: '4.85',
    reviewCount: 190,
    languages: ['English', 'Tamil', 'Malayalam', 'Hindi'],
    specialisation: 'Youth & Career',
    availabilityTag: 'Available Today',
    availableDates: ['Today', 'Tomorrow', 'Friday'],
    slots: ['3:00 PM', '4:30 PM', '6:00 PM'],
    pricing: {
      video: 1200,
      audio: 900,
      text: 650,
    },
    bio: 'Kavita creates an open, culturally sensitive haven for young adults discovering their authentic voice. She combines conversational psychotherapy with narrative journaling and creative mindfulness.',
    clinicalFocus: [
      'Academic pressure & family expectations',
      'Loneliness & social anxiety in young adults',
      'Low self-esteem & body image concerns',
      'Emotional expression through art and journaling',
    ],
    avatarColor: '#EFF6FC',
    avatarIconColor: '#2F6E9E',
  },
];

export default function GuidesScreen() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-sessions'

  // FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialisation, setSelectedSpecialisation] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedAvailability, setSelectedAvailability] = useState('Any Time');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // SESSIONS DATA
  const [bookedSessions, setBookedSessions] = useState([]);

  // MODALS
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfileGuide, setSelectedProfileGuide] = useState(null);

  // BOOKING PROCESS (8 STEPS)
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingGuide, setBookingGuide] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Type | 2: Date & Slot | 3: Review | 4: Payment | 5: Confirmation
  const [bookingSessionType, setBookingSessionType] = useState('video'); // 'video' | 'audio' | 'text'
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [completedBookingDetails, setCompletedBookingDetails] = useState(null);

  // 3.3 AI-ASSISTED MATCHING STATE
  const [aiMatchingModalVisible, setAiMatchingModalVisible] = useState(false);
  const [matchingStep, setMatchingStep] = useState(1); // 1: Questions, 2: Matched Results
  const [aiMatchAnswers, setAiMatchAnswers] = useState({
    supportType: 'Anxiety & Depression',
    language: 'English',
    sessionType: 'video',
    approach: 'Gentle & CBT-Focused',
    availability: 'Available Today',
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // RESCHEDULE MODAL
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [rescheduleSession, setRescheduleSession] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('Tomorrow');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState('');

  // ATTEND / LIVE ROOM MODAL
  const [liveRoomVisible, setLiveRoomVisible] = useState(false);
  const [liveSession, setLiveSession] = useState(null);
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const saved = await AsyncStorage.getItem('souLinkBookedSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookedSessions(parsed);
        }
      }
    } catch (e) {
      console.log('Error loading sessions:', e);
    }
  };

  const saveSessions = async (updated) => {
    try {
      setBookedSessions(updated);
      await AsyncStorage.setItem('souLinkBookedSessions', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving sessions:', e);
    }
  };

  // OPEN GUIDE PROFILE
  const handleOpenProfile = (guide) => {
    setSelectedProfileGuide(guide);
    setProfileModalVisible(true);
  };

  // 3.3 AI-ASSISTED MATCHING LOGIC (Hybrid Rule-Based + Affinity Scoring)
  const handleOpenAiMatching = () => {
    setMatchingStep(1);
    setAiMatchingModalVisible(true);
  };

  const handleRunAiMatching = () => {
    // 1. Mandatory Rule Checks: Guide must be verified, support session format
    const candidateGuides = PROFESSIONALS_DATA.filter((guide) => {
      // Must have pricing for session type
      if (!guide.pricing[aiMatchAnswers.sessionType]) return false;
      return true;
    });

    // 2. Hybrid Scoring Engine
    const scoredGuides = candidateGuides.map((guide) => {
      let score = 55; // Base qualification and approval score

      // Support / Specialty Match (+25)
      if (guide.specialisation === aiMatchAnswers.supportType) {
        score += 25;
      } else if (
        guide.clinicalFocus.some((f) =>
          f.toLowerCase().includes(aiMatchAnswers.supportType.toLowerCase().slice(0, 5))
        )
      ) {
        score += 15;
      }

      // Language Compatibility Rule (+15)
      if (aiMatchAnswers.language !== 'All Languages') {
        if (guide.languages.includes(aiMatchAnswers.language)) {
          score += 15;
        }
      } else {
        score += 10;
      }

      // Availability Tag Match (+10)
      if (guide.availabilityTag === aiMatchAnswers.availability) {
        score += 10;
      }

      // Approach & Characteristics Match (+5)
      if (aiMatchAnswers.approach.includes('CBT') && guide.bio.includes('CBT')) score += 5;
      if (aiMatchAnswers.approach.includes('Somatic') && guide.bio.includes('Somatic')) score += 5;

      const finalMatchPercent = Math.min(99, Math.max(76, score));

      return {
        ...guide,
        matchScore: finalMatchPercent,
        matchRationale: `Optimal clinical synergy for ${aiMatchAnswers.supportType} in ${guide.languages.join(' & ')}.`,
      };
    });

    scoredGuides.sort((a, b) => b.matchScore - a.matchScore);
    setAiRecommendations(scoredGuides.slice(0, 2));
    setMatchingStep(2);
  };

  // INITIATE BOOKING
  const handleStartBooking = (guide) => {
    setBookingGuide(guide);
    setBookingSessionType('video');
    setBookingDate(guide.availableDates[0] || 'Tomorrow');
    setBookingSlot(guide.slots[0] || '5:00 PM');
    setBookingNotes('');
    setBookingStep(1);
    setBookingModalVisible(true);
    setProfileModalVisible(false);
  };

  // CONFIRM BOOKING & COMPLETE PAYMENT (Step 6 -> Step 7)
  const handleProcessPayment = async () => {
    if (!bookingGuide) return;

    const price = bookingGuide.pricing[bookingSessionType] || 1200;
    const bookingId = 'SL-' + Math.floor(100000 + Math.random() * 900000);

    const newSession = {
      id: bookingId,
      guideId: bookingGuide.id,
      guideName: bookingGuide.name,
      guideTitle: bookingGuide.title,
      sessionType: bookingSessionType,
      date: bookingDate,
      timeSlot: bookingSlot,
      price: price,
      notes: bookingNotes.trim(),
      status: 'Confirmed',
      bookedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    const updated = [newSession, ...bookedSessions];
    await saveSessions(updated);

    setCompletedBookingDetails(newSession);
    setBookingStep(5); // Show Confirmation View
  };

  // CANCEL SESSION WITH PLATFORM POLICY
  const handleCancelSession = (session) => {
    Alert.alert(
      'Cancel Consultation',
      `Platform Cancellation Policy:\n\n• Cancellations made 4+ hours before the session receive a 100% full refund (₹${session.price}).\n• The slot will be released back to the community.\n\nDo you wish to proceed?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Confirm Cancellation',
          style: 'destructive',
          onPress: async () => {
            const updated = bookedSessions.filter((s) => s.id !== session.id);
            await saveSessions(updated);
            Alert.alert(
              'Booking Cancelled',
              `Your session with ${session.guideName} has been cancelled. A refund of ₹${session.price} will be credited to your original payment mode within 24-48 hours.`
            );
          },
        },
      ]
    );
  };

  // INITIATE RESCHEDULE
  const handleOpenReschedule = (session) => {
    setRescheduleSession(session);
    setNewRescheduleDate('Tomorrow');
    setNewRescheduleSlot('6:00 PM');
    setRescheduleModalVisible(true);
  };

  // CONFIRM RESCHEDULE
  const handleConfirmReschedule = async () => {
    if (!rescheduleSession) return;

    const updated = bookedSessions.map((s) =>
      s.id === rescheduleSession.id
        ? {
            ...s,
            date: newRescheduleDate,
            timeSlot: newRescheduleSlot,
            status: 'Rescheduled',
          }
        : s
    );

    await saveSessions(updated);
    setRescheduleModalVisible(false);
    Alert.alert(
      'Session Rescheduled! 🌿',
      `Your consultation with ${rescheduleSession.guideName} has been rescheduled to ${newRescheduleDate} at ${newRescheduleSlot}.`
    );
  };

  // ATTEND THE SESSION (Step 8)
  const handleAttendSession = (session) => {
    setLiveSession(session);
    setLiveChatMessages([
      {
        id: '1',
        sender: 'guide',
        text: `Welcome, Explorer. I'm ${session.guideName}. Whenever you are settled, take a breath. We are in a safe, encrypted room together.`,
        time: 'Just now',
      },
    ]);
    setLiveChatInput('');
    setIsMuted(false);
    setIsVideoOff(false);
    setLiveRoomVisible(true);
  };

  const handleSendLiveMessage = () => {
    const trimmed = liveChatInput.trim();
    if (!trimmed) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      time: 'Now',
    };
    setLiveChatMessages((prev) => [...prev, newMsg]);
    setLiveChatInput('');

    setTimeout(() => {
      setLiveChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'guide',
          text: 'I understand. Let us unpack that together. How has that been feeling in your body today?',
          time: 'Now',
        },
      ]);
    }, 1500);
  };

  // FILTERED PROFESSIONALS LIST
  const filteredProfessionals = PROFESSIONALS_DATA.filter((p) => {
    // Specialisation filter
    if (
      selectedSpecialisation !== 'All' &&
      p.specialisation !== selectedSpecialisation
    ) {
      return false;
    }
    // Language filter
    if (
      selectedLanguage !== 'All Languages' &&
      !p.languages.includes(selectedLanguage)
    ) {
      return false;
    }
    // Availability filter
    if (selectedAvailability !== 'Any Time') {
      if (selectedAvailability === 'Available Today' && p.availabilityTag !== 'Available Today') {
        return false;
      }
      if (selectedAvailability === 'This Weekend' && p.availabilityTag !== 'This Weekend') {
        return false;
      }
      if (selectedAvailability === 'Evening Slots' && p.availabilityTag !== 'Evening Slots') {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchQual = p.qualifications.toLowerCase().includes(q);
      const matchFocus = p.clinicalFocus.some((f) => f.toLowerCase().includes(q));
      return matchName || matchTitle || matchQual || matchFocus;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Mental Health Guides</Text>
          <Text style={styles.headerSubtitle}>
            Discover certified psychologists, therapists & counselors
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={20} color="#62417D" />
          {(selectedLanguage !== 'All Languages' || selectedAvailability !== 'Any Time') && (
            <View style={styles.filterBadgeIndicator} />
          )}
        </TouchableOpacity>
      </View>

      {/* TOP TAB SWITCHER (Browse Guides vs My Bookings) */}
      <View style={styles.topTabsContainer}>
        <TouchableOpacity
          style={[styles.topTabBtn, activeTab === 'browse' && styles.topTabBtnActive]}
          onPress={() => setActiveTab('browse')}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={activeTab === 'browse' ? '#62417D' : '#8C8298'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.topTabBtnText,
              activeTab === 'browse' && styles.topTabBtnTextActive,
            ]}
          >
            Find a Guide
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.topTabBtn,
            activeTab === 'my-sessions' && styles.topTabBtnActive,
          ]}
          onPress={() => setActiveTab('my-sessions')}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={activeTab === 'my-sessions' ? '#62417D' : '#8C8298'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.topTabBtnText,
              activeTab === 'my-sessions' && styles.topTabBtnTextActive,
            ]}
          >
            My Bookings {bookedSessions.length > 0 ? `(${bookedSessions.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'browse' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 3.3 AI-ASSISTED MATCHING HERO BANNER */}
          <View style={styles.aiHeroBanner}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={styles.aiSparkleBadge}>
                <Ionicons name="sparkles" size={13} color="#62417D" style={{ marginRight: 4 }} />
                <Text style={styles.aiSparkleBadgeText}>AI-Assisted Matching</Text>
              </View>
              <Text style={styles.aiHeroTitle}>Find Your Ideal Guide</Text>
              <Text style={styles.aiHeroSub}>
                Answer 4 quick preferences to get rule-verified, personalized recommendations.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.aiMatchLaunchBtn}
              onPress={handleOpenAiMatching}
              activeOpacity={0.85}
            >
              <Text style={styles.aiMatchLaunchBtnText}>Get Matched</Text>
            </TouchableOpacity>
          </View>

          {/* AI MATCHED RESULTS PREVIEW (IF AVAILABLE) */}
          {aiRecommendations.length > 0 && (
            <View style={styles.matchedSectionWrapper}>
              <View style={styles.matchedSectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="sparkles" size={16} color="#8875B7" style={{ marginRight: 6 }} />
                  <Text style={styles.matchedSectionTitle}>AI Recommendations For You</Text>
                </View>
                <TouchableOpacity onPress={() => setAiRecommendations([])}>
                  <Text style={styles.clearMatchText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {aiRecommendations.map((guide) => (
                <View key={`match-${guide.id}`} style={styles.matchGuideCard}>
                  <View style={styles.matchScoreBadge}>
                    <Text style={styles.matchScoreText}>{guide.matchScore}% Match</Text>
                  </View>
                  <Text style={styles.matchGuideName}>{guide.name}</Text>
                  <Text style={styles.matchGuideRole}>{guide.title}</Text>
                  <Text style={styles.matchRationale}>"{guide.matchRationale}"</Text>
                  <View style={styles.matchActionRow}>
                    <Text style={styles.matchFeeText}>Starts at ₹{guide.pricing.audio}</Text>
                    <TouchableOpacity
                      style={styles.matchBookBtn}
                      onPress={() => handleStartBooking(guide)}
                    >
                      <Text style={styles.matchBookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* SEARCH INPUT */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#8F8599" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by specialty, condition, or guide name..."
              placeholderTextColor="#A89FB3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#8F8599" />
              </TouchableOpacity>
            )}
          </View>

          {/* ACTIVE FILTER BADGES */}
          {(selectedLanguage !== 'All Languages' || selectedAvailability !== 'Any Time') && (
            <View style={styles.activeFiltersRow}>
              {selectedLanguage !== 'All Languages' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterChipText}>{selectedLanguage}</Text>
                  <TouchableOpacity onPress={() => setSelectedLanguage('All Languages')}>
                    <Ionicons name="close" size={14} color="#62417D" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}
              {selectedAvailability !== 'Any Time' && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterChipText}>{selectedAvailability}</Text>
                  <TouchableOpacity onPress={() => setSelectedAvailability('Any Time')}>
                    <Ionicons name="close" size={14} color="#62417D" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* SPECIALISATION FILTER HORIZONTAL CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specScroll}
          >
            {SPECIALISATIONS.map((spec) => {
              const isSelected = selectedSpecialisation === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[styles.specChip, isSelected && styles.specChipActive]}
                  onPress={() => setSelectedSpecialisation(spec)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.specChipText,
                      isSelected && styles.specChipTextActive,
                    ]}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* GUIDES LIST */}
          <View style={styles.guidesList}>
            {filteredProfessionals.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={44} color="#8875B7" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No Guides Found</Text>
                <Text style={styles.emptySubtitle}>
                  Try relaxing your language or specialisation filters to see more available mental health professionals.
                </Text>
                <TouchableOpacity
                  style={styles.resetFiltersBtn}
                  onPress={() => {
                    setSelectedSpecialisation('All');
                    setSelectedLanguage('All Languages');
                    setSelectedAvailability('Any Time');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.resetFiltersBtnText}>Reset All Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredProfessionals.map((guide) => (
                <View key={guide.id} style={styles.guideCard}>
                  {/* Card Header: Avatar, Name, Title, Rating */}
                  <View style={styles.cardHeaderRow}>
                    <View
                      style={[
                        styles.guideAvatar,
                        { backgroundColor: guide.avatarColor },
                      ]}
                    >
                      <Ionicons name="person" size={26} color={guide.avatarIconColor} />
                    </View>

                    <View style={styles.guideHeaderMeta}>
                      <View style={styles.nameAndRatingRow}>
                        <Text style={styles.guideName}>{guide.name}</Text>
                        <View style={styles.ratingBox}>
                          <Ionicons name="star" size={12} color="#D99B26" style={{ marginRight: 3 }} />
                          <Text style={styles.ratingValue}>{guide.rating}</Text>
                          <Text style={styles.reviewCount}>({guide.reviewCount})</Text>
                        </View>
                      </View>

                      <Text style={styles.guideTitle}>{guide.title}</Text>
                      <Text style={styles.guideQuals} numberOfLines={1}>
                        {guide.qualifications}
                      </Text>
                    </View>
                  </View>

                  {/* Experience & Languages Pill Row */}
                  <View style={styles.metaBadgeRow}>
                    <View style={styles.badgePill}>
                      <Ionicons name="ribbon-outline" size={12} color="#62417D" style={{ marginRight: 4 }} />
                      <Text style={styles.badgePillText}>{guide.experience}</Text>
                    </View>

                    <View style={styles.badgePill}>
                      <Ionicons name="chatbubbles-outline" size={12} color="#62417D" style={{ marginRight: 4 }} />
                      <Text style={styles.badgePillText}>
                        {guide.languages.join(', ')}
                      </Text>
                    </View>

                    <View style={styles.availabilityBadge}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.availabilityBadgeText}>
                        {guide.availabilityTag}
                      </Text>
                    </View>
                  </View>

                  {/* Short Bio */}
                  <Text style={styles.guideBioText} numberOfLines={2}>
                    {guide.bio}
                  </Text>

                  {/* Session Types & Starting Pricing */}
                  <View style={styles.pricingSummaryRow}>
                    <View style={styles.pricingOptions}>
                      <View style={styles.priceItem}>
                        <Ionicons name="videocam-outline" size={14} color="#62417D" />
                        <Text style={styles.priceLabel}>Video: ₹{guide.pricing.video}</Text>
                      </View>
                      <View style={styles.priceItem}>
                        <Ionicons name="call-outline" size={14} color="#62417D" />
                        <Text style={styles.priceLabel}>Audio: ₹{guide.pricing.audio}</Text>
                      </View>
                      <View style={styles.priceItem}>
                        <Ionicons name="chatbubble-outline" size={14} color="#62417D" />
                        <Text style={styles.priceLabel}>Text: ₹{guide.pricing.text}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions: View Profile & Book */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.viewProfileBtn}
                      onPress={() => handleOpenProfile(guide)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewProfileBtnText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.bookSessionBtn}
                      onPress={() => handleStartBooking(guide)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="calendar-outline" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.bookSessionBtnText}>Book Session</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        /* MY BOOKINGS TAB */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {bookedSessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={44} color="#8875B7" />
              </View>
              <Text style={styles.emptyTitle}>No Consultations Booked</Text>
              <Text style={styles.emptySubtitle}>
                You haven't scheduled any sessions yet. Connect with a verified mental health professional when you're ready.
              </Text>
              <TouchableOpacity
                style={styles.findGuideBtn}
                onPress={() => setActiveTab('browse')}
              >
                <Text style={styles.findGuideBtnText}>Discover Guides</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookedSessions.map((session) => (
              <View key={session.id} style={styles.bookingCard}>
                {/* Header */}
                <View style={styles.bookingCardHeader}>
                  <View style={styles.bookingTypeBadge}>
                    <Ionicons
                      name={
                        session.sessionType === 'video'
                          ? 'videocam-outline'
                          : session.sessionType === 'audio'
                          ? 'call-outline'
                          : 'chatbubble-outline'
                      }
                      size={14}
                      color="#62417D"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.bookingTypeText}>
                      {session.sessionType === 'video'
                        ? 'Video Consultation'
                        : session.sessionType === 'audio'
                        ? 'Audio Call'
                        : 'Secure Text Session'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      session.status === 'Rescheduled'
                        ? styles.statusPillRescheduled
                        : styles.statusPillConfirmed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        session.status === 'Rescheduled'
                          ? styles.statusTextRescheduled
                          : styles.statusTextConfirmed,
                      ]}
                    >
                      {session.status}
                    </Text>
                  </View>
                </View>

                {/* Guide Info */}
                <Text style={styles.bookingGuideName}>{session.guideName}</Text>
                <Text style={styles.bookingGuideTitle}>{session.guideTitle}</Text>

                {/* Timing & Fee */}
                <View style={styles.timingAndFeeRow}>
                  <View style={styles.timingItem}>
                    <Ionicons name="time-outline" size={15} color="#8875B7" style={{ marginRight: 4 }} />
                    <Text style={styles.timingItemText}>
                      {session.date} at {session.timeSlot}
                    </Text>
                  </View>

                  <Text style={styles.feePaidText}>Paid: ₹{session.price}</Text>
                </View>

                {session.notes ? (
                  <View style={styles.bookingNotesBox}>
                    <Text style={styles.bookingNotesText}>
                      Focus: "{session.notes}"
                    </Text>
                  </View>
                ) : null}

                {/* Management Action Buttons: Attend (Step 8), Reschedule, Cancel */}
                <View style={styles.bookingActionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBookingBtn}
                    onPress={() => handleCancelSession(session)}
                  >
                    <Text style={styles.cancelBookingBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rescheduleBtn}
                    onPress={() => handleOpenReschedule(session)}
                  >
                    <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.attendBtn}
                    onPress={() => handleAttendSession(session)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="enter-outline" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.attendBtnText}>Join Session</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* =========================================================================
          GUIDE DETAILED PROFILE MODAL
         ========================================================================= */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity
              onPress={() => setProfileModalVisible(false)}
              style={styles.modalCloseCircle}
            >
              <Ionicons name="arrow-back" size={24} color="#62417D" />
            </TouchableOpacity>
            <Text style={styles.fullModalTitle}>Professional Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {selectedProfileGuide && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.profileScrollContent}
            >
              <View style={styles.profileHero}>
                <View
                  style={[
                    styles.largeAvatar,
                    { backgroundColor: selectedProfileGuide.avatarColor },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={46}
                    color={selectedProfileGuide.avatarIconColor}
                  />
                </View>

                <Text style={styles.profileName}>{selectedProfileGuide.name}</Text>
                <Text style={styles.profileTitle}>{selectedProfileGuide.title}</Text>

                <View style={styles.profileRatingRow}>
                  <Ionicons name="star" size={15} color="#D99B26" style={{ marginRight: 4 }} />
                  <Text style={styles.profileRatingText}>
                    {selectedProfileGuide.rating} rating ({selectedProfileGuide.reviewCount} Explorer reviews)
                  </Text>
                </View>
              </View>

              {/* Qualifications & Experience */}
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionHeading}>Qualifications & Credentials</Text>
                <View style={styles.qualRow}>
                  <Ionicons name="school-outline" size={18} color="#62417D" style={{ marginRight: 8 }} />
                  <Text style={styles.qualText}>{selectedProfileGuide.qualifications}</Text>
                </View>
                <View style={styles.qualRow}>
                  <Ionicons name="medal-outline" size={18} color="#62417D" style={{ marginRight: 8 }} />
                  <Text style={styles.qualText}>{selectedProfileGuide.experience}</Text>
                </View>
                <View style={styles.qualRow}>
                  <Ionicons name="language-outline" size={18} color="#62417D" style={{ marginRight: 8 }} />
                  <Text style={styles.qualText}>
                    Fluently speaks {selectedProfileGuide.languages.join(', ')}
                  </Text>
                </View>
              </View>

              {/* Biography */}
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionHeading}>Professional Biography</Text>
                <Text style={styles.profileBioText}>{selectedProfileGuide.bio}</Text>
              </View>

              {/* Clinical Focus */}
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionHeading}>Clinical Focus & Specialties</Text>
                {selectedProfileGuide.clinicalFocus.map((focus, idx) => (
                  <View key={idx} style={styles.focusItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#8875B7" style={{ marginRight: 8 }} />
                    <Text style={styles.focusItemText}>{focus}</Text>
                  </View>
                ))}
              </View>

              {/* Session Types & Fee Structure */}
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionHeading}>Session Types & Pricing</Text>
                <View style={styles.priceCardGrid}>
                  <View style={styles.priceTile}>
                    <Ionicons name="videocam" size={20} color="#62417D" />
                    <Text style={styles.priceTileTitle}>Video Session</Text>
                    <Text style={styles.priceTileDuration}>50 minutes</Text>
                    <Text style={styles.priceTileAmount}>₹{selectedProfileGuide.pricing.video}</Text>
                  </View>

                  <View style={styles.priceTile}>
                    <Ionicons name="call" size={20} color="#62417D" />
                    <Text style={styles.priceTileTitle}>Audio Call</Text>
                    <Text style={styles.priceTileDuration}>50 minutes</Text>
                    <Text style={styles.priceTileAmount}>₹{selectedProfileGuide.pricing.audio}</Text>
                  </View>

                  <View style={styles.priceTile}>
                    <Ionicons name="chatbubbles" size={20} color="#62417D" />
                    <Text style={styles.priceTileTitle}>Text Deep-Dive</Text>
                    <Text style={styles.priceTileDuration}>45 minutes</Text>
                    <Text style={styles.priceTileAmount}>₹{selectedProfileGuide.pricing.text}</Text>
                  </View>
                </View>
              </View>

              {/* Platform Guarantee */}
              <View style={styles.policyNoticeBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#62417D" style={{ marginRight: 8 }} />
                <Text style={styles.policyNoticeText}>
                  All SouLink Guides undergo rigorous identity, qualification, and background verification. 100% encrypted and confidential.
                </Text>
              </View>

              {/* Bottom Book Button */}
              <TouchableOpacity
                style={styles.profileBookBtn}
                onPress={() => handleStartBooking(selectedProfileGuide)}
                activeOpacity={0.8}
              >
                <Text style={styles.profileBookBtnText}>Book a Consultation</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* =========================================================================
          MULTI-STEP BOOKING MODAL (STEPS 1 - 7)
         ========================================================================= */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.fullModalContainer}
        >
          {/* Modal Header */}
          <View style={styles.fullModalHeader}>
            <TouchableOpacity
              onPress={() => {
                if (bookingStep > 1 && bookingStep < 5) {
                  setBookingStep(bookingStep - 1);
                } else {
                  setBookingModalVisible(false);
                }
              }}
              style={styles.modalCloseCircle}
            >
              <Ionicons
                name={bookingStep > 1 && bookingStep < 5 ? 'arrow-back' : 'close'}
                size={22}
                color="#62417D"
              />
            </TouchableOpacity>

            <Text style={styles.fullModalTitle}>
              {bookingStep === 1
                ? 'Select Session Type'
                : bookingStep === 2
                ? 'Date & Available Slot'
                : bookingStep === 3
                ? 'Review Booking'
                : bookingStep === 4
                ? 'Complete Payment'
                : 'Booking Confirmed'}
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {bookingGuide && (
            <ScrollView
              contentContainerStyle={styles.bookingStepContent}
              showsVerticalScrollIndicator={false}
            >
              {/* GUIDE INFO CHIP */}
              {bookingStep < 5 && (
                <View style={styles.guideSummaryRow}>
                  <View
                    style={[
                      styles.smallAvatar,
                      { backgroundColor: bookingGuide.avatarColor },
                    ]}
                  >
                    <Ionicons name="person" size={20} color={bookingGuide.avatarIconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.summaryGuideName}>{bookingGuide.name}</Text>
                    <Text style={styles.summaryGuideTitle}>{bookingGuide.title}</Text>
                  </View>
                </View>
              )}

              {/* STEP 1: SELECT SESSION TYPE */}
              {bookingStep === 1 && (
                <View>
                  <Text style={styles.stepHeading}>Step 1: Choose Session Format</Text>
                  <Text style={styles.stepDescription}>
                    Select how you would feel most comfortable communicating with your Guide.
                  </Text>

                  {[
                    {
                      id: 'video',
                      title: '1-on-1 Video Session',
                      duration: '50 Minutes',
                      price: bookingGuide.pricing.video,
                      desc: 'Face-to-face visual interaction via encrypted high-definition video.',
                      icon: 'videocam',
                    },
                    {
                      id: 'audio',
                      title: 'Private Audio Call',
                      duration: '50 Minutes',
                      price: bookingGuide.pricing.audio,
                      desc: 'Voice-only consultation. Ideal if you prefer talking without being on camera.',
                      icon: 'call',
                    },
                    {
                      id: 'text',
                      title: 'Real-time Text Consultation',
                      duration: '45 Minutes',
                      price: bookingGuide.pricing.text,
                      desc: 'Deep-dive interactive chat session at your own pace.',
                      icon: 'chatbubbles',
                    },
                  ].map((item) => {
                    const isSelected = bookingSessionType === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.sessionTypeChoiceCard,
                          isSelected && styles.sessionTypeChoiceCardSelected,
                        ]}
                        onPress={() => setBookingSessionType(item.id)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.sessionTypeIconCircle,
                            isSelected && { backgroundColor: '#62417D' },
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={isSelected ? '#FFFFFF' : '#62417D'}
                          />
                        </View>

                        <View style={{ flex: 1, marginRight: 8 }}>
                          <View style={styles.sessionChoiceTop}>
                            <Text style={styles.choiceTitle}>{item.title}</Text>
                            <Text style={styles.choicePrice}>₹{item.price}</Text>
                          </View>
                          <Text style={styles.choiceDuration}>{item.duration}</Text>
                          <Text style={styles.choiceDesc}>{item.desc}</Text>
                        </View>

                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSelected ? '#62417D' : '#C5B9D4'}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.continueStepBtn}
                    onPress={() => setBookingStep(2)}
                  >
                    <Text style={styles.continueStepBtnText}>Continue to Date & Time</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: SELECT DATE & TIME SLOT */}
              {bookingStep === 2 && (
                <View>
                  <Text style={styles.stepHeading}>Step 2: Select Date & Available Slot</Text>
                  <Text style={styles.stepDescription}>
                    Pick a convenient time when you will have a quiet, undisturbed space.
                  </Text>

                  {/* Dates Selection */}
                  <Text style={styles.subFieldLabel}>Available Days</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: 18 }}
                  >
                    {bookingGuide.availableDates.map((d) => {
                      const isSelected = bookingDate === d;
                      return (
                        <TouchableOpacity
                          key={d}
                          style={[
                            styles.datePickChip,
                            isSelected && styles.datePickChipActive,
                          ]}
                          onPress={() => setBookingDate(d)}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={isSelected ? '#FFFFFF' : '#62417D'}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            style={[
                              styles.datePickText,
                              isSelected && styles.datePickTextActive,
                            ]}
                          >
                            {d}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* Time Slots */}
                  <Text style={styles.subFieldLabel}>Available Time Slots</Text>
                  <View style={styles.slotGrid}>
                    {bookingGuide.slots.map((s) => {
                      const isSelected = bookingSlot === s;
                      return (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.slotTile,
                            isSelected && styles.slotTileActive,
                          ]}
                          onPress={() => setBookingSlot(s)}
                        >
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={isSelected ? '#FFFFFF' : '#62417D'}
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={[
                              styles.slotTileText,
                              isSelected && styles.slotTileTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Optional Notes for Guide */}
                  <Text style={styles.subFieldLabel}>Reason for Consultation (Optional)</Text>
                  <TextInput
                    style={styles.notesInputField}
                    placeholder="Briefly describe what's on your mind (e.g., anxiety attacks, relationship distress, feeling stuck)..."
                    placeholderTextColor="#A89FB3"
                    value={bookingNotes}
                    onChangeText={setBookingNotes}
                    multiline
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={styles.continueStepBtn}
                    onPress={() => setBookingStep(3)}
                  >
                    <Text style={styles.continueStepBtnText}>Review Booking</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 3: REVIEW BOOKING & PLATFORM POLICIES */}
              {bookingStep === 3 && (
                <View>
                  <Text style={styles.stepHeading}>Step 3: Review Consultation Summary</Text>
                  <Text style={styles.stepDescription}>
                    Please double-check your booking parameters before proceeding to payment.
                  </Text>

                  <View style={styles.reviewCard}>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Guide:</Text>
                      <Text style={styles.reviewValue}>{bookingGuide.name}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Specialty:</Text>
                      <Text style={styles.reviewValue}>{bookingGuide.specialisation}</Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Session Type:</Text>
                      <Text style={styles.reviewValue}>
                        {bookingSessionType === 'video'
                          ? '1-on-1 Video Call'
                          : bookingSessionType === 'audio'
                          ? 'Private Audio Call'
                          : 'Text Consultation'}
                      </Text>
                    </View>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Date & Time:</Text>
                      <Text style={styles.reviewValue}>
                        {bookingDate} at {bookingSlot}
                      </Text>
                    </View>
                    {bookingNotes ? (
                      <View style={styles.reviewRow}>
                        <Text style={styles.reviewLabel}>Notes:</Text>
                        <Text style={styles.reviewValue}>{bookingNotes}</Text>
                      </View>
                    ) : null}

                    <View style={styles.reviewDivider} />

                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewTotalLabel}>Total Amount:</Text>
                      <Text style={styles.reviewTotalAmount}>
                        ₹{bookingGuide.pricing[bookingSessionType]}
                      </Text>
                    </View>
                  </View>

                  {/* Platform Policy Notice */}
                  <View style={styles.policyNoticeBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#62417D" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.policyHeading}>Platform Cancellation & Reschedule Policy</Text>
                      <Text style={styles.policyBody}>
                        • Free cancellation or reschedule up to 4 hours before the session.
                        • 100% refund credited immediately upon cancellation.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.continueStepBtn}
                    onPress={() => setBookingStep(4)}
                  >
                    <Text style={styles.continueStepBtnText}>Proceed to Payment</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 4: COMPLETE PAYMENT */}
              {bookingStep === 4 && (
                <View>
                  <Text style={styles.stepHeading}>Step 4: Complete Payment</Text>
                  <Text style={styles.stepDescription}>
                    Safe & secure 256-bit encrypted checkout.
                  </Text>

                  <View style={styles.paymentTotalCard}>
                    <Text style={styles.payTotalLabel}>Amount Payable</Text>
                    <Text style={styles.payTotalAmount}>
                      ₹{bookingGuide.pricing[bookingSessionType]}
                    </Text>
                  </View>

                  {/* Payment Method Selector */}
                  {[
                    { id: 'upi', label: 'Instant UPI (Google Pay, PhonePe, Paytm)', icon: 'flash' },
                    { id: 'card', label: 'Credit / Debit Card (Visa, MasterCard)', icon: 'card' },
                    { id: 'netbanking', label: 'Net Banking (All Major Indian Banks)', icon: 'business' },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        style={[
                          styles.paymentOptionCard,
                          isSelected && styles.paymentOptionCardSelected,
                        ]}
                        onPress={() => setPaymentMethod(m.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={m.icon}
                          size={18}
                          color={isSelected ? '#62417D' : '#8875B7'}
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          style={[
                            styles.paymentOptionText,
                            isSelected && styles.paymentOptionTextSelected,
                          ]}
                        >
                          {m.label}
                        </Text>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={isSelected ? '#62417D' : '#C5B9D4'}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.payNowBtn}
                    onPress={handleProcessPayment}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.payNowBtnText}>
                      Pay ₹{bookingGuide.pricing[bookingSessionType]} & Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 5: RECEIVE CONFIRMATION (STEP 7 IN OVERALL FLOW) */}
              {bookingStep === 5 && completedBookingDetails && (
                <View style={styles.confirmationContainer}>
                  <View style={styles.successCheckCircle}>
                    <Ionicons name="checkmark" size={44} color="#FFFFFF" />
                  </View>

                  <Text style={styles.confirmTitle}>Consultation Confirmed!</Text>
                  <Text style={styles.confirmSubtitle}>
                    Your session has been scheduled with {completedBookingDetails.guideName}.
                  </Text>

                  <View style={styles.ticketCard}>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Booking ID</Text>
                      <Text style={styles.ticketValue}>{completedBookingDetails.id}</Text>
                    </View>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Session Time</Text>
                      <Text style={styles.ticketValue}>
                        {completedBookingDetails.date} at {completedBookingDetails.timeSlot}
                      </Text>
                    </View>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Mode</Text>
                      <Text style={styles.ticketValue}>
                        {completedBookingDetails.sessionType.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Status</Text>
                      <Text style={[styles.ticketValue, { color: '#2D7B66' }]}>
                        {completedBookingDetails.status}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => {
                      setBookingModalVisible(false);
                      setActiveTab('my-sessions');
                    }}
                  >
                    <Text style={styles.doneBtnText}>View in My Bookings</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================================
          RESCHEDULE MODAL
         ========================================================================= */}
      <Modal
        visible={rescheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.rescheduleContent}>
            <View style={styles.rescheduleHeader}>
              <Text style={styles.rescheduleHeading}>Reschedule Consultation</Text>
              <TouchableOpacity onPress={() => setRescheduleModalVisible(false)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            {rescheduleSession && (
              <View>
                <Text style={styles.rescheduleSub}>
                  Select a new date and time with {rescheduleSession.guideName}.
                </Text>

                <Text style={styles.subFieldLabel}>Select New Day</Text>
                <View style={{ flexDirection: 'row', marginBottom: 14 }}>
                  {['Tomorrow', 'Saturday', 'Sunday', 'Next Week'].map((d) => {
                    const isSelected = newRescheduleDate === d;
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.datePickChip,
                          isSelected && styles.datePickChipActive,
                        ]}
                        onPress={() => setNewRescheduleDate(d)}
                      >
                        <Text
                          style={[
                            styles.datePickText,
                            isSelected && styles.datePickTextActive,
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.subFieldLabel}>Select New Slot</Text>
                <View style={styles.slotGrid}>
                  {['11:00 AM', '3:00 PM', '5:30 PM', '7:00 PM'].map((s) => {
                    const isSelected = newRescheduleSlot === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.slotTile,
                          isSelected && styles.slotTileActive,
                        ]}
                        onPress={() => setNewRescheduleSlot(s)}
                      >
                        <Text
                          style={[
                            styles.slotTileText,
                            isSelected && styles.slotTileTextActive,
                          ]}
                        >
                          {s}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.confirmRescheduleBtn}
                  onPress={handleConfirmReschedule}
                >
                  <Text style={styles.confirmRescheduleBtnText}>Confirm New Time</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          ATTEND SESSION (STEP 8: LIVE CONSULTATION ROOM)
         ========================================================================= */}
      <Modal
        visible={liveRoomVisible}
        animationType="slide"
        onRequestClose={() => setLiveRoomVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.liveRoomContainer}
        >
          {/* Room Header */}
          <View style={styles.liveRoomHeader}>
            <TouchableOpacity
              onPress={() => setLiveRoomVisible(false)}
              style={styles.liveLeaveBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#62417D" />
            </TouchableOpacity>

            {liveSession && (
              <View style={styles.liveHeaderMeta}>
                <Text style={styles.liveHeaderTitle}>{liveSession.guideName}</Text>
                <View style={styles.liveStatusRow}>
                  <View style={styles.liveGreenDot} />
                  <Text style={styles.liveStatusText}>Encrypted Live Room</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'End Consultation',
                  'Are you sure you want to end this active session?',
                  [
                    { text: 'Stay', style: 'cancel' },
                    { text: 'End Session', style: 'destructive', onPress: () => setLiveRoomVisible(false) },
                  ]
                );
              }}
              style={styles.endCallCircle}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video / Call Preview Canvas */}
          <View style={styles.liveMediaCanvas}>
            <View style={styles.remoteGuideFeed}>
              <Ionicons
                name={isVideoOff ? 'videocam-off' : 'person'}
                size={54}
                color="#62417D"
              />
              <Text style={styles.remoteGuideFeedName}>
                {liveSession ? liveSession.guideName : 'Guide'}
              </Text>
            </View>

            {/* Media Toggles */}
            <View style={styles.mediaControlsRow}>
              <TouchableOpacity
                style={[styles.mediaControlBtn, isMuted && styles.mediaControlBtnOff]}
                onPress={() => setIsMuted(!isMuted)}
              >
                <Ionicons
                  name={isMuted ? 'mic-off' : 'mic'}
                  size={20}
                  color={isMuted ? '#FFFFFF' : '#62417D'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaControlBtn, isVideoOff && styles.mediaControlBtnOff]}
                onPress={() => setIsVideoOff(!isVideoOff)}
              >
                <Ionicons
                  name={isVideoOff ? 'videocam-off' : 'videocam'}
                  size={20}
                  color={isVideoOff ? '#FFFFFF' : '#62417D'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Interactive Live Chat Inside Session */}
          <ScrollView
            style={styles.liveChatScroll}
            contentContainerStyle={styles.liveChatContent}
          >
            {liveChatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    isUser ? styles.chatBubbleUser : styles.chatBubbleGuide,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatBubbleText,
                      isUser ? styles.chatTextUser : styles.chatTextGuide,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text style={styles.chatTime}>{msg.time}</Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.liveInputBar}>
            <TextInput
              style={styles.liveTextInput}
              placeholder="Send message to Guide..."
              placeholderTextColor="#A89FB3"
              value={liveChatInput}
              onChangeText={setLiveChatInput}
            />
            <TouchableOpacity
              onPress={handleSendLiveMessage}
              style={styles.liveSendBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================================
          FILTER DRAWER / MODAL (Languages & Availability)
         ========================================================================= */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.filterModalContent}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalHeading}>Filter Guides</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Language Filter */}
              <Text style={styles.filterSectionTitle}>Languages Spoken</Text>
              <View style={styles.filterGrid}>
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.filterOptionChip,
                        isSelected && styles.filterOptionChipSelected,
                      ]}
                      onPress={() => setSelectedLanguage(lang)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          isSelected && styles.filterOptionTextSelected,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Availability Filter */}
              <Text style={styles.filterSectionTitle}>Availability</Text>
              <View style={styles.filterGrid}>
                {AVAILABILITY_OPTIONS.map((avail) => {
                  const isSelected = selectedAvailability === avail;
                  return (
                    <TouchableOpacity
                      key={avail}
                      style={[
                        styles.filterOptionChip,
                        isSelected && styles.filterOptionChipSelected,
                      ]}
                      onPress={() => setSelectedAvailability(avail)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          isSelected && styles.filterOptionTextSelected,
                        ]}
                      >
                        {avail}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.applyFilterBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFilterBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          3.3 AI-ASSISTED MATCHING MODAL (QUESTIONNAIRE & HYBRID RESULTS)
         ========================================================================= */}
      <Modal
        visible={aiMatchingModalVisible}
        animationType="slide"
        onRequestClose={() => setAiMatchingModalVisible(false)}
      >
        <View style={styles.fullModalContainer}>
          <View style={styles.fullModalHeader}>
            <TouchableOpacity
              onPress={() => setAiMatchingModalVisible(false)}
              style={styles.modalCloseCircle}
            >
              <Ionicons name="close" size={22} color="#62417D" />
            </TouchableOpacity>

            <Text style={styles.fullModalTitle}>
              {matchingStep === 1 ? 'Personalized Guide Matching' : 'Your Recommended Guides'}
            </Text>

            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.aiModalContent}
          >
            {matchingStep === 1 ? (
              <View>
                <View style={styles.aiModalHero}>
                  <View style={styles.aiSparkleCircle}>
                    <Ionicons name="sparkles" size={24} color="#62417D" />
                  </View>
                  <Text style={styles.aiModalHeading}>Help Us Understand Your Needs</Text>
                  <Text style={styles.aiModalSub}>
                    Answer these 5 brief preferences. Our hybrid system matches clinical specializations, availability, and languages to recommend your best-fit Guide.
                  </Text>
                </View>

                {/* Q1: Support Type */}
                <Text style={styles.aiQuestionLabel}>1. What kind of support are you looking for?</Text>
                <View style={styles.aiChoiceGrid}>
                  {SPECIALISATIONS.filter((s) => s !== 'All').map((spec) => {
                    const isSelected = aiMatchAnswers.supportType === spec;
                    return (
                      <TouchableOpacity
                        key={spec}
                        style={[
                          styles.aiChoiceTile,
                          isSelected && styles.aiChoiceTileSelected,
                        ]}
                        onPress={() =>
                          setAiMatchAnswers({ ...aiMatchAnswers, supportType: spec })
                        }
                      >
                        <Text
                          style={[
                            styles.aiChoiceTileText,
                            isSelected && styles.aiChoiceTileTextSelected,
                          ]}
                        >
                          {spec}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Q2: Preferred Language */}
                <Text style={styles.aiQuestionLabel}>2. Preferred Language</Text>
                <View style={styles.aiChoiceGrid}>
                  {LANGUAGES.map((lang) => {
                    const isSelected = aiMatchAnswers.language === lang;
                    return (
                      <TouchableOpacity
                        key={lang}
                        style={[
                          styles.aiChoiceTile,
                          isSelected && styles.aiChoiceTileSelected,
                        ]}
                        onPress={() =>
                          setAiMatchAnswers({ ...aiMatchAnswers, language: lang })
                        }
                      >
                        <Text
                          style={[
                            styles.aiChoiceTileText,
                            isSelected && styles.aiChoiceTileTextSelected,
                          ]}
                        >
                          {lang}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Q3: Session Format */}
                <Text style={styles.aiQuestionLabel}>3. Preferred Session Format</Text>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  {[
                    { id: 'video', label: 'Video Call', icon: 'videocam' },
                    { id: 'audio', label: 'Audio Call', icon: 'call' },
                    { id: 'text', label: 'Text Session', icon: 'chatbubbles' },
                  ].map((fmt) => {
                    const isSelected = aiMatchAnswers.sessionType === fmt.id;
                    return (
                      <TouchableOpacity
                        key={fmt.id}
                        style={[
                          styles.aiFormatCard,
                          isSelected && styles.aiFormatCardSelected,
                        ]}
                        onPress={() =>
                          setAiMatchAnswers({ ...aiMatchAnswers, sessionType: fmt.id })
                        }
                      >
                        <Ionicons
                          name={fmt.icon}
                          size={18}
                          color={isSelected ? '#62417D' : '#8875B7'}
                        />
                        <Text
                          style={[
                            styles.aiFormatText,
                            isSelected && styles.aiFormatTextSelected,
                          ]}
                        >
                          {fmt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Q4: Guide Characteristics / Approach */}
                <Text style={styles.aiQuestionLabel}>4. Preferred Therapeutic Approach</Text>
                <View style={styles.aiChoiceGrid}>
                  {[
                    'Gentle & CBT-Focused',
                    'Somatic & Breathwork',
                    'Practical & Solution-Oriented',
                    'Compassionate & Reflective',
                  ].map((app) => {
                    const isSelected = aiMatchAnswers.approach === app;
                    return (
                      <TouchableOpacity
                        key={app}
                        style={[
                          styles.aiChoiceTile,
                          isSelected && styles.aiChoiceTileSelected,
                        ]}
                        onPress={() =>
                          setAiMatchAnswers({ ...aiMatchAnswers, approach: app })
                        }
                      >
                        <Text
                          style={[
                            styles.aiChoiceTileText,
                            isSelected && styles.aiChoiceTileTextSelected,
                          ]}
                        >
                          {app}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Q5: Availability */}
                <Text style={styles.aiQuestionLabel}>5. Availability Preference</Text>
                <View style={styles.aiChoiceGrid}>
                  {AVAILABILITY_OPTIONS.map((avail) => {
                    const isSelected = aiMatchAnswers.availability === avail;
                    return (
                      <TouchableOpacity
                        key={avail}
                        style={[
                          styles.aiChoiceTile,
                          isSelected && styles.aiChoiceTileSelected,
                        ]}
                        onPress={() =>
                          setAiMatchAnswers({ ...aiMatchAnswers, availability: avail })
                        }
                      >
                        <Text
                          style={[
                            styles.aiChoiceTileText,
                            isSelected && styles.aiChoiceTileTextSelected,
                          ]}
                        >
                          {avail}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Clinical Disclaimer (Rule 3.3) */}
                <View style={styles.aiDisclaimerBox}>
                  <Ionicons name="information-circle-outline" size={18} color="#62417D" style={{ marginRight: 8 }} />
                  <Text style={styles.aiDisclaimerText}>
                    AI matching assists Explorers based on preferences. AI does not independently diagnose clinical conditions or alter professional qualifications.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.findMatchBtn}
                  onPress={handleRunAiMatching}
                  activeOpacity={0.85}
                >
                  <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.findMatchBtnText}>Find My Match</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* STEP 2: HYBRID MATCHED RESULTS */
              <View>
                <View style={styles.aiModalHero}>
                  <View style={[styles.aiSparkleCircle, { backgroundColor: '#EDF8F4' }]}>
                    <Ionicons name="checkmark-done" size={26} color="#2D7B66" />
                  </View>
                  <Text style={styles.aiModalHeading}>Matched Mental Health Professionals</Text>
                  <Text style={styles.aiModalSub}>
                    Based on your preference for {aiMatchAnswers.supportType} and {aiMatchAnswers.language} support, these certified professionals are your closest clinical match.
                  </Text>
                </View>

                {aiRecommendations.map((guide, idx) => (
                  <View key={`rec-${guide.id}`} style={styles.aiResultCard}>
                    <View style={styles.aiResultHeader}>
                      <View style={styles.aiScoreBadge}>
                        <Ionicons name="sparkles" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.aiScoreText}>{guide.matchScore}% Match</Text>
                      </View>
                      <Text style={styles.aiTopPickBadge}>Top Pick #{idx + 1}</Text>
                    </View>

                    <Text style={styles.aiGuideName}>{guide.name}</Text>
                    <Text style={styles.aiGuideTitle}>{guide.title}</Text>
                    <Text style={styles.aiGuideRationale}>"{guide.matchRationale}"</Text>

                    <View style={styles.aiGuideMetaPills}>
                      <View style={styles.aiPill}>
                        <Text style={styles.aiPillText}>{guide.experience}</Text>
                      </View>
                      <View style={styles.aiPill}>
                        <Text style={styles.aiPillText}>{guide.languages.join(', ')}</Text>
                      </View>
                      <View style={[styles.aiPill, { backgroundColor: '#EDF8F4' }]}>
                        <Text style={[styles.aiPillText, { color: '#2D7B66' }]}>
                          {guide.availabilityTag}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.aiResultActionRow}>
                      <TouchableOpacity
                        style={styles.aiProfileBtn}
                        onPress={() => {
                          setAiMatchingModalVisible(false);
                          handleOpenProfile(guide);
                        }}
                      >
                        <Text style={styles.aiProfileBtnText}>View Profile</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.aiBookNowBtn}
                        onPress={() => {
                          setAiMatchingModalVisible(false);
                          handleStartBooking(guide);
                        }}
                      >
                        <Text style={styles.aiBookNowBtnText}>Book Consultation</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.browseAllGuidesBtn}
                  onPress={() => setAiMatchingModalVisible(false)}
                >
                  <Text style={styles.browseAllGuidesBtnText}>Browse All Approved Guides</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
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
  filterIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadgeIndicator: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#8875B7',
    position: 'absolute',
    top: 3,
    right: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  topTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F0EAF5',
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  topTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  topTabBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7E6E8D',
  },
  topTabBtnTextActive: {
    color: '#62417D',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#3A3440',
    padding: 0,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE5F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  activeFilterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#62417D',
  },
  specScroll: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  specChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFEE',
    marginRight: 8,
  },
  specChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  specChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#62417D',
  },
  specChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  guidesList: {
    paddingHorizontal: 20,
  },
  guideCard: {
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
  cardHeaderRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  guideAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guideHeaderMeta: {
    flex: 1,
  },
  nameAndRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E6F18',
  },
  reviewCount: {
    fontSize: 10,
    color: '#A19175',
    marginLeft: 2,
  },
  guideTitle: {
    fontSize: 12,
    color: '#62417D',
    fontWeight: '600',
    marginTop: 2,
  },
  guideQuals: {
    fontSize: 11,
    color: '#82758D',
    marginTop: 2,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    color: '#554C60',
    fontWeight: '500',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF8F4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D7B66',
    marginRight: 5,
  },
  availabilityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D7B66',
  },
  guideBioText: {
    fontSize: 12,
    color: '#554C60',
    lineHeight: 18,
    marginBottom: 10,
  },
  pricingSummaryRow: {
    backgroundColor: '#FAF8FC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  pricingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#554C60',
    fontWeight: '600',
    marginLeft: 4,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewProfileBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F0EAF5',
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  bookSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#62417D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  bookSessionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#77717F',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  resetFiltersBtn: {
    backgroundColor: '#8875B7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resetFiltersBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  findGuideBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
  },
  findGuideBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // BOOKING CARD IN MY SESSIONS
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bookingTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#62417D',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillConfirmed: {
    backgroundColor: '#EDF8F4',
  },
  statusPillRescheduled: {
    backgroundColor: '#FFF5E6',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextConfirmed: {
    color: '#2D7B66',
  },
  statusTextRescheduled: {
    color: '#B5781B',
  },
  bookingGuideName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  bookingGuideTitle: {
    fontSize: 12,
    color: '#82758D',
    marginTop: 2,
    marginBottom: 8,
  },
  timingAndFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#554C60',
  },
  feePaidText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62417D',
  },
  bookingNotesBox: {
    backgroundColor: '#FAF8FC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  bookingNotesText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#77717F',
  },
  bookingActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4EFF7',
    paddingTop: 10,
  },
  cancelBookingBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  cancelBookingBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B34E6A',
  },
  rescheduleBtn: {
    backgroundColor: '#F0EAF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  attendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#62417D',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  attendBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // FULL MODAL STYLES (Profile & Multi-step booking)
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  fullModalHeader: {
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
  modalCloseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A3440',
  },
  profileScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A3440',
  },
  profileTitle: {
    fontSize: 13,
    color: '#62417D',
    fontWeight: '600',
    marginTop: 3,
  },
  profileRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  profileRatingText: {
    fontSize: 12,
    color: '#77717F',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  profileSectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 10,
  },
  qualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualText: {
    fontSize: 12,
    color: '#554C60',
    flex: 1,
  },
  profileBioText: {
    fontSize: 13,
    color: '#554C60',
    lineHeight: 20,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  focusItemText: {
    fontSize: 12,
    color: '#554C60',
  },
  priceCardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceTile: {
    flex: 1,
    backgroundColor: '#FAF8FC',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginHorizontal: 3,
  },
  priceTileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3A3440',
    marginTop: 6,
  },
  priceTileDuration: {
    fontSize: 10,
    color: '#8875B7',
    marginTop: 2,
  },
  priceTileAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62417D',
    marginTop: 4,
  },
  policyNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#F3EEF9',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  policyNoticeText: {
    fontSize: 11,
    color: '#62417D',
    flex: 1,
    lineHeight: 16,
  },
  profileBookBtn: {
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  profileBookBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // BOOKING PROCESS STYLES
  bookingStepContent: {
    padding: 20,
    paddingBottom: 40,
  },
  guideSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryGuideName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
  },
  summaryGuideTitle: {
    fontSize: 11,
    color: '#82758D',
  },
  stepHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#77717F',
    marginBottom: 16,
    lineHeight: 18,
  },
  sessionTypeChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#ECE7F2',
  },
  sessionTypeChoiceCardSelected: {
    borderColor: '#62417D',
    backgroundColor: '#FAF8FC',
  },
  sessionTypeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0EAF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionChoiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
  },
  choicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#62417D',
  },
  choiceDuration: {
    fontSize: 11,
    color: '#8875B7',
    fontWeight: '600',
    marginVertical: 2,
  },
  choiceDesc: {
    fontSize: 11,
    color: '#77717F',
    lineHeight: 16,
  },
  continueStepBtn: {
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 14,
  },
  continueStepBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62417D',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  datePickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 8,
  },
  datePickChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  datePickText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  datePickTextActive: {
    color: '#FFFFFF',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  slotTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  slotTileActive: {
    backgroundColor: '#8875B7',
    borderColor: '#8875B7',
  },
  slotTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  slotTileTextActive: {
    color: '#FFFFFF',
  },
  notesInputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#3A3440',
    minHeight: 70,
    marginBottom: 14,
  },

  // REVIEW & PAYMENT
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 12,
    color: '#77717F',
  },
  reviewValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A3440',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#F0EAF5',
    marginVertical: 10,
  },
  reviewTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
  },
  reviewTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#62417D',
  },
  policyHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62417D',
    marginBottom: 2,
  },
  policyBody: {
    fontSize: 11,
    color: '#62417D',
    lineHeight: 16,
  },
  paymentTotalCard: {
    backgroundColor: '#F3EEF9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  payTotalLabel: {
    fontSize: 12,
    color: '#77717F',
  },
  payTotalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#62417D',
    marginTop: 2,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#ECE7F2',
  },
  paymentOptionCardSelected: {
    borderColor: '#62417D',
    backgroundColor: '#FAF8FC',
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 12,
    color: '#554C60',
    fontWeight: '500',
  },
  paymentOptionTextSelected: {
    color: '#62417D',
    fontWeight: '700',
  },
  payNowBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 14,
  },
  payNowBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // CONFIRMATION VIEW
  confirmationContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  successCheckCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#2D7B66',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 6,
  },
  confirmSubtitle: {
    fontSize: 13,
    color: '#77717F',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginBottom: 24,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  ticketLabel: {
    fontSize: 12,
    color: '#82758D',
  },
  ticketValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3A3440',
  },
  doneBtn: {
    backgroundColor: '#62417D',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // RESCHEDULE MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  rescheduleContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  rescheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rescheduleHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
  },
  rescheduleSub: {
    fontSize: 12,
    color: '#77717F',
    marginBottom: 16,
  },
  confirmRescheduleBtn: {
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmRescheduleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // LIVE ROOM MODAL (STEP 8)
  liveRoomContainer: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  liveRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
  },
  liveLeaveBtn: {
    padding: 6,
    marginRight: 8,
  },
  liveHeaderMeta: {
    flex: 1,
  },
  liveHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  liveStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D7B66',
    marginRight: 5,
  },
  liveStatusText: {
    fontSize: 11,
    color: '#2D7B66',
    fontWeight: '600',
  },
  endCallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E04F78',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveMediaCanvas: {
    height: 190,
    backgroundColor: '#F3EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7F2',
  },
  remoteGuideFeed: {
    alignItems: 'center',
  },
  remoteGuideFeedName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A345B',
    marginTop: 8,
  },
  mediaControlsRow: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
  },
  mediaControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mediaControlBtnOff: {
    backgroundColor: '#E04F78',
  },
  liveChatScroll: {
    flex: 1,
  },
  liveChatContent: {
    padding: 16,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  chatBubbleGuide: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#62417D',
    borderBottomRightRadius: 4,
  },
  chatBubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chatTextGuide: {
    color: '#3A3440',
  },
  chatTextUser: {
    color: '#FFFFFF',
  },
  chatTime: {
    fontSize: 10,
    marginTop: 4,
    color: '#93899E',
    alignSelf: 'flex-end',
  },
  liveInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEAF5',
  },
  liveTextInput: {
    flex: 1,
    backgroundColor: '#FAF8FC',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#3A3440',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginRight: 10,
  },
  liveSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#62417D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // FILTER MODAL
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterModalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62417D',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterOptionChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionChipSelected: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#554C60',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  applyFilterBtn: {
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  applyFilterBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 3.3 AI-ASSISTED MATCHING STYLES
  aiHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF9',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8DEF0',
  },
  aiSparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  aiSparkleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#62417D',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  aiHeroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 2,
  },
  aiHeroSub: {
    fontSize: 11,
    color: '#77717F',
    lineHeight: 16,
  },
  aiMatchLaunchBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#62417D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  aiMatchLaunchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchedSectionWrapper: {
    marginHorizontal: 20,
    marginBottom: 14,
  },
  matchedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchedSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#62417D',
  },
  clearMatchText: {
    fontSize: 12,
    color: '#8875B7',
    fontWeight: '600',
  },
  matchGuideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#D4C5E2',
    position: 'relative',
  },
  matchScoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2D7B66',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchGuideName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A3440',
    paddingRight: 80,
  },
  matchGuideRole: {
    fontSize: 11,
    color: '#82758D',
    marginTop: 2,
    marginBottom: 6,
  },
  matchRationale: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#62417D',
    backgroundColor: '#FAF8FC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  matchActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchFeeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#554C60',
  },
  matchBookBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  matchBookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiModalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  aiModalHero: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  aiSparkleCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiModalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3440',
    textAlign: 'center',
    marginBottom: 4,
  },
  aiModalSub: {
    fontSize: 12,
    color: '#77717F',
    textAlign: 'center',
    lineHeight: 18,
  },
  aiQuestionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62417D',
    marginTop: 12,
    marginBottom: 8,
  },
  aiChoiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  aiChoiceTile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginRight: 6,
    marginBottom: 6,
  },
  aiChoiceTileSelected: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  aiChoiceTileText: {
    fontSize: 11,
    color: '#554C60',
    fontWeight: '500',
  },
  aiChoiceTileTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  aiFormatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    backgroundColor: '#FAF8FC',
    marginHorizontal: 3,
  },
  aiFormatCardSelected: {
    borderColor: '#62417D',
    backgroundColor: '#F3EEF9',
    borderWidth: 2,
  },
  aiFormatText: {
    fontSize: 11,
    color: '#554C60',
    fontWeight: '500',
    marginTop: 4,
  },
  aiFormatTextSelected: {
    color: '#62417D',
    fontWeight: '700',
  },
  aiDisclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF8FC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginTop: 14,
    marginBottom: 18,
    alignItems: 'center',
  },
  aiDisclaimerText: {
    fontSize: 11,
    color: '#77717F',
    flex: 1,
    lineHeight: 16,
  },
  findMatchBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62417D',
    paddingVertical: 14,
    borderRadius: 18,
  },
  findMatchBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#D4C5E2',
    shadowColor: '#4A3262',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  aiResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D7B66',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiTopPickBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8875B7',
  },
  aiGuideName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3440',
  },
  aiGuideTitle: {
    fontSize: 12,
    color: '#62417D',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  aiGuideRationale: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#554C60',
    backgroundColor: '#FAF8FC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    lineHeight: 17,
  },
  aiGuideMetaPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  aiPill: {
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#ECE7F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  aiPillText: {
    fontSize: 10,
    color: '#554C60',
    fontWeight: '500',
  },
  aiResultActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F4EFF7',
    paddingTop: 10,
  },
  aiProfileBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0EAF5',
  },
  aiProfileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#62417D',
  },
  aiBookNowBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  aiBookNowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  browseAllGuidesBtn: {
    backgroundColor: '#FAF8FC',
    borderWidth: 1,
    borderColor: '#D4C5E2',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  browseAllGuidesBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#62417D',
  },
});
