import React, { useRef, useState } from 'react';
import { Text, Dimensions, View, StyleSheet, Image, TouchableOpacity, Animated, PanResponder } from 'react-native';
import cons from '../../../app/data/thinkingOfAdopting/cons';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';
const ORANGE = '#D4956A';
const ORANGE_LIGHT = '#F2C9A0';
const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../assets/images/paw.png');

const CAT_IMAGES = [
  require('../../../assets/images/cat.png'),
  require('../../../assets/images/catCute.png'),
  require('../../../assets/images/catStretch.png'),
  require('../../../assets/images/catWave.png'),
];

function FlipCard({ con, index, color }: { con: any, index: number, color: string }) {
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

      {/* Front */}
      <Animated.View style={[
        styles.card,
        { backgroundColor: color },
        { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity },
      ]}>
        <Text style={styles.frontTitle}>{con.category}</Text>

        <Image
          source={CAT_IMAGES[index % CAT_IMAGES.length]}
          style={styles.catSticker}
          resizeMode="contain"
        />

        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to learn more</Text>
        </View>
      </Animated.View>

      {/* Back */}
      <Animated.View style={[
        styles.card,
        styles.cardBack,
        { backgroundColor: WHITE },
        { transform: [{ rotateY: backInterpolate }], opacity: backOpacity },
      ]}>
        <Text style={styles.backHeading}>{con.category}</Text>

        <View style={styles.divider} />

        <View style={styles.bulletsArea}>
          {[con.support1, con.support2, con.support3]
            .filter(s => s && s !== '')
            .map((support, i) => (
              <View key={i} style={styles.bulletRow}>
                <Image source={PAW} style={styles.bulletPaw} resizeMode="contain" />
                <Text style={styles.bulletText}>{support}</Text>
              </View>
            ))}
        </View>

        <View style={[styles.tapHint, styles.tapHintDark]}>
          <Text style={[styles.tapHintText, { color: INK_SOFT }]}>Tap to flip back</Text>
        </View>
      </Animated.View>

    </TouchableOpacity>
  );
}

export default function Cons({ navigation }: { navigation: any }) {
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
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        const idx = currentIndexRef.current;
        if (gesture.dx < -SWIPE_THRESHOLD && idx < cons.length - 1) {
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
    <View style={styles.container}>

      {/* Top */}
      <View style={styles.topArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.pageLabel}>THINKING OF ADOPTING</Text>
            <Text style={styles.pageTitle}>The Cons</Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeNum}>{currentIndex + 1}</Text>
            <Text style={styles.counterBadgeDenom}>/{cons.length}</Text>
          </View>
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
            con={cons[currentIndex]}
            index={currentIndex}
            color={ORANGE_LIGHT}
          />
        </Animated.View>
      </View>

      {/* Bottom */}
      <View style={styles.bottomArea}>
        <View style={styles.dotsRow}>
          {cons.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goToIndex(i)}>
              <View style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
                i < currentIndex && styles.dotSeen,
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={() => currentIndex > 0 && goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>{"< Prev"}</Text>
          </TouchableOpacity>

          <View style={styles.swipeHint}>
            <Image source={PAW} style={styles.swipeHintPaw} resizeMode="contain" />
            <Text style={styles.swipeHintText}>Swipe or tap</Text>
            <Image source={PAW} style={[styles.swipeHintPaw, { transform: [{ scaleX: -1 }] }]} resizeMode="contain" />
          </View>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonNext, currentIndex === cons.length - 1 && styles.navButtonDisabled]}
            onPress={() => currentIndex < cons.length - 1 && goToIndex(currentIndex + 1)}
            disabled={currentIndex === cons.length - 1}
            activeOpacity={0.8}
          >
            <Text style={[styles.navButtonText, { color: WHITE }]}>{"Next >"}</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 22,
    paddingTop: 64,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  topArea: {
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: INK_SOFT,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleBlock: {
    gap: 2,
  },
  pageLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 44,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  counterBadge: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginBottom: 6,
  },
  counterBadgeNum: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '900',
    color: WHITE,
    lineHeight: 26,
  },
  counterBadgeDenom: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,250,245,0.7)',
  },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },

  flipContainer: {
    width: '100%',
    height: 320,
  },

  card: {
    width: '100%',
    height: 320,
    borderRadius: 32,
    padding: 26,
    shadowColor: INK,
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardBack: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  frontTitle: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
    lineHeight: 32,
    textAlign: 'center',
    alignSelf: 'stretch',
  },

  catSticker: {
    width: 140,
    height: 140,
  },

  backHeading: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 22,
    alignSelf: 'stretch',
  },

  divider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.1)',
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
    width: 20,
    height: 20,
    tintColor: ORANGE,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 20,
  },

  tapHint: {
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  tapHintDark: {
    backgroundColor: 'rgba(44,26,14,0.06)',
  },
  tapHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: INK,
    letterSpacing: 0.3,
  },

  bottomArea: {
    gap: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(44,26,14,0.15)',
  },
  dotActive: {
    backgroundColor: INK,
    width: 22,
  },
  dotSeen: {
    backgroundColor: ORANGE,
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(44,26,14,0.08)',
  },
  navButtonNext: {
    backgroundColor: INK,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
  },

  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swipeHintPaw: {
    width: 14,
    height: 14,
    tintColor: INK_SOFT,
    opacity: 0.5,
  },
  swipeHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: INK_SOFT,
    opacity: 0.6,
  },
});