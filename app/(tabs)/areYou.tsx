import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';

const CATEGORIES = [
  {
    key: 'thinking',
    route: 'Thinking of Adopting',
    title: 'Thinking of Adopting',
    subtitle: 'Maybe adopt a cat soon?',
  },
  {
    key: 'new',
    route: 'New Cat Parents',
    title: 'New Cat Parents',
    subtitle: 'Just got a cat!',
  },
  {
    key: 'parents',
    route: 'Cat Parents',
    title: 'Cat Parents',
    subtitle: 'Already a cat parent!',
  },
  {
    key: 'lovers',
    route: 'Cat Lovers',
    title: 'Cat Lovers',
    subtitle: 'Just love cats!',
  },
];

export default function AreYou({ navigation }: { navigation: any }) {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <View style={styles.container}>

      {/* Top band */}
      <View style={styles.topBand}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Start')}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>Welcome to Catwise</Text>
        <Text style={styles.titleText}>Are You:</Text>
        <Text style={styles.titleSub}>Select what best describes you</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsArea}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.card,
              pressed === cat.key && styles.cardPressed,
            ]}
            onPress={() => navigation.navigate(cat.route)}
            onPressIn={() => setPressed(cat.key)}
            onPressOut={() => setPressed(null)}
            activeOpacity={1}
          >
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
            </View>

            {/* Arrow chip */}
            <View style={[
              styles.arrowChip,
              pressed === cat.key && styles.arrowChipPressed,
            ]}>
              <Text style={styles.arrowChipText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  // Top band
  topBand: {
    backgroundColor: SAND,
    paddingTop: 64,
    paddingHorizontal: 28,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,250,245,0.5)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backArrow: {
    fontSize: 16,
    color: INK,
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: INK,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(44,26,14,0.5)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  titleText: {
    fontFamily: 'Georgia',
    fontSize: 42,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 6,
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '400',
    color: INK_SOFT,
  },

  // Cards area
  cardsArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 16,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: '#FDF3E7',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    transform: [{ scale: 0.985 }],
  },

  cardTextBlock: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '700',
    color: INK,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
  },

  arrowChip: {
    backgroundColor: SAND,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  arrowChipPressed: {
    backgroundColor: WARM,
  },
  arrowChipText: {
    fontSize: 16,
    color: INK,
    fontWeight: '600',
  },
});