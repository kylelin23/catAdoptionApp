import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  SafeAreaView,
  ScrollView,
} from "react-native";
import expectCards from "../../data/newCatParents/expect";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";
const GREEN_LIGHT = "#C4DDB0";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CARD_WIDTH = screenWidth * 0.88;
const CARD_HEIGHT = screenHeight * 0.5;

const PAW = require("../../../assets/images/paw.png");

const CAT_IMAGES = [
  require("../../../assets/images/cat.png"),
  require("../../../assets/images/catCute.png"),
  require("../../../assets/images/catStretch.png"),
  require("../../../assets/images/catWave.png"),
];

function FlipCard({ card, index }: { card: any; index: number }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [containerHeight, setContainerHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

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

  const flipFrontToBack = () => {
    if (!flipped) {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }).start();
      setFlipped(true);
    }
  };

  const handleScroll = (e: any) => {
    scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  const bullets = [
    card.bullet1,
    card.bullet2,
    card.bullet3,
    card.bullet4,
    card.bullet5,
  ].filter((b) => b && b !== "");

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
    <View style={styles.flipContainer}>
      <TouchableOpacity
        onPress={flipFrontToBack}
        disabled={flipped}
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: GREEN_LIGHT },
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <Text
            style={styles.frontTitle}
            maxFontSizeMultiplier={1.5}
            numberOfLines={4}
          >
            {card.category}
          </Text>
          <Image
            source={CAT_IMAGES[index % CAT_IMAGES.length]}
            style={styles.catSticker}
            resizeMode="contain"
          />
          <View style={styles.tapHint}>
            <Text
              style={styles.tapHintText}
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
            >
              Tap to see more
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        pointerEvents={flipped ? "auto" : "none"}
        style={[
          styles.card,
          styles.cardBack,
          { backgroundColor: WHITE },
          { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
        ]}
      >
        <Text
          style={styles.backHeading}
          maxFontSizeMultiplier={1.4}
          numberOfLines={3}
        >
          {card.category}
        </Text>
        <View style={styles.divider} />
        <View
          style={styles.scrollWrapper}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
          <ScrollView
            style={styles.bulletsScroll}
            contentContainerStyle={styles.bulletsContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            onContentSizeChange={(_, h) => setContentHeight(h)}
            onScroll={handleScroll}
          >
            {bullets.map((bullet, i) => (
              <View key={i} style={styles.bulletRow}>
                <Image
                  source={PAW}
                  style={styles.bulletPaw}
                  resizeMode="contain"
                />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
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
      </Animated.View>
    </View>
  );
}

export default function Expect({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const currentIndexRef = useRef(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const reviewCardOpacity = useRef(new Animated.Value(1)).current;
  const reviewCardSlide = useRef(new Animated.Value(0)).current;
  const reviewBtnScale = useRef(new Animated.Value(0)).current;

  const cardAnimations = useRef(
    expectCards.map(() => ({
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      scale: new Animated.Value(1),
    })),
  ).current;

  const SWIPE_THRESHOLD = screenWidth * 0.25;
  const SWIPE_VELOCITY = 0.4;

  const resetDeck = () => {
    expectCards.forEach((_, index) => {
      cardAnimations[index].pan.setValue({ x: 0, y: 0 });
      cardAnimations[index].scale.setValue(index === 0 ? 1 : 0.95);
    });
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setShowReviewScreen(false);

    reviewCardOpacity.setValue(1);
    reviewCardSlide.setValue(0);

    fadeAnim.setValue(0);
    slideAnim.setValue(25);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    mixpanel.track("Screen Opened", {
      "Screen Name": "Expected",
    });
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    const nextCard =
      idx < expectCards.length - 1 ? cardAnimations[idx + 1] : null;

    mixpanel.track("Expectation Card Swiped", {
      "Screen Name": "Expectation",
      "Card Index": idx,
      "Is Last Card": idx === expectCards.length - 1,
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
      if (idx >= expectCards.length - 1) {
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
          if (idx < expectCards.length - 1) {
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
              idx < expectCards.length - 1
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText} allowFontScaling={false}>
                {"<"}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View style={styles.headerCenter}>
                <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
                  NEW CAT PARENTS
                </Text>
                <Text style={styles.pageTitle} maxFontSizeMultiplier={1.4}>
                  First Week
                </Text>
              </View>
            </View>
          </View>

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
              expectCards.map((card, index) => {
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
                  zIndex: expectCards.length - index,
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
                    <FlipCard card={card} index={index} />
                  </Animated.View>
                );
              })
            )}
          </View>

          {!showReviewScreen && (
            <Text style={styles.instructionText} maxFontSizeMultiplier={1.3}>
              Swipe left to see the next card!
            </Text>
          )}

          <View style={styles.bottomNav}>
            <Text style={styles.pageCounter} maxFontSizeMultiplier={1.3}>
              {showReviewScreen ? expectCards.length : currentIndex + 1} /{" "}
              {expectCards.length}
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
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: "100%",
    maxWidth: 380,
    paddingVertical: 22,
    alignSelf: "center",
    gap: 16,
  },
  header: {
    width: CARD_WIDTH,
    alignSelf: "center",
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: INK,
    lineHeight: 22,
  },
  headerCenter: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: "Avenir",
    fontSize: 28,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  instructionText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "600",
    color: INK_SOFT,
    textAlign: "center",
    marginTop: -4,
    marginBottom: 2,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  cardArea: {
    minHeight: CARD_HEIGHT + 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  cardWrapper: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  backgroundCard: {
    opacity: 1,
  },
  flipContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 26,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backfaceVisibility: "hidden",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
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
    alignItems: "center",
    justifyContent: "flex-start",
  },
  frontTitle: {
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 28,
    textAlign: "center",
    alignSelf: "stretch",
  },
  catSticker: {
    width: CARD_HEIGHT * 0.35,
    height: CARD_HEIGHT * 0.35,
  },
  tapHint: {
    backgroundColor: "rgba(44,26,14,0.1)",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  tapHintText: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "700",
    color: INK,
    letterSpacing: 0.3,
  },
  backHeading: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.2,
    lineHeight: 21,
    alignSelf: "stretch",
  },
  divider: {
    height: 1.5,
    backgroundColor: "rgba(44,26,14,0.08)",
    borderRadius: 1,
    alignSelf: "stretch",
    marginBottom: 4,
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bulletsScroll: {
    flex: 1,
  },
  bulletsContent: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
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
    backgroundColor: GREEN,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bulletPaw: {
    width: 18,
    height: 18,
    tintColor: GREEN,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 19,
  },
  reviewContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
    paddingBottom: 4,
  },
  pageCounter: {
    fontFamily: "Avenir",
    fontSize: 17,
    fontWeight: "800",
    color: INK_SOFT,
  },
});
