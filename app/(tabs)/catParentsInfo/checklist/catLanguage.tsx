import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import cards from '../../../data/catParents/catLang';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const GREEN = '#7BAE6E';
const GREEN_DARK = '#5A8F50';

const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../../assets/images/paw.png');
const CAT = require('../../../../assets/images/walkingCat.png');

const MOODS = [
  { key: 'happy', label: 'Happy and Relaxed', color: '#C4DDB0', border: '#7BAE6E', dark: '#5A8F50' },
  { key: 'loving', label: 'Loving Cat', color: '#F2C9A0', border: '#D4956A', dark: '#A86E45' },
  { key: 'excited', label: 'Excited and Playful', color: '#C8D8E8', border: '#7A9BBE', dark: '#5C7A9A' },
  { key: 'angry', label: 'Angry, Fearful and Anxious', color: '#E8C8B8', border: '#C47A45', dark: '#9E5C2E' },
];

function MoodRow({
  label,
  answer,
  color,
  border,
  dark,
  isOpen,
  onToggle,
}: {
  label: string;
  answer: string;
  color: string;
  border: string;
  dark: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.moodRow, { backgroundColor: color, borderColor: border, borderBottomColor: dark }]}>
      <TouchableOpacity style={styles.moodHeader} onPress={onToggle} activeOpacity={0.8}>
        <View style={[styles.moodDot, { backgroundColor: border }]} />
        <Text style={styles.moodLabel}>{label}</Text>
        <Animated.Image
          source={PAW}
          style={[styles.moodPaw, { tintColor: border, transform: [{ rotate }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.moodAnswer}>
          <View style={[styles.moodDivider, { backgroundColor: border }]} />
          <Text style={styles.moodAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function CatLanguage({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openMoodKey, setOpenMoodKey] = useState<string | null>(null);

  const currentIndexRef = useRef(0);
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;

  const SWIPE_THRESHOLD = screenWidth * 0.25;
  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;

  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: currentIndex / (cards.length - 1),
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const goToIndex = (index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
    setOpenMoodKey(null);
    swipeAnim.setValue(0);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        swipeAnim.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        const idx = currentIndexRef.current;

        if (gesture.dx < -SWIPE_THRESHOLD && idx < cards.length - 1) {
          // Swipe Left -> Next Card
          Animated.timing(swipeAnim, {
            toValue: -screenWidth,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            goToIndex(idx + 1);
          });
        } else if (gesture.dx > SWIPE_THRESHOLD && idx > 0) {
          // Swipe Right -> Prev Card
          Animated.timing(swipeAnim, {
            toValue: screenWidth,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            goToIndex(idx - 1);
          });
        } else {
          // Reset positioning snap back
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 5,
            tension: 40,
          }).start();
        }
      },
    })
  ).current;

  // Animated Interpolations for Quizlet Stack Effect
  const currentCardTranslateX = swipeAnim;

  const currentCardRotate = swipeAnim.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ['-6deg', '0deg', '6deg'],
  });

  // Next peek card moves into center view as you drag
  const nextCardTranslateX = swipeAnim.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [0, screenWidth - 28, screenWidth * 2],
  });

  // Previous peek card moves into center view as you drag
  const prevCardTranslateX = swipeAnim.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [-screenWidth * 2, -screenWidth + 28, 0],
  });

  const triggerButtonNav = (targetIndex: number, direction: 'forward' | 'backward') => {
    Animated.timing(swipeAnim, {
      toValue: direction === 'forward' ? -screenWidth : screenWidth,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      goToIndex(targetIndex);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>CAT PARENTS</Text>
            <Text style={styles.pageTitle}>Cat Language</Text>
          </View>

          <View style={styles.counterBadge}>
            <Text style={styles.counterNum}>{currentIndex + 1}</Text>
            <Text style={styles.counterDenom}>/{cards.length}</Text>
          </View>
        </View>

        {/* Top Progress bar tracking */}
        <View style={styles.progressArea}>
          <Animated.Image
            source={CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: catProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Dynamic Quizlet Card Slider Container */}
        <View style={styles.cardContainerArea} {...panResponder.panHandlers}>

          {/* Glimpse Card: PREVIOUS */}
          {currentIndex > 0 && (
            <Animated.View
              style={[
                styles.peekCardOuter,
                { transform: [{ translateX: prevCardTranslateX }] }
              ]}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{cards[currentIndex - 1].title}</Text>
              </View>
            </Animated.View>
          )}

          {/* Core Interactive Card: CURRENT */}
          <Animated.View
            style={[
              styles.peekCardOuter,
              {
                transform: [
                  { translateX: currentCardTranslateX },
                  { rotate: currentCardRotate }
                ],
                zIndex: 10
              }
            ]}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{cards[currentIndex].title}</Text>

              <View style={styles.moodsArea}>
                {MOODS.map((mood) => (
                  <MoodRow
                    key={`${currentIndex}-${mood.key}`}
                    label={mood.label}
                    answer={(cards[currentIndex] as any)[mood.key]}
                    color={mood.color}
                    border={mood.border}
                    dark={mood.dark}
                    isOpen={openMoodKey === mood.key}
                    onToggle={() =>
                      setOpenMoodKey(openMoodKey === mood.key ? null : mood.key)
                    }
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Glimpse Card: NEXT */}
          {currentIndex < cards.length - 1 && (
            <Animated.View
              style={[
                styles.peekCardOuter,
                { transform: [{ translateX: nextCardTranslateX }] }
              ]}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{cards[currentIndex + 1].title}</Text>
              </View>
            </Animated.View>
          )}

        </View>

        {/* Carousel Pagination dots indicators */}
        <View style={styles.dotsRow}>
          {cards.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (i !== currentIndex) {
                  triggerButtonNav(i, i > currentIndex ? 'forward' : 'backward');
                }
              }}
            >
              <View
                style={[
                  styles.dot,
                  i === currentIndex && styles.dotActive,
                  i < currentIndex && styles.dotSeen,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation bottom bar */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={() => currentIndex > 0 && triggerButtonNav(currentIndex - 1, 'backward')}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, currentIndex === 0 && styles.arrowDisabled]}>←</Text>
          </TouchableOpacity>

          <Text style={styles.counterText}>
            {currentIndex + 1} / {cards.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnNext,
              currentIndex === cards.length - 1 && styles.navBtnDisabled,
            ]}
            onPress={() => currentIndex < cards.length - 1 && triggerButtonNav(currentIndex + 1, 'forward')}
            disabled={currentIndex === cards.length - 1}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, styles.arrowNext]}>→</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    lineHeight: 22,
  },

  headerCenter: {
    flex: 1,
    gap: 2,
  },

  eyebrow: {
    fontFamily: 'Avenir',
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },

  pageTitle: {
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  counterBadge: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    borderBottomWidth: 3,
    borderBottomColor: GREEN_DARK,
    flexShrink: 0,
  },

  counterNum: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '900',
    color: WHITE,
  },

  counterDenom: {
    fontFamily: 'Avenir',
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,250,245,0.7)',
  },

  progressArea: {
    marginTop: 16,
    marginBottom: 12,
  },

  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
    borderRadius: 5,
  },

  progressCat: {
    position: 'absolute',
    width: 36,
    height: 36,
    top: -28,
  },

  /* Quizlet Card Carousel Engine Layout Specs */
  cardContainerArea: {
    flex: 1,
    position: 'relative',
    marginHorizontal: -12, // Extends container boundaries to allow smooth overflow peeking
  },

  peekCardOuter: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    bottom: 0,
  },

  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(44,26,14,0.1)',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  cardTitle: {
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  moodsArea: {
    gap: 8,
    flex: 1,
  },

  moodRow: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderBottomWidth: 4,
  },

  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },

  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },

  moodLabel: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '700',
    color: INK,
  },

  moodPaw: {
    width: 20,
    height: 20,
    flexShrink: 0,
  },

  moodAnswer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },

  moodDivider: {
    height: 1.5,
    borderRadius: 1,
    opacity: 0.3,
  },

  moodAnswerText: {
    fontFamily: 'Avenir',
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 20,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(44,26,14,0.15)',
  },

  dotActive: {
    backgroundColor: INK,
    width: 20,
  },

  dotSeen: {
    backgroundColor: GREEN,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },

  navBtn: {
    width: 92,
    height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },

  navBtnNext: {
    backgroundColor: GREEN,
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
  },

  navBtnDisabled: {
    opacity: 0.35,
  },

  arrowText: {
    fontSize: 34,
    fontWeight: '700',
    color: INK_SOFT,
    lineHeight: 38,
  },

  arrowNext: {
    color: WHITE,
  },

  arrowDisabled: {
    color: 'rgba(107,76,53,0.35)',
  },

  counterText: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '800',
    color: INK_SOFT,
  },
});