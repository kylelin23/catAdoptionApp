import React, { useRef, useEffect } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Image, SafeAreaView,
} from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND     = '#E8C9A0';
const WHITE    = '#FFFAF5';
const GREEN    = '#7BAE6E';

const PAW     = require('../../assets/images/paw.png');
const CAT_IMG = require('../../assets/images/catWave.png');

const CATEGORIES = [
  { key: 'thinking', route: 'Thinking of Adopting', title: 'Thinking of Adopting', subtitle: 'Considering getting a cat', color: '#C4DDB0', border: '#7BAE6E', dark: '#5A8F50' },
  { key: 'new',      route: 'New Cat Parents',       title: 'New Cat Parents',       subtitle: 'Just brought a cat home',    color: '#C8D8E8', border: '#7A9BBE', dark: '#5C7A9A' },
  { key: 'parents',  route: 'Cat Parents',            title: 'Cat Parents',            subtitle: 'Already a cat parent',       color: '#F2C9A0', border: '#D4956A', dark: '#A86E45' },
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
    <Animated.View style={[styles.cardWrapper, { opacity, transform: [{ scale: Animated.multiply(scale, pressAnim) }] }]}>
      <TouchableOpacity
        style={[styles.card, {
          backgroundColor: cat.color,
          borderColor: cat.border,
          borderBottomColor: cat.dark,
        }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={[styles.cardSwatch, { backgroundColor: cat.border, borderBottomColor: cat.dark }]}>
          <Image source={PAW} style={styles.cardPaw} resizeMode="contain" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{cat.title}</Text>
          <Text style={styles.cardSub}>{cat.subtitle}</Text>
        </View>
        <View style={[styles.chevron, { backgroundColor: cat.border, borderBottomColor: cat.dark }]}>
          <Text style={styles.chevronText}>›</Text>
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

      {/* Top row — back + stories */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.storiesBtn}
          onPress={() => navigation.navigate('Cat Stories')}
          activeOpacity={0.7}
        >
          <Text style={styles.storiesBtnText}>🐾 Stories</Text>
        </TouchableOpacity>
      </View>

      {/* Speech bubble header */}
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

      {/* Cards */}
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
    height: H * 0.4,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: H * 0.65,
    backgroundColor: '#FFFFFF',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
  },

  backBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18, fontWeight: '700',
    color: INK, lineHeight: 22,
  },

  storiesBtn: {
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  storiesBtnText: {
    fontFamily: 'Avenir',
    fontSize: 13, fontWeight: '700',
    color: INK,
  },

  mascotArea: {
    paddingHorizontal: 12,
    paddingTop: H * 0.035,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catImg: {
    width: H * 0.24, height: H * 0.24,
    flexShrink: 0,
    marginRight: -(W * 0.1),
  },
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
  tail: {
    width: 0, height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: WHITE,
  },
  bubble: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleText: {
    fontFamily: 'Avenir',
    fontSize: 18, fontWeight: '900',
    color: INK, letterSpacing: -0.3,
  },

  cardsArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
    justifyContent: 'center',
  },

  cardWrapper: {
    flex: 1,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  card: {
    flex: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 16,
    borderWidth: 2.5,
    borderBottomWidth: 4,
  },

  cardSwatch: {
    width: 44, height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  cardPaw: {
    width: 22, height: 22,
    tintColor: WHITE,
  },

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
    fontSize: 22, fontWeight: '800',
    lineHeight: 26,
    color: WHITE,
  },
});