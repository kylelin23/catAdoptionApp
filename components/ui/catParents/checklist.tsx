import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE    = '#FFFAF5';

const PAW = require('../../../assets/images/paw.png');

const ITEMS = [
  {
    route:   'Toxic Foods, Plants and Items',
    title:   'Toxic Foods, Plants and Items',
    subtitle: 'Keep your cat safe',
    border:  '#C47A45',
    dark:    '#9E5C2E',
    paw:     '#C47A45',
  },
  {
    route:   'Cat Language',
    title:   'Cat Language',
    subtitle: 'Understand what they are saying',
    border:  '#7A9BBE',
    dark:    '#5C7A9A',
    paw:     '#7A9BBE',
  },
  {
    route:   'Poop Monitoring Scores',
    title:   'Poop Monitoring Scores',
    subtitle: "Track your cat's health",
    border:  '#7BAE6E',
    dark:    '#5A8F50',
    paw:     '#7BAE6E',
  },
];

function InfoCard({ item, index, onPress }: { item: typeof ITEMS[0]; index: number; onPress: () => void }) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 1, duration: 250, useNativeDriver: true }),
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
        style={[styles.card, { borderColor: item.border, borderBottomColor: item.dark }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Image source={PAW} style={[styles.paw, { tintColor: item.paw }]} resizeMode="contain" />

        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>

        <Text style={[styles.arrow, { color: item.border }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CheckList({ navigation }: { navigation: any }) {
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
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    gap: 14,
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
    width: 30,
    height: 30,
    flexShrink: 0,
  },

  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.2,
    lineHeight: 21,
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