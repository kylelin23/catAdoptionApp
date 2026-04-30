import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';

const PAW = require('../../../assets/images/paw.png');

const ITEMS = [
  {
    route: 'What to Buy in Preparation',
    title: 'What to Buy in Preparation',
    subtitle: 'Make sure you are prepared!',
    color: '#C8D8E8',
  },
  {
    route: 'What to Expect in the First Week',
    title: 'What to Expect in the First Week',
    subtitle: 'Know what to expect!',
    color: '#C4DDB0',
  },
];

// Paw trail positions — zigzag from top down to cards
const TRAIL = [
  { x: 20,  y: 55,  rotation: '-10deg' },
  { x: 80,  y: 45,  rotation: '15deg'  },
  { x: 140, y: 60,  rotation: '-5deg'  },
  { x: 200, y: 47,  rotation: '20deg'  },
  { x: 260, y: 57,  rotation: '-15deg' },
  { x: 320, y: 43,  rotation: '10deg'  },
];

const STEP_GAP = 300;
const HOLD_DURATION = 2000;
const FADE_OUT_DURATION = 800;

function PawTrail() {
  const opacities = useRef(TRAIL.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const runTrail = () => {
      opacities.forEach(o => o.setValue(0));

      const stampSequence = TRAIL.map((_, i) =>
        Animated.sequence([
          Animated.delay(i * STEP_GAP),
          Animated.spring(opacities[i], {
            toValue: 1,
            friction: 4,
            tension: 120,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.sequence([
        Animated.parallel(stampSequence),
        Animated.delay(HOLD_DURATION),
        Animated.parallel(
          opacities.map(o =>
            Animated.timing(o, {
              toValue: 0,
              duration: FADE_OUT_DURATION,
              useNativeDriver: true,
            })
          )
        ),
        Animated.delay(400),
      ]).start(() => runTrail());
    };

    runTrail();
  }, []);

  return (
    <>
      {TRAIL.map((step, i) => (
        <Animated.Image
          key={i}
          source={PAW}
          style={[
            styles.trailPaw,
            {
              left: step.x,
              top: step.y,
              opacity: opacities[i],
              transform: [
                { rotate: step.rotation },
                {
                  scale: opacities[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />
      ))}
    </>
  );
}

function InfoCard({ item, onPress }: { item: typeof ITEMS[0], onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 5 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: item.color }]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Image source={PAW} style={styles.cardPaw} resizeMode="contain" />
          <View style={styles.arrowChip}>
            <Text style={styles.arrowText}>{">"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Info({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>

      {/* Paw trail in background */}
      <PawTrail />

      {/* Cards */}
      <View style={styles.cardsArea}>
        {ITEMS.map((item, i) => (
          <InfoCard
            key={i}
            item={item}
            onPress={() => navigation.navigate(item.route)}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 24,
  },

  // Paw trail
  trailPaw: {
    position: 'absolute',
    width: 40,
    height: 40,
    tintColor: INK,
    opacity: 0,
    zIndex: 0,
  },

  // Cards
  cardsArea: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    zIndex: 1,
  },

  cardWrapper: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
    borderRadius: 28,
  },

  card: {
    borderRadius: 28,
    padding: 26,
    minHeight: 160,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  cardContent: {
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  cardPaw: {
    width: 28,
    height: 28,
    tintColor: INK,
    opacity: 0.3,
  },

  arrowChip: {
    backgroundColor: 'rgba(44,26,14,0.12)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
  },
});