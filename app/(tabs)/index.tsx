import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Image, Animated, Dimensions, SafeAreaView } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WHITE = '#FFFAF5';
const GREEN = '#7BAE6E';

const IMAGES = [
  require('../../assets/images/catWave.png'),
  require('../../assets/images/catStretch.png'),
  require('../../assets/images/cat.png'),
];

const PAW = require('../../assets/images/paw.png');

let hasVisited = false;

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

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef   = useRef(false);

  const catScale    = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const catOpacity  = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const catBounce   = useRef(new Animated.Value(0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;
  const imgOpacity  = useRef(new Animated.Value(1)).current;

  const logoOp  = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const logoY   = useRef(new Animated.Value(hasVisited ? 0 : -20)).current;
  const tagOp   = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const tagY    = useRef(new Animated.Value(hasVisited ? 0 : 20)).current;
  const pillsOp = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const btnOp   = useRef(new Animated.Value(hasVisited ? 1 : 0)).current;
  const btnY    = useRef(new Animated.Value(hasVisited ? 0 : 30)).current;

  const startIdleAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(catBounce, { toValue: -6, duration: 1000, useNativeDriver: true }),
        Animated.timing(catBounce, { toValue: 0,  duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circlePulse, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(circlePulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    intervalRef.current = setInterval(() => {
      Animated.timing(imgOpacity, { toValue: 0, duration: 350, useNativeDriver: true })
        .start(() => {
          setCurrentIndex(prev => (prev + 1) % IMAGES.length);
          Animated.timing(imgOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        });
    }, 2400);
  };

  const loadContent = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoY, { toValue: 0, friction: 10, tension: 200, useNativeDriver: true }),
        Animated.timing(logoOp, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.delay(15),
      Animated.parallel([
        Animated.spring(tagY, { toValue: 0, friction: 10, tension: 200, useNativeDriver: true }),
        Animated.timing(tagOp, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(pillsOp, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]),
      Animated.delay(15),
      Animated.parallel([
        Animated.spring(btnY, { toValue: 0, friction: 10, tension: 180, useNativeDriver: true }),
        Animated.timing(btnOp, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
    ]).start(() => {
      startIdleAnimations();
    });
  };

  useEffect(() => {
    if (hasVisited) {
      loadedRef.current = true;
      startIdleAnimations();
      return;
    }

    Animated.sequence([
      Animated.delay(10),
      Animated.parallel([
        Animated.spring(catScale, { toValue: 1, friction: 6, tension: 180, useNativeDriver: true }),
        Animated.timing(catOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.spring(catBounce, { toValue: -12, friction: 5, tension: 250, useNativeDriver: true }),
      Animated.spring(catBounce, { toValue: 0,   friction: 6, tension: 180,  useNativeDriver: true }),
    ]).start(() => {
      hasVisited = true;
      timeoutRef.current = setTimeout(loadContent, 100);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {PAWS.map((p, i) => <FloatingPaw key={i} {...p} />)}

      {/* Logo */}
      <Animated.View style={[styles.logoArea, { opacity: logoOp, transform: [{ translateY: logoY }] }]}>
        <Text style={styles.logoText}>catwise</Text>
      </Animated.View>

      {/* Mascot */}
      <View style={styles.mascotArea}>
        <Animated.View style={[styles.shadowRing, { transform: [{ scale: circlePulse }] }]} />
        <Animated.View style={[
          styles.catWrapper,
          {
            opacity: catOpacity,
            transform: [{ scale: catScale }, { translateY: catBounce }],
          },
        ]}>
          <View style={styles.catCircle}>
            <Animated.Image
              source={IMAGES[currentIndex]}
              style={[styles.catImage, { opacity: imgOpacity }]}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>

      {/* White area content — centered */}
      <View style={styles.whiteContent}>

        <Animated.View style={[styles.tagArea, { opacity: tagOp, transform: [{ translateY: tagY }] }]}>
          <Text style={styles.tagTitle}>Your complete guide{'\n'}to cat adoption</Text>
        </Animated.View>

        <Animated.View style={[styles.pillsRow, { opacity: pillsOp }]}>
          {['Food', 'Health', 'Toys', 'Home'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.btnStack, { opacity: btnOp, transform: [{ translateY: btnY }] }]}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaPrimaryText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

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
    marginTop: 24,
    alignItems: 'center',
  },
    logoText: {
    fontFamily: 'Avenir',
    fontSize: 28, fontWeight: '900',
    color: INK, letterSpacing: -0.5,
  },

  mascotArea: {
    height: H * 0.32,
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
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 18,
  },

  tagArea: {
    alignItems: 'center',
  },
  tagTitle: {
    fontFamily: 'Avenir',
    fontSize: 24, fontWeight: '900',
    color: INK, letterSpacing: -0.5,
    textAlign: 'center', lineHeight: 32,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(44,26,14,0.06)',
    borderRadius: 50, paddingVertical: 7, paddingHorizontal: 14,
  },
  pillText: { fontSize: 13, fontWeight: '600', color: INK, fontFamily: 'Avenir' },

  btnStack: {
    width: '100%',
    marginTop: 35,
  },
  ctaPrimary: {
    width: '100%', paddingVertical: 18,
    backgroundColor: GREEN, borderRadius: 16,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    borderBottomWidth: 4, borderBottomColor: '#5A8F50',
  },
  ctaPrimaryText: {
    color: WHITE, fontSize: 17,
    fontWeight: '800', letterSpacing: 0.3,
    fontFamily: 'Avenir',
  },
});