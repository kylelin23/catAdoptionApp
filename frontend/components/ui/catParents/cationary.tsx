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
  ScrollView,
} from "react-native";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

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
    word: "Al\u00ADlo\u00ADgroom\u00ADing",
    definition:
      "Cats groom\u00ADing each oth\u00ADer, a sign of bond\u00ADing and trust",
  },
  {
    word: "Bunt\u00ADing",
    definition:
      "When a cat rubs their head or cheeks on you or ob\u00ADjects to mark their scent",
  },
  {
    word: "Chirp\u00ADing",
    definition: "The noise cats make when watch\u00ADing birds or prey",
  },
  {
    word: "Clow\u00ADder",
    definition: "A group of cats liv\u00ADing to\u00ADgeth\u00ADer",
  },
  {
    word: "Flehmen Re\u00ADsponse",
    definition:
      "Slight open-mouth ex\u00ADpres\u00ADsion when a cat is ana\u00ADlyz\u00ADing a scent",
  },
  {
    word: "Groom\u00ADing",
    definition: "Cat lick\u00ADing to clean them\u00ADselves",
  },
  {
    word: "Hiss\u00ADing",
    definition:
      'De\u00ADfens\u00ADive warn\u00ADing to strangers or oth\u00ADer cats to "back off"',
  },
  {
    word: "Loaf Pos\u00ADi\u00ADtion",
    definition:
      "Cat pos\u00ADi\u00ADtion with paws tucked un\u00ADder, in\u00ADdic\u00ADates a re\u00ADlaxed cat",
  },
  {
    word: "Mark\u00ADing",
    definition:
      "Us\u00ADing scent (rub\u00ADbing or spray\u00ADing) to mark ter\u00ADrit\u00ADory",
  },
  {
    word: "Overstim\u00ADu\u00ADla\u00ADtion",
    definition:
      "When pet\u00ADting or play\u00ADing be\u00ADcomes too much, leads to cat bit\u00ADing or swat\u00ADting",
  },
  {
    word: "Phero\u00ADmones",
    definition:
      "Chem\u00ADic\u00ADal sig\u00ADnals cats use to com\u00ADmu\u00ADnic\u00ADate safety",
  },
  {
    word: "Scent Swap\u00ADping",
    definition:
      "Ex\u00ADchan\u00ADging bed\u00ADding or items to in\u00ADtro\u00ADduce cats through smell first",
  },
  {
    word: "Slow Blink",
    definition:
      "A sign of trust and af\u00ADfec\u00ADtion, of\u00ADten called a cat kiss",
  },
  {
    word: "Toe Beans",
    definition: "The soft squishy paw pads on a cat's feet",
  },
  {
    word: "Zoomies",
    definition:
      "Sud\u00ADden bursts of en\u00ADergy when cats run wildly, com\u00ADmon at night",
  },
];

const CARD_COLOR = "#C8D8E8";

function FlipCard({ word, color }: { word: (typeof WORDS)[0]; color: string }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [containerHeight, setContainerHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

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

  const handleScroll = (e: any) => {
    scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  const needsScrollbar = contentHeight > containerHeight + 1;
  const thumbHeight = needsScrollbar
    ? Math.max(24, (containerHeight / contentHeight) * containerHeight)
    : containerHeight;
  const thumbTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(contentHeight - containerHeight, 1)],
    outputRange: [0, Math.max(containerHeight - thumbHeight, 0)],
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity
      onPress={flip}
      disabled={flipped}
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
        <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
          CATIONARY
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
            Tap to reveal
          </Text>
        </View>
      </Animated.View>

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
        <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
          DEFINITION
        </Text>

        <View
          style={styles.backContent}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
          <Text
            style={styles.cardWordSmall}
            maxFontSizeMultiplier={1.4}
            numberOfLines={2}
          >
            {word.word}
          </Text>
          <View style={styles.divider} />

          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.defScroll}
              contentContainerStyle={styles.defScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              scrollEventThrottle={16}
              onContentSizeChange={(_, h) => setContentHeight(h)}
              onScroll={handleScroll}
            >
              <Text style={styles.cardDefinition}>{word.definition}</Text>
            </ScrollView>

            {needsScrollbar && (
              <View style={styles.scrollTrack}>
                <Animated.View
                  style={[
                    styles.scrollThumb,
                    {
                      height: thumbHeight,
                      transform: [{ translateY: thumbTranslateY }],
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={flip} activeOpacity={0.7}>
          <View
            style={[styles.tapHint, { backgroundColor: "rgba(44,26,14,0.06)" }]}
          >
            <Text
              style={[styles.tapHintText, { color: INK_SOFT }]}
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
            >
              Tap to flip back
            </Text>
          </View>
        </TouchableOpacity>
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

  const scrollRef = useRef<ScrollView>(null);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);

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
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, g) =>
        Math.abs(g.dx) > 5 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,

      onPanResponderGrant: () => {
        setOuterScrollEnabled(false);
      },

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
        setOuterScrollEnabled(true);
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

      onPanResponderTerminate: () => {
        setOuterScrollEnabled(true);
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        scrollEnabled={outerScrollEnabled}
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
            Click the flashcard to learn about cat vocabulary, and swipe left
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
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 16,
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
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  cardWrapper: {
    position: "absolute",
    width: CARD_WIDTH,
    height: "100%",
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
    fontSize: 30,
    fontWeight: "900",
    color: INK,
    letterSpacing: -1,
    lineHeight: 36,
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
  scrollWrapper: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  defScroll: {
    flex: 1,
  },
  defScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingRight: 10,
  },
  scrollTrack: {
    width: 4,
    marginLeft: 6,
    borderRadius: 2,
    backgroundColor: "rgba(44,26,14,0.08)",
    overflow: "hidden",
  },
  scrollThumb: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#7A9BBE",
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
    height: "100%",
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
