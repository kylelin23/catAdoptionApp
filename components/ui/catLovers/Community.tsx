import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const GREEN = '#7BAE6E';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CARD_WIDTH = screenWidth * 0.88;
const CARD_HEIGHT = screenHeight * 0.42;

const CAT = require('../../../assets/images/walkingCat.png');

const WORDS = [
  {
    word: 'Community Cats',
    definition: '• Could be feral cats who were never socialized to humans\n• Also known as stray cats who were once pets but got lost or were abandoned\n• Live in colonies\n• Survive by hunting and relying on neighbors or colony feeders'
  },
  {
    word: 'Trap-Neuter-Return (TNR)',
    definition: '• Is a humane and effective approach to controlling populations of community cats\n• Involves trapping cats/kittens and taking them to a shelter to be spayed or neutered\n• At the vet, they are also vaccinated and microchipped\n• During surgery, the cat\'s ear is tipped, signaling that they have already been spayed or neutered\n• After recovery (a few days), cats that are not socialized are returned to the colony where they were trapped\n• Cats who are friendly and socialized to people may be adopted into homes\n• Kittens under 8 weeks can often be socialized and adopted'
  },
  {
    word: 'Caring for Colonies',
    definition: '• Colony caretakers look after community cats\n• Provide fresh water and food daily\n• Keep feeding area clean to avoid complaints from neighborhood\n• Monitor cats for illness or injury\n• Build or provide weatherproof shelters\n• TNR to make sure all cats are spayed and neutered'
  },
  {
    word: 'Barn Cats',
    definition: '• Community cats who live in farms, barns or warehouses\n• Help to catch mice and control rodents\n• Lower maintenance than house cats\n• Should also be vaccinated and provided food daily\n• May never become indoor pets but some have become affectionate over time'
  },
];

const CARD_COLOR = '#C8D8E8';

function FlipCard({
  word,
  color,
}: {
  word: typeof WORDS[0];
  color: string;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
  }, [word]);

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
    <View style={styles.flipContainer}>
      {/* Front Face — Tapping flips it over */}
      <TouchableOpacity
        onPress={flip}
        disabled={flipped}
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: color,
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <Text style={styles.eyebrow}>COMMUNITY RESOURCES</Text>

          <Text style={styles.cardWord}>{word.word}</Text>

          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Tap to learn more</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Back Face */}
      <Animated.View
        pointerEvents={flipped ? 'auto' : 'none'}
        style={[
          styles.card,
          styles.cardBack,
          {
            backgroundColor: WHITE,
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity,
          },
        ]}
      >
        {/* Full card background touch targets back flip safely outside the ScrollView */}
        <TouchableOpacity
          onPress={flip}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.backContent} pointerEvents="box-none">
          <Text style={styles.eyebrow}>OVERVIEW</Text>
          <Text style={styles.cardWordSmall}>{word.word}</Text>
          <View style={styles.divider} />

          <ScrollView
            style={styles.scrollTextContainer}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollTextContent}
          >
            <Text style={styles.cardDefinition}>
              {word.definition}
            </Text>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

export default function Community() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const catProgress = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;

  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: WORDS.length > 1 ? currentIndex / (WORDS.length - 1) : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleNavigation = (direction: 'next' | 'prev') => {
    const isNext = direction === 'next';
    const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= WORDS.length) return;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isNext ? -screenWidth : screenWidth,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentIndex(nextIndex);
      slideAnim.setValue(isNext ? screenWidth : -screenWidth);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Progress */}
        <View style={styles.progressArea}>
          <Animated.Image
            source={CAT}
            style={[
              styles.progressCat,
              { transform: [{ translateX: catX }] },
            ]}
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

        {/* Card */}
        <View style={styles.cardArea}>
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              opacity: cardOpacity,
            }}
          >
            <FlipCard
              word={WORDS[currentIndex]}
              color={CARD_COLOR}
            />
          </Animated.View>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              currentIndex === 0 && styles.navBtnDisabled,
            ]}
            onPress={() => handleNavigation('prev')}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.arrowText,
                currentIndex === 0 &&
                  styles.arrowDisabled,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.counterText}>
            {currentIndex + 1} / {WORDS.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnNext,
              currentIndex === WORDS.length - 1 &&
                styles.navBtnDisabled,
            ]}
            onPress={() => handleNavigation('next')}
            disabled={
              currentIndex === WORDS.length - 1
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.arrowText,
                styles.arrowNext,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    width: 36,
    height: 36,
    top: -30,
  },

  // Card Area
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },

  flipContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 24,

    shadowColor: INK,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,

    backfaceVisibility: 'hidden',

    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',

    borderBottomWidth: 5,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },

  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  backContent: {
    flex: 1,
    width: '100%',
  },

  eyebrow: {
    fontFamily: 'Avenir',
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.35)',
    letterSpacing: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },

  cardWord: {
    fontFamily: 'Avenir',
    fontSize: 32,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
    lineHeight: 38,
    textAlign: 'center',
  },

  cardWordSmall: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
    marginVertical: 4,
  },

  scrollTextContainer: {
    flex: 1,
    marginTop: 10,
  },

  scrollTextContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 8,
  },

  cardDefinition: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 22,
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

  // Navigation
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 4,
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