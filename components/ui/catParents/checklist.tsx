import React, { useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';

const PAW = require('../../../assets/images/paw.png');

const ITEMS = [
  {
    route: 'Toxic Foods, Plants and Items',
    title: 'Toxic Foods, Plants and Items',
    subtitle: 'Keep your cat safe',
    color: '#E8C8B8',
  },
  {
    route: 'Cat Language',
    title: 'Cat Language',
    subtitle: 'Understand what they are saying',
    color: '#C8D8E8',
  },
  {
    route: 'Poop Monitoring Scores',
    title: 'Poop Monitoring Scores',
    subtitle: 'Track your cat\'s health',
    color: '#C4DDB0',
  },
];

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

export default function CheckList({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
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
    paddingTop: 24,
    paddingBottom: 24,
  },

  cardsArea: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
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
    padding: 24,
    minHeight: 120,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  cardContent: {
    gap: 6,
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
    lineHeight: 26,
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
    marginTop: 14,
  },

  cardPaw: {
    width: 24,
    height: 24,
    tintColor: INK,
    opacity: 0.3,
  },

  arrowChip: {
    backgroundColor: 'rgba(44,26,14,0.12)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 15,
    fontWeight: '700',
    color: INK,
  },
});