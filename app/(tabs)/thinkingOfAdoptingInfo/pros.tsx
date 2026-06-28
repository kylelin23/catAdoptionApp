import React, { useRef, useState, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, Image, TouchableOpacity, Animated, PanResponder, SafeAreaView } from 'react-native';
import pros from '../../../app/data/thinkingOfAdopting/pros';
import { mixpanel } from '../../../lib/mixpanel';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const GREEN = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const GREEN_LIGHT = '#C4DDB0';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CARD_WIDTH = screenWidth * 0.88;
const CARD_HEIGHT = screenHeight * 0.5;

const PAW = require('../../../assets/images/paw.png');

const CAT_IMAGES = [
  require('../../../assets/images/cat.png'),
  require('../../../assets/images/catCute.png'),
  require('../../../assets/images/catStretch.png'),
  require('../../../assets/images/catWave.png'),
];

function FlipCard({ pro, index }: { pro: any; index: number }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity     = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOpacity      = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  const flip = () => {
    Animated.spring(flipAnim, { toValue: flipped ? 0 : 180, friction: 8, tension: 60, useNativeDriver: true }).start();
    setFlipped(!flipped);
  };

  return (
    <TouchableOpacity onPress={flip} activeOpacity={1} style={styles.flipContainer}>
      <Animated.View style={[styles.card, { backgroundColor: GREEN_LIGHT }, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }]}>
        <Text style={styles.frontTitle}>{pro.fact}</Text>
        <Image source={CAT_IMAGES[index % CAT_IMAGES.length]} style={styles.catSticker} resizeMode="contain" />
        <View style={styles.tapHint}><Text style={styles.tapHintText}>Tap to see why</Text></View>
      </Animated.View>

      <Animated.View style={[styles.card, styles.cardBack, { backgroundColor: WHITE }, { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }]}>
        <Text style={styles.backHeading}>{pro.fact}</Text>
        <View style={styles.divider} />
        <View style={styles.bulletsArea}>
          {[pro.support1, pro.support2, pro.support3, pro.support4].filter(s => s && s !== '').map((support, i) => (
            <View key={i} style={styles.bulletRow}>
              <Image source={PAW} style={styles.bulletPaw} resizeMode="contain" />
              <Text style={styles.bulletText}>{support}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.tapHint, { backgroundColor: 'rgba(44,26,14,0.06)' }]}>
          <Text style={[styles.tapHintText, { color: INK_SOFT }]}>Tap to flip back</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function Pros({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const currentIndexRef = useRef(0);

  // ENTRY/EXIT SCREEN ANIMATIONS
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // REVIEW CARD ANIMS
  const reviewCardOpacity = useRef(new Animated.Value(1)).current;
  const reviewCardSlide   = useRef(new Animated.Value(0)).current;
  const reviewBtnScale    = useRef(new Animated.Value(0)).current;

  const cardAnimations = useRef(
    pros.map(() => ({
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
      scale: new Animated.Value(1),
    }))
  ).current;

  const SWIPE_THRESHOLD = screenWidth * 0.25;
  const SWIPE_VELOCITY  = 0.4;

  const resetDeck = () => {
    pros.forEach((_, index) => {
      cardAnimations[index].pan.setValue({ x: 0, y: 0 });
      cardAnimations[index].scale.setValue(index === 0 ? 1 : 0.95);
    });
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setShowReviewScreen(false);

    reviewCardOpacity.setValue(1);
    reviewCardSlide.setValue(0);

    fadeAnim.setValue(0);
    slideAnim.setValue(25);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    mixpanel.track('Screen Opened', {
      'Screen Name': 'Pros'
    });
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (showReviewScreen) {
      reviewBtnScale.setValue(0.5);
      Animated.spring(reviewBtnScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true
      }).start();
    }
  }, [showReviewScreen]);

  const handleReviewAgainPress = () => {
    Animated.sequence([
      Animated.timing(reviewBtnScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(reviewBtnScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(reviewCardOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(reviewCardSlide, { toValue: 40, duration: 280, useNativeDriver: true })
      ])
    ]).start(() => {
      resetDeck();
    });
  };

  const goNext = () => {
    const idx = currentIndexRef.current;
    const currentCard = cardAnimations[idx];
    const nextCard = idx < pros.length - 1 ? cardAnimations[idx + 1] : null;

    mixpanel.track('Pros Card Swiped', {
      'Screen Name': 'Pros',
      'Card Index': idx,
      'Is Last Card': idx === pros.length - 1,
    });

    Animated.parallel([
      Animated.timing(currentCard.pan, {
        toValue: { x: -screenWidth * 1.3, y: 0 },
        duration: 220,
        useNativeDriver: true,
      }),
      nextCard
        ? Animated.spring(nextCard.scale, { toValue: 1, friction: 8, useNativeDriver: true })
        : Animated.timing(new Animated.Value(0), { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start(() => {
      if (idx >= pros.length - 1) {
        setShowReviewScreen(true);
      } else {
        currentIndexRef.current = idx + 1;
        setCurrentIndex(idx + 1);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5 && Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderMove: (_, g) => {
        const idx = currentIndexRef.current;
        const dx = g.dx;

        if (dx < 0) {
          cardAnimations[idx].pan.setValue({ x: dx, y: g.dy * 0.1 });
          if (idx < pros.length - 1) {
            const progress = Math.min(Math.abs(dx) / (screenWidth * 0.5), 1);
            cardAnimations[idx + 1].scale.setValue(0.95 + progress * 0.05);
          }
        } else if (dx > 0) {
          cardAnimations[idx].pan.setValue({ x: dx * 0.18, y: g.dy * 0.05 });
        }
      },

      onPanResponderRelease: (_, g) => {
        const idx = currentIndexRef.current;
        const swipedLeft = g.dx < -SWIPE_THRESHOLD || g.vx < -SWIPE_VELOCITY;

        if (g.dx < 0 && swipedLeft) {
          goNext();
        } else {
          Animated.parallel([
            Animated.spring(cardAnimations[idx].pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 5 }),
            idx < pros.length - 1 ? Animated.spring(cardAnimations[idx + 1].scale, { toValue: 0.95, useNativeDriver: true, friction: 5 }) : null
          ].filter(Boolean) as Animated.CompositeAnimation[]).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.headerRow}>
            <View style={styles.headerCenter}>
              <Text style={styles.eyebrow}>THINKING OF ADOPTING</Text>
              <Text style={styles.pageTitle}>The Pros</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardArea}>
          {showReviewScreen ? (
            <Animated.View style={[
              styles.reviewContainer,
              { opacity: reviewCardOpacity, transform: [{ translateY: reviewCardSlide }] }
            ]}>
              <Text style={styles.reviewHeading}>Great Job!</Text>
              <Text style={styles.reviewSubheading}>You've finished! Click below to go through the cards again! </Text>

              <Animated.View style={{ transform: [{ scale: reviewBtnScale }] }}>
                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={handleReviewAgainPress}
                  activeOpacity={0.85}
                >
                  <Text style={styles.reviewBtnText}>Review Again</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          ) : (
            pros.map((pro, index) => {
              if (index < currentIndex || index > currentIndex + 1) {
                return null;
              }

              const cardAnim = cardAnimations[index];
              const rotateCard = cardAnim.pan.x.interpolate({
                inputRange: [-screenWidth / 2, 0, screenWidth / 2],
                outputRange: ['-10deg', '0deg', '10deg'],
                extrapolate: 'clamp',
              });

              const animatedStyles = {
                transform: [
                  { translateX: cardAnim.pan.x },
                  { translateY: cardAnim.pan.y },
                  { scale: cardAnim.scale },
                  { rotate: rotateCard },
                ],
                zIndex: pros.length - index,
              };

              const isCurrent = index === currentIndex;
              const isUnderneath = index === currentIndex + 1;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardWrapper,
                    animatedStyles,
                    isUnderneath && styles.backgroundCard,
                  ]}
                  {...(isCurrent ? panResponder.panHandlers : {})}
                >
                  <FlipCard pro={pro} index={index} />
                </Animated.View>
              );
            })
          )}
        </View>

        {/* Dynamic Instruction Text — Repositioned underneath the Flashcard */}
        {!showReviewScreen && (
          <Text style={styles.instructionText}>
            Swipe left to see the next card!
          </Text>
        )}

        <View style={styles.bottomNav}>
          <Text style={styles.pageCounter}>
            {showReviewScreen ? pros.length : currentIndex + 1} / {pros.length}
          </Text>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, width: '100%', maxWidth: 380, paddingVertical: 22, alignSelf: 'center', gap: 16 },
  header: { width: CARD_WIDTH, alignSelf: 'center', gap: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(44,26,14,0.08)', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, fontWeight: '700', color: INK, lineHeight: 22 },
  headerCenter: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: 'Avenir', fontSize: 10, fontWeight: '800', color: 'rgba(44,26,14,0.4)', letterSpacing: 2 },
  pageTitle: { fontFamily: 'Avenir', fontSize: 28, fontWeight: '900', color: INK, letterSpacing: -0.5 },

  // Custom Instruction Text Styling
  instructionText: {
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '600',
    color: INK_SOFT,
    textAlign: 'center',
    marginTop: -4,  // Tucked slightly under the card block bounds
    marginBottom: 2,
    paddingHorizontal: 16,
    lineHeight: 18,
  },

  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', width: CARD_WIDTH, alignSelf: 'center' },
  cardWrapper: { position: 'absolute', width: CARD_WIDTH, height: CARD_HEIGHT },
  backgroundCard: { opacity: 1 },
  flipContainer: { width: CARD_WIDTH, height: CARD_HEIGHT },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, padding: 26, shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6, backfaceVisibility: 'hidden', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: 'rgba(44,26,14,0.06)', borderBottomWidth: 5, borderBottomColor: 'rgba(44,26,14,0.12)' },
  cardBack: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'space-between' },
  frontTitle: { fontFamily: 'Avenir', fontSize: 22, fontWeight: '900', color: INK, letterSpacing: -0.3, lineHeight: 28, textAlign: 'center', alignSelf: 'stretch' },
  catSticker: { width: CARD_HEIGHT * 0.35, height: CARD_HEIGHT * 0.35 },
  tapHint: { backgroundColor: 'rgba(44,26,14,0.1)', borderRadius: 50, paddingVertical: 6, paddingHorizontal: 14 },
  tapHintText: { fontFamily: 'Avenir', fontSize: 11, fontWeight: '700', color: INK, letterSpacing: 0.3 },

  backHeading: { fontFamily: 'Avenir', fontSize: 20, fontWeight: '900', color: INK, letterSpacing: -0.2, lineHeight: 24, alignSelf: 'stretch', paddingTop: 8 },
  divider: { height: 1.5, backgroundColor: 'rgba(44,26,14,0.08)', borderRadius: 1, alignSelf: 'stretch', marginTop: 10 },
  bulletsArea: { gap: 10, flex: 1, justifyContent: 'center', alignSelf: 'stretch', marginVertical: 10 },

  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulletPaw: { width: 18, height: 18, tintColor: GREEN, flexShrink: 0 },
  bulletText: { flex: 1, fontFamily: 'Avenir', fontSize: 17, fontWeight: '400', color: INK_SOFT, lineHeight: 19 },

  reviewContainer: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, padding: 32, backgroundColor: WHITE, borderWidth: 2, borderColor: 'rgba(44,26,14,0.06)', borderBottomWidth: 5, borderBottomColor: 'rgba(44,26,14,0.12)', alignItems: 'center', justifyContent: 'center', gap: 12 },
  reviewHeading: { fontFamily: 'Avenir', fontSize: 26, fontWeight: '900', color: INK, textAlign: 'center' },
  reviewSubheading: { fontFamily: 'Avenir', fontSize: 15, fontWeight: '500', color: INK_SOFT, textAlign: 'center', paddingHorizontal: 10, lineHeight: 20, marginBottom: 12 },
  reviewBtn: { backgroundColor: GREEN, paddingVertical: 14, paddingHorizontal: 36, borderRadius: 50, borderBottomWidth: 4, borderBottomColor: GREEN_DARK },
  reviewBtnText: { fontFamily: 'Avenir', fontSize: 16, fontWeight: '800', color: WHITE },

  bottomNav: { width: CARD_WIDTH, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 4 },
  pageCounter: { fontFamily: 'Avenir', fontSize: 17, fontWeight: '800', color: INK_SOFT },
});