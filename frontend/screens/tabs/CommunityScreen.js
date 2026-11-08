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

// COMMUNITY TOPICS
const TOPICS = [
  'All',
  'Personal Stories',
  'Overcoming Anxiety',
  'Daily Gratitude',
  'Healing & Self-Love',
  'Seeking Advice',
];

// REPORT REASONS
const REPORT_REASONS = [
  'Harassment or Hate Speech',
  'Misleading Medical / Clinical Advice',
  'Self-Harm or Mental Health Crisis',
  'Inappropriate or Explicit Content',
  'Spam or Commercial Promotion',
];

// INITIAL SAMPLE POSTS FOR COMMUNITY
const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    authorName: 'Anonymous Explorer',
    isAnonymous: true,
    authorAvatarColor: '#E8DFF5',
    topic: 'Overcoming Anxiety',
    timestamp: '2 hours ago',
    content:
      'For the first time in 6 months, I went to a crowded grocery store without having a panic attack. I used the 5-4-3-2-1 grounding technique my Guide suggested. Just wanted to remind anyone struggling today that tiny steps add up. 💜',
    likesCount: 24,
    hasLiked: false,
    comments: [
      {
        id: 'c-1',
        author: 'Priya K.',
        text: 'So incredibly proud of you! Grounding techniques changed my life too.',
        time: '1 hour ago',
      },
      {
        id: 'c-2',
        author: 'Anonymous Explorer',
        text: 'Needed to read this today. Thank you for sharing your courage.',
        time: '45 mins ago',
      },
    ],
  },
  {
    id: 'post-2',
    authorName: 'Rohan Deshmukh',
    isAnonymous: false,
    authorAvatarColor: '#EDF8F4',
    topic: 'Daily Gratitude',
    timestamp: '4 hours ago',
    content:
      'Grateful for cold morning air, warm tea, and realizing that saying "no" to things that drain me is not selfish—it is self-preservation.',
    likesCount: 38,
    hasLiked: true,
    comments: [
      {
        id: 'c-3',
        author: 'Sneha M.',
        text: 'Healthy boundaries are the highest form of self-love. Love this reminder!',
        time: '3 hours ago',
      },
    ],
  },
  {
    id: 'post-3',
    authorName: 'Anonymous Explorer',
    isAnonymous: true,
    authorAvatarColor: '#FCEEF5',
    topic: 'Seeking Advice',
    timestamp: 'Yesterday',
    content:
      'How do you deal with the guilt of taking a complete rest day when your brain keeps whispering that you are being unproductive? Any gentle mantras that help?',
    likesCount: 19,
    hasLiked: false,
    comments: [
      {
        id: 'c-4',
        author: 'Kavita N.',
        text: '"Rest is not a reward you earn; it is a fundamental requirement to exist." Repeat it like a song.',
        time: '18 hours ago',
      },
    ],
  },
  {
    id: 'post-4',
    authorName: 'Arjun V.',
    isAnonymous: false,
    authorAvatarColor: '#FEF4ED',
    topic: 'Healing & Self-Love',
    timestamp: '2 days ago',
    content:
      'Healing is not linear. Yesterday I felt like I was back at square one, but today I realized I handled the sadness with so much more kindness towards myself than I did a year ago. That is real progress.',
    likesCount: 52,
    hasLiked: false,
    comments: [],
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [blockedUsers, setBlockedUsers] = useState([]);

  // CREATE POST MODAL
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTopic, setPostTopic] = useState('Personal Stories');
  const [isAnonymousPost, setIsAnonymousPost] = useState(false);

  // COMMENTS MODAL
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [activePostForComments, setActivePostForComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // REPORT POST MODAL
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportingPost, setReportingPost] = useState(null);
  const [selectedReportReason, setSelectedReportReason] = useState(REPORT_REASONS[0]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      const [savedPosts, savedBlocked] = await Promise.all([
        AsyncStorage.getItem('souLinkCommunityPosts'),
        AsyncStorage.getItem('souLinkBlockedUsers'),
      ]);

      if (savedBlocked) {
        setBlockedUsers(JSON.parse(savedBlocked));
      }

      if (savedPosts) {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      }

      // Default seed
      setPosts(INITIAL_COMMUNITY_POSTS);
      await AsyncStorage.setItem(
        'souLinkCommunityPosts',
        JSON.stringify(INITIAL_COMMUNITY_POSTS)
      );
    } catch (e) {
      console.log('Error loading community data:', e);
    }
  };

  const savePosts = async (updated) => {
    try {
      setPosts(updated);
      await AsyncStorage.setItem('souLinkCommunityPosts', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving community posts:', e);
    }
  };

  // LIKE POST TOGGLE
  const handleToggleLike = async (postId) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const newHasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: newHasLiked,
          likesCount: newHasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    await savePosts(updated);
  };

  // CREATE NEW POST (3.4 Anonymous / Identified Posting)
  const handleCreatePost = async () => {
    const trimmed = postContent.trim();
    if (!trimmed) {
      Alert.alert('Empty Post', 'Please write a reflection or question to share.');
      return;
    }

    // Retrieve user profile name if identified
    let authorName = 'Anonymous Explorer';
    if (!isAnonymousPost) {
      try {
        const savedProfile = await AsyncStorage.getItem('souLinkUserProfile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) authorName = parsed.name;
        }
      } catch (e) {}
      if (authorName === 'Anonymous Explorer') {
        authorName = 'Explorer';
      }
    }

    const newPost = {
      id: 'post-' + Date.now(),
      authorName: isAnonymousPost ? 'Anonymous Explorer' : authorName,
      isAnonymous: isAnonymousPost,
      authorAvatarColor: isAnonymousPost ? '#E8DFF5' : '#EDF8F4',
      topic: postTopic,
      timestamp: 'Just now',
      content: trimmed,
      likesCount: 0,
      hasLiked: false,
      comments: [],
    };

    const updated = [newPost, ...posts];
    await savePosts(updated);
    setPostContent('');
    setIsAnonymousPost(false);
    setCreateModalVisible(false);

    Alert.alert(
      'Shared with Community 💜',
      isAnonymousPost
        ? 'Your reflection was posted anonymously. Thank you for making SouLink a supportive space.'
        : 'Your post is now live. Thank you for sharing your experience.'
    );
  };

  // OPEN COMMENTS
  const handleOpenComments = (post) => {
    setActivePostForComments(post);
    setNewCommentText('');
    setCommentsModalVisible(true);
  };

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!activePostForComments) return;
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    let commenterName = 'Anonymous Explorer';
    try {
      const savedProfile = await AsyncStorage.getItem('souLinkUserProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) commenterName = parsed.name;
      }
    } catch (e) {}

    const newComment = {
      id: 'c-' + Date.now(),
      author: commenterName,
      text: trimmed,
      time: 'Just now',
    };

    const updated = posts.map((p) => {
      if (p.id === activePostForComments.id) {
        const updatedComments = [...p.comments, newComment];
        setActivePostForComments({ ...p, comments: updatedComments });
        return { ...p, comments: updatedComments };
      }
      return p;
    });

    await savePosts(updated);
    setNewCommentText('');
  };

  // OPEN REPORT MODAL
  const handleOpenReport = (post) => {
    setReportingPost(post);
    setSelectedReportReason(REPORT_REASONS[0]);
    setReportModalVisible(true);
  };

  // SUBMIT REPORT (3.4 Content Moderation)
  const handleSubmitReport = () => {
    if (!reportingPost) return;

    Alert.alert(
      'Report Submitted',
      `Thank you for keeping SouLink safe. Our moderation team will review this post for "${selectedReportReason}".`,
      [
        {
          text: 'OK',
          onPress: () => {
            setReportModalVisible(false);
            setReportingPost(null);
          },
        },
      ]
    );
  };

  // BLOCK USER (3.4 Block Users)
  const handleBlockUser = (post) => {
    if (post.isAnonymous) {
      Alert.alert(
        'Block Anonymous User',
        'Would you like to hide posts from this anonymous author on your feed?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Hide Posts',
            onPress: async () => {
              const updatedBlocked = [...blockedUsers, post.id];
              setBlockedUsers(updatedBlocked);
              await AsyncStorage.setItem(
                'souLinkBlockedUsers',
                JSON.stringify(updatedBlocked)
              );
              Alert.alert('User Blocked', 'Posts from this user have been hidden from your feed.');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        `Block ${post.authorName}?`,
        `You will no longer see posts or comments from ${post.authorName}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block User',
            style: 'destructive',
            onPress: async () => {
              const updatedBlocked = [...blockedUsers, post.authorName];
              setBlockedUsers(updatedBlocked);
              await AsyncStorage.setItem(
                'souLinkBlockedUsers',
                JSON.stringify(updatedBlocked)
              );
              Alert.alert('User Blocked', `${post.authorName} has been blocked.`);
            },
          },
        ]
      );
    }
  };

  // FILTERED POSTS (Exclude blocked users/posts)
  const filteredPosts = posts.filter((p) => {
    // Check block list
    if (p.isAnonymous && blockedUsers.includes(p.id)) return false;
    if (!p.isAnonymous && blockedUsers.includes(p.authorName)) return false;

    // Check topic
    if (selectedTopic !== 'All' && p.topic !== selectedTopic) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>SouLink Community</Text>
          <Text style={styles.headerSubtitle}>
            A compassionate space to share, listen & heal together
          </Text>
        </View>

        <TouchableOpacity
          style={styles.composeButton}
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={17} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.composeButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT MODERATION & SAFETY BANNER (3.4) */}
      <View style={styles.safetyBanner}>
        <Ionicons name="shield-checkmark" size={16} color="#62417D" style={{ marginRight: 6 }} />
        <Text style={styles.safetyBannerText}>
          Moderated Safe Space: Zero tolerance for harassment, judgment, or unverified medical advice.
        </Text>
      </View>

      {/* TOPIC / CIRCLE HORIZONTAL FILTER */}
      <View style={styles.topicsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicScroll}
        >
          {TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                style={[styles.topicChip, isSelected && styles.topicChipActive]}
                onPress={() => setSelectedTopic(topic)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.topicChipText,
                    isSelected && styles.topicChipTextActive,
                  ]}
                >
                  {topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* POSTS FEED */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="chatbubbles-outline" size={42} color="#8875B7" />
            </View>
            <Text style={styles.emptyTitle}>No Stories Here Yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to share an experience, a small daily victory, or gentle encouragement.
            </Text>
            <TouchableOpacity
              style={styles.firstPostBtn}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.firstPostBtnText}>Create the First Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header: Avatar, Name (Anonymous or Identified), Topic, Timestamp */}
              <View style={styles.postHeader}>
                <View
                  style={[
                    styles.postAvatar,
                    { backgroundColor: post.authorAvatarColor || '#E8DFF5' },
                  ]}
                >
                  <Ionicons
                    name={post.isAnonymous ? 'finger-print' : 'person'}
                    size={20}
                    color="#62417D"
                  />
                </View>

                <View style={styles.postHeaderMeta}>
                  <View style={styles.authorRow}>
                    <Text style={styles.postAuthorName}>{post.authorName}</Text>
                    {post.isAnonymous && (
                      <View style={styles.anonymousBadge}>
                        <Text style={styles.anonymousBadgeText}>Anonymous</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.topicAndDateRow}>
                    <Text style={styles.postTopicBadge}>{post.topic}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                  </View>
                </View>

                {/* More Options / Moderation (Report / Block) */}
                <TouchableOpacity
                  style={styles.moreOptionsBtn}
                  onPress={() => {
                    Alert.alert('Post Options', 'Select an action:', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Report Post',
                        style: 'destructive',
                        onPress: () => handleOpenReport(post),
                      },
                      {
                        text: `Block ${post.isAnonymous ? 'Author' : post.authorName}`,
                        style: 'destructive',
                        onPress: () => handleBlockUser(post),
                      },
                    ]);
                  }}
                >
                  <Ionicons name="ellipsis-horizontal" size={18} color="#9E94A7" />
                </TouchableOpacity>
              </View>

              {/* Post Content Text */}
              <Text style={styles.postContentText}>{post.content}</Text>

              {/* Card Footer: Like, Comment count, Share */}
              <View style={styles.postFooter}>
                <TouchableOpacity
                  style={styles.reactionBtn}
                  onPress={() => handleToggleLike(post.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={post.hasLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={post.hasLiked ? '#E04F78' : '#8A7E96'}
                  />
                  <Text
                    style={[
                      styles.reactionCountText,
                      post.hasLiked && { color: '#E04F78', fontWeight: '700' },
                    ]}
                  >
                    {post.likesCount}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reactionBtn}
                  onPress={() => handleOpenComments(post)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-outline" size={18} color="#8A7E96" />
                  <Text style={styles.reactionCountText}>
                    {post.comments ? post.comments.length : 0}
                  </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                  style={styles.flagBtn}
                  onPress={() => handleOpenReport(post)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="flag-outline" size={15} color="#B8ABB8" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* =========================================================================
          CREATE POST MODAL (ANONYMOUS & IDENTIFIED OPTIONS)
         ========================================================================= */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.createModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>

              <Text style={styles.modalHeading}>Share with Community</Text>

              <TouchableOpacity
                onPress={handleCreatePost}
                style={styles.modalPostBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalPostBtnText}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Posting Mode Selector (Anonymous vs Identified) */}
            <Text style={styles.sectionLabel}>Posting Identity</Text>
            <View style={styles.identityToggleRow}>
              <TouchableOpacity
                style={[
                  styles.identityOption,
                  !isAnonymousPost && styles.identityOptionActive,
                ]}
                onPress={() => setIsAnonymousPost(false)}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color={!isAnonymousPost ? '#62417D' : '#8A8095'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.identityOptionText,
                    !isAnonymousPost && styles.identityOptionTextActive,
                  ]}
                >
                  Post as Myself
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.identityOption,
                  isAnonymousPost && styles.identityOptionActive,
                ]}
                onPress={() => setIsAnonymousPost(true)}
              >
                <Ionicons
                  name="finger-print"
                  size={18}
                  color={isAnonymousPost ? '#62417D' : '#8A8095'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.identityOptionText,
                    isAnonymousPost && styles.identityOptionTextActive,
                  ]}
                >
                  Anonymous Explorer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Topic Selector */}
            <Text style={styles.sectionLabel}>Choose Topic</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginBottom: 14 }}
            >
              {TOPICS.filter((t) => t !== 'All').map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.topicPickChip,
                    postTopic === t && styles.topicPickChipActive,
                  ]}
                  onPress={() => setPostTopic(t)}
                >
                  <Text
                    style={[
                      styles.topicPickText,
                      postTopic === t && styles.topicPickTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Post Content Input */}
            <TextInput
              style={styles.postTextInput}
              placeholder="Share what is in your heart today... an encouragement, reflection, milestone, or vulnerability."
              placeholderTextColor="#B0A8BB"
              value={postContent}
              onChangeText={setPostContent}
              multiline
              textAlignVertical="top"
              autoFocus
            />

            {/* Safety Reminder */}
            <View style={styles.postRulesNotice}>
              <Ionicons name="information-circle-outline" size={16} color="#8875B7" style={{ marginRight: 6 }} />
              <Text style={styles.postRulesText}>
                Be compassionate. Avoid offering prescriptive clinical/medical advice.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================================
          COMMENTS MODAL
         ========================================================================= */}
      <Modal
        visible={commentsModalVisible}
        animationType="slide"
        onRequestClose={() => setCommentsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.commentsContainer}
        >
          <View style={styles.commentsHeader}>
            <TouchableOpacity
              onPress={() => setCommentsModalVisible(false)}
              style={styles.commentsBackBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#62417D" />
            </TouchableOpacity>
            <Text style={styles.commentsHeading}>Supportive Replies</Text>
            <View style={{ width: 36 }} />
          </View>

          {activePostForComments && (
            <ScrollView
              contentContainerStyle={styles.commentsScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Original Post Recap */}
              <View style={styles.originalPostRecap}>
                <Text style={styles.originalPostAuthor}>
                  {activePostForComments.authorName}
                </Text>
                <Text style={styles.originalPostContent}>
                  {activePostForComments.content}
                </Text>
              </View>

              {/* Comments List */}
              <Text style={styles.repliesSectionTitle}>Replies</Text>
              {activePostForComments.comments.length === 0 ? (
                <View style={styles.noCommentsBox}>
                  <Text style={styles.noCommentsText}>
                    No replies yet. Be the first to leave an encouraging word! 🌸
                  </Text>
                </View>
              ) : (
                activePostForComments.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentTopRow}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* Comment Input */}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a supportive reply..."
              placeholderTextColor="#A89FB3"
              value={newCommentText}
              onChangeText={setNewCommentText}
            />
            <TouchableOpacity
              style={styles.commentSendBtn}
              onPress={handleAddComment}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* =========================================================================
          CONTENT MODERATION: REPORT POST MODAL
         ========================================================================= */}
      <Modal
        visible={reportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Report Post</Text>
              <TouchableOpacity
                onPress={() => setReportModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#62417D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.reportSub}>
              Why are you reporting this content? Help us protect our community.
            </Text>

            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReportReason === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reportReasonRow,
                    isSelected && styles.reportReasonRowSelected,
                  ]}
                  onPress={() => setSelectedReportReason(reason)}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? '#62417D' : '#A89FB3'}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.reportReasonText,
                      isSelected && styles.reportReasonTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.submitReportBtn}
              onPress={handleSubmitReport}
            >
              <Text style={styles.submitReportBtnText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
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
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8875B7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: '#8875B7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  composeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF9',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DEF0',
  },
  safetyBannerText: {
    fontSize: 11,
    color: '#62417D',
    flex: 1,
    lineHeight: 15,
  },
  topicsWrapper: {
    marginBottom: 8,
  },
  topicScroll: {
    paddingHorizontal: 20,
  },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFEE',
    marginRight: 8,
  },
  topicChipActive: {
    backgroundColor: '#62417D',
    borderColor: '#62417D',
  },
  topicChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#62417D',
  },
  topicChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  feedContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 4,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postHeaderMeta: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
  },
  anonymousBadge: {
    backgroundColor: '#F3EEF9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  anonymousBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#62417D',
  },
  topicAndDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postTopicBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8875B7',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#BDB3C7',
    fontSize: 10,
  },
  postTimestamp: {
    fontSize: 11,
    color: '#93899E',
  },
  moreOptionsBtn: {
    padding: 4,
  },
  postContentText: {
    fontSize: 14,
    color: '#4A4252',
    lineHeight: 21,
    marginBottom: 14,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F4EFF7',
    paddingTop: 10,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    paddingVertical: 4,
  },
  reactionCountText: {
    fontSize: 12,
    color: '#6B6077',
    marginLeft: 5,
    fontWeight: '500',
  },
  flagBtn: {
    padding: 4,
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
  firstPostBtn: {
    backgroundColor: '#8875B7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  firstPostBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // CREATE MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  createModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
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
  modalPostBtn: {
    backgroundColor: '#62417D',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  modalPostBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62417D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  identityToggleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  identityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ECE7F2',
    backgroundColor: '#FAF8FC',
    marginHorizontal: 4,
  },
  identityOptionActive: {
    borderColor: '#62417D',
    backgroundColor: '#F3EEF9',
  },
  identityOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#554C60',
  },
  identityOptionTextActive: {
    color: '#62417D',
    fontWeight: '700',
  },
  topicPickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    backgroundColor: '#FAF8FC',
    marginRight: 8,
  },
  topicPickChipActive: {
    backgroundColor: '#8875B7',
    borderColor: '#8875B7',
  },
  topicPickText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#62417D',
  },
  topicPickTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  postTextInput: {
    backgroundColor: '#FAF8FC',
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: '#3A3440',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    lineHeight: 22,
    marginBottom: 14,
  },
  postRulesNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5FA',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  postRulesText: {
    fontSize: 11,
    color: '#77717F',
    flex: 1,
    lineHeight: 15,
  },

  // COMMENTS MODAL STYLES
  commentsContainer: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF5',
  },
  commentsBackBtn: {
    padding: 4,
  },
  commentsHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A3440',
  },
  commentsScrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  originalPostRecap: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE7F2',
    marginBottom: 20,
  },
  originalPostAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62417D',
    marginBottom: 4,
  },
  originalPostContent: {
    fontSize: 13,
    color: '#554C60',
    lineHeight: 19,
  },
  repliesSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A3440',
    marginBottom: 12,
  },
  noCommentsBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 13,
    color: '#8A8095',
    textAlign: 'center',
  },
  commentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE7F2',
  },
  commentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3A3440',
  },
  commentTime: {
    fontSize: 10,
    color: '#9E94A7',
  },
  commentText: {
    fontSize: 13,
    color: '#4A4252',
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEAF5',
  },
  commentInput: {
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
  commentSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#62417D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // REPORT MODAL STYLES
  reportModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  reportSub: {
    fontSize: 12,
    color: '#77717F',
    marginBottom: 16,
  },
  reportReasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFF7',
  },
  reportReasonRowSelected: {
    backgroundColor: '#FAF8FC',
  },
  reportReasonText: {
    fontSize: 13,
    color: '#554C60',
    flex: 1,
  },
  reportReasonTextSelected: {
    color: '#62417D',
    fontWeight: '700',
  },
  submitReportBtn: {
    backgroundColor: '#B33E5D',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  submitReportBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
