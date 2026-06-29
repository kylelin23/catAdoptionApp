import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  SafeAreaView,
  PanResponder,
} from "react-native";
import { mixpanel } from "../../../lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";

const { width: screenWidth } = Dimensions.get("window");

const CARD_WIDTH = screenWidth * 0.88;

const CAT = require("../../../assets/images/walkingCat.png");

const WORDS = [
  {
    word: "Allogrooming",
    definition: "Cats grooming each other, a sign of bonding and trust",
  },
  {
    word: "Bunting",
    definition:
      "When a cat rubs their head or cheeks on you or objects to mark their scent",
  },
  {
    word: "Chirping",
    definition: "The noise cats make when watching birds or prey",
  },
  { word: "Clowder", definition: "A group of cats living together" },
  {
    word: "Flehmen Response",
    definition: "Slight open-mouth expression when a cat is analyzing a scent",
  },
  { word: "Grooming", definition: "Cat licking to clean themselves" },
  {
    word: "Hissing",
    definition: 'Defensive warning to strangers or other cats to "back off"',
  },
  {
    word: "Loaf Position",
    definition: "Cat position with paws tucked under, indicates a relaxed cat",
  },
  {
    word: "Marking",
    definition: "Using scent (rubbing or spraying) to mark territory",
  },
  {
    word: "Overstimulation",
    definition:
      "When petting or playing becomes too much, leads to cat biting or swatting",
  },
  {
    word: "Pheromones",
    definition: "Chemical signals cats use to communicate safety",
  },
  {
    word: "Scent Swapping",
    definition:
      "Exchanging bedding or items to introduce cats through smell first",
  },
  {
    word: "Slow Blink",
    definition: "A sign of trust and affection, often called a cat kiss",
  },
  {
    word: "Toe Beans",
    definition: "The soft squishy paw pads on a cat's feet",
  },
  {
    word: "Zoomies",
    definition: "Sudden bursts of energy when cats run wildly, common at night",
  },
];

const CARD_COLOR = "#C8D8E8";

function FlipCard({ word, color }: { word: (typeof WORDS)[0]; color: string }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
  }, [word]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
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
    <TouchableOpacity
      onPress={flip}
      activeOpacity={1}
      style={styles.flipContainer}
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
        <Text style={styles.eyebrow}>CATIONARY</Text>

        <Text style={styles.cardWord}>{word.word}</Text>

        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to reveal</Text>
        </View>
      </Animated.View>

      <Animated.View
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
        <Text style={styles.eyebrow}>DEFINITION</Text>

        <View style={styles.backContent}>
          <Text style={styles.cardWordSmall}>{word.word}</Text>
          <View style={styles.divider} />
          <Text style={styles.cardDefinition}>{word.definition}</Text>
        </View>

        <View
          style={[styles.tapHint, { backgroundColor: "rgba(44,26,14,0.06)" }]}
        >
          <Text style={[styles.tapHintText, { color: INK_SOFT }]}>
            Tap to flip back
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function Cationary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const currentIndexRef = useRef(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideScreenAnim = useRef(new Animated.Value(25)).current;
  const reviewCardOpacity = useRef(new Animated.Value(1)).current;
  const reviewCardSlide = useRef(new Animated.Value(0)).current;
  const reviewBtnScale = useRef(new Animated.Value(0)).current;

  const catProgress = useRef(new Animated.Value(0)).current;
  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;

  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: "clamp",
  });

  const cardAnimations = useRef(
    WORDS.map(() => ({
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      scale: new Animated.Value(1),
    })),
  ).current;

  const SWIPE_THRESHOLD = screenWidth * 0.25;
  const SWIPE_VELOCITY = 0.4;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideScreenAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: WORDS.length > 1 ? currentIndex / (WORDS.length - 1) : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    if (showReviewScreen) {
      reviewBtnScale.setValue(0.5);
      Animated.spring(reviewBtnScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [showReviewScreen]);

  const resetDeck = () => {
    WORDS.forEach((_, index) => {
      cardAnimations[index].pan.setValue({ x: 0, y: 0 });
      cardAnimations[index].scale.setValue(index === 0 ? 1 : 0.95);
    });
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setShowReviewScreen(false);

    reviewCardOpacity.setValue(1);
    reviewCardSlide.setValue(0);

    fadeAnim.setValue(0);
    slideScreenAnim.setValue(25);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideScreenAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleReviewAgainPress = () => {
    Animated.sequence([
      Animated.timing(reviewBtnScale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(reviewBtnScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(reviewCardOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(reviewCardSlide, {
          toValue: 40,
          duration: 280,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      resetDeck();
    });
  };

  const goNext = () => {
    const idx = currentIndexRef.current;
    const currentCard = cardAnimations[idx];
    const nextCard = idx < WORDS.length - 1 ? cardAnimations[idx + 1] : null;

    mixpanel.track("Cationary Card Swiped", {
      "Screen Name": "Cationary",
      "Card Index": idx,
      Word: WORDS[idx].word,
      "Is Last Card": idx === WORDS.length - 1,
    });

    Animated.parallel([
      Animated.timing(currentCard.pan, {
        toValue: { x: -screenWidth * 1.3, y: 0 },
        duration: 220,
        useNativeDriver: true,
      }),
      nextCard
        ? Animated.spring(nextCard.scale, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          })
        : Animated.timing(new Animated.Value(0), {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
    ]).start(() => {
      if (idx >= WORDS.length - 1) {
        setShowReviewScreen(true);
      } else {
        currentIndexRef.current = idx + 1;
        setCurrentIndex(idx + 1);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 5 && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderMove: (_, g) => {
        const idx = currentIndexRef.current;
        const dx = g.dx;

        if (dx < 0) {
          cardAnimations[idx].pan.setValue({ x: dx, y: g.dy * 0.1 });
          if (idx < WORDS.length - 1) {
            const progress = Math.min(Math.abs(dx) / (screenWidth * 0.5), 1);
            cardAnimations[idx + 1].scale.setValue(0.95 + progress * 0.05);
          }
        } else if (dx > 0) {
          cardAnimations[idx].pan.setValue({ x: dx * 0.18, y: g.dy * 0.05 });
        }
      },

      onPanResponderRelease: (_, g) => {
        const idx = currentIndexRef.current;
        const swipedLeft = g.dx < -SWIPE_THRESHOLD || g.vx < -SWIPE_VELOCITY;

        if (g.dx < 0 && swipedLeft) {
          goNext();
        } else {
          Animated.parallel(
            [
              Animated.spring(cardAnimations[idx].pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
                friction: 5,
              }),
              idx < WORDS.length - 1
                ? Animated.spring(cardAnimations[idx + 1].scale, {
                    toValue: 0.95,
                    useNativeDriver: true,
                    friction: 5,
                  })
                : null,
            ].filter(Boolean) as Animated.CompositeAnimation[],
          ).start();
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideScreenAnim }] },
        ]}
      >
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
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.instructionText}>
          Click the flashcard to learn about cat vocabulary, and swipe left for
          the next card!
        </Text>

        <View style={styles.cardArea}>
          {showReviewScreen ? (
            <Animated.View
              style={[
                styles.reviewContainer,
                {
                  opacity: reviewCardOpacity,
                  transform: [{ translateY: reviewCardSlide }],
                },
              ]}
            >
              <Text style={styles.reviewHeading}>Great Job!</Text>
              <Text style={styles.reviewSubheading}>
                You've finished! Click below to go through the cards again!{" "}
              </Text>

              <Animated.View style={{ transform: [{ scale: reviewBtnScale }] }}>
                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={handleReviewAgainPress}
                  activeOpacity={0.85}
                >
                  <Text style={styles.reviewBtnText}>Review Again</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          ) : (
            WORDS.map((word, index) => {
              if (index < currentIndex || index > currentIndex + 1) {
                return null;
              }

              const cardAnim = cardAnimations[index];
              const rotateCard = cardAnim.pan.x.interpolate({
                inputRange: [-screenWidth / 2, 0, screenWidth / 2],
                outputRange: ["-10deg", "0deg", "10deg"],
                extrapolate: "clamp",
              });

              const animatedStyles = {
                transform: [
                  { translateX: cardAnim.pan.x },
                  { translateY: cardAnim.pan.y },
                  { scale: cardAnim.scale },
                  { rotate: rotateCard },
                ],
                zIndex: WORDS.length - index,
              };

              const isCurrent = index === currentIndex;
              const isUnderneath = index === currentIndex + 1;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardWrapper,
                    animatedStyles,
                    isUnderneath && styles.backgroundCard,
                  ]}
                  {...(isCurrent ? panResponder.panHandlers : {})}
                >
                  <FlipCard word={word} color={CARD_COLOR} />
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.bottomNav}>
          <Text style={styles.pageCounter}>
            {showReviewScreen ? WORDS.length : currentIndex + 1} /{" "}
            {WORDS.length}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  progressArea: {
    marginTop: 12,
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(44,26,14,0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 5,
  },
  progressCat: {
    position: "absolute",
    width: 36,
    height: 36,
    top: -30,
  },
  instructionText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "600",
    color: INK_SOFT,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  cardWrapper: {
    position: "absolute",
    width: CARD_WIDTH,
    height: "92%",
    maxHeight: 460,
  },
  backgroundCard: {
    opacity: 1,
  },
  flipContainer: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    padding: 24,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    backfaceVisibility: "hidden",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 5,
    borderBottomColor: "rgba(44,26,14,0.12)",
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.35)",
    letterSpacing: 2,
    alignSelf: "flex-start",
  },
  cardWord: {
    fontFamily: "Avenir",
    fontSize: 34,
    fontWeight: "900",
    color: INK,
    letterSpacing: -1,
    lineHeight: 40,
    textAlign: "center",
  },
  backContent: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    marginVertical: 8,
    width: "100%",
  },
  cardWordSmall: {
    fontFamily: "Avenir",
    fontSize: 20,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1.5,
    backgroundColor: "rgba(44,26,14,0.08)",
    borderRadius: 1,
  },
  cardDefinition: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 24,
  },
  tapHint: {
    alignSelf: "center",
    backgroundColor: "rgba(44,26,14,0.08)",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tapHintText: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "700",
    color: INK,
    letterSpacing: 0.3,
  },
  reviewContainer: {
    width: CARD_WIDTH,
    height: "92%",
    maxHeight: 460,
    borderRadius: 24,
    padding: 32,
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 5,
    borderBottomColor: "rgba(44,26,14,0.12)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  reviewHeading: {
    fontFamily: "Avenir",
    fontSize: 26,
    fontWeight: "900",
    color: INK,
    textAlign: "center",
  },
  reviewSubheading: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "500",
    color: INK_SOFT,
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewBtn: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
  },
  reviewBtnText: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "800",
    color: WHITE,
  },
  bottomNav: {
    width: CARD_WIDTH,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageCounter: {
    fontFamily: "Avenir",
    fontSize: 17,
    fontWeight: "800",
    color: INK_SOFT,
  },
});
