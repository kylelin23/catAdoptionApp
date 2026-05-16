import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, Image, SafeAreaView } from "react-native";

const INK        = '#2C1A0E';
const INK_SOFT   = '#6B4C35';
const WHITE      = '#FFFAF5';
const GREEN      = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const screenWidth = Dimensions.get('window').width;

const CAT = require('../../../assets/images/walkingCat.png');

const WORDS = [
  { word: 'Allogrooming',    definition: 'Cats grooming each other, a sign of bonding and trust' },
  { word: 'Bunting',         definition: 'When a cat rubs their head or cheeks on you or objects to mark their scent' },
  { word: 'Chirping',        definition: 'The noise cats make when watching birds or prey' },
  { word: 'Clowder',         definition: 'A group of cats living together' },
  { word: 'Flehmen Response',definition: 'Slight open-mouth expression when a cat is analyzing a scent' },
  { word: 'Grooming',        definition: 'Cat licking to clean themselves' },
  { word: 'Hissing',         definition: 'Defensive warning to strangers or other cats to "back off"' },
  { word: 'Loaf Position',   definition: 'Cat position with paws tucked under, indicates a relaxed cat' },
  { word: 'Marking',         definition: 'Using scent (rubbing or spraying) to mark territory' },
  { word: 'Overstimulation', definition: 'When petting or playing becomes too much, leads to cat biting or swatting' },
  { word: 'Pheromones',      definition: 'Chemical signals cats use to communicate safety' },
  { word: 'Scent Swapping',  definition: 'Exchanging bedding or items to introduce cats through smell first' },
  { word: 'Slow Blink',      definition: 'A sign of trust and affection, often called a cat kiss' },
  { word: 'Toe Beans',       definition: "The soft squishy paw pads on a cat's feet" },
  { word: 'Zoomies',         definition: 'Sudden bursts of energy when cats run wildly, common at night' },
];

const CARD_COLOR = '#C8D8E8';


function FlipCard({ word, index, color }: { word: typeof WORDS[0]; index: number; color: string }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity     = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOpacity      = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8, tension: 60,
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
        <Text style={styles.eyebrow}>CATIONARY</Text>
        <Text style={styles.cardWord}>{word.word}</Text>
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
        <Text style={styles.eyebrow}>DEFINITION</Text>
        <View style={styles.backContent}>
          <Text style={styles.cardWordSmall}>{word.word}</Text>
          <View style={styles.divider} />
          <Text style={styles.cardDefinition}>{word.definition}</Text>
        </View>
        <View style={[styles.tapHint, { backgroundColor: 'rgba(44,26,14,0.06)' }]}>
          <Text style={[styles.tapHintText, { color: INK_SOFT }]}>Tap to flip back</Text>
        </View>
      </Animated.View>

    </TouchableOpacity>
  );
}

export default function Cationary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const catProgress = useRef(new Animated.Value(0)).current;

  const CAT_SIZE   = 36;
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: currentIndex / (WORDS.length - 1),
      friction: 6, tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const goToIndex = (index: number) => setCurrentIndex(index);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Progress bar */}
        <View style={styles.progressArea}>
          <Animated.Image
            source={CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, {
              width: catProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            }]} />
          </View>
        </View>

        {/* Card */}
        <View style={styles.cardArea}>
          <FlipCard
            key={currentIndex}
            word={WORDS[currentIndex]}
            index={currentIndex}
            color={CARD_COLOR}
          />
        </View>

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={() => currentIndex > 0 && goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, currentIndex === 0 && styles.arrowDisabled]}>←</Text>
          </TouchableOpacity>

          <Text style={styles.counterText}>{currentIndex + 1} / {WORDS.length}</Text>

          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnNext, currentIndex === WORDS.length - 1 && styles.navBtnDisabled]}
            onPress={() => currentIndex < WORDS.length - 1 && goToIndex(currentIndex + 1)}
            disabled={currentIndex === WORDS.length - 1}
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
    paddingTop: 24,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  // Progress
  progressArea: {
    marginTop: 16,
    marginBottom: 8,
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
    width: 36, height: 36,
    top: -30,
  },

  // Card
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },

  flipContainer: {
    width: '100%',
    height: 320,
  },

  card: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    padding: 28,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backfaceVisibility: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',   // add this
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },

  cardBack: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: WHITE,
  },

  eyebrow: {
    fontFamily: 'Avenir',
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.35)',
    letterSpacing: 2,
    alignSelf: 'flex-start',  // add this
  },

  cardWord: {
    fontFamily: 'Avenir',
    fontSize: 36,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 42,
    textAlign: 'center',   // add this
  },

  backContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
    marginVertical: 8,
  },

  cardWordSmall: {
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
  },

  cardDefinition: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 24,
  },

  tapHint: {
    alignSelf: 'center',
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  tapHintText: {
    fontFamily: 'Avenir',
    fontSize: 11,
    fontWeight: '700',
    color: INK,
    letterSpacing: 0.3,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
    paddingHorizontal: 20,
  },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(44,26,14,0.15)',
  },
  dotActive: {
    backgroundColor: INK,
    width: 18,
  },
  dotSeen: {
    backgroundColor: GREEN,
  },

  // Nav
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 4,
  },
  navBtn: {
    width: 92, height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },
    navBtnNext: {
    backgroundColor: '#C8D8E8',
    borderBottomWidth: 4,
    borderBottomColor: '#7A9BBE',
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
    color: '#2C1A0E',
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