import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Image, Animated, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WHITE = '#FFFAF5';

const IMAGES = [
  require('../../assets/images/catWave.png'),
  require('../../assets/images/catStretch.png'),
  require('../../assets/images/cat.png'),
];

const PAW = require('../../assets/images/paw.png');

const PAWS = [
  { x: 0.08, delay: 0,    duration: 5000, size: 18, opacity: 0.1  },
  { x: 0.75, delay: 1200, duration: 6000, size: 14, opacity: 0.08 },
  { x: 0.45, delay: 2400, duration: 5500, size: 16, opacity: 0.09 },
];

const CONFETTI_COLORS = [
  '#D4956A', '#E8C9A0', '#7BAE6E', '#C8D8E8',
  '#E8C8B8', '#2C1A0E', '#F2C9A0', '#C4DDB0',
];

const NUM_CONFETTI = 24;

const CONFETTI_PIECES = Array.from({ length: NUM_CONFETTI }).map((_, i) => {
  const angle = (i / NUM_CONFETTI) * 2 * Math.PI;
  const dist  = 100 + Math.random() * 80;
  return {
    tx:      Math.cos(angle) * dist,
    ty:      Math.sin(angle) * dist,
    color:   CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size:    6 + Math.random() * 6,
    isRound: Math.random() > 0.5,
  };
});

function ConfettiBurst({ show }: { show: boolean }) {
  const anims = useRef(
    CONFETTI_PIECES.map(() => ({
      translate: new Animated.ValueXY({ x: 0, y: 0 }),
      opacity:   new Animated.Value(0),
      scale:     new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!show) return;
    const animations = anims.map((anim, i) => {
      const piece = CONFETTI_PIECES[i];
      return Animated.sequence([
        Animated.delay(i * 18),
        Animated.parallel([
          Animated.spring(anim.translate, {
            toValue: { x: piece.tx, y: piece.ty },
            friction: 4, tension: 60, useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1, friction: 4, tension: 80, useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.delay(500),
            Animated.timing(anim.opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
          ]),
        ]),
      ]);
    });
    Animated.parallel(animations).start();
  }, [show]);

  if (!show) return null;

  return (
    <>
      {CONFETTI_PIECES.map((piece, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            borderRadius: piece.isRound ? piece.size / 2 : 2,
            backgroundColor: piece.color,
            opacity: anims[i].opacity,
            transform: [
              { translateX: anims[i].translate.x },
              { translateY: anims[i].translate.y },
              { scale: anims[i].scale },
            ],
          }}
        />
      ))}
    </>
  );
}

function FloatingPaw({ x, delay, duration, size, opacity }: typeof PAWS[0]) {
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

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const catScale    = useRef(new Animated.Value(0)).current;
  const catOpacity  = useRef(new Animated.Value(0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;
  const imgOpacity  = useRef(new Animated.Value(1)).current;

  const titleY   = useRef(new Animated.Value(30)).current;
  const titleOp  = useRef(new Animated.Value(0)).current;
  const subY     = useRef(new Animated.Value(20)).current;
  const subOp    = useRef(new Animated.Value(0)).current;
  const pillsOp  = useRef(new Animated.Value(0)).current;
  const btnOp    = useRef(new Animated.Value(0)).current;
  const tapBlink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Cat springs in
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(catScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        Animated.timing(catOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      // 2. Confetti fires when cat lands
      setShowConfetti(true);

      // 3. Content loads after confetti finishes
      setTimeout(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.spring(titleY, { toValue: 0, friction: 7, tension: 100, useNativeDriver: true }),
            Animated.timing(titleOp, { toValue: 1, duration: 250, useNativeDriver: true }),
          ]),
          Animated.delay(80),
          Animated.parallel([
            Animated.spring(subY,  { toValue: 0, friction: 7, tension: 100, useNativeDriver: true }),
            Animated.timing(subOp, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(pillsOp, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]),
          Animated.delay(100),
          Animated.timing(btnOp, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start(() => {
          // 4. Image cycling starts AFTER everything is loaded in
          intervalRef.current = setInterval(() => {
            Animated.timing(imgOpacity, { toValue: 0, duration: 350, useNativeDriver: true })
              .start(() => {
                setCurrentIndex(prev => (prev + 1) % IMAGES.length);
                Animated.timing(imgOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
              });
          }, 3500);
        });

        Animated.timing(tapBlink, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
      }, 2500);
    });

    // Circle pulse starts after cat appears
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(circlePulse, { toValue: 1.07, duration: 1200, useNativeDriver: true }),
          Animated.timing(circlePulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }, 600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Home')}
      activeOpacity={1}
    >
      <StatusBar barStyle="dark-content" />

      {PAWS.map((p, i) => <FloatingPaw key={i} {...p} />)}

      <View style={styles.blobTL} />
      <View style={styles.blobBR} />
      <View style={styles.blobCenter} />

      {/* Cat circle */}
      <Animated.View style={[
        styles.catWrapper,
        {
          opacity: catOpacity,
          transform: [{ scale: Animated.multiply(catScale, circlePulse) }],
        },
      ]}>
        <ConfettiBurst show={showConfetti} />

        <View style={styles.catCircle}>
          <Animated.Image
            source={IMAGES[currentIndex]}
            style={[styles.catImage, { opacity: imgOpacity }]}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleArea, { opacity: titleOp, transform: [{ translateY: titleY }] }]}>
        <Text style={styles.titleText}>Catwise</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subArea, { opacity: subOp, transform: [{ translateY: subY }] }]}>
        <Text style={styles.subText}>Your complete guide to cat adoption</Text>
      </Animated.View>

      {/* Divider */}
      <Animated.View style={[styles.dividerRow, { opacity: pillsOp }]}>
        <View style={styles.dividerLine} />
        <Image source={PAW} style={styles.dividerPaw} resizeMode="contain" />
        <View style={styles.dividerLine} />
      </Animated.View>

      {/* Pills */}
      <Animated.View style={[styles.pillsRow, { opacity: pillsOp }]}>
        {['Food', 'Health', 'Toys', 'Behavior'].map((label) => (
          <View key={label} style={styles.pill}>
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Tap to get started */}
      <Animated.View style={[styles.tapArea, { opacity: btnOp }]}>
        <Animated.View style={[styles.tapRow, { opacity: tapBlink }]}>
          <Image source={PAW} style={styles.tapPaw} resizeMode="contain" />
          <Text style={styles.tapText}>Tap to get started</Text>
          <Image source={PAW} style={[styles.tapPaw, { transform: [{ scaleX: -1 }] }]} resizeMode="contain" />
        </Animated.View>
      </Animated.View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    overflow: 'hidden',
  },

  blobTL: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#F2DCBC',
    top: -80, left: -80, opacity: 0.65,
  },
  blobBR: {
    position: 'absolute',
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: '#C47A45',
    bottom: 60, right: -70, opacity: 0.28,
  },
  blobCenter: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#E8C9A0',
    top: H * 0.3, left: -60, opacity: 0.4,
  },

  catWrapper: {
    width: 180, height: 180, borderRadius: 90,
    marginBottom: 28,
    shadowColor: '#A0622A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCircle: {
    width: 180, height: 180, borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,250,245,0.7)',
    backgroundColor: 'rgba(255,250,245,0.2)',
  },
  catImage: {
    width: '100%', height: '100%',
  },

  titleArea: { alignItems: 'center', marginBottom: 6 },
  titleText: {
    fontFamily: 'Georgia',
    fontSize: 62, fontWeight: '900',
    color: INK, letterSpacing: -2, lineHeight: 66,
  },

  subArea: { alignItems: 'center', marginBottom: 20 },
  subText: {
    fontSize: 15, fontWeight: '400',
    color: INK_SOFT, textAlign: 'center',
    lineHeight: 22, letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 18, width: '60%',
  },
  dividerLine: {
    flex: 1, height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.18)', borderRadius: 1,
  },
  dividerPaw: {
    width: 16, height: 16,
    tintColor: INK, opacity: 0.3,
  },

  pillsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, justifyContent: 'center', marginBottom: 40,
  },
  pill: {
    backgroundColor: 'rgba(255,250,245,0.5)',
    borderWidth: 1.5, borderColor: 'rgba(255,250,245,0.7)',
    borderRadius: 50, paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: INK, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  pillText: {
    fontSize: 13, fontWeight: '600',
    color: INK, letterSpacing: 0.2,
  },

  tapArea: { alignItems: 'center', paddingVertical: 12 },
  tapRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tapPaw: { width: 14, height: 14, tintColor: INK, opacity: 0.5 },
  tapText: {
    fontFamily: 'Georgia',
    fontSize: 16, fontWeight: '600',
    color: INK, letterSpacing: 0.8,
  },
});