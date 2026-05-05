import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, Image } from "react-native";

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const WARM = '#D4956A';
const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../assets/images/paw.png');
const CAT = require('../../../assets/images/walkingCat.png');

const WORDS = [
  { word: 'Allogrooming', definition: 'Cats grooming each other, a sign of bonding and trust' },
  { word: 'Bunting', definition: 'When a cat rubs their head or cheeks on you or objects to mark their scent' },
  { word: 'Chirping', definition: 'The noise cats make when watching birds or prey' },
  { word: 'Clowder', definition: 'A group of cats living together' },
  { word: 'Flehmen Response', definition: 'Slight open-mouth expression when a cat is analyzing a scent' },
  { word: 'Grooming', definition: 'Cat licking to clean themselves' },
  { word: 'Hissing', definition: 'Defensive warning to strangers or other cats to "back off"' },
  { word: 'Loaf Position', definition: 'Cat position with paws tucked under, indicates a relaxed cat' },
  { word: 'Marking', definition: 'Using scent (rubbing or spraying) to mark territory' },
  { word: 'Overstimulation', definition: 'When petting or playing becomes too much, leads to cat biting or swatting' },
  { word: 'Pheromones', definition: 'Chemical signals cats use to communicate safety' },
  { word: 'Scent Swapping', definition: 'Exchanging bedding or items to introduce cats through smell first' },
  { word: 'Slow Blink', definition: 'A sign of trust and affection, often called a cat kiss' },
  { word: 'Toe Beans', definition: 'The soft squishy paw pads on a cat\'s feet' },
  { word: 'Zoomies', definition: 'Sudden bursts of energy when cats run wildly, common at night' },
];

const CARD_COLORS = [
  '#C8D8E8', '#C4DDB0', '#F2C9A0', '#E8C8B8', '#D4E8C4',
  '#C8D8E8', '#F2D9A0', '#C4DDB0', '#E8C8B8', '#C8D8E8',
  '#C4DDB0', '#F2C9A0', '#D4E8C4', '#E8C8B8', '#C8D8E8',
];

function FlipCard({ word, index, color }: { word: typeof WORDS[0], index: number, color: string }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  return (
    <TouchableOpacity onPress={flip} activeOpacity={1} style={styles.flipContainer}>

      {/* Front */}
      <Animated.View style={[
        styles.card,
        { backgroundColor: color },
        { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity },
      ]}>
        <Text style={styles.cardCounter}>{index + 1} of {WORDS.length}</Text>
        <View style={styles.cardCenter}>
          <Text style={styles.cardLabel}>CATIONARY</Text>
          <Text style={styles.cardWord}>{word.word}</Text>
        </View>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to reveal</Text>
        </View>
      </Animated.View>

      {/* Back */}
      <Animated.View style={[
        styles.card,
        styles.cardBack,
        { backgroundColor: WHITE },
        { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
      ]}>
        <Text style={styles.cardCounter}>{index + 1} of {WORDS.length}</Text>
        <View style={styles.cardCenter}>
          <Text style={styles.cardWordSmall}>{word.word}</Text>
          <View style={styles.divider} />
          <Text style={styles.cardDefinition}>{word.definition}</Text>
        </View>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to flip back</Text>
        </View>
      </Animated.View>

    </TouchableOpacity>
  );
}

export default function Cationary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const catProgress = useRef(new Animated.Value(0)).current;

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: currentIndex / (WORDS.length - 1),
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>

      {/* Progress bar with walking cat */}
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

      {/* Card */}
      <View style={styles.cardArea}>
        <FlipCard
          key={currentIndex}
          word={WORDS[currentIndex]}
          index={currentIndex}
          color={CARD_COLORS[currentIndex % CARD_COLORS.length]}
        />
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {WORDS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goToIndex(i)}>
            <View style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
              i < currentIndex && styles.dotSeen,
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Nav */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={() => currentIndex > 0 && goToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonText}>{"< Prev"}</Text>
        </TouchableOpacity>

        <Text style={styles.counterText}>{currentIndex + 1} of {WORDS.length}</Text>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext, currentIndex === WORDS.length - 1 && styles.navButtonDisabled]}
          onPress={() => currentIndex < WORDS.length - 1 && goToIndex(currentIndex + 1)}
          disabled={currentIndex === WORDS.length - 1}
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
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  progressArea: {
    marginTop: 16,
    marginBottom: 6,
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

  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },

  flipContainer: {
    width: '100%',
    height: 300,
  },

  card: {
    width: '100%',
    height: 300,
    borderRadius: 32,
    padding: 26,
    shadowColor: INK,
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    backfaceVisibility: 'hidden',
    justifyContent: 'space-between',
  },

  cardBack: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },

  cardCounter: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(44,26,14,0.35)',
    letterSpacing: 1,
  },

  cardCenter: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },

  cardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },

  cardWord: {
    fontFamily: 'Georgia',
    fontSize: 34,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 38,
  },

  cardWordSmall: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 1,
  },

  cardDefinition: {
    fontSize: 16,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 24,
  },

  tapHint: {
    alignSelf: 'center',
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  tapHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: INK,
    letterSpacing: 0.3,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(44,26,14,0.15)',
  },
  dotActive: {
    backgroundColor: INK,
    width: 18,
  },
  dotSeen: {
    backgroundColor: WARM,
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(44,26,14,0.08)',
  },
  navButtonNext: {
    backgroundColor: INK,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
  },
  counterText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    color: INK_SOFT,
  },
});