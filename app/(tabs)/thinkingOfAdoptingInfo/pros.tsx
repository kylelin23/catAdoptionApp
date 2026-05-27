import React, { useRef, useState } from 'react';
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import pros from '../../../app/data/thinkingOfAdopting/pros';

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
const CARD_PADDING = (screenWidth - CARD_WIDTH) / 2; // = screenWidth * 0.06

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

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();

    setFlipped(!flipped);
  };

  return (
    <TouchableOpacity onPress={flip} activeOpacity={1} style={styles.flipContainer}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: GREEN_LIGHT },
          {
            transform: [{ rotateY: frontInterpolate }],
            opacity: frontOpacity,
          },
        ]}
      >
        <Text style={styles.frontTitle}>{pro.fact}</Text>

        <Image
          source={CAT_IMAGES[index % CAT_IMAGES.length]}
          style={styles.catSticker}
          resizeMode="contain"
        />

        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to see why</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { backgroundColor: WHITE },
          {
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity,
          },
        ]}
      >
        <Text style={styles.backHeading}>{pro.fact}</Text>

        <View style={styles.divider} />

        <View style={styles.bulletsArea}>
          {[pro.support1, pro.support2, pro.support3, pro.support4]
            .filter(support => support && support !== '')
            .map((support, i) => (
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
  const currentIndexRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const SWIPE_THRESHOLD = screenWidth * 0.18;
  const SWIPE_VELOCITY = 0.38;

  const goToIndex = (index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
    translateX.setValue(0);
  };

  const goNext = () => {
    const idx = currentIndexRef.current;
    if (idx >= pros.length - 1) {
      // snap back instead of animating off screen
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }).start();
      return;
    }

    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      goToIndex(idx + 1);
    });
  };

  const goBack = () => {
    const idx = currentIndexRef.current;
    if (idx <= 0) {
      // snap back instead of animating off screen
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }).start();
      return;
    }

    Animated.timing(translateX, {
      toValue: screenWidth,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      goToIndex(idx - 1);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 4 && Math.abs(gesture.dx) > Math.abs(gesture.dy),

      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },

      onPanResponderRelease: (_, gesture) => {
        const swipedLeft =
          gesture.dx < -SWIPE_THRESHOLD || gesture.vx < -SWIPE_VELOCITY;

        const swipedRight =
          gesture.dx > SWIPE_THRESHOLD || gesture.vx > SWIPE_VELOCITY;

        if (swipedLeft) {
          goNext();
        } else if (swipedRight) {
          goBack();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 7,
            tension: 80,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
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
          <Animated.View
            style={{ transform: [{ translateX }] }}
            {...panResponder.panHandlers}
          >
            <FlipCard
              key={currentIndex}
              pro={pros[currentIndex]}
              index={currentIndex}
            />
          </Animated.View>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.circleNavBtn,
              currentIndex === 0 && styles.circleNavBtnDisabled,
            ]}
            onPress={goBack}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.arrowText,
                currentIndex === 0 && styles.arrowTextDisabled,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageCounter}>
            {currentIndex + 1} / {pros.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.circleNavBtn,
              styles.circleNavBtnNext,
              currentIndex === pros.length - 1 && styles.circleNavBtnDisabled,
            ]}
            onPress={goNext}
            disabled={currentIndex === pros.length - 1}
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
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: 380,
    paddingVertical: 22,
    // paddingHorizontal: CARD_PADDING,
    alignSelf: 'center',
    gap: 16,
  },

  header: {
    width: CARD_WIDTH,       // ← add these two
    alignSelf: 'center',     // ← lines
    gap: 10,
},

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    lineHeight: 22,
  },

  headerCenter: {
    flex: 1,
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontSize: 20,
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
  },

  bulletsArea: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  bulletPaw: {
    width: 18,
    height: 18,
    tintColor: GREEN,
    flexShrink: 0,
  },

  bulletText: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 19,
  },

  bottomNav: {
    width: CARD_WIDTH,       // ← add these two
    alignSelf: 'center',     // ← lines
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingBottom: 4,
  },

  circleNavBtn: {
    width: 92,
    height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(44,26,14,0.12)',
  },

  circleNavBtnNext: {
    backgroundColor: GREEN,
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
  },

  circleNavBtnDisabled: {
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