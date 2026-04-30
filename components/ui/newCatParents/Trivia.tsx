import React, { useState, useRef, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import quiz, { answers } from '../../../app/data/newCatParents/trivia';

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const GREEN = '#6B8F5E';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CAT = require('../../../assets/images/walkingCat.png');

const CONFETTI_COLORS = ['#D4956A', '#E8C9A0', '#6B8F5E', '#C8D8E8', '#E8C8B8', '#2C1A0E', '#FFFAF5'];

function ConfettiPiece({ color, delay }: { color: string, delay: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const x = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, {
          toValue: screenHeight,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: (Math.random() - 0.5) * 200 + Math.random() * screenWidth,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: Math.random() > 0.5 ? 10 : -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1200),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: Math.random() > 0.5 ? 10 : 7,
        height: Math.random() > 0.5 ? 10 : 7,
        borderRadius: Math.random() > 0.5 ? 5 : 0,
        backgroundColor: color,
        transform: [{ translateY: y }, { translateX: x }, { rotate: spin }],
        opacity,
        zIndex: 999,
      }}
    />
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiPiece
          key={i}
          color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
          delay={i * 40}
        />
      ))}
    </>
  );
}

export default function Trivia() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const [nextShown, setNextShown] = useState(false);
  const [contentShown, setContentShown] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;

  const progress = (questionNumber - 1) / quiz.length;

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: progress,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [questionNumber]);

  const animateSlide = (callback: () => void) => {
    Animated.timing(slideAnim, {
      toValue: -screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      slideAnim.setValue(screenWidth);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const button = (letter: string) => {
    if (selected === letter) {
      setSelected('');
    } else {
      setSelected(letter);
    }
    setResult('');
    setNextShown(false);
  };

  const checkAnswer = () => {
    if (!selected) return;
    if (answers[questionNumber - 1] === selected) {
      setResult('correct');
      setNextShown(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setResult('incorrect');
      setNextShown(false);
    }
  };

  const next = () => {
    if (questionNumber === quiz.length) {
      setContentShown(false);
    } else {
      animateSlide(() => {
        setQuestionNumber(prev => prev + 1);
        setSelected('');
        setResult('');
        setNextShown(false);
      });
    }
  };

  const restart = () => {
    setContentShown(true);
    setQuestionNumber(1);
    setSelected('');
    setResult('');
    setNextShown(false);
    catProgress.setValue(0);
  };

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
  });

  if (!contentShown) {
    return (
      <View style={styles.finishedScreen}>
        <Image source={CAT} style={styles.finishedCat} resizeMode="contain" />
        <Text style={styles.finishedTitle}>You did it!</Text>
        <Text style={styles.finishedSub}>Congrats on finishing the quiz!</Text>
        <TouchableOpacity style={styles.restartButton} onPress={restart} activeOpacity={0.85}>
          <Text style={styles.restartText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = quiz[questionNumber - 1];
  const ANSWERS = [
    { key: 'a', label: currentQ.answer1 },
    { key: 'b', label: currentQ.answer2 },
    { key: 'c', label: currentQ.answer3 },
  ];

  const getAnswerStyle = (key: string) => {
    if (result === '') return selected === key ? styles.answerSelected : styles.answerButton;
    if (key === answers[questionNumber - 1]) return [styles.answerButton, styles.answerCorrect];
    if (key === selected && result === 'incorrect') return [styles.answerButton, styles.answerWrong];
    return styles.answerButton;
  };

  const getAnswerTextStyle = (key: string) => {
    if (result === '') return selected === key ? styles.answerTextSelected : styles.answerText;
    if (key === answers[questionNumber - 1]) return [styles.answerText, { color: GREEN, fontWeight: '700' as const }];
    if (key === selected && result === 'incorrect') return [styles.answerText, { color: '#C47A45', fontWeight: '700' as const }];
    return styles.answerText;
  };

  return (
    <View style={styles.container}>

      {/* Confetti */}
      <Confetti show={showConfetti} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Question {questionNumber} of {quiz.length}</Text>

        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, {
              width: catProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }]} />
          </View>
          <Animated.Image
            source={CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.progressLabel}>{questionNumber - 1} of {quiz.length} answered</Text>
      </View>

      {/* Question card */}
      <Animated.View style={[styles.questionCard, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        <View style={styles.answersArea}>
          {ANSWERS.map((answer) => (
            <TouchableOpacity
              key={answer.key}
              style={getAnswerStyle(answer.key)}
              onPress={() => result === '' && button(answer.key)}
              activeOpacity={0.8}
              disabled={result !== ''}
            >
              <View style={[
                styles.answerDot,
                selected === answer.key && result === '' && styles.answerDotSelected,
                result !== '' && answer.key === answers[questionNumber - 1] && styles.answerDotCorrect,
                result === 'incorrect' && answer.key === selected && styles.answerDotWrong,
              ]} />
              <Text style={getAnswerTextStyle(answer.key)}>{answer.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {result !== '' && (
          <View style={[styles.resultBanner, result === 'correct' ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultText}>
              {result === 'correct' ? 'Correct!' : 'Not quite!'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Bottom */}
      <View style={styles.bottomArea}>
        {result === '' ? (
          <TouchableOpacity
            style={[styles.checkButton, !selected && styles.checkButtonDisabled]}
            onPress={checkAnswer}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : nextShown ? (
          <TouchableOpacity style={styles.nextButton} onPress={next} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>
              {questionNumber === quiz.length ? 'Finish' : 'Next >'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => { setResult(''); setSelected(''); }}
            activeOpacity={0.85}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <View style={styles.dotsRow}>
          {quiz.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i === questionNumber - 1 && styles.dotActive,
              i < questionNumber - 1 && styles.dotSeen,
            ]} />
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(212,149,106,0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: WARM,
  },
  answerCorrect: {
    backgroundColor: 'rgba(107,143,94,0.12)',
    borderColor: GREEN,
  },
  answerWrong: {
    backgroundColor: 'rgba(196,122,69,0.12)',
    borderColor: '#C47A45',
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
  answerDotCorrect: {
    borderColor: GREEN,
    backgroundColor: GREEN,
  },
  answerDotWrong: {
    borderColor: '#C47A45',
    backgroundColor: '#C47A45',
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: INK_SOFT,
    lineHeight: 20,
  },
  answerTextSelected: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: INK,
    lineHeight: 20,
  },

  resultBanner: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  resultCorrect: {
    backgroundColor: 'rgba(107,143,94,0.15)',
  },
  resultWrong: {
    backgroundColor: 'rgba(196,122,69,0.15)',
  },
  resultText: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '700',
    color: INK,
  },

  bottomArea: {
    gap: 14,
  },
  checkButton: {
    backgroundColor: INK,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  checkButtonDisabled: {
    opacity: 0.4,
  },
  checkButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: GREEN,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  nextButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: 'rgba(196,122,69,0.15)',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C47A45',
  },
  retryButtonText: {
    color: '#C47A45',
    fontSize: 16,
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
  dotSeen: {
    backgroundColor: WARM,
  },

  finishedScreen: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  finishedCat: {
    width: 140,
    height: 140,
  },
  finishedTitle: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
  },
  finishedSub: {
    fontSize: 15,
    fontWeight: '400',
    color: INK_SOFT,
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 8,
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
  restartText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
});