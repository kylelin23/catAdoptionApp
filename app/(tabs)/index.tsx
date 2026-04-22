import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }: { navigation: any }) {

  const handleGetStarted = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />
      <View style={styles.blobCenter} />

      {/* Cat illustration circle */}
      <View style={styles.catCircle}>
        <View style={styles.catBody}>
          {/* Ears */}
          <View style={styles.earsRow}>
            <View style={styles.earOuter}>
              <View style={styles.earInner} />
            </View>
            <View style={[styles.earOuter, styles.earRight]}>
              <View style={[styles.earInner, styles.earInnerRight]} />
            </View>
          </View>
          {/* Head */}
          <View style={styles.catHead}>
            {/* Eyes */}
            <View style={styles.eyesRow}>
              <View style={styles.eyeWhite}>
                <View style={styles.pupil} />
                <View style={styles.eyeShine} />
              </View>
              <View style={styles.eyeWhite}>
                <View style={styles.pupil} />
                <View style={styles.eyeShine} />
              </View>
            </View>
            {/* Nose */}
            <View style={styles.nose} />
            {/* Mouth lines */}
            <View style={styles.mouthRow}>
              <View style={styles.mouthLeft} />
              <View style={styles.mouthRight} />
            </View>
            {/* Whiskers */}
            <View style={styles.whiskersRow}>
              <View style={styles.whiskerLeft} />
              <View style={styles.whiskerRight} />
            </View>
            <View style={[styles.whiskersRow, { marginTop: 3 }]}>
              <View style={styles.whiskerLeft} />
              <View style={styles.whiskerRight} />
            </View>
          </View>
        </View>
      </View>

      {/* Decorative dots */}
      <View style={styles.dotLarge} />
      <View style={styles.dotSmall} />

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
      <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted} activeOpacity={0.85}>
        <Text style={styles.ctaText}>Get Started</Text>
        <View style={styles.ctaArrow}>
          <Text style={styles.ctaArrowText}>›</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const INK = '#1A2B35';
const INK_SOFT = '#3D5566';
const SKY = '#A8C5DA';
const TEAL = '#7AAEC6';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: SKY,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingHorizontal: 36,
    overflow: 'hidden',
  },

  // Background blobs
  blobTopLeft: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#D4ECF7',
    top: -60,
    left: -60,
    opacity: 0.5,
  },
  blobBottomRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#5FA8CC',
    bottom: 80,
    right: -50,
    opacity: 0.4,
  },
  blobCenter: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EAF6FF',
    top: '40%',
    left: '20%',
    opacity: 0.35,
  },

  // Cat illustration
  catCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },

  catBody: {
    alignItems: 'center',
    width: 100,
  },

  earsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 72,
    marginBottom: -6,
    zIndex: 1,
  },
  earOuter: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: INK,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  earRight: {},
  earInner: {
    position: 'absolute',
    bottom: -22,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: TEAL,
  },
  earInnerRight: {},

  catHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },

  eyesRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 6,
  },
  eyeWhite: {
    width: 18,
    height: 20,
    borderRadius: 9,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    width: 10,
    height: 13,
    borderRadius: 6,
    backgroundColor: '#0d1a22',
  },
  eyeShine: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: WHITE,
  },

  nose: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: TEAL,
    marginBottom: 4,
  },

  mouthRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  mouthLeft: {
    width: 10,
    height: 1.5,
    backgroundColor: TEAL,
    borderRadius: 1,
    transform: [{ rotate: '20deg' }],
  },
  mouthRight: {
    width: 10,
    height: 1.5,
    backgroundColor: TEAL,
    borderRadius: 1,
    transform: [{ rotate: '-20deg' }],
  },

  whiskersRow: {
    flexDirection: 'row',
    gap: 30,
  },
  whiskerLeft: {
    width: 22,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },
  whiskerRight: {
    width: 22,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },

  // Decorative dots
  dotLarge: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    top: '28%',
    right: '18%',
  },
  dotSmall: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: '35%',
    left: '16%',
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
    backgroundColor: 'rgba(30,60,80,0.2)',
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
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
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
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrowText: {
    color: WHITE,
    fontSize: 20,
    lineHeight: 22,
  },
});