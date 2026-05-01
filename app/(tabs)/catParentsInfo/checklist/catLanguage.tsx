import React, { useState, useRef, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, Animated, Image, PanResponder } from 'react-native';
import cards from '../../../data/catParents/catLang';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../../assets/images/paw.png');
const CAT = require('../../../../assets/images/walkingCat.png');

const MOODS = [
  { key: 'happy',   label: 'Happy and Relaxed',          color: '#C4DDB0', dot: '#7BAE6E' },
  { key: 'loving',  label: 'Loving Cat',                 color: '#F2C9A0', dot: '#D4956A' },
  { key: 'excited', label: 'Excited and Playful',        color: '#C8D8E8', dot: '#7A9BBE' },
  { key: 'angry',   label: 'Angry, Fearful and Anxious', color: '#E8C8B8', dot: '#C47A45' },
];

function MoodRow({ label, answer, color, dot }: {
  label: string;
  answer: string;
  color: string;
  dot: string;
}) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.moodRow, { backgroundColor: color }]}>
      <TouchableOpacity style={styles.moodHeader} onPress={toggle} activeOpacity={0.8}>
        <View style={[styles.moodDot, { backgroundColor: dot }]} />
        <Text style={styles.moodLabel}>{label}</Text>
        <Animated.Image
          source={PAW}
          style={[styles.moodPaw, { transform: [{ rotate }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.moodAnswer}>
          <View style={[styles.moodDivider, { backgroundColor: dot, opacity: 0.3 }]} />
          <Text style={styles.moodAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function CatLanguage({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;
  const SWIPE_THRESHOLD = screenWidth * 0.3;

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 40;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
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
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        const idx = currentIndexRef.current;
        if (gesture.dx < -SWIPE_THRESHOLD && idx < cards.length - 1) {
          Animated.timing(translateX, { toValue: -screenWidth, duration: 250, useNativeDriver: true })
            .start(() => { goToIndex(idx + 1); translateX.setValue(0); });
        } else if (gesture.dx > SWIPE_THRESHOLD && idx > 0) {
          Animated.timing(translateX, { toValue: screenWidth, duration: 250, useNativeDriver: true })
            .start(() => { goToIndex(idx - 1); translateX.setValue(0); });
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        }
      },
    })
  ).current;

  const card = cards[currentIndex];

  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cat Language</Text>
          <Text style={styles.headerSub}>Swipe to explore body parts</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterNum}>{currentIndex + 1}</Text>
          <Text style={styles.counterDenom}>/{cards.length}</Text>
        </View>
      </View>

      {/* Walking cat progress bar */}
      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {
            width: catProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }]} />
        </View>
        <Animated.Image
          source={CAT}
          style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
          resizeMode="contain"
        />
      </View>

      {/* Swipeable card */}
      <Animated.View
        style={[styles.cardArea, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <View style={styles.moodsArea}>
            {MOODS.map((mood) => (
              <MoodRow
                key={`${currentIndex}-${mood.key}`}
                label={mood.label}
                answer={(card as any)[mood.key]}
                color={mood.color}
                dot={mood.dot}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {cards.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => {
            const direction = i > currentIndex ? -1 : 1;
            Animated.timing(translateX, { toValue: direction * screenWidth, duration: 250, useNativeDriver: true })
              .start(() => { goToIndex(i); translateX.setValue(0); });
          }}>
            <View style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
              i < currentIndex && styles.dotSeen,
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Nav buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={() => {
            if (currentIndex > 0) {
              Animated.timing(translateX, { toValue: screenWidth, duration: 250, useNativeDriver: true })
                .start(() => { goToIndex(currentIndex - 1); translateX.setValue(0); });
            }
          }}
          disabled={currentIndex === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonText}>{"< Prev"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext, currentIndex === cards.length - 1 && styles.navButtonDisabled]}
          onPress={() => {
            if (currentIndex < cards.length - 1) {
              Animated.timing(translateX, { toValue: -screenWidth, duration: 250, useNativeDriver: true })
                .start(() => { goToIndex(currentIndex + 1); translateX.setValue(0); });
            }
          }}
          disabled={currentIndex === cards.length - 1}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, { color: WHITE }]}>{"Next >"}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
    gap: 14,
  },

  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK_SOFT,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 32,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 36,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: WARM,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginBottom: 4,
  },
  counterNum: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '900',
    color: WHITE,
  },
  counterDenom: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,250,245,0.7)',
  },

  // Progress bar
  progressArea: {
    position: 'relative',
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(44,26,14,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: WARM,
    borderRadius: 4,
  },
  progressCat: {
    position: 'absolute',
    width: 36,
    height: 36,
    top: -28,
  },

  // Card
  cardArea: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
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
    fontSize: 13,
    fontWeight: '700',
    color: INK,
  },
  moodPaw: {
    width: 20,
    height: 20,
    tintColor: INK,
    opacity: 0.5,
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
  },
  moodAnswerText: {
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 20,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
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
    backgroundColor: WARM,
  },

  // Nav
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(44,26,14,0.08)',
  },
  navButtonNext: {
    backgroundColor: INK,
    flex: 1,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
  },
});