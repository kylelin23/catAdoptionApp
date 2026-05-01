import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView, Image } from "react-native";
import food, { plants, householdItems, others } from '../../../data/catParents/catList1';
import { useState, useRef, useEffect } from "react";

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WARM = '#D4956A';
const WHITE = '#FFFAF5';
const GREEN = '#6B8F5E';
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
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [fakeAnswer, setFakeAnswer] = useState('');
  const [realAnswer, setRealAnswer] = useState('');
  const [invisibleAnswer, setInvisibleAnswer] = useState([-1]);
  const [invisibleItem, setInvisibleItem] = useState([-1]);
  const [showConfetti, setShowConfetti] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;
  const currentList = LISTS[listIndex];

  const matchedCount = invisibleItem.filter(i => i !== -1).length;
  const totalCount = currentList.length;
  const progress = totalCount > 0 ? matchedCount / totalCount : 0;

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 32;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
  });

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: progress,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [matchedCount]);

  const resetSelections = () => {
    setSelectedItemIndex(-1);
    setSelectedAnswerIndex(-1);
    setInvisibleItem([-1]);
    setInvisibleAnswer([-1]);
    setRealAnswer('');
    setFakeAnswer('');
    catProgress.setValue(0);
  };

  const checkAllMatched = (newInvisibleItem: number[]) => {
    const matched = newInvisibleItem.filter(i => i !== -1).length;
    if (matched === currentList.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const animateToList = (newIndex: number) => {
    const direction = newIndex > listIndex ? -1 : 1;
    Animated.timing(slideAnim, {
      toValue: direction * screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      resetSelections();
      setListIndex(newIndex);
      slideAnim.setValue(-direction * screenWidth);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const itemPress = (itemIdx: number, answer: string) => {
    setSelectedItemIndex(itemIdx);
    if (answer === fakeAnswer && answer !== '') {
      const newInvisibleItem = [...invisibleItem, itemIdx];
      const newInvisibleAnswer = [...invisibleAnswer, selectedAnswerIndex];
      setInvisibleItem(newInvisibleItem);
      setInvisibleAnswer(newInvisibleAnswer);
      setSelectedItemIndex(-1);
      setSelectedAnswerIndex(-1);
      setRealAnswer('');
      setFakeAnswer('');
      checkAllMatched(newInvisibleItem);
    } else {
      setRealAnswer(answer);
    }
  };

  const answerPress = (ansIdx: number, fake: string) => {
    setSelectedAnswerIndex(ansIdx);
    if (realAnswer === fake && fake !== '') {
      const newInvisibleItem = [...invisibleItem, selectedItemIndex];
      const newInvisibleAnswer = [...invisibleAnswer, ansIdx];
      setInvisibleItem(newInvisibleItem);
      setInvisibleAnswer(newInvisibleAnswer);
      setSelectedItemIndex(-1);
      setSelectedAnswerIndex(-1);
      setRealAnswer('');
      setFakeAnswer('');
      checkAllMatched(newInvisibleItem);
    } else {
      setFakeAnswer(fake);
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
      <Text style={styles.headerTitle}>Are These Toxic?</Text>

      {/* Category tabs */}
      <View style={styles.tabRow}>
        {LIST_LABELS.map((label, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tabPill, listIndex === i && styles.tabPillActive]}
            onPress={() => i !== listIndex && animateToList(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabPillText, listIndex === i && styles.tabPillTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress bar with walking cat */}
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
        <Text style={styles.progressLabel}>{matchedCount} of {totalCount} matched</Text>
      </View>

      {/* Column headers */}
      <View style={styles.columnHeaders}>
        <Text style={styles.columnHeader}>Item</Text>
        <Text style={styles.columnHeader}>Toxic?</Text>
      </View>

      {/* Matching pairs */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Animated.View style={[{ gap: 8 }, { transform: [{ translateX: slideAnim }] }]}>
          {currentList.map((item, index) => {
            const itemHidden = invisibleItem.includes(index);
            const answerHidden = invisibleAnswer.includes(index);

            return (
              <View key={index} style={styles.pairRow}>
                <TouchableOpacity
                  onPress={() => !itemHidden && itemPress(index, item.answer)}
                  style={[styles.matchCard, styles.itemCard, selectedItemIndex === index && styles.matchCardSelected, itemHidden && styles.matchCardMatched]}
                  disabled={itemHidden}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.matchCardText, selectedItemIndex === index && styles.matchCardTextSelected, itemHidden && styles.matchCardTextHidden]}>
                    {item.item}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => !answerHidden && answerPress(index, item.fakeAnswer)}
                  style={[styles.matchCard, styles.answerCard, selectedAnswerIndex === index && styles.matchCardSelected, answerHidden && styles.matchCardMatched]}
                  disabled={answerHidden}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.matchCardText, selectedAnswerIndex === index && styles.matchCardTextSelected, answerHidden && styles.matchCardTextHidden]}>
                    {item.fakeAnswer}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Nav buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, listIndex === 0 && styles.navButtonDisabled]}
          onPress={() => listIndex > 0 && animateToList(listIndex - 1)}
          disabled={listIndex === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonText}>{"< Prev"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonNext, listIndex === LISTS.length - 1 && styles.navButtonDisabled]}
          onPress={() => listIndex < LISTS.length - 1 && animateToList(listIndex + 1)}
          disabled={listIndex === LISTS.length - 1}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, { color: WHITE }]}>{"Next >"}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 16,
    paddingTop: 90,
    paddingBottom: 16,
    gap: 10,
  },

  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK_SOFT,
  },

  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.5,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,250,245,0.4)',
    borderRadius: 50,
    padding: 3,
    gap: 3,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 50,
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: INK,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: INK_SOFT,
  },
  tabPillTextActive: {
    color: WHITE,
  },

  // Progress bar with cat
  progressArea: {
    marginTop: 16,
    marginBottom: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(44,26,14,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
    borderRadius: 4,
  },
  progressCat: {
    position: 'absolute',
    width: 36,
    height: 36,
    top: -28,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: INK_SOFT,
    marginTop: 4,
  },

  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  columnHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  pairRow: {
    flexDirection: 'row',
    gap: 10,
  },

  matchCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 46,
  },
  itemCard: {
    backgroundColor: WHITE,
    borderColor: 'rgba(44,26,14,0.12)',
  },
  answerCard: {
    backgroundColor: 'rgba(232,201,160,0.3)',
    borderColor: 'rgba(44,26,14,0.12)',
  },
  matchCardSelected: {
    borderColor: WARM,
    backgroundColor: 'rgba(212,149,106,0.15)',
  },
  matchCardMatched: {
    backgroundColor: 'rgba(107,143,94,0.12)',
    borderColor: 'rgba(107,143,94,0.3)',
  },
  matchCardText: {
    fontSize: 12,
    fontWeight: '500',
    color: INK,
    textAlign: 'center',
    lineHeight: 16,
  },
  matchCardTextSelected: {
    fontWeight: '700',
  },
  matchCardTextHidden: {
    color: 'transparent',
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(44,26,14,0.08)',
  },
  navButtonNext: {
    backgroundColor: INK,
    flex: 1,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: INK,
  },
});