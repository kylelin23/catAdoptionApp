import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Image, Animated } from 'react-native';

const IMAGES = [
  require('../../assets/images/catWave.png'),
  require('../../assets/images/catStretch.png'),
  require('../../assets/images/cat.png'),
];

export default function HomeScreen({ navigation }: { navigation: any }) {

  const handleGetStarted = () => {
    navigation.navigate("Home");
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = setInterval(() => {
      // First shrink to 0, THEN swap image, THEN spring back
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }).start();
      });
    }, 2200);

    return () => clearInterval(cycle);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />

      {/* Animated cat circle */}
      <Animated.View style={[styles.catCircleWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.catCircle}>
          <Image
            source={IMAGES[currentIndex]}
            style={styles.catImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Title */}
      <View style={styles.titleArea}>
        <Text style={styles.titleText}>Catwise</Text>
        <Text style={styles.subText}>Your complete guide to cat adoption</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Feature pills */}
      <View style={styles.pillsRow}>
        {['Food', 'Health', 'Toys', 'Behavior'].map((label) => (
          <View key={label} style={styles.pill}>
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleGetStarted}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WHITE = '#FFFAF5';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: SAND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    overflow: 'hidden',
  },

  // Background blobs
  blobTopLeft: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#F2DCBC',
    top: -60,
    left: -60,
    opacity: 0.7,
  },
  blobBottomRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#C47A45',
    bottom: 80,
    right: -50,
    opacity: 0.35,
  },

  // Shadow wrapper — keeps shadow visible on Android
  catCircleWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 24,
    shadowColor: '#A0622A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  // Inner circle clips the image
  catCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,250,245,0.55)',
    backgroundColor: 'rgba(255,250,245,0.15)',
  },

  catImage: {
    width: '100%',
    height: '100%',
  },

  // Title
  titleArea: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  titleText: {
    fontFamily: 'Georgia',
    fontSize: 58,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1.5,
    lineHeight: 62,
  },
  subText: {
    fontSize: 16,
    fontWeight: '400',
    color: INK_SOFT,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Divider
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(44,26,14,0.2)',
    borderRadius: 2,
    marginBottom: 18,
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 36,
  },
  pill: {
    backgroundColor: 'rgba(255,250,245,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,250,245,0.65)',
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: INK,
  },

  // CTA
  ctaButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: INK,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,250,245,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrowText: {
    color: WHITE,
    fontSize: 20,
    lineHeight: 22,
  },
});