import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView, Image } from "react-native";
import food, { plants, householdItems, others } from '../../../data/catParents/catList1';
import { useState, useRef, useEffect } from "react";

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const GREEN = '#6B8F5E';
const RED = '#C47A45';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LISTS = [food, plants, householdItems, others];
const LIST_LABELS = ['Foods', 'Plants', 'Household', 'Others'];
const CONFETTI_COLORS = ['#D4956A', '#E8C9A0', '#6B8F5E', '#C8D8E8', '#E8C8B8', '#2C1A0E', '#FFFAF5'];

const CAT = require('../../../../assets/images/walkingCat.png');

function ConfettiPiece({ color, delay }: { color: string, delay: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const x = useRef(new Animated.Value(Math.random() * screenWidth)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, { toValue: screenHeight, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(x, { toValue: (Math.random() - 0.5) * 200 + Math.random() * screenWidth, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: Math.random() > 0.5 ? 10 : -10, duration: 2000, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(1200),
          Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [-10, 10], outputRange: ['-360deg', '360deg'] });

  return (
    <Animated.View style={{
      position: 'absolute',
      width: Math.random() > 0.5 ? 10 : 7,
      height: Math.random() > 0.5 ? 10 : 7,
      borderRadius: Math.random() > 0.5 ? 5 : 0,
      backgroundColor: color,
      transform: [{ translateY: y }, { translateX: x }, { rotate: spin }],
      opacity,
      zIndex: 999,
    }} />
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiPiece key={i} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} delay={i * 40} />
      ))}
    </>
  );
}

export default function CatList1({ navigation }: { navigation: any }) {

  const [listIndex, setListIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;
  const currentList = LISTS[listIndex];
  const currentItem = currentList[currentItemIndex];

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 40;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: currentItemIndex / currentList.length,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentItemIndex]);

  const resetList = () => {
    setCurrentItemIndex(0);
    setAnswered(null);
    setCompleted(false);
    setScore(0);
    catProgress.setValue(0);
  };

  const animateToList = (newIndex: number) => {
    const direction = newIndex > listIndex ? -1 : 1;
    Animated.timing(slideAnim, {
      toValue: direction * screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      resetList();
      setListIndex(newIndex);
      slideAnim.setValue(-direction * screenWidth);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (answered) return;
    const correct = answer === currentItem.answer;
    setAnswered(correct ? 'correct' : 'incorrect');
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const handleNext = () => {
    const newScore = score + (answered === 'correct' ? 1 : 0);
    if (currentItemIndex === currentList.length - 1) {
      setScore(newScore);
      setCompleted(true);
      if (newScore === currentList.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      Animated.spring(catProgress, { toValue: 1, friction: 6, tension: 80, useNativeDriver: false }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentItemIndex(prev => prev + 1);
        setAnswered(null);
        slideAnim.setValue(screenWidth);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  return (
    <View style={styles.container}>

      <Confetti show={showConfetti} />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Are These Toxic?</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{currentItemIndex + 1}/{currentList.length}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {LIST_LABELS.map((label, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tabPill, listIndex === i && styles.tabPillActive]}
            onPress={() => i !== listIndex && animateToList(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabPillText, listIndex === i && styles.tabPillTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressArea}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {
            width: catProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]} />
        </View>
        <Animated.Image source={CAT} style={[styles.progressCat, { transform: [{ translateX: catX }] }]} resizeMode="contain" />
      </View>

      {completed ? (

        <View style={styles.completedArea}>
          <Image source={CAT} style={styles.completedCat} resizeMode="contain" />
          <Text style={styles.completedTitle}>{score === currentList.length ? 'Perfect!' : 'Done!'}</Text>
          <Text style={styles.completedScore}>{score} out of {currentList.length} correct</Text>
          <TouchableOpacity style={styles.retryButton} onPress={resetList} activeOpacity={0.85}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>

      ) : (

        <View style={styles.questionArea}>

          {/* Item card */}
          <Animated.View style={[styles.itemCard, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.itemQuestion}>Is this toxic to cats?</Text>
            <Text style={styles.itemName}>{currentItem.item}</Text>

            {answered && (
              <View style={[styles.resultBanner, answered === 'correct' ? styles.resultCorrect : styles.resultWrong]}>
                <Text style={styles.resultText}>
                  {answered === 'correct'
                    ? currentItem.answer === 'yes' ? '☠️ Yes, toxic!' : '✓ Correct, it\'s safe!'
                    : currentItem.answer === 'yes' ? '☠️ Actually toxic!' : '✓ Actually safe!'}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Yes / No buttons */}
          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                styles.choiceYes,
                answered === 'correct' && currentItem.answer === 'yes' && styles.choiceCorrectHighlight,
                answered === 'incorrect' && currentItem.answer !== 'yes' && styles.choiceWrongHighlight,
              ]}
              onPress={() => handleAnswer('yes')}
              disabled={answered !== null}
              activeOpacity={0.85}
            >
              <Text style={styles.choiceEmoji}>☠️</Text>
              <Text style={styles.choiceLabel}>Toxic!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                styles.choiceNo,
                answered === 'correct' && currentItem.answer === 'no' && styles.choiceCorrectHighlight,
                answered === 'incorrect' && currentItem.answer !== 'no' && styles.choiceWrongHighlight,
              ]}
              onPress={() => handleAnswer('no')}
              disabled={answered !== null}
              activeOpacity={0.85}
            >
              <Text style={styles.choiceEmoji}>✓</Text>
              <Text style={styles.choiceLabel}>Safe!</Text>
            </TouchableOpacity>
          </View>

          {answered && (
            <TouchableOpacity
              style={[styles.nextButton, answered === 'correct' ? styles.nextButtonCorrect : styles.nextButtonWrong]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>
                {currentItemIndex === currentList.length - 1 ? 'See Results' : 'Next >'}
              </Text>
            </TouchableOpacity>
          )}

        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 24,
    gap: 12,
  },

  backButton: { alignSelf: 'flex-start' },
  backText: { fontSize: 14, fontWeight: '700', color: INK_SOFT },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },
  counterBadge: {
    backgroundColor: 'rgba(44,26,14,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: { fontSize: 13, fontWeight: '700', color: INK_SOFT },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,250,245,0.4)',
    borderRadius: 50,
    padding: 3,
    gap: 3,
  },
  tabPill: { flex: 1, paddingVertical: 6, borderRadius: 50, alignItems: 'center' },
  tabPillActive: { backgroundColor: INK },
  tabPillText: { fontSize: 11, fontWeight: '600', color: INK_SOFT },
  tabPillTextActive: { color: WHITE },

  progressArea: { marginTop: 8, marginBottom: 4 },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(44,26,14,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 4 },
  progressCat: { position: 'absolute', width: 36, height: 36, top: -28 },

  questionArea: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },

  itemCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 180,
    justifyContent: 'center',
  },
  itemQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: INK_SOFT,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  itemName: {
    fontFamily: 'Georgia',
    fontSize: 32,
    fontWeight: '900',
    color: INK,
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 38,
  },

  resultBanner: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  resultCorrect: { backgroundColor: 'rgba(107,143,94,0.15)' },
  resultWrong: { backgroundColor: 'rgba(196,122,69,0.15)' },
  resultText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: '700',
    color: INK,
    textAlign: 'center',
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 6,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  choiceYes: { backgroundColor: '#E8C8B8' },
  choiceNo: { backgroundColor: '#C4DDB0' },
  choiceCorrectHighlight: {
    backgroundColor: 'rgba(107,143,94,0.3)',
    borderWidth: 2.5,
    borderColor: GREEN,
  },
  choiceWrongHighlight: { opacity: 0.4 },
  choiceEmoji: { fontSize: 28 },
  choiceLabel: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
  },

  nextButton: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonCorrect: { backgroundColor: GREEN },
  nextButtonWrong: { backgroundColor: RED },
  nextButtonText: { color: WHITE, fontSize: 16, fontWeight: '700' },

  completedArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  completedCat: { width: 120, height: 120 },
  completedTitle: {
    fontFamily: 'Georgia',
    fontSize: 42,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
  },
  completedScore: { fontSize: 16, fontWeight: '500', color: INK_SOFT },
  retryButton: {
    marginTop: 8,
    backgroundColor: INK,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  retryText: { color: WHITE, fontSize: 15, fontWeight: '600' },
});