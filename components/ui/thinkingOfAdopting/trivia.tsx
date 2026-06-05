import React, { useState, useRef, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, Animated, Image, SafeAreaView, ScrollView } from 'react-native';
import quiz from '../../../app/data/thinkingOfAdopting/trivia';

const INK        = '#2C1A0E';
const INK_SOFT   = '#6B4C35';
const WHITE      = '#FFFAF5';
const GREEN      = '#7BAE6E';
const GREEN_DARK = '#5A8F50';
const WARM       = '#D4956A';

const screenWidth = Dimensions.get('window').width;
const CAT = require('../../../assets/images/walkingCat.png');

export default function Trivia() {
  const [currentQ, setCurrentQ]     = useState(0);
  const [questions, setQuestions]   = useState(Array(quiz.length).fill(0));
  const [total, setTotal]           = useState(0);
  const [result, setResult]         = useState('');
  const [showResult, setShowResult] = useState(false);

  const slideAnim   = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const answeredCount = questions.filter(q => q !== 0).length;
  const progress      = answeredCount / questions.length;

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: progress,
      friction: 6, tension: 80,
      useNativeDriver: false,
    }).start();
  }, [answeredCount]);

  const animateSlide = (direction: number, callback: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    Animated.timing(slideAnim, { toValue: direction * screenWidth, duration: 180, useNativeDriver: true })
      .start(() => {
        callback();
        slideAnim.setValue(-direction * screenWidth);
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true })
          .start(() => { isAnimating.current = false; });
      });
  };

  const selectAnswer = (points: number) => {
    const newQuestions = [...questions];
    newQuestions[currentQ] = newQuestions[currentQ] === points ? 0 : points;
    setQuestions(newQuestions);
    setTotal(newQuestions.reduce((a, b) => a + b, 0));
  };

  const handleCheck = () => {
    const currentAnswer = questions[currentQ];
    if (currentAnswer === 0) return;

    if (currentQ < quiz.length - 1) {
      animateSlide(-1, () => setCurrentQ(p => p + 1));
    } else {
      const firstUnanswered = questions.findIndex(q => q === 0);
      if (firstUnanswered !== -1) {
        alert(`Question ${firstUnanswered + 1} still needs an answer!`);
        return;
      }
      const finalTotal = questions.reduce((a, b) => a + b, 0);
      let resultText = '';
      if (finalTotal < 16)      resultText = 'Not Yet Ready. Nothing is ever a complete "no" but we want you to feel ready and be ready.';
      else if (finalTotal < 22) resultText = 'Almost There. Go cat sit or hang out at a shelter before taking the plunge.';
      else                      resultText = 'Ready to Adopt! You probably already have a name ready!';
      setResult(resultText);
      setShowResult(true);
    }
  };

  const reset = () => {
    setQuestions(Array(quiz.length).fill(0));
    setTotal(0); setResult(''); setShowResult(false); setCurrentQ(0);
    catProgress.setValue(0);
    isAnimating.current = false;
  };

  const getResultColor = () => {
    const finalTotal = questions.reduce((a, b) => a + b, 0);
    return finalTotal < 16 ? '#C47A45' : finalTotal < 22 ? WARM : GREEN;
  };

  const currentAnswer = questions[currentQ];
  const question      = quiz[currentQ];
  const isLast        = currentQ === quiz.length - 1;
  const isAnswered    = currentAnswer !== 0;

  if (!question) return null;

  const CAT_SIZE    = 36;
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: 'clamp',
  });

  if (showResult) {
    return (
      <SafeAreaView style={styles.resultScreen}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEyebrow}>YOUR RESULT</Text>
          <Text style={[styles.resultText, { color: getResultColor() }]}>{result}</Text>
        </View>
        <TouchableOpacity style={styles.tryAgainBtn} onPress={reset} activeOpacity={0.85}>
          <Text style={styles.tryAgainText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Top layer layout style position: Cat progress track + Question layout */}
        <View style={styles.topSection}>
          <View style={styles.progressArea}>
            <Animated.Image
              source={CAT}
              style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
              resizeMode="contain"
            />
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, {
                width: catProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }]} />
            </View>
          </View>
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.questionText}>{question.question}</Text>
          </Animated.View>
        </View>

        {/* Dynamic center flex layout block formatting choice elements vertically down page wrapper */}
        <View style={styles.centeredBody}>
          <Animated.View style={[styles.answersArea, { transform: [{ translateX: slideAnim }] }]}>
            {[
              { label: question.answer1, points: 3 },
              { label: question.answer2, points: 2 },
              { label: question.answer3, points: 1 },
            ].map((answer, aIndex) => {
              const isSelected = currentAnswer === answer.points;
              return (
                <TouchableOpacity
                  key={aIndex}
                  style={[styles.answerBtn, isSelected && styles.answerBtnSelected]}
                  onPress={() => selectAnswer(answer.points)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.answerText, isSelected && styles.answerTextSelected, { flex: 1 }]}>
                    {answer.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>

      </ScrollView>

      {/* Persistent platform bottom locked interactive actionable response button layout component stack layer */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.nextBtn, !isAnswered && styles.nextBtnDisabled]}
          onPress={handleCheck}
          disabled={!isAnswered}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Finish Quiz' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 10,
  },
  centeredBody: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  progressArea: {
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(44,26,14,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
    borderRadius: 5,
  },
  progressCat: {
    position: 'absolute',
    width: 36, height: 36,
    top: -30,
  },
  questionText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    lineHeight: 26,
    marginTop: 10,
  },
  answersArea: {
    paddingHorizontal: 22,
    gap: 10,
  },
  answerBtn: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 15,
    borderWidth: 2.5,
    borderColor: 'rgba(44,26,14,0.1)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(44,26,14,0.15)',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerBtnSelected: {
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
    backgroundColor: 'rgba(123,174,110,0.1)',
  },
  answerText: {
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '600',
    color: INK_SOFT,
    lineHeight: 20,
  },
  answerTextSelected: {
    color: INK,
    fontWeight: '800',
  },
  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  nextBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  nextBtnDisabled: {
    backgroundColor: '#D1E4CB',
    borderBottomColor: '#A3C29B',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontFamily: 'Avenir',
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultScreen: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 24,
  },
  resultCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(44,26,14,0.06)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(44,26,14,0.1)',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultEyebrow: {
    fontFamily: 'Avenir',
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },
  resultText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 26,
    color: INK,
  },
  tryAgainBtn: {
    width: '50%',
    paddingVertical: 18,
    backgroundColor: GREEN,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tryAgainText: {
    fontFamily: 'Avenir',
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});