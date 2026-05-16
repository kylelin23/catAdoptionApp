import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE    = '#FFFAF5';
const GREEN    = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const BLUE     = '#7A9BBE';
const BLUE_DARK = '#5C7A9A';

const PAW = require('../../../assets/images/paw.png');

const ITEMS = [
  {
    route:      'What to Buy in Preparation',
    title:      'What to Buy in Preparation',
    subtitle:   'Make sure you are prepared!',
    border:     BLUE,
    borderDark: BLUE_DARK,
    pawColor:   BLUE,
  },
  {
    route:      'What to Expect in the First Week',
    title:      'What to Expect in the First Week',
    subtitle:   'Know what to expect!',
    border:     GREEN,
    borderDark: GREEN_DARK,
    pawColor:   GREEN,
  },
];

function InfoCard({ item, index, onPress }: { item: typeof ITEMS[0]; index: number; onPress: () => void }) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 120),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 5 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, friction: 5 }).start();

  return (
    <Animated.View style={[
      styles.cardWrapper,
      { opacity, transform: [{ translateY }, { scale: scaleAnim }] },
    ]}>
      <TouchableOpacity
        style={[styles.card, { borderColor: item.border, borderBottomColor: item.borderDark }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Image source={PAW} style={[styles.paw, { tintColor: item.pawColor }]} resizeMode="contain" />

        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>

        <Text style={[styles.arrow, { color: item.border }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Info({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      {ITEMS.map((item, i) => (
        <InfoCard
          key={i}
          item={item}
          index={i}
          onPress={() => navigation.navigate(item.route)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    gap: 50,
    justifyContent: 'center',
  },

  cardWrapper: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 14,
  },

  paw: {
    width: 32,
    height: 32,
    flexShrink: 0,
  },

  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
  },

  arrow: {
    fontSize: 26,
    fontWeight: '800',
    flexShrink: 0,
  },
});