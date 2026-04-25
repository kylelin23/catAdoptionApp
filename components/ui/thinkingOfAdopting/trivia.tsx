import React, { useState, useRef, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import quiz from '../../../app/data/thinkingOfAdopting/trivia';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const GREEN = '#6B8F5E';
const screenWidth = Dimensions.get('window').width;

const CAT = require('../../../assets/images/walkingCat.png');

export default function Trivia() {
  const [currentQ, setCurrentQ] = useState(0);
  const [questions, setQuestions] = useState(Array(9).fill(0));
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;

  const answeredCount = questions.filter(q => q !== 0).length;
  const progress = answeredCount / questions.length;

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: progress,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [answeredCount]);

  const animateSlide = (direction: number, callback: () => void) => {
    Animated.timing(slideAnim, {
      toValue: direction * screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      slideAnim.setValue(-direction * screenWidth);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const selectAnswer = (points: number) => {
    const newQuestions = [...questions];
    const wasSelected = newQuestions[currentQ] === points;
    newQuestions[currentQ] = wasSelected ? 0 : points;
    setQuestions(newQuestions);

    let sum = 0;
    for (let q = 0; q < newQuestions.length; q++) sum += newQuestions[q];
    setTotal(sum);
  };

  const goNext = () => {
    if (currentQ < quiz.length - 1) {
      animateSlide(-1, () => setCurrentQ(prev => prev + 1));
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      animateSlide(1, () => setCurrentQ(prev => prev - 1));
    }
  };

  const submit = () => {
    const firstUnanswered = questions.findIndex(q => q === 0);
    if (firstUnanswered !== -1) {
      alert(`Question ${firstUnanswered + 1} still needs an answer!`);
      return;
    }

    let resultText = '';
    if (total < 16) {
      resultText = 'Not Yet Ready. Nothing is ever a complete "no" but we want you to feel ready and be ready.';
    } else if (total < 22) {
      resultText = 'Almost There. Go cat sit or hang out at a shelter before taking the plunge.';
    } else {
      resultText = 'Ready to Adopt! You probably already have a name ready!';
    }

    setResult(resultText);
    setShowResult(true);
  };

  const reset = () => {
    setQuestions(Array(9).fill(0));
    setTotal(0);
    setResult('');
    setShowResult(false);
    setCurrentQ(0);
    catProgress.setValue(0);
  };

  const getResultColor = () => {
    if (total < 16) return '#C47A45';
    if (total < 22) return '#D4956A';
    return GREEN;
  };

  const currentAnswer = questions[currentQ];
  const question = quiz[currentQ];

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
  });

  if (showResult) {
    return (
      <View style={styles.resultScreen}>
        <Image source={CAT} style={styles.resultCatImage} resizeMode="contain" />
        <Text style={styles.resultTitle}>Your Result</Text>
        <Text style={[styles.resultBigText, { color: getResultColor() }]}>{result}</Text>

        <TouchableOpacity style={styles.resetButton} onPress={reset} activeOpacity={0.85}>
          <Text style={styles.resetText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Question {currentQ + 1} of {quiz.length}</Text>

        {/* Progress bar with walking cat */}
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: catProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }) }]} />
          </View>
          <Animated.Image
            source={CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.progressLabel}>{answeredCount} of {questions.length} answered</Text>
      </View>

      {/* Question card */}
      <Animated.View style={[styles.questionCard, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.answersArea}>
          {[
            { label: question.answer1, points: 3 },
            { label: question.answer2, points: 2 },
            { label: question.answer3, points: 1 },
          ].map((answer, aIndex) => {
            const isSelected = currentAnswer === answer.points;
            return (
              <TouchableOpacity
                key={aIndex}
                style={[styles.answerButton, isSelected && styles.answerSelected]}
                onPress={() => selectAnswer(answer.points)}
                activeOpacity={0.8}
              >
                <View style={[styles.answerDot, isSelected && styles.answerDotSelected]} />
                <Text style={[styles.answerText, isSelected && styles.answerTextSelected]}>
                  {answer.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentQ === 0 && styles.navButtonDisabled]}
          onPress={goPrev}
          disabled={currentQ === 0}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, currentQ === 0 && styles.navButtonTextDisabled]}>{"< Back"}</Text>
        </TouchableOpacity>

        {currentQ < quiz.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButtonPrimary, currentAnswer === 0 && styles.navButtonPrimaryDisabled]}
            onPress={goNext}
            activeOpacity={0.85}
          >
            <Text style={styles.navButtonPrimaryText}>{"Next >"}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, currentAnswer === 0 && styles.submitButtonDisabled]}
            onPress={submit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>See Result</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {quiz.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => animateSlide(i > currentQ ? -1 : 1, () => setCurrentQ(i))}
          >
            <View style={[
              styles.dot,
              i === currentQ && styles.dotActive,
              questions[i] !== 0 && i !== currentQ && styles.dotAnswered,
            ]} />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },

  header: {
    gap: 8,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: INK_SOFT,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  progressArea: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(44,26,14,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: WARM,
    borderRadius: 4,
  },
  progressCat: {
    position: 'absolute',
    width: 36,
    height: 36,
    top: -28,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: INK_SOFT,
  },

  questionCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  questionText: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    lineHeight: 26,
  },

  answersArea: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(232,201,160,0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  answerSelected: {
    backgroundColor: 'rgba(212,149,106,0.15)',
    borderColor: WARM,
  },
  answerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.25)',
    flexShrink: 0,
  },
  answerDotSelected: {
    borderColor: WARM,
    backgroundColor: WARM,
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 20,
  },
  answerTextSelected: {
    color: INK,
    fontWeight: '600',
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(44,26,14,0.08)',
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: INK,
  },
  navButtonTextDisabled: {
    color: INK_SOFT,
  },
  navButtonPrimary: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: INK,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonPrimaryDisabled: {
    opacity: 0.45,
  },
  navButtonPrimaryText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: GREEN,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
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
    width: 20,
  },
  dotAnswered: {
    backgroundColor: WARM,
  },

  resultScreen: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },
  resultCatImage: {
    width: 140,
    height: 140,
  },
  resultTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: INK_SOFT,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  resultBigText: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 30,
  },
  resetButton: {
    backgroundColor: INK,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
});