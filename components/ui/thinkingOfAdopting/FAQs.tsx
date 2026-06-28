import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import faqs from '../../../app/data/thinkingOfAdopting/faqs';
import { mixpanel } from '../../../lib/mixpanel';

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE    = '#FFFAF5';
const GREEN    = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const WARM     = '#D4956A';

const PAW      = require('../../../assets/images/paw.png');
const CAT_PEEK = require('../../../assets/images/catWave.png');

function FAQItem({ question, answer, isOpen, onPress, index }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
  index: number;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const peekAnim   = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, { toValue: isOpen ? 1 : 0, duration: 200, useNativeDriver: true }),
      Animated.spring(peekAnim,   { toValue: isOpen ? 1 : 0, friction: 5, tension: 70, useNativeDriver: true }),
    ]).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const catTranslateX = peekAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.faqWrapper}>

      {/* Cat peeks from left */}
      <Animated.Image
        source={CAT_PEEK}
        style={[
          styles.peekingCat,
          {
            opacity: peekAnim,
            transform: [{ translateX: catTranslateX }, { rotate: '-45deg' }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Card */}
      <View style={[
        styles.faqCard,
        isOpen && { borderLeftWidth: 3, borderLeftColor: GREEN },
      ]}>
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
    const isOpening = openIndex !== index;

    if (isOpening) {
      mixpanel.track('FAQ Opened (Thinking of Adopting)', {
        'Screen Name': 'Thinking of Adopting FAQs',
        'Question': faqs[index].question,
      });
    }
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
          index={index}
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
    backgroundColor: 'white',
  },

  scrollContent: {
    paddingLeft: 0,
    paddingRight: 20,
    paddingTop: 24,
    gap: 16,
  },

  faqWrapper: {
    position: 'relative',
  },

  peekingCat: {
    position: 'absolute',
    width: 120,
    height: 120,
    left: 0,
    top: '50%',
    marginTop: -60,
    zIndex: 0,
  },

  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2,
    marginLeft: 55,
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(44,26,14,0.1)',
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },

  questionText: {
    flex: 1,
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '700',
    color: INK,
    lineHeight: 24,
  },

  pawChevron: {
    width: 26,
    height: 26,
    tintColor: GREEN,
    flexShrink: 0,
    marginTop: 1,
  },

  answerWrapper: {
    gap: 12,
    marginTop: 12,
  },

  answerDivider: {
    height: 1.5,
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 1,
  },

  answerText: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 22,
  },
});