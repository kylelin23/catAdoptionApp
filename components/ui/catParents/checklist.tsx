import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';

const PAW = require('../../../assets/images/paw.png');

const ITEMS = [
  {
    route: 'Toxic Foods, Plants and Items',
    title: 'Toxic Foods, Plants, Items',
    subtitle: 'Keep your cat safe',
    border: '#C47A45',
    dark: '#9E5C2E',
    paw: '#C47A45',
    bg: '#FAF0E8',
  },
  {
    route: 'Cat Language',
    title: 'Cat Language',
    subtitle: 'Understand what they are saying',
    border: '#7A9BBE',
    dark: '#5C7A9A',
    paw: '#7A9BBE',
    bg: '#EEF4F9',
  },
  {
    route: 'Poop Monitoring Scores',
    title: 'Poop Monitoring Scores',
    subtitle: "Track your cat's health",
    border: '#7BAE6E',
    dark: '#5A8F50',
    paw: '#7BAE6E',
    bg: '#EEF5EC',
  },
];

function InfoCard({
  item,
  index,
  onPress,
}: {
  item: typeof ITEMS[0];
  index: number;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 5,
    }).start();

  const onPressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ translateY }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: item.border,
            borderBottomColor: item.dark,
            backgroundColor: item.bg,
          },
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={styles.cardTop}>
          <View style={styles.leftRow}>
            <View style={[styles.pawCircle, { backgroundColor: item.border }]}>
              <Image source={PAW} style={styles.paw} resizeMode="contain" />
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>

          <Text style={[styles.arrow, { color: item.border }]}>›</Text>
        </View>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 16,
  },

  cardWrapper: {
    flex: 1,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },

  card: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2.5,
    borderBottomWidth: 5,
    paddingVertical: 17,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  pawCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paw: {
    width: 22,
    height: 22,
    tintColor: WHITE,
  },

  arrow: {
    fontSize: 30,
    fontWeight: '800',
    marginLeft: 8,
  },

  cardBottom: {
    marginTop: 20,
  },

  cardTitle: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  cardSubtitle: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
  },
});