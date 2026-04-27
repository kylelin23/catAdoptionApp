import React, { useState, useRef } from 'react';
import { Text, Dimensions, View, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import faqs from '../../../app/data/thinkingOfAdopting/faqs';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const screenWidth = Dimensions.get('window').width;

const PAW = require('../../../assets/images/paw.png');
const CAT_PEEK = require('../../../assets/images/catWave.png');

function FAQItem({ question, answer, isOpen, onPress }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const peekAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(peekAnim, {
        toValue: isOpen ? 1 : 0,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Cat slides right enough to overlap behind the card
  const catTranslateX = peekAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0], // right edge of cat goes well into the card
  });

  return (
    <View style={styles.faqWrapper}>

      {/* Cat — zIndex 0, renders behind card */}
      <Animated.Image
        source={CAT_PEEK}
        style={[
          styles.peekingCat,
          {
            opacity: peekAnim,
            transform: [
              { translateX: catTranslateX },
              { rotate: '-45deg' },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* Card — zIndex 2, renders in front of cat */}
      <View style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
        <TouchableOpacity
          style={styles.questionRow}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.questionText}>{question}</Text>
          <Animated.Image
            source={PAW}
            style={[styles.pawChevron, { transform: [{ rotate }] }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.answerWrapper}>
            <View style={styles.answerDivider} />
            <Text style={styles.answerText}>{answer}</Text>
          </View>
        )}
      </View>

    </View>
  );
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {faqs.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onPress={() => showAnswer(index)}
        />
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  scroll: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  scrollContent: {
    paddingLeft: 0,
    paddingRight: 20,
    paddingTop: 20,
    gap: 12,
  },

  faqWrapper: {
    position: 'relative',
  },

  // Cat behind the card — zIndex 0
  peekingCat: {
    position: 'absolute',
    width: 120,
    height: 120,
    left: 0,
    top: '50%',
    marginTop: -60,
    zIndex: 0,
  },

  // Card in front — zIndex 2
  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,  // higher elevation on Android keeps card above cat
    zIndex: 2,
    marginLeft: 55,
  },

  faqCardOpen: {
    borderLeftWidth: 4,
    borderLeftColor: WARM,
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  questionText: {
    flex: 1,
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '700',
    color: INK,
    lineHeight: 19,
  },

  pawChevron: {
    width: 28,
    height: 28,
    tintColor: WARM,
    flexShrink: 0,
  },

  answerWrapper: {
    gap: 12,
    marginTop: 4,
  },

  answerDivider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
  },

  answerText: {
    fontSize: 12,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 18,
  },
});