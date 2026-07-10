import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { mixpanel } from "../../../frontend/lib/mixpanel";

const { width: W, height: H } = Dimensions.get("window");

const INK = "#2C1A0E";
const SAND = "#E8C9A0";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";

const CAT_IMG = require("../../assets/images/cat.png");
const PAW = require("../../assets/images/paw.png");
const WALKING_CAT = require("../../assets/images/walkingCat.png");

const CAT_FACTS = [
  "About 80% of orange (ginger) cats are male.",
  "Calico cats are almost always female — roughly 99.9%.",
  "Tortoiseshell cats are overwhelmingly female.",
  "White cats with two blue eyes have a roughly 65–85% chance of being deaf.",
  "All cats are born with blue eyes — permanent eye color develops between 6–8 weeks of age.",
  "Kittens are born blind and deaf, with eyes and ears opening around 10–14 days after birth.",
  "Kittens can't regulate body temperature until about 4 weeks old, relying on mom and littermates for warmth.",
  "The optimal window for socializing kittens is between 2–7 weeks of age.",
  'Cats "slow blink" as a sign of trust and affection.',
  "A cat shows you its belly as a sign of trust.",
  'Cats bring their owners "gifts" like prey or toys when they treat you as family.',
  "Cats chirp and chatter at birds and squirrels through windows.",
  "Cats rub their faces on people to mark them as safe and familiar.",
  'Cats always land on their feet thanks to a "righting reflex".',
  "A cat's purr vibrates at 25–150 Hz, known to promote healing.",
  "Cats have 32 muscles in each ear and can rotate them 180 degrees independently.",
  "Cats can squeeze through any opening their head fits through, thanks to a highly flexible collarbone.",
  "All domestic cats share about 95.6% of their DNA with tigers.",
  "A cat's nose print is as unique as a human fingerprint.",
  "Cats sleep 12–16 hours a day on average.",
  "Adult cats almost never meow at other cats.",
];

let hasVisited = false;

const CAT_SIZE = 36;
const TRACK_WIDTH = W - 80;

function FloatingPaw({
  x,
  delay,
  duration,
  size,
  opacity,
}: {
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}) {
  const y = useRef(new Animated.Value(H + 40)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = () => {
      y.setValue(H + 40);
      fade.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, { toValue: -60, duration, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(fade, {
              toValue: opacity,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(duration - 1000),
            Animated.timing(fade, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => run());
    };
    run();
  }, []);

  return (
    <Animated.Image
      source={PAW}
      style={{
        position: "absolute",
        left: W * x,
        width: size,
        height: size,
        tintColor: INK,
        opacity: fade,
        transform: [{ translateY: y }],
      }}
      resizeMode="contain"
    />
  );
}

const PAWS = [
  { x: 0.08, delay: 0, duration: 5000, size: 18, opacity: 0.08 },
  { x: 0.75, delay: 1200, duration: 6000, size: 14, opacity: 0.06 },
  { x: 0.45, delay: 2400, duration: 5500, size: 16, opacity: 0.07 },
];

const BAR_TOTAL_DURATION = 5000;

export default function HomeScreen({ navigation }: { navigation: any }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);
  const hasNavigated = useRef(false);

  const [currentFact, setCurrentFact] = useState("");

  const catScale = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const catOpacity = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;
  const logoOp = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const logoY = useRef(new Animated.Value(hasVisited ? 0 : -20)).current;
  const barProgress = useRef(new Animated.Value(0)).current;

  const navigateNow = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    navigation.replace("Home");
  };

  const startBar = (duration: number) => {
    Animated.timing(barProgress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) navigateNow();
    });
  };

  const startIdleAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(circlePulse, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(circlePulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const loadContent = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    Animated.parallel([
      Animated.spring(logoY, {
        toValue: 0,
        friction: 10,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(logoOp, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      startIdleAnimations();
    });
  };

  useEffect(() => {
    mixpanel.track("App Opened", {
      "Screen Name": "Home",
    });
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    setCurrentFact(CAT_FACTS[randomIndex]);

    if (hasVisited) {
      loadedRef.current = true;
      startIdleAnimations();
      startBar(800);
      return;
    }

    startBar(BAR_TOTAL_DURATION);

    Animated.sequence([
      Animated.delay(10),
      Animated.parallel([
        Animated.spring(catScale, {
          toValue: 1,
          friction: 6,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.timing(catOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      hasVisited = true;
      timeoutRef.current = setTimeout(loadContent, 50);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const catX = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: "clamp",
  });

  const barWidth = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {PAWS.map((p, i) => (
        <FloatingPaw key={i} {...p} />
      ))}

      <Animated.View
        style={[
          styles.logoArea,
          { opacity: logoOp, transform: [{ translateY: logoY }] },
        ]}
      >
        <Text style={styles.logoText} maxFontSizeMultiplier={1.2}>
          catwise
        </Text>
      </Animated.View>

      <View style={styles.mascotArea}>
        <Animated.View
          style={[styles.shadowRing, { transform: [{ scale: circlePulse }] }]}
        />
        <Animated.View
          style={[
            styles.catWrapper,
            {
              opacity: catOpacity,
              transform: [{ scale: catScale }],
            },
          ]}
        >
          <View style={styles.catCircle}>
            <Image
              source={CAT_IMG}
              style={styles.catImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>

      <View style={styles.whiteContent}>
        <View style={styles.factContainer}>
          <Text style={styles.factLabel} maxFontSizeMultiplier={1.3}>
            Did you know?
          </Text>
          <Text style={styles.factText} maxFontSizeMultiplier={1.4}>
            {currentFact}
          </Text>
        </View>

        <View style={styles.progressArea}>
          <Animated.Image
            source={WALKING_CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center",
    overflow: "hidden",
  },
  bgTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.55,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.48,
    backgroundColor: WHITE,
  },
  logoArea: {
    marginTop: H * 0.08,
    alignItems: "center",
  },
  logoText: {
    fontFamily: "Avenir",
    fontSize: 28,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  mascotArea: {
    position: "absolute",
    top: H * 0.22,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowRing: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(44,26,14,0.06)",
  },
  catWrapper: {
    width: 154,
    height: 154,
    borderRadius: 77,
    shadowColor: "#A0622A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  catCircle: {
    width: 154,
    height: 154,
    borderRadius: 77,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(255,250,245,0.8)",
    backgroundColor: "rgba(255,250,245,0.3)",
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
  whiteContent: {
    position: "absolute",
    bottom: H * 0.12,
    width: "100%",
    paddingHorizontal: 40,
  },
  factContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  factLabel: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "bold",
    color: GREEN,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  factText: {
    fontFamily: "Avenir",
    fontSize: 15,
    color: INK,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  progressArea: {
    width: "100%",
  },
  progressCat: {
    position: "absolute",
    width: CAT_SIZE,
    height: CAT_SIZE,
    top: -CAT_SIZE + 6,
    zIndex: 1,
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
});
