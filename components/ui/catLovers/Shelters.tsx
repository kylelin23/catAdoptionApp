import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions, Image } from "react-native";

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const WARM = '#D4956A';
const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../assets/images/paw.png');
const CAT = require('../../../assets/images/walkingCat.png');

const CARDS = [
  {
    title: 'Community Cats',
    color: '#C8D8E8',
    bullets: [
      'Could be feral cats who were never socialized to humans',
      'Also known as stray cats who were once pets but got lost or were abandoned',
      'Live in colonies',
      'Survive by hunting and relying on neighbors or colony feeders',
    ],
  },
  {
    title: 'Trap-Neuter-Return (TNR)',
    color: '#C4DDB0',
    bullets: [
      'A humane and effective approach to controlling populations of community cats',
      'Involves trapping cats/kittens and taking them to a shelter to be spayed or neutered',
      'At the vet, they are also vaccinated and microchipped',
      'During surgery, the cat\'s ear is tipped, signaling they have already been spayed or neutered',
      'After recovery, cats that are not socialized are returned to the colony',
      'Cats who are friendly may be adopted into homes',
      'Kittens under 8 weeks can often be socialized and adopted',
    ],
  },
  {
    title: 'Caring for Colonies',
    color: '#F2C9A0',
    bullets: [
      'Colony caretakers look after community cats',
      'Provide fresh water and food daily',
      'Keep feeding area clean to avoid complaints from neighborhood',
      'Monitor cats for illness or injury',
      'Build or provide weatherproof shelters',
      'TNR to make sure all cats are spayed and neutered',
    ],
  },
  {
    title: 'Barn Cats',
    color: '#E8C8B8',
    bullets: [
      'Community cats who live in farms, barns or warehouses',
      'Help to catch mice and control rodents',
      'Lower maintenance than house cats',
      'Should also be vaccinated and provided food daily',
      'May never become indoor pets but some have become affectionate over time',
    ],
  },
];

function FlipCard({ card, index, color }: { card: typeof CARDS[0], index: number, color: string }) {
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
        <Text style={styles.cardCounter}>{index + 1} of {CARDS.length}</Text>
        <View style={styles.cardCenter}>
          <Text style={styles.cardLabel}>COMMUNITY CATS</Text>
          <Text style={styles.cardWord}>{card.title}</Text>
        </View>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to learn more</Text>
        </View>
      </Animated.View>

      {/* Back */}
      <Animated.View style={[
        styles.card,
        styles.cardBack,
        { backgroundColor: WHITE },
        { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
      ]}>
        <Text style={styles.cardCounter}>{index + 1} of {CARDS.length}</Text>
        <Text style={styles.cardWordSmall}>{card.title}</Text>
        <View style={styles.divider} />
        <View style={styles.bulletsArea}>
          {card.bullets.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <Image source={PAW} style={styles.bulletPaw} resizeMode="contain" />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to flip back</Text>
        </View>
      </Animated.View>

    </TouchableOpacity>
  );
}

export default function CommunityCats() {
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
      toValue: currentIndex / (CARDS.length - 1),
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

      {/* Progress bar */}
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
          card={CARDS[currentIndex]}
          index={currentIndex}
          color={CARDS[currentIndex].color}
        />
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {CARDS.map((_, i) => (
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

        <Text style={styles.counterText}>{currentIndex + 1} of {CARDS.length}</Text>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext, currentIndex === CARDS.length - 1 && styles.navButtonDisabled]}
          onPress={() => currentIndex < CARDS.length - 1 && goToIndex(currentIndex + 1)}
          disabled={currentIndex === CARDS.length - 1}
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
    height: 340,
  },

  card: {
    width: '100%',
    height: 340,
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
    gap: 8,
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
    fontSize: 30,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.8,
    lineHeight: 36,
  },

  cardWordSmall: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.4,
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 1,
  },

  bulletsArea: {
    flex: 1,
    gap: 7,
    justifyContent: 'center',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPaw: {
    width: 14,
    height: 14,
    tintColor: WARM,
    marginTop: 3,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 17,
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
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(44,26,14,0.15)',
  },
  dotActive: {
    backgroundColor: INK,
    width: 22,
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