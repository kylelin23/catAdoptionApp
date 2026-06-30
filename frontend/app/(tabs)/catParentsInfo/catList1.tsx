import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  SafeAreaView,
} from "react-native";
import food, {
  plants,
  householdItems,
  others,
} from "../../data/catParents/catList1";
import { useState, useRef, useEffect } from "react";
import { mixpanel } from "../../../frontend/lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";
const RED = "#C47A45";
const RED_DARK = "#9E5C2E";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const LISTS = [food, plants, householdItems, others];
const LIST_LABELS = ["Foods", "Plants", "Household", "Others"];
const CONFETTI_COLORS = [
  "#D4956A",
  "#E8C9A0",
  "#7BAE6E",
  "#C8D8E8",
  "#E8C8B8",
  "#2C1A0E",
  "#FFFAF5",
];

const CAT = require("../../../assets/images/walkingCat.png");

function ConfettiPiece({ color, delay }: { color: string; delay: number }) {
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
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
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
  const TRACK_WIDTH = screenWidth - 44;
  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: "clamp",
  });

  useEffect(() => {
    mixpanel.track("Screen Opened", {
      "Screen Name": "Toxic Game",
    });
  }, []);

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

  const handleAnswer = (answer: "yes" | "no") => {
    if (answered) return;
    const correct = answer === currentItem.answer;

    mixpanel.track("Toxic Game Question Answered", {
      List: LIST_LABELS[listIndex],
      Item: currentItem.item,
      "Correct?": correct,
    });

    setAnswered(correct ? "correct" : "incorrect");
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  };

  const handleNext = () => {
    const point = answered === "correct" ? 1 : 0;
    const newScore = score + point;

    setScore(newScore);

    if (currentItemIndex === currentList.length - 1) {
      setCompleted(true);

      if (newScore === currentList.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      Animated.spring(catProgress, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentItemIndex((prev) => prev + 1);
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
    <SafeAreaView style={styles.safeArea}>
      <Confetti show={showConfetti} />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>CAT PARENTS</Text>
            <Text style={styles.pageTitle}>Are These Toxic?</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {LIST_LABELS.map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tabPill, listIndex === i && styles.tabPillActive]}
              onPress={() => i !== listIndex && animateToList(i)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabPillText,
                  listIndex === i && styles.tabPillTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressArea}>
          <Animated.Image
            source={CAT}
            style={[styles.progressCat, { transform: [{ translateX: catX }] }]}
            resizeMode="contain"
          />
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: catProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
          </View>
        </View>

        {completed ? (
          <View style={styles.completedArea}>
            <Image
              source={CAT}
              style={styles.completedCat}
              resizeMode="contain"
            />
            <View style={styles.completedCard}>
              <Text style={styles.completedEyebrow}>RESULT</Text>
              <Text style={styles.completedTitle}>
                {score === currentList.length ? "Perfect!" : "Done!"}
              </Text>
              <Text style={styles.completedScore}>
                {score} / {currentList.length} correct
              </Text>
            </View>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={resetList}
              activeOpacity={0.85}
            >
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.questionArea}>
            <Animated.View
              style={[
                styles.itemCard,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Text style={styles.itemQuestion}>Is this toxic to cats?</Text>
              <Text style={styles.itemName}>{currentItem.item}</Text>
            </Animated.View>

            <View style={styles.resultBannerContainer}>
              {answered && (
                <View
                  style={[
                    styles.resultBanner,
                    answered === "correct"
                      ? styles.resultCorrect
                      : styles.resultWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      { color: answered === "correct" ? GREEN : RED },
                    ]}
                  >
                    {answered === "correct"
                      ? currentItem.answer === "yes"
                        ? "Yes, toxic!"
                        : "Correct, safe!"
                      : currentItem.answer === "yes"
                        ? "Actually toxic!"
                        : "Actually safe!"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.choiceRow}>
              <TouchableOpacity
                style={[
                  styles.choiceBtn,
                  styles.choiceToxic,
                  answered &&
                    currentItem.answer === "yes" &&
                    styles.choiceBtnCorrect,
                  answered &&
                    answered === "incorrect" &&
                    currentItem.answer !== "yes" &&
                    styles.choiceBtnWrong,
                ]}
                onPress={() => handleAnswer("yes")}
                disabled={answered !== null}
                activeOpacity={0.85}
              >
                <Text style={styles.choiceLabel}>Toxic!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceBtn,
                  styles.choiceSafe,
                  answered &&
                    currentItem.answer === "no" &&
                    styles.choiceBtnCorrect,
                  answered &&
                    answered === "incorrect" &&
                    currentItem.answer !== "no" &&
                    styles.choiceBtnWrong,
                ]}
                onPress={() => handleAnswer("no")}
                disabled={answered !== null}
                activeOpacity={0.85}
              >
                <Text style={styles.choiceLabel}>Safe!</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nextBtnContainer}>
              {answered && (
                <TouchableOpacity
                  style={[
                    styles.nextBtn,
                    answered === "correct"
                      ? styles.nextBtnCorrect
                      : styles.nextBtnWrong,
                  ]}
                  onPress={handleNext}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextBtnText}>
                    {currentItemIndex === currentList.length - 1
                      ? "SEE RESULTS"
                      : "NEXT"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
  },
  header: { gap: 8 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: INK,
    lineHeight: 22,
  },
  headerCenter: { gap: 2 },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: "Avenir",
    fontSize: 26,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(44,26,14,0.06)",
    borderRadius: 50,
    padding: 4,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 50,
    alignItems: "center",
  },
  tabPillActive: {
    backgroundColor: INK,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  tabPillText: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "600",
    color: INK_SOFT,
  },
  tabPillTextActive: {
    color: WHITE,
    fontWeight: "800",
  },
  progressArea: {
    marginTop: 16,
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(44,26,14,0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 5,
  },
  progressCat: {
    position: "absolute",
    width: 36,
    height: 36,
    top: -20,
  },
  questionArea: {
    flex: 1,
    gap: 14,
    justifyContent: "center",
  },
  itemCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 5,
    borderBottomColor: "rgba(44,26,14,0.1)",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 160,
    justifyContent: "center",
  },
  itemQuestion: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "700",
    color: INK_SOFT,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  itemName: {
    fontFamily: "Avenir",
    fontSize: 34,
    fontWeight: "900",
    color: INK,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  resultBannerContainer: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  resultBanner: {
    width: "70%",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  resultCorrect: {
    backgroundColor: "rgba(123,174,110,0.1)",
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
  },
  resultWrong: {
    backgroundColor: "rgba(196,122,69,0.1)",
    borderColor: RED,
    borderBottomColor: RED_DARK,
  },
  resultText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 12,
  },
  choiceBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderBottomWidth: 5,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  choiceToxic: {
    backgroundColor: "#F2C9A0",
    borderColor: "#D4956A",
    borderBottomColor: "#A86E45",
  },
  choiceSafe: {
    backgroundColor: "#C4DDB0",
    borderColor: "#7BAE6E",
    borderBottomColor: GREEN_DARK,
  },
  choiceBtnCorrect: {
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
    backgroundColor: "rgba(123,174,110,0.2)",
  },
  choiceBtnWrong: {
    opacity: 0.4,
  },
  choiceLabel: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
  },
  nextBtnContainer: {
    height: 62,
    justifyContent: "center",
  },
  nextBtn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 4,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnCorrect: {
    backgroundColor: GREEN,
    borderBottomColor: GREEN_DARK,
  },
  nextBtnWrong: {
    backgroundColor: RED,
    borderBottomColor: RED_DARK,
  },
  nextBtnText: {
    fontFamily: "Avenir",
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  completedArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  completedCat: { width: 130, height: 130 },
  completedCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    width: "80%",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(44,26,14,0.1)",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  completedEyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  completedTitle: {
    fontFamily: "Avenir",
    fontSize: 32,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  completedScore: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "400",
    color: INK_SOFT,
  },
  retryBtn: {
    width: "60%",
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryBtnText: {
    fontFamily: "Avenir",
    color: WHITE,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
