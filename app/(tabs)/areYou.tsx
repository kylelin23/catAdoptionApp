import React, { useRef, useEffect } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Image, SafeAreaView,
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const INK           = '#2C1A0E';
const INK_SOFT      = '#6B4C35';
const SAND          = '#E8C9A0';
const WHITE         = '#FFFAF5';
const GREEN         = '#7BAE6E';

const PAW     = require('../../assets/images/paw.png');
const CAT_IMG = require('../../assets/images/catWave.png');

const CATEGORIES = [
  { key: 'thinking', route: 'Thinking of Adopting', title: 'Thinking of Adopting', subtitle: 'Considering getting a cat', color: '#C4DDB0', border: '#7BAE6E' },
  { key: 'new',      route: 'New Cat Parents',       title: 'New Cat Parents',       subtitle: 'Just brought a cat home',    color: '#C8D8E8', border: '#7A9BBE' },
  { key: 'parents',  route: 'Cat Parents',            title: 'Cat Parents',            subtitle: 'Already a cat parent',       color: '#F2C9A0', border: '#D4956A' },
  { key: 'lovers',   route: 'Cat Lovers',             title: 'Cat Lovers',             subtitle: 'Just love cats',             color: '#E8C8B8', border: '#C47A45' },
];

function CategoryCard({ cat, index, onPress }: { cat: typeof CATEGORIES[0]; index: number; onPress: () => void }) {
  const scale     = useRef(new Animated.Value(0)).current;
  const opacity   = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const onPressIn  = () => Animated.spring(pressAnim, { toValue: 0.96, useNativeDriver: true, friction: 5 }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1,    useNativeDriver: true, friction: 5 }).start();

  return (
    <Animated.View style={{ opacity, transform: [{ scale: Animated.multiply(scale, pressAnim) }] }}>
      <TouchableOpacity
        style={[styles.card, { borderColor: cat.border }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={[styles.cardSwatch, { backgroundColor: cat.color }]}>
          <Image source={PAW} style={[styles.cardPaw, { tintColor: cat.border }]} resizeMode="contain" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{cat.title}</Text>
          <Text style={styles.cardSub}>{cat.subtitle}</Text>
        </View>
        <View style={[styles.chevron, { backgroundColor: cat.color, borderBottomColor: cat.border }]}>
          <Text style={[styles.chevronText, { color: cat.border }]}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AreYou({ navigation }: { navigation: any }) {
  const headerY     = useRef(new Animated.Value(-20)).current;
  const headerOp    = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.spring(bubbleScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Start')} activeOpacity={0.7}>
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.mascotArea, { opacity: headerOp, transform: [{ translateY: headerY }] }]}>

        <Image source={CAT_IMG} style={styles.catImg} resizeMode="contain" />

        <Animated.View style={[styles.bubbleWrapper, { transform: [{ scale: bubbleScale }] }]}>
          <View style={styles.bubbleRow}>
            <View style={styles.tail} />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>Who are you?</Text>
            </View>
          </View>
        </Animated.View>

      </Animated.View>

      <View style={styles.cardsArea}>
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.key}
            cat={cat}
            index={i}
            onPress={() => navigation.navigate(cat.route)}
          />
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    overflow: 'hidden',
  },

  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: H * 0.44,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: H * 0.65,
    backgroundColor: WHITE,
  },

  backBtn: {
    position: 'absolute',
    top: 56, left: 20,
    zIndex: 10,
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18, fontWeight: '700',
    color: INK, lineHeight: 22,
  },

  mascotArea: {
    paddingHorizontal: 12,  // was 24
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  catImg: {
    width: 200,
    height: 200,
    flexShrink: 0,
    marginRight: -40,  // pulls bubble closer to cat
  },

  // Shadow on wrapper so it wraps the whole shape including tail
  bubbleWrapper: {
    flex: 1,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Single triangle — same WHITE as bubble, no border
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: WHITE,
  },

  // No border on bubble — shadow only so no seam
  bubble: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  bubbleText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.3,
  },

  cardsArea: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: 'center',
    paddingBottom: 24,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 16,
    borderWidth: 2.5,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderBottomWidth: 4,
  },

  cardSwatch: {
    width: 48, height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  cardPaw: { width: 26, height: 26 },

  cardText: { flex: 1, gap: 3 },
  cardTitle: {
    fontFamily: 'Avenir',
    fontSize: 16, fontWeight: '900',
    color: INK, letterSpacing: -0.2,
  },
  cardSub: {
    fontFamily: 'Avenir',
    fontSize: 12, fontWeight: '400',
    color: INK_SOFT,
  },

  chevron: {
    width: 34, height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  chevronText: {
    fontSize: 22, fontWeight: '800', lineHeight: 26,
  },
});