import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated, Image } from "react-native";

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE    = '#FFFAF5';

const PAW      = require('../../../assets/images/paw.png');
const CAT_PEEK = require('../../../assets/images/catWave.png');

const STEPS = [
  {
    key:     'separate',
    number:  '01',
    title:   'Separate Spaces',
    tagline: 'Keep them apart at first',
    accent:  '#7A9BBE',
    dark:    '#5C7A9A',
    bullets: [
      'Keep the cats in separate spaces',
      'Set up the new cat in a quiet room with litter box, food, water, hiding spot and scratching post',
      'Keep the door closed',
      'Do not allow face to face contact for the first 3–5 days',
    ],
  },
  {
    key:     'scent',
    number:  '02',
    title:   'Exchange Scents',
    tagline: 'Cats recognize by scent before sight',
    accent:  '#D4956A',
    dark:    '#A86E45',
    bullets: [
      'Exchange bedding or blankets between cats',
      'Feed cats on opposite sides of the door',
      "Provide treats so cats associate each other's scents with something positive",
    ],
  },
  {
    key:     'supervised',
    number:  '03',
    title:   'Supervised Meetings',
    tagline: 'Short and sweet visits',
    accent:  '#7BAE6E',
    dark:    '#5A8F50',
    bullets: [
      'Cats are ready when they show curious sniffing at the door',
      'After several days, open the door slightly',
      'Let the cats meet briefly',
      'Continue to provide treats and keep sessions short',
    ],
  },
  {
    key:     'slow',
    number:  '04',
    title:   'Slow and Gradual',
    tagline: 'Patience is key',
    accent:  '#C47A45',
    dark:    '#9E5C2E',
    bullets: [
      'Maintain the same structure over days or weeks',
      'Keep the pace slow and gradual',
      'Keep routines consistent',
      'Do not force interaction',
      'Remember: Hissing = communication and is totally common!',
    ],
  },
];

function StepItem({ step, isOpen, onPress }: {
  step: typeof STEPS[0];
  isOpen: boolean;
  onPress: () => void;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const peekAnim   = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, { toValue: isOpen ? 1 : 0, duration: 200, useNativeDriver: true }),
      Animated.spring(peekAnim,   { toValue: isOpen ? 1 : 0, friction: 5, tension: 70, useNativeDriver: true }),
    ]).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const catTranslateX = peekAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.itemWrapper}>

      {/* Cat peeks from left */}
      <Animated.Image
        source={CAT_PEEK}
        style={[
          styles.peekingCat,
          {
            opacity: peekAnim,
            transform: [{ translateX: catTranslateX }, { rotate: '-45deg' }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Card */}
      <View style={[
        styles.card,
        { borderColor: step.accent, borderBottomColor: step.dark },
        isOpen && { borderLeftWidth: 3, borderLeftColor: step.accent },
      ]}>
        <TouchableOpacity style={styles.headerRow} onPress={onPress} activeOpacity={0.8}>

          <View style={[styles.numberBadge, { backgroundColor: step.accent, borderBottomColor: step.dark }]}>
            <Text style={styles.numberText}>{step.number}</Text>
          </View>

          <View style={styles.titleArea}>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardTagline}>{step.tagline}</Text>
          </View>

          <Animated.Image
            source={PAW}
            style={[styles.pawChevron, { tintColor: step.accent, transform: [{ rotate }] }]}
            resizeMode="contain"
          />

        </TouchableOpacity>

        {isOpen && (
          <View style={styles.bulletsArea}>
            <View style={styles.divider} />
            {step.bullets.map((bullet, i) => (
              <View key={i} style={styles.bulletRow}>
                <Image source={PAW} style={[styles.bulletPaw, { tintColor: step.accent }]} resizeMode="contain" />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

    </View>
  );
}

export default function NewCats() {
  const [openIndex, setOpenIndex] = React.useState(-1);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {STEPS.map((step, index) => (
          <StepItem
            key={step.key}
            step={step}
            isOpen={openIndex === index}
            onPress={() => toggle(index)}
          />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: { flex: 1 },

  scrollContent: {
    paddingLeft: 0,
    paddingRight: 20,
    paddingTop: 20,
    gap: 12,
  },

  itemWrapper: {
    position: 'relative',
  },

  peekingCat: {
    position: 'absolute',
    width: 120,
    height: 120,
    left: 0,
    top: '50%',
    marginTop: -60,
    zIndex: 0,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2,
    marginLeft: 55,
    borderWidth: 2.5,
    borderBottomWidth: 4,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  numberText: {
    fontFamily: 'Avenir',
    fontSize: 11,
    fontWeight: '900',
    color: WHITE,
  },

  titleArea: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '800',
    color: INK,
    lineHeight: 20,
  },
  cardTagline: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
  },

  pawChevron: {
    width: 26,
    height: 26,
    flexShrink: 0,
  },

  bulletsArea: {
    gap: 10,
    marginTop: 6,
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletPaw: {
    width: 14,
    height: 14,
    marginTop: 3,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 19,
  },
});