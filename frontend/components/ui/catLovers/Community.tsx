import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  PanResponder,
} from "react-native";
import { mixpanel } from "../../../lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CARD_WIDTH = screenWidth * 0.88;

const CAT = require("../../../assets/images/walkingCat.png");

const WORDS = [
  {
    word: "Com\u00ADmun\u00ADity Cats",
    definition:
      "• Could be fer\u00ADal cats who were nev\u00ADer so\u00ADcial\u00ADized to hu\u00ADmans\n• Also known as stray cats who were once pets but got lost or were aban\u00ADdoned\n• Live in col\u00ADon\u00ADies\n• Sur\u00ADvive by hunt\u00ADing and re\u00ADly\u00ADing on neigh\u00ADbors or col\u00ADony feed\u00ADers",
  },
  {
    word: "Trap-Neuter-Return (TNR)",
    definition:
      "• Is a hu\u00ADmane and ef\u00ADfect\u00ADive ap\u00ADproach to con\u00ADtrol\u00ADling pop\u00ADu\u00ADla\u00ADtions of com\u00ADmun\u00ADity cats\n• In\u00ADvolves trap\u00ADping cats/kittens and tak\u00ADing them to a shel\u00ADter to be spayed or neu\u00ADtered\n• At the vet, they are also vac\u00ADcin\u00ADated and micro\u00ADchipped\n• Dur\u00ADing sur\u00ADgery, the cat's ear is tipped, sig\u00ADnal\u00ADing that they have al\u00ADready been spayed or neu\u00ADtered\n• After re\u00ADcov\u00ADery (a few days), cats that are not so\u00ADcial\u00ADized are re\u00ADturned to the col\u00ADony where they were trapped\n• Cats who are friend\u00ADly and so\u00ADcial\u00ADized to people may be adop\u00ADted in\u00ADto homes\n• Kit\u00ADtens un\u00ADder 8 weeks can of\u00ADten be so\u00ADcial\u00ADized and adop\u00ADted",
  },
  {
    word: "Car\u00ADing for Col\u00ADon\u00ADies",
    definition:
      "• Col\u00ADony care\u00ADtakers look after com\u00ADmun\u00ADity cats\n• Pro\u00ADvide fresh wa\u00ADter and food daily\n• Keep feed\u00ADing area clean to avoid com\u00ADplaints from neigh\u00ADbor\u00ADhood\n• Mon\u00ADit\u00ADor cats for ill\u00ADness or in\u00ADjury\n• Build or pro\u00ADvide weath\u00ADer\u00ADproof shel\u00ADters\n• TNR to make sure all cats are spayed and neu\u00ADtered",
  },
  {
    word: "Barn Cats",
    definition:
      "• Com\u00ADmun\u00ADity cats who live in farms, barns or ware\u00ADhouses\n• Help to catch mice and con\u00ADtrol ro\u00ADdents\n• Lower main\u00ADten\u00ADance than house cats\n• Should also be vac\u00ADcin\u00ADated and pro\u00ADvided food daily\n• May nev\u00ADer be\u00ADcome in\u00ADdoor pets but some have be\u00ADcome af\u00ADfec\u00ADtion\u00ADate over time",
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
    <View style={styles.flipContainer}>
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
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            COMMUNITY RESOURCES
          </Text>

          <Text
            style={styles.cardWord}
            maxFontSizeMultiplier={1.4}
            numberOfLines={4}
          >
            {word.word}
          </Text>

          <View style={styles.tapHint}>
            <Text
              style={styles.tapHintText}
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
            >
              Tap to learn more
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        pointerEvents={flipped ? "auto" : "none"}
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
        <TouchableOpacity
          onPress={flip}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.backContent} pointerEvents="box-none">
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            OVERVIEW
          </Text>
          <Text
            style={styles.cardWordSmall}
            maxFontSizeMultiplier={1.4}
            numberOfLines={2}
          >
            {word.word}
          </Text>
          <View style={styles.divider} />

          <ScrollView
            style={styles.scrollTextContainer}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollTextContent}
          >
            <Text style={styles.cardDefinition}>{word.definition}</Text>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

export default function Community() {
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

    mixpanel.track("Community Card Swiped", {
      "Screen Name": "Community",
      "Card Index": idx,
      Word: WORDS[idx].word,
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideScreenAnim }],
            },
          ]}
        >
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
                      outputRange: ["0%", "100%"],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.instructionText} maxFontSizeMultiplier={1.3}>
            Click the flashcard to learn about community cats, and swipe left
            for the next card!
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
                <Text style={styles.reviewHeading} maxFontSizeMultiplier={1.4}>
                  Great Job!
                </Text>
                <Text
                  style={styles.reviewSubheading}
                  maxFontSizeMultiplier={1.4}
                  numberOfLines={4}
                >
                  You've finished! Click below to go through the cards
                  again!{" "}
                </Text>

                <Animated.View
                  style={{ transform: [{ scale: reviewBtnScale }] }}
                >
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={handleReviewAgainPress}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={styles.reviewBtnText}
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      Review Again
                    </Text>
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
            <Text style={styles.pageCounter} maxFontSizeMultiplier={1.3}>
              {showReviewScreen ? WORDS.length : currentIndex + 1} /{" "}
              {WORDS.length}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    minHeight: screenHeight,
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
    minHeight: 460 + 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  cardWrapper: {
    position: "absolute",
    width: CARD_WIDTH,
    height: 460,
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
    overflow: "hidden",
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backContent: {
    flex: 1,
    width: "100%",
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.35)",
    letterSpacing: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  cardWord: {
    fontFamily: "Avenir",
    fontSize: 30,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
    lineHeight: 36,
    textAlign: "center",
  },
  cardWordSmall: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1.5,
    backgroundColor: "rgba(44,26,14,0.08)",
    borderRadius: 1,
    marginVertical: 4,
  },
  scrollTextContainer: {
    flex: 1,
    marginTop: 6,
  },
  scrollTextContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 4,
  },
  cardDefinition: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 21,
  },
  tapHint: {
    alignSelf: "center",
    backgroundColor: "rgba(44,26,14,0.08)",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
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
    height: 460,
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
    textAlign: "center",
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
