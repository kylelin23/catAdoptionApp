import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const SAND = "#E8C9A0";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";
const WARM = "#D4956A";
const WARM_DARK = "#A86E45";

const YOUR_EMAIL = "catwise78@gmail.com";

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:5001";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#D4956A",
  "#E8C9A0",
  "#7BAE6E",
  "#C8D8E8",
  "#E8C8B8",
  "#2C1A0E",
  "#FFFAF5",
  "#F2C9A0",
];

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
  status: string;
};

const AVATAR_COLORS = ["#C4DDB0", "#C8D8E8", "#F2C9A0", "#E8C8B8", "#D4DDB0"];

const FIELDS = [
  {
    key: "name",
    label: "Your Name",
    placeholder: "e.g. Sarah",
    required: false,
    multiline: false,
  },
  {
    key: "cat_name",
    label: "Your Cat's Name",
    placeholder: "e.g. Maggy",
    required: true,
    multiline: false,
  },
  {
    key: "how_met",
    label: "How did you meet your cat?",
    placeholder: "Tell us how you found each other…",
    required: false,
    multiline: true,
  },
  {
    key: "cat_description",
    label: "Describe your cat",
    placeholder: "What are they like?",
    required: false,
    multiline: true,
  },
  {
    key: "memorable_story",
    label: "A memorable story",
    placeholder: "Something unforgettable…",
    required: false,
    multiline: true,
  },
  {
    key: "best_part",
    label: "Best part of being a cat parent",
    placeholder: "What do you love most?",
    required: false,
    multiline: true,
  },
];

const EMPTY_FORM = {
  name: "",
  cat_name: "",
  how_met: "",
  cat_description: "",
  memorable_story: "",
  best_part: "",
};

// GET request to get approved stories
async function fetchApprovedStories(): Promise<{
  ok: boolean;
  data?: Story[];
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stories`);
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    console.log("fetchApprovedStories failed:", e);
    return { ok: false };
  }
}

// POST Request to submit story to database
async function submitStory(
  form: Record<string, string>,
  photoUrls: string[],
): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        cat_name: form.cat_name.trim(),
        how_met: form.how_met.trim(),
        cat_description: form.cat_description.trim(),
        memorable_story: form.memorable_story.trim(),
        best_part: form.best_part.trim(),
        photos: photoUrls,
      }),
    });
    return res.ok;
  } catch (e) {
    console.log("submitStory failed:", e);
    return false;
  }
}

// URL stored in database and actual photo in Supabase Storage
async function uploadPhotoToBackend(uri: string): Promise<string | null> {
  try {
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const formData = new FormData();
    formData.append("file", { uri, name: fileName, type: "image/jpeg" } as any);

    const res = await fetch(`${BACKEND_URL}/api/stories/photos`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.log("upload failed:", res.status);
      return null;
    }
    const data = await res.json();
    return data.url as string;
  } catch (e) {
    console.log("upload exception:", e);
    return null;
  }
}

// Notifies moderator via email after story submission
async function notifyModerator(
  catName: string,
  submitterName: string,
): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/stories/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cat_name: catName,
        name: submitterName,
      }),
    });
  } catch (e) {
    console.log("notifyModerator failed:", e);
  }
}

function ConfettiPiece({ color, delay }: { color: string; delay: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const x = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, {
          toValue: screenHeight,
          duration: 2200 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: (Math.random() - 0.5) * 200 + Math.random() * screenWidth,
          duration: 2200 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: Math.random() > 0.5 ? 10 : -10,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [-10, 10],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: Math.random() > 0.5 ? 10 : 7,
        height: Math.random() > 0.5 ? 10 : 7,
        borderRadius: Math.random() > 0.5 ? 5 : 0,
        backgroundColor: color,
        transform: [{ translateY: y }, { translateX: x }, { rotate: spin }],
        opacity,
        zIndex: 9999,
      }}
    />
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      {Array.from({ length: 60 }).map((_, i) => (
        <ConfettiPiece
          key={i}
          color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
          delay={i * 35}
        />
      ))}
    </>
  );
}

function AnimatedField({
  field,
  index,
  visible,
  value,
  onChange,
}: {
  field: (typeof FIELDS)[0];
  index: number;
  visible: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(16);
      Animated.sequence([
        Animated.delay(index * 50 + 100),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.inputGroup,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.inputLabel}>
        {field.label}
        {field.required ? <Text style={styles.requiredAsterisk}> *</Text> : ""}
      </Text>
      <TextInput
        style={[styles.input, field.multiline && styles.inputMultiline]}
        placeholder={field.placeholder}
        placeholderTextColor="rgba(44,26,14,0.25)"
        value={value}
        onChangeText={onChange}
        multiline={field.multiline}
        textAlignVertical={field.multiline ? "top" : "center"}
        returnKeyType={field.multiline ? "default" : "next"}
        blurOnSubmit={!field.multiline}
      />
    </Animated.View>
  );
}

function StoryCard({ item, index }: { item: Story; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const avatarColor = AVATAR_COLORS[item.id % AVATAR_COLORS.length];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const hasAnyContent =
    item.how_met ||
    item.memorable_story ||
    item.cat_description ||
    item.best_part;

  const photoUrls: string[] = (() => {
    if (!item.photos) return [];
    try {
      const parsed = JSON.parse(item.photos);
      return Array.isArray(parsed) ? parsed : [item.photos];
    } catch {
      return [item.photos];
    }
  })();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContact = () => {
    const subject = encodeURIComponent(
      `CatWise Story Request — ${item.cat_name} (ID: ${item.id})`,
    );
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to request an edit or removal of my cat story.\n\nStory details:\n- Cat name: ${item.cat_name}\n- Submitted by: ${item.name || "Anonymous"}\n- Story ID: ${item.id}\n\nRequest:\n[Please describe what you'd like changed or removed]\n\nThanks!`,
    );
    const gmailUrl = `googlegmail://co?to=${YOUR_EMAIL}&subject=${subject}&body=${body}`;
    const mailUrl = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    Linking.canOpenURL(gmailUrl).then((supported) => {
      Linking.openURL(supported ? gmailUrl : mailUrl);
    });
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <TouchableOpacity
        style={styles.storyCard}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={styles.storyHeader}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>
              {(item.name || "A")[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.storyMeta}>
            <Text style={styles.storyName}>{item.name || "Anonymous"}</Text>
            <Text style={styles.storyCatBadge}>{item.cat_name}</Text>
          </View>
          <Text style={styles.expandIcon}>{expanded ? "↑" : "↓"}</Text>
        </View>

        {photoUrls.length > 0 && (
          <View>
            <Image
              source={{ uri: photoUrls[photoIndex] }}
              style={styles.storyPhoto}
              resizeMode="cover"
            />
            {photoUrls.length > 1 && (
              <View style={styles.photoNav}>
                <TouchableOpacity
                  style={[
                    styles.photoNavBtn,
                    photoIndex === 0 && styles.photoNavBtnDisabled,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    setPhotoIndex((i) => Math.max(0, i - 1));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.photoNavText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.photoNavCount}>
                  {photoIndex + 1} / {photoUrls.length}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.photoNavBtn,
                    photoIndex === photoUrls.length - 1 &&
                      styles.photoNavBtnDisabled,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    setPhotoIndex((i) => Math.min(photoUrls.length - 1, i + 1));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.photoNavText}>›</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {!expanded &&
          (item.how_met ? (
            <Text style={styles.storyPreview} numberOfLines={2}>
              {item.how_met}
            </Text>
          ) : item.memorable_story ? (
            <Text style={styles.storyPreview} numberOfLines={2}>
              {item.memorable_story}
            </Text>
          ) : item.cat_description ? (
            <Text style={styles.storyPreview} numberOfLines={2}>
              {item.cat_description}
            </Text>
          ) : item.best_part ? (
            <Text style={styles.storyPreview} numberOfLines={2}>
              {item.best_part}
            </Text>
          ) : null)}

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
                <Text style={styles.storySectionLabel}>
                  ABOUT {item.cat_name.toUpperCase()}
                </Text>
                <Text style={styles.storySectionText}>
                  {item.cat_description}
                </Text>
              </View>
            ) : null}
            {item.memorable_story ? (
              <View style={styles.storySection}>
                <Text style={styles.storySectionLabel}>A MEMORABLE MOMENT</Text>
                <Text style={styles.storySectionText}>
                  {item.memorable_story}
                </Text>
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
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={handleContact}
              activeOpacity={0.8}
            >
              <Text style={styles.contactBtnText}>Request edit or removal</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function StoryModal({
  visible,
  onClose,
  onSubmit,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    form: Record<string, string>,
    photoUrls: string[],
  ) => Promise<void>;
  loading: boolean;
}) {
  const slideAnim = useRef(new Animated.Value(700)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState<Record<string, string>>(EMPTY_FORM);
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 700,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          setForm(EMPTY_FORM);
          setPhotoUris([]);
        }, 0);
      });
    }
  }, [visible]);

  const pickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    setPicking(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"] as any,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    setPicking(false);
    if (!result.canceled) {
      setPhotoUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = form.cat_name.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    let uploadedUrls: string[] = [];
    if (photoUris.length > 0) {
      setUploading(true);
      const results = await Promise.all(
        photoUris.map((uri) => uploadPhotoToBackend(uri)),
      );
      uploadedUrls = results.filter(Boolean) as string[];
      setUploading(false);
    }
    await onSubmit(form, uploadedUrls);
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setPhotoUris([]);
    }, 0);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
        pointerEvents="none"
      />
      <TouchableOpacity
        style={styles.backdropDismiss}
        activeOpacity={1}
        onPress={onClose}
      />

      <KeyboardAvoidingView
        style={styles.modalWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handleBar} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Share Your Story</Text>
              <Text style={styles.modalSub}>
                Answer as many or as few as you want
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
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
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, [field.key]: v }))
                }
              />
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Photos{" "}
                <Text style={styles.photosOptionalLabel}>(optional)</Text>
              </Text>

              {photoUris.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.photoRow}
                  contentContainerStyle={styles.photoRowContent}
                >
                  {photoUris.map((uri, i) => (
                    <View key={i} style={styles.photoThumbWrapper}>
                      <Image
                        source={{ uri }}
                        style={styles.photoThumb}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.photoRemoveBtn}
                        onPress={() => removePhoto(i)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.photoRemoveText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.photoAddMore,
                      picking && styles.photoAddMoreLoading,
                    ]}
                    onPress={pickPhotos}
                    activeOpacity={0.8}
                    disabled={picking}
                  >
                    {picking ? (
                      <ActivityIndicator color={INK_SOFT} size="small" />
                    ) : (
                      <>
                        <Text style={styles.photoEmptyIcon}>+</Text>
                        <Text style={styles.photoAddMoreText}>Add more</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              )}

              {photoUris.length === 0 && (
                <TouchableOpacity
                  style={[
                    styles.photoPicker,
                    picking && styles.photoPickerLoading,
                  ]}
                  onPress={pickPhotos}
                  activeOpacity={0.85}
                  disabled={picking}
                >
                  {picking ? (
                    <View style={styles.photoEmpty}>
                      <ActivityIndicator color={INK_SOFT} size="small" />
                      <Text style={styles.photoEmptyText}>
                        Opening library…
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.photoEmpty}>
                      <Text style={styles.photoEmptyIcon}>+</Text>
                      <Text style={styles.photoEmptyText}>
                        Add photos of your cat
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!canSubmit || uploading || picking) &&
                  styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || uploading || !canSubmit || picking}
              activeOpacity={0.85}
            >
              {loading || uploading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <Text style={styles.submitBtnText}>Share Story</Text>
              )}
            </TouchableOpacity>
            <View style={styles.modalBottomSpacer} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function CatStories({ navigation }: { navigation: any }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const promptY = useRef(new Animated.Value(20)).current;
  const promptOp = useRef(new Animated.Value(0)).current;
  const sectionY = useRef(new Animated.Value(20)).current;
  const sectionOp = useRef(new Animated.Value(0)).current;
  const bannerOp = useRef(new Animated.Value(0)).current;
  const bannerY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(promptY, {
        toValue: 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(promptOp, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.spring(sectionY, {
        toValue: 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(sectionOp, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showSuccessBanner = () => {
    bannerOp.setValue(0);
    bannerY.setValue(-10);
    setSubmitted(true);
    Animated.parallel([
      Animated.spring(bannerY, {
        toValue: 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(bannerOp, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(bannerOp, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bannerY, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setSubmitted(false));
    }, 6000);
  };

  const fetchStories = async () => {
    setFetching(true);
    const result = await fetchApprovedStories();
    if (result.ok && result.data) setStories(result.data);
    setFetching(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSubmit = async (
    form: Record<string, string>,
    photoUrls: string[],
  ): Promise<void> => {
    setLoading(true);
    const ok = await submitStory(form, photoUrls);
    setLoading(false);
    if (ok) {
      setShowModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      showSuccessBanner();
      notifyModerator(form.cat_name.trim(), form.name.trim());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Confetti show={showConfetti} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {submitted && (
          <Animated.View
            style={[
              styles.successBanner,
              { opacity: bannerOp, transform: [{ translateY: bannerY }] },
            ]}
          >
            <Text style={styles.successText}>
              Thanks! Your story was submitted for review.
            </Text>
          </Animated.View>
        )}

        <Animated.View
          style={{ opacity: promptOp, transform: [{ translateY: promptY }] }}
        >
          <TouchableOpacity
            style={styles.sharePromptBtn}
            onPress={() => setShowModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.sharePromptInner}>
              <View style={styles.sharePromptText}>
                <Text style={styles.sharePromptTitle}>Share your story</Text>
                <Text style={styles.sharePromptSub}>
                  Answer as many or as few questions as you want
                </Text>
              </View>
              <Text style={styles.sharePromptArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{ opacity: sectionOp, transform: [{ translateY: sectionY }] }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>From the Community</Text>
            <Text style={styles.sectionCount}>
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </Text>
          </View>

          {fetching ? (
            <ActivityIndicator color={GREEN} style={styles.loadingIndicator} />
          ) : stories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No stories yet</Text>
              <Text style={styles.emptyText}>
                Be the first to share your cat adoption story!
              </Text>
            </View>
          ) : (
            stories.map((item, i) => (
              <StoryCard key={item.id} item={item} index={i} />
            ))
          )}
        </Animated.View>
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
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 40,
    gap: 14,
  },

  successBanner: {
    backgroundColor: "rgba(123,174,110,0.15)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: GREEN,
    borderBottomWidth: 3,
    borderBottomColor: GREEN_DARK,
  },
  successText: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "800",
    color: GREEN,
    textAlign: "center",
  },

  sharePromptBtn: {
    backgroundColor: SAND,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WARM,
    borderBottomWidth: 4,
    borderBottomColor: WARM_DARK,
  },
  sharePromptInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  sharePromptText: {
    flex: 1,
    gap: 2,
  },
  sharePromptTitle: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
  },
  sharePromptSub: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "400",
    color: INK_SOFT,
  },
  sharePromptArrow: {
    fontSize: 24,
    fontWeight: "800",
    color: WARM,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
  },
  sectionCount: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "600",
    color: INK_SOFT,
    backgroundColor: "rgba(44,26,14,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  loadingIndicator: {
    marginTop: 20,
  },

  emptyState: {
    padding: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(44,26,14,0.03)",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.08)",
  },
  emptyTitle: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
  },
  emptyText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
    textAlign: "center",
  },

  storyCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(44,26,14,0.1)",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  storyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "Avenir",
    fontSize: 17,
    fontWeight: "900",
    color: INK,
  },
  storyMeta: {
    flex: 1,
    gap: 2,
  },
  storyName: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
  },
  storyCatBadge: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "400",
    color: INK_SOFT,
  },
  expandIcon: {
    fontSize: 18,
    color: INK_SOFT,
    fontWeight: "600",
  },
  storyPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 4,
  },
  photoNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  photoNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoNavBtnDisabled: {
    opacity: 0.3,
  },
  photoNavText: {
    fontSize: 20,
    fontWeight: "700",
    color: INK,
    lineHeight: 24,
  },
  photoNavCount: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "600",
    color: INK_SOFT,
  },
  storyPreview: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 20,
  },
  noDescription: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(44,26,14,0.3)",
    lineHeight: 20,
    fontStyle: "italic",
  },
  expandedContent: {
    gap: 12,
    marginTop: 4,
  },
  storySection: {
    backgroundColor: "rgba(44,26,14,0.03)",
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  storySectionLabel: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 1.5,
  },
  storySectionText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 20,
  },
  bestPartSection: {
    backgroundColor: "rgba(123,174,110,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(123,174,110,0.3)",
  },
  bestPartText: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "700",
    color: INK,
    lineHeight: 22,
    fontStyle: "italic",
  },
  contactBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.12)",
    backgroundColor: "rgba(44,26,14,0.04)",
    marginTop: 4,
  },
  contactBtnText: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "700",
    color: INK_SOFT,
    letterSpacing: 0.2,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdropDismiss: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "30%",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: INK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(44,26,14,0.15)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalTitle: {
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.3,
  },
  modalSub: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: INK,
  },
  modalScroll: {
    maxHeight: "75%",
  },
  modalScrollContent: {
    paddingHorizontal: 22,
    gap: 14,
  },
  modalBottomSpacer: {
    height: 60,
  },

  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(44,26,14,0.45)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  requiredAsterisk: {
    color: WARM,
  },
  photosOptionalLabel: {
    color: INK_SOFT,
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: "400",
  },
  input: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "500",
    color: INK,
    backgroundColor: "rgba(44,26,14,0.04)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.1)",
  },
  inputMultiline: {
    height: 80,
    paddingTop: 12,
  },

  photoPicker: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.12)",
    borderStyle: "dashed",
    backgroundColor: "rgba(44,26,14,0.03)",
    overflow: "hidden",
  },
  photoPickerLoading: {
    opacity: 0.6,
  },
  photoEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  photoEmptyIcon: {
    fontSize: 28,
    color: INK_SOFT,
    fontWeight: "300",
  },
  photoEmptyText: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "600",
    color: INK_SOFT,
  },

  photoRow: {
    overflow: "visible",
  },
  photoRowContent: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 4,
    paddingRight: 10,
  },
  photoThumbWrapper: {
    marginRight: 10,
    position: "relative",
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  photoRemoveBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  photoRemoveText: {
    fontSize: 10,
    fontWeight: "800",
    color: WHITE,
  },
  photoAddMore: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.12)",
    borderStyle: "dashed",
    backgroundColor: "rgba(44,26,14,0.03)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddMoreLoading: {
    opacity: 0.6,
  },
  photoAddMoreText: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "600",
    color: INK_SOFT,
  },

  submitBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    fontFamily: "Avenir",
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
