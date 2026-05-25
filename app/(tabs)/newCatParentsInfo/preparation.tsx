import React, { useRef, useState } from 'react';
import { Text, Dimensions, View, StyleSheet, Image, TouchableOpacity, Animated, PanResponder, SafeAreaView, ScrollView } from 'react-native';
import prepCards from '../../data/newCatParents/preperation';

const INK        = '#2C1A0E';
const INK_SOFT   = '#6B4C35';
const WHITE      = '#FFFAF5';
const BLUE       = '#7A9BBE';
const BLUE_DARK  = '#5C7A9A';
const BLUE_LIGHT = '#C8D8E8';
const screenWidth  = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CARD_WIDTH  = screenWidth * 0.88;
const CARD_HEIGHT = screenHeight * 0.5;

const PAW = require('../../../assets/images/paw.png');

const CAT_IMAGES = [
  require('../../../assets/images/cat.png'),
  require('../../../assets/images/catCute.png'),
  require('../../../assets/images/catStretch.png'),
  require('../../../assets/images/catWave.png'),
];

function FlipCard({ card, index }: { card: any; index: number }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity     = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOpacity      = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8, tension: 60,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const bullets = [card.bullet1, card.bullet2, card.bullet3, card.bullet4, card.bullet5]
    .filter(b => b && b !== '');

  return (
    <View style={styles.flipContainer}>

      {/* Front — fully tappable */}
      <TouchableOpacity
        onPress={flip}
        activeOpacity={0.95}
        style={[
          styles.card,
          { position: flipped ? 'absolute' : 'relative' },
        ]}
      >
        <Animated.View style={[
          StyleSheet.absoluteFill,
          { padding: 26, alignItems: 'center', justifyContent: 'space-between', backgroundColor: BLUE_LIGHT, borderRadius: 24 },
          { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity },
        ]}>
          <Text style={styles.frontTitle}>{card.category}</Text>
          <Image
            source={CAT_IMAGES[index % CAT_IMAGES.length]}
            style={styles.catSticker}
            resizeMode="contain"
          />
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Tap to see more</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Back — scrollable, flip via button */}
      <Animated.View style={[
        styles.card,
        styles.cardBack,
        { backgroundColor: 'transparent' },
        { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
      ]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: WHITE, borderRadius: 24 }]} />
        <Text style={styles.backHeading}>{card.category}</Text>
        <View style={styles.divider} />

        <ScrollView
          style={styles.bulletsScroll}
          contentContainerStyle={styles.bulletsContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {bullets.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <Image source={PAW} style={styles.bulletPaw} resizeMode="contain" />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </ScrollView>

      </Animated.View>

    </View>
  );
}

export default function Preparation({ navigation }: { navigation: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const SWIPE_THRESHOLD = screenWidth * 0.3;

  const goToIndex = (index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => { translateX.setValue(gesture.dx); },
      onPanResponderRelease: (_, gesture) => {
        const idx = currentIndexRef.current;
        if (gesture.dx < -SWIPE_THRESHOLD && idx < prepCards.length - 1) {
          Animated.timing(translateX, { toValue: -screenWidth, duration: 250, useNativeDriver: true })
            .start(() => { goToIndex(idx + 1); translateX.setValue(0); });
        } else if (gesture.dx > SWIPE_THRESHOLD && idx > 0) {
          Animated.timing(translateX, { toValue: screenWidth, duration: 250, useNativeDriver: true })
            .start(() => { goToIndex(idx - 1); translateX.setValue(0); });
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>NEW CAT PARENTS</Text>
            <Text style={styles.pageTitle}>Preparation</Text>
          </View>
        </View>

        {/* Card */}
        <View style={styles.cardArea}>
          <Animated.View
            style={{ transform: [{ translateX }] }}
            {...panResponder.panHandlers}
          >
            <FlipCard
              key={currentIndex}
              card={prepCards[currentIndex]}
              index={currentIndex}
            />
          </Animated.View>
        </View>

        {/* Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={() => currentIndex > 0 && goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, currentIndex === 0 && styles.arrowTextDisabled]}>←</Text>
          </TouchableOpacity>

          <Text style={styles.pageCounter}>{currentIndex + 1} / {prepCards.length}</Text>

          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnNext, currentIndex === prepCards.length - 1 && styles.navBtnDisabled]}
            onPress={() => currentIndex < prepCards.length - 1 && goToIndex(currentIndex + 1)}
            disabled={currentIndex === prepCards.length - 1}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, styles.arrowTextNext]}>→</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: 380,
    padding: 22,
    alignSelf: 'center',
    gap: 16,
  },

  header: {
    gap: 10,
  },

  backBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18, fontWeight: '700',
    color: INK, lineHeight: 22,
  },

  headerCenter: {
    gap: 2,
  },
  eyebrow: {
    fontFamily: 'Avenir',
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: 'Avenir',
    fontSize: 28,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },

  flipContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 26,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },

  cardBack: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  frontTitle: {
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 28,
    textAlign: 'center',
    alignSelf: 'stretch',
  },

  catSticker: {
    width: CARD_HEIGHT * 0.35,
    height: CARD_HEIGHT * 0.35,
  },

  tapHint: {
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tapHintText: {
    fontFamily: 'Avenir',
    fontSize: 11,
    fontWeight: '700',
    color: INK,
    letterSpacing: 0.3,
  },

  backHeading: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.2,
    lineHeight: 21,
    alignSelf: 'stretch',
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
    alignSelf: 'stretch',
    marginBottom: 4,
  },

  bulletsScroll: {
    flex: 1,
    alignSelf: 'stretch',
  },
  bulletsContent: {
    gap: 10,
    paddingVertical: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletPaw: {
    width: 18, height: 18,
    tintColor: BLUE,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 19,
  },

  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingBottom: 4,
  },
  navBtn: {
    width: 92, height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },
  navBtnNext: {
    backgroundColor: BLUE,
    borderBottomWidth: 4,
    borderBottomColor: BLUE_DARK,
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  arrowText: {
    fontSize: 34,
    fontWeight: '700',
    color: INK_SOFT,
    lineHeight: 38,
  },
  arrowTextNext: {
    color: WHITE,
  },
  arrowTextDisabled: {
    color: 'rgba(107,76,53,0.35)',
  },
  pageCounter: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '800',
    color: INK_SOFT,
  },
});