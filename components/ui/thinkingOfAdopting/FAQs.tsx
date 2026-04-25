import React, { useState, useRef } from 'react';
import { Text, Dimensions, View, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import faqs from '../../../app/data/thinkingOfAdopting/faqs';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const screenWidth = Dimensions.get('window').width;

function FAQItem({ question, answer, isOpen, onPress }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(heightAnim, {
        toValue: isOpen ? 1 : 0,
        friction: 8,
        tension: 60,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
      <TouchableOpacity
        style={styles.questionRow}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.questionText}>{question}</Text>
            <Animated.View style={[styles.chevronWrapper, { transform: [{ rotate }] }]}>
                <View style={styles.chevron} />
            </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.answerWrapper}>
          <View style={styles.answerDivider} />
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
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

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  scroll: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },

  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 15,
    fontWeight: '700',
    color: INK,
    lineHeight: 22,
  },

  chevronWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: SAND,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: INK,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
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
    fontSize: 14,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 22,
  },
});