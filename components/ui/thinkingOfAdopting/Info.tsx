import React, { useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';

const screenWidth = Dimensions.get('window').width;

export default function Info({ navigation }: { navigation: any }) {

  const prosScale = useRef(new Animated.Value(1)).current;
  const consScale = useRef(new Animated.Value(1)).current;

  const animatePress = (anim: Animated.Value, destination: string) => {
    Animated.spring(anim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
    }).start(() => {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
      navigation.navigate(destination);
    });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.sectionLabel}>Choose a topic</Text>

      {/* Pros — full width banner */}
      <Animated.View style={[styles.bannerWrapper, { transform: [{ scale: prosScale }] }]}>
        <TouchableOpacity
          style={[styles.banner, styles.bannerPros]}
          onPress={() => animatePress(prosScale, 'Pros')}
          activeOpacity={1}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>01</Text>
            <Text style={styles.bannerTitle}>Pros</Text>
            <Text style={styles.bannerSubtitle}>Key benefits of adopting a cat</Text>
          </View>
          <View style={styles.bannerArrow}>
            <Text style={styles.bannerArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Cons — full width banner */}
      <Animated.View style={[styles.bannerWrapper, { transform: [{ scale: consScale }] }]}>
        <TouchableOpacity
          style={[styles.banner, styles.bannerCons]}
          onPress={() => animatePress(consScale, 'Cons')}
          activeOpacity={1}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>02</Text>
            <Text style={styles.bannerTitle}>Cons</Text>
            <Text style={styles.bannerSubtitle}>Things to consider before adopting</Text>
          </View>
          <View style={styles.bannerArrow}>
            <Text style={styles.bannerArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 14,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(44,26,14,0.45)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    paddingLeft: 4,
    marginBottom: 4,
  },

  bannerWrapper: {
    borderRadius: 28,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },

  banner: {
    borderRadius: 28,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 140,
  },

  bannerPros: {
    backgroundColor: '#C8D8E8',  // dusty blue
  },

  bannerCons: {
    backgroundColor: '#E8C8B8',  // soft terracotta
  },

  bannerLeft: {
    flex: 1,
    gap: 6,
  },

  bannerTag: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(44,26,14,0.3)',
    letterSpacing: 1,
  },

  bannerTitle: {
    fontFamily: 'Georgia',
    fontSize: 34,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 36,
  },

  bannerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 18,
    maxWidth: 200,
  },

  bannerArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerArrowText: {
    fontSize: 18,
    color: INK,
    fontWeight: '600',
  },
});
