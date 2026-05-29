import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, ActivityIndicator,
  Platform, Modal, Animated, KeyboardAvoidingView, Dimensions, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../lib/supabase';

const INK        = '#2C1A0E';
const INK_SOFT   = '#6B4C35';
const WHITE      = '#FFFAF5';
const SAND       = '#E8C9A0';
const GREEN      = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const WARM       = '#D4956A';
const WARM_DARK  = '#A86E45';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CONFETTI_COLORS = ['#D4956A', '#E8C9A0', '#7BAE6E', '#C8D8E8', '#E8C8B8', '#2C1A0E', '#FFFAF5', '#F2C9A0'];

type Story = {
  id: number;
  name: string;
  cat_name: string;
  how_met: string;
  cat_description: string;
  memorable_story: string;
  best_part: string;
  photos: string | null;
  created_at: string;
};

const AVATAR_COLORS = ['#C4DDB0', '#C8D8E8', '#F2C9A0', '#E8C8B8', '#D4DDB0'];

const FIELDS = [
  { key: 'name',            label: 'Your Name',                       placeholder: 'e.g. Sarah',                       required: false, multiline: false },
  { key: 'cat_name',        label: "Your Cat's Name",                 placeholder: 'e.g. Maggy',                       required: true,  multiline: false },
  { key: 'how_met',         label: 'How did you meet your cat?',      placeholder: 'Tell us how you found each other…', required: false, multiline: true  },
  { key: 'cat_description', label: 'Describe your cat',               placeholder: 'What are they like?',              required: false, multiline: true  },
  { key: 'memorable_story', label: 'A memorable story',               placeholder: 'Something unforgettable…',         required: false, multiline: true  },
  { key: 'best_part',       label: 'Best part of being a cat parent', placeholder: 'What do you love most?',           required: false, multiline: true  },
];

function ConfettiPiece({ color, delay }: { color: string; delay: number }) {
  const y       = useRef(new Animated.Value(-20)).current;
  const x       = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y,      { toValue: screenHeight, duration: 2200 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(x,      { toValue: (Math.random() - 0.5) * 200 + Math.random() * screenWidth, duration: 2200 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: Math.random() > 0.5 ? 10 : -10, duration: 2200, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [-10, 10], outputRange: ['-360deg', '360deg'] });

  return (
    <Animated.View style={{
      position: 'absolute',
      width: Math.random() > 0.5 ? 10 : 7,
      height: Math.random() > 0.5 ? 10 : 7,
      borderRadius: Math.random() > 0.5 ? 5 : 0,
      backgroundColor: color,
      transform: [{ translateY: y }, { translateX: x }, { rotate: spin }],
      opacity,
      zIndex: 9999,
    }} />
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      {Array.from({ length: 60 }).map((_, i) => (
        <ConfettiPiece key={i} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} delay={i * 35} />
      ))}
    </>
  );
}

function AnimatedField({
  field, index, visible, value, onChange,
}: {
  field: typeof FIELDS[0];
  index: number;
  visible: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(16);
      Animated.sequence([
        Animated.delay(index * 50 + 100),
        Animated.parallel([
          Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.inputGroup, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.inputLabel}>
        {field.label}
        {field.required ? <Text style={{ color: WARM }}> *</Text> : ''}
      </Text>
      <TextInput
        style={[styles.input, field.multiline && styles.inputMultiline]}
        placeholder={field.placeholder}
        placeholderTextColor="rgba(44,26,14,0.25)"
        value={value}
        onChangeText={onChange}
        multiline={field.multiline}
        textAlignVertical={field.multiline ? 'top' : 'center'}
        returnKeyType={field.multiline ? 'default' : 'next'}
        blurOnSubmit={!field.multiline}
      />
    </Animated.View>
  );
}

function StoryCard({ item, index }: { item: Story; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const avatarColor = AVATAR_COLORS[item.id % AVATAR_COLORS.length];
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const hasAnyContent = item.how_met || item.memorable_story || item.cat_description || item.best_part;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.storyCard} onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
        <View style={styles.storyHeader}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{(item.name || 'A')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.storyMeta}>
            <Text style={styles.storyName}>{item.name || 'Anonymous'}</Text>
            <Text style={styles.storyCatBadge}>{item.cat_name}</Text>
          </View>
          <Text style={styles.expandIcon}>{expanded ? '↑' : '↓'}</Text>
        </View>

        {item.photos ? (
          <Image source={{ uri: item.photos }} style={styles.storyPhoto} resizeMode="cover" />
        ) : null}

        {!expanded && (
          item.how_met ? (
            <Text style={styles.storyPreview} numberOfLines={2}>{item.how_met}</Text>
          ) : item.memorable_story ? (
            <Text style={styles.storyPreview} numberOfLines={2}>{item.memorable_story}</Text>
          ) : item.cat_description ? (
            <Text style={styles.storyPreview} numberOfLines={2}>{item.cat_description}</Text>
          ) : item.best_part ? (
            <Text style={styles.storyPreview} numberOfLines={2}>{item.best_part}</Text>
          ) : null
        )}

        {expanded && (
          <View style={styles.expandedContent}>
            {item.how_met ? (
              <View style={styles.storySection}>
                <Text style={styles.storySectionLabel}>HOW WE MET</Text>
                <Text style={styles.storySectionText}>{item.how_met}</Text>
              </View>
            ) : null}
            {item.cat_description ? (
              <View style={styles.storySection}>
                <Text style={styles.storySectionLabel}>ABOUT {item.cat_name.toUpperCase()}</Text>
                <Text style={styles.storySectionText}>{item.cat_description}</Text>
              </View>
            ) : null}
            {item.memorable_story ? (
              <View style={styles.storySection}>
                <Text style={styles.storySectionLabel}>A MEMORABLE MOMENT</Text>
                <Text style={styles.storySectionText}>{item.memorable_story}</Text>
              </View>
            ) : null}
            {item.best_part ? (
              <View style={[styles.storySection, styles.bestPartSection]}>
                <Text style={styles.storySectionLabel}>BEST PART</Text>
                <Text style={styles.bestPartText}>"{item.best_part}"</Text>
              </View>
            ) : null}
            {!hasAnyContent && (
              <Text style={styles.noDescription}>No description</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function StoryModal({
  visible, onClose, onSubmit, loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (form: Record<string, string>, photoUrl: string | null) => Promise<void>;
  loading: boolean;
}) {
  const slideAnim    = useRef(new Animated.Value(700)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm]         = useState<Record<string, string>>({
    name: '', cat_name: '', how_met: '',
    cat_description: '', memorable_story: '', best_part: '',
  });
  const [photoUri, setPhotoUri]   = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim,    { toValue: 0, friction: 9, tension: 70, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,    { toValue: 700, duration: 240, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const uploadPhoto = async (uri: string): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append('file', { uri, name: fileName, type: 'image/jpeg' } as any);
      const { error } = await supabase.storage
        .from('cat-photos')
        .upload(fileName, formData, { contentType: 'multipart/form-data' });
      if (error) { console.log('upload error:', error); return null; }
      const { data } = supabase.storage.from('cat-photos').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (e) {
      console.log('upload exception:', e);
      return null;
    }
  };

  const canSubmit = form.cat_name.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    let photoUrl: string | null = null;
    if (photoUri) {
      setUploading(true);
      photoUrl = await uploadPhoto(photoUri);
      setUploading(false);
    }
    await onSubmit(form, photoUrl);
    setForm({ name: '', cat_name: '', how_met: '', cat_description: '', memorable_story: '', best_part: '' });
    setPhotoUri(null);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} pointerEvents="none" />
      <TouchableOpacity style={styles.backdropDismiss} activeOpacity={1} onPress={onClose} />

      <KeyboardAvoidingView
        style={styles.modalWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handleBar} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Share Your Story</Text>
              <Text style={styles.modalSub}>Answer as many or as few as you want</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {FIELDS.map((field, i) => (
              <AnimatedField
                key={field.key}
                field={field}
                index={i}
                visible={visible}
                value={form[field.key]}
                onChange={(v) => setForm(prev => ({ ...prev, [field.key]: v }))}
              />
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Photo <Text style={{ color: INK_SOFT, textTransform: 'none', letterSpacing: 0, fontWeight: '400' }}>(optional)</Text>
              </Text>
              <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto} activeOpacity={0.85}>
                {photoUri ? (
                  <>
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoOverlayText}>Tap to change</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.photoEmpty}>
                    <Text style={styles.photoEmptyIcon}>+</Text>
                    <Text style={styles.photoEmptyText}>Add a photo of your cat</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, (!canSubmit || uploading) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading || uploading || !canSubmit}
              activeOpacity={0.85}
            >
              {loading || uploading
                ? <ActivityIndicator color={WHITE} />
                : <Text style={styles.submitBtnText}>Share Story</Text>
              }
            </TouchableOpacity>
            <View style={{ height: 60 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function CatStories({ navigation }: { navigation: any }) {
  const [stories, setStories]           = useState<Story[]>([]);
  const [fetching, setFetching]         = useState(true);
  const [loading, setLoading]           = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal]       = useState(false);

  // Top to bottom: header → prompt → section
  const headerY   = useRef(new Animated.Value(-16)).current;
  const headerOp  = useRef(new Animated.Value(0)).current;
  const promptY   = useRef(new Animated.Value(20)).current;
  const promptOp  = useRef(new Animated.Value(0)).current;
  const sectionY  = useRef(new Animated.Value(20)).current;
  const sectionOp = useRef(new Animated.Value(0)).current;
  const bannerOp  = useRef(new Animated.Value(0)).current;
  const bannerY   = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.sequence([
      // 1 — header
      Animated.parallel([
        Animated.spring(headerY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(headerOp, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]),
      // 2 — share prompt
      Animated.parallel([
        Animated.spring(promptY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(promptOp, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]),
      // 3 — section header + cards
      Animated.parallel([
        Animated.spring(sectionY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(sectionOp, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const showSuccessBanner = () => {
    bannerOp.setValue(0);
    bannerY.setValue(-10);
    setSubmitted(true);
    Animated.parallel([
      Animated.spring(bannerY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(bannerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(bannerOp, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(bannerY,  { toValue: -10, duration: 400, useNativeDriver: true }),
      ]).start(() => setSubmitted(false));
    }, 6000);
  };

  const fetchStories = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('cat_stories')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setStories(data);
    setFetching(false);
  };

  useEffect(() => { fetchStories(); }, []);

  const handleSubmit = async (form: Record<string, string>, photoUrl: string | null): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.from('cat_stories').insert([{
      name:            form.name.trim() || 'Anonymous',
      cat_name:        form.cat_name.trim(),
      how_met:         form.how_met.trim(),
      cat_description: form.cat_description.trim(),
      memorable_story: form.memorable_story.trim(),
      best_part:       form.best_part.trim(),
      photos:          photoUrl,
    }]);
    setLoading(false);
    if (!error) {
      setShowModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      showSuccessBanner();
      fetchStories();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Confetti show={showConfetti} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1 — Header */}
        <Animated.View style={[styles.header, { opacity: headerOp, transform: [{ translateY: headerY }] }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>COMMUNITY</Text>
            <Text style={styles.pageTitle}>Cat Stories</Text>
            <Text style={styles.pageSub}>Real stories from cat parents like you</Text>
          </View>
        </Animated.View>

        {/* Success banner */}
        {submitted && (
          <Animated.View style={[styles.successBanner, { opacity: bannerOp, transform: [{ translateY: bannerY }] }]}>
            <Text style={styles.successText}>Your story was shared with the community!</Text>
          </Animated.View>
        )}

        {/* 2 — Share prompt */}
        <Animated.View style={{ opacity: promptOp, transform: [{ translateY: promptY }] }}>
          <TouchableOpacity style={styles.sharePromptBtn} onPress={() => setShowModal(true)} activeOpacity={0.85}>
            <View style={styles.sharePromptInner}>
              <View style={styles.sharePromptText}>
                <Text style={styles.sharePromptTitle}>Share your story</Text>
                <Text style={styles.sharePromptSub}>Answer as many or as few questions as you want</Text>
              </View>
              <Text style={styles.sharePromptArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* 3 — Section header + cards */}
        <Animated.View style={{ opacity: sectionOp, transform: [{ translateY: sectionY }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>From the Community</Text>
            <Text style={styles.sectionCount}>{stories.length} {stories.length === 1 ? 'story' : 'stories'}</Text>
          </View>

          {fetching ? (
            <ActivityIndicator color={GREEN} style={{ marginTop: 20 }} />
          ) : stories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No stories yet</Text>
              <Text style={styles.emptyText}>Be the first to share your cat adoption story!</Text>
            </View>
          ) : (
            stories.map((item, i) => <StoryCard key={item.id} item={item} index={i} />)
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <StoryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: WHITE },
  scrollContent: { paddingHorizontal: 22, paddingTop: 12, gap: 14 },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(44,26,14,0.08)', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  backBtnText: { fontSize: 18, fontWeight: '700', color: INK, lineHeight: 22 },
  headerText: { flex: 1, gap: 3 },
  eyebrow: { fontFamily: 'Avenir', fontSize: 10, fontWeight: '800', color: 'rgba(44,26,14,0.4)', letterSpacing: 2 },
  pageTitle: { fontFamily: 'Avenir', fontSize: 26, fontWeight: '900', color: INK, letterSpacing: -0.5 },
  pageSub: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '400', color: INK_SOFT },

  successBanner: { backgroundColor: 'rgba(123,174,110,0.15)', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: GREEN, borderBottomWidth: 3, borderBottomColor: GREEN_DARK },
  successText: { fontFamily: 'Avenir', fontSize: 14, fontWeight: '800', color: GREEN, textAlign: 'center' },

  sharePromptBtn: { backgroundColor: SAND, borderRadius: 20, borderWidth: 2, borderColor: WARM, borderBottomWidth: 4, borderBottomColor: WARM_DARK },
  sharePromptInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  sharePromptText: { flex: 1, gap: 2 },
  sharePromptTitle: { fontFamily: 'Avenir', fontSize: 15, fontWeight: '900', color: INK },
  sharePromptSub: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '400', color: INK_SOFT },
  sharePromptArrow: { fontSize: 24, fontWeight: '800', color: WARM },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 14 },
  sectionTitle: { fontFamily: 'Avenir', fontSize: 16, fontWeight: '900', color: INK },
  sectionCount: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '600', color: INK_SOFT, backgroundColor: 'rgba(44,26,14,0.06)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },

  emptyState: { padding: 36, alignItems: 'center', gap: 8, backgroundColor: 'rgba(44,26,14,0.03)', borderRadius: 24, borderWidth: 1.5, borderColor: 'rgba(44,26,14,0.08)' },
  emptyTitle: { fontFamily: 'Avenir', fontSize: 16, fontWeight: '900', color: INK },
  emptyText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: INK_SOFT, textAlign: 'center' },

  storyCard: { backgroundColor: WHITE, borderRadius: 20, padding: 16, gap: 10, borderWidth: 2, borderColor: 'rgba(44,26,14,0.06)', borderBottomWidth: 4, borderBottomColor: 'rgba(44,26,14,0.1)', shadowColor: INK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginBottom: 14 },
  storyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontFamily: 'Avenir', fontSize: 17, fontWeight: '900', color: INK },
  storyMeta: { flex: 1, gap: 2 },
  storyName: { fontFamily: 'Avenir', fontSize: 14, fontWeight: '900', color: INK },
  storyCatBadge: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '400', color: INK_SOFT },
  expandIcon: { fontSize: 18, color: INK_SOFT, fontWeight: '600' },
  storyPhoto: { width: '100%', height: 180, borderRadius: 14, marginTop: 4 },
  storyPreview: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: INK_SOFT, lineHeight: 20 },
  noDescription: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: 'rgba(44,26,14,0.3)', lineHeight: 20, fontStyle: 'italic' },
  expandedContent: { gap: 12, marginTop: 4 },
  storySection: { backgroundColor: 'rgba(44,26,14,0.03)', borderRadius: 14, padding: 12, gap: 6 },
  storySectionLabel: { fontFamily: 'Avenir', fontSize: 10, fontWeight: '800', color: 'rgba(44,26,14,0.4)', letterSpacing: 1.5 },
  storySectionText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: INK_SOFT, lineHeight: 20 },
  bestPartSection: { backgroundColor: 'rgba(123,174,110,0.08)', borderWidth: 1.5, borderColor: 'rgba(123,174,110,0.3)' },
  bestPartText: { fontFamily: 'Avenir', fontSize: 14, fontWeight: '700', color: INK, lineHeight: 22, fontStyle: 'italic' },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  backdropDismiss: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '30%' },
  modalWrapper: { flex: 1, justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: WHITE, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: INK, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 20 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(44,26,14,0.15)', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16 },
  modalTitle: { fontFamily: 'Avenir', fontSize: 20, fontWeight: '900', color: INK, letterSpacing: -0.3 },
  modalSub: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '400', color: INK_SOFT, marginTop: 2 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(44,26,14,0.08)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: INK },
  modalScroll: { maxHeight: '75%' },
  modalScrollContent: { paddingHorizontal: 22, gap: 14 },

  inputGroup: { gap: 6 },
  inputLabel: { fontFamily: 'Avenir', fontSize: 11, fontWeight: '800', color: 'rgba(44,26,14,0.45)', letterSpacing: 1.5, textTransform: 'uppercase' },
  input: { fontFamily: 'Avenir', fontSize: 14, fontWeight: '500', color: INK, backgroundColor: 'rgba(44,26,14,0.04)', borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: 'rgba(44,26,14,0.1)' },
  inputMultiline: { height: 80, paddingTop: 12 },

  photoPicker: { height: 150, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(44,26,14,0.12)', borderStyle: 'dashed', backgroundColor: 'rgba(44,26,14,0.03)', overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  photoOverlayText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '700', color: WHITE },
  photoEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  photoEmptyIcon: { fontSize: 28, color: INK_SOFT, fontWeight: '300' },
  photoEmptyText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '600', color: INK_SOFT },

  submitBtn: { backgroundColor: GREEN, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: GREEN_DARK },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontFamily: 'Avenir', color: WHITE, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});