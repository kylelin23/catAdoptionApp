import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Animated, Easing, Dimensions, SafeAreaView } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const INK = '#2C1A0E';
const SAND = '#E8C9A0';
const WHITE = '#FFFAF5';
const GREEN = '#7BAE6E';

const CAT_IMG     = require('../../assets/images/catWave.png');
const PAW         = require('../../assets/images/paw.png');
const WALKING_CAT = require('../../assets/images/walkingCat.png');

let hasVisited = false;

const CAT_SIZE    = 36;
const TRACK_WIDTH = W - 80;

function FloatingPaw({ x, delay, duration, size, opacity }: {
  x: number, delay: number, duration: number, size: number, opacity: number
}) {
  const y    = useRef(new Animated.Value(H + 40)).current;
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
            Animated.timing(fade, { toValue: opacity, duration: 500, useNativeDriver: true }),
            Animated.delay(duration - 1000),
            Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }),
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
        position: 'absolute',
        left: W * x,
        width: size, height: size,
        tintColor: INK,
        opacity: fade,
        transform: [{ translateY: y }],
      }}
      resizeMode="contain"
    />
  );
}

const PAWS = [
  { x: 0.08, delay: 0,    duration: 5000, size: 18, opacity: 0.08 },
  { x: 0.75, delay: 1200, duration: 6000, size: 14, opacity: 0.06 },
  { x: 0.45, delay: 2400, duration: 5500, size: 16, opacity: 0.07 },
];

const BAR_TOTAL_DURATION = 5000;

export default function HomeScreen({ navigation }: { navigation: any }) {
  const timeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef    = useRef(false);
  const hasNavigated = useRef(false);

  const catScale    = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const catOpacity  = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;
  const logoOp      = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const logoY       = useRef(new Animated.Value(hasVisited ? 0 : -20)).current;
  const barProgress = useRef(new Animated.Value(0)).current;

  const navigateNow = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    navigation.replace('Home');
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
        Animated.timing(circlePulse, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(circlePulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  };

  const loadContent = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    Animated.parallel([
      Animated.spring(logoY, { toValue: 0, friction: 10, tension: 200, useNativeDriver: true }),
      Animated.timing(logoOp, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      startIdleAnimations();
    });
  };

  useEffect(() => {
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
        Animated.spring(catScale, { toValue: 1, friction: 6, tension: 180, useNativeDriver: true }),
        Animated.timing(catOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
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
    extrapolate: 'clamp',
  });

  const barWidth = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {PAWS.map((p, i) => <FloatingPaw key={i} {...p} />)}

      <Animated.View style={[styles.logoArea, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
        <Text style={styles.logoText}>catwise</Text>
      </Animated.View>

      <View style={styles.mascotArea}>
        <Animated.View style={[styles.shadowRing, { transform: [{ scale: circlePulse }] }]} />
        <Animated.View style={[
          styles.catWrapper,
          {
            opacity: catOpacity,
            transform: [{ scale: catScale }],
          },
        ]}>
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
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: H * 0.55,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: H * 0.48,
    backgroundColor: WHITE,
  },
  logoArea: {
    marginTop: H * 0.08,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Avenir',
    fontSize: 28, fontWeight: '900',
    color: INK, letterSpacing: -0.5,
  },
  mascotArea: {
    position: 'absolute',
    top: H * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowRing: {
    position: 'absolute',
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(44,26,14,0.06)',
  },
  catWrapper: {
    width: 200, height: 200, borderRadius: 100,
    shadowColor: '#A0622A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 12,
  },
  catCircle: {
    width: 200, height: 200, borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255,250,245,0.8)',
    backgroundColor: 'rgba(255,250,245,0.3)',
  },
  catImage: { width: '100%', height: '100%' },
  whiteContent: {
    position: 'absolute',
    bottom: H * 0.15,
    width: '100%',
    paddingHorizontal: 40,
  },
  progressArea: {
    width: '100%',
  },
  progressCat: {
    position: 'absolute',
    width: CAT_SIZE,
    height: CAT_SIZE,
    top: -CAT_SIZE + 6,
    zIndex: 1,
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
});