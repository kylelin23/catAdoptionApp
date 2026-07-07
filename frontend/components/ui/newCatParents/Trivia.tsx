import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  ScrollView,
} from "react-native";
import quiz, { answers } from "../../../app/data/newCatParents/trivia";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";
const RED = "#C47A45";
const RED_DARK = "#9E5C2E";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CAT = require("../../../assets/images/walkingCat.png");

const CONFETTI_COLORS = [
  "#D4956A",
  "#E8C9A0",
  "#7BAE6E",
  "#C8D8E8",
  "#E8C8B8",
  "#2C1A0E",
  "#FFFAF5",
];

const ALL_CORRECT_QUESTION_INDEX = 5;

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

export default function Trivia() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const catProgress = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const progress = currentQ / quiz.length;
  const isAllCorrectQuestion = currentQ === ALL_CORRECT_QUESTION_INDEX;

  useEffect(() => {
    Animated.spring(catProgress, {
      toValue: progress,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [currentQ]);

  const animateSlide = (callback: () => void) => {
    if (isAnimating.current) return;

    isAnimating.current = true;

    Animated.timing(slideAnim, {
      toValue: -screenWidth,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      callback();
      slideAnim.setValue(screenWidth);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        isAnimating.current = false;
      });
    });
  };

  const handleSelect = (key: string) => {
    if (checked) return;
    setSelected((prev) => (prev === key ? "" : key));
  };

  const handleCheck = () => {
    if (!selected || checked) return;

    const correct = isAllCorrectQuestion || answers[currentQ] === selected;

    setIsCorrect(correct);
    setChecked(true);
    mixpanel.track("Trivia Question Answered", {
      "Question Number": currentQ + 1,
      "Correct?": correct,
    });

    if (correct) {
      setScore((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNext = () => {
    if (currentQ >= quiz.length - 1) {
      mixpanel.track("Trivia Completed", {
        "Final Score": score + "/10",
        "Total Questions": quiz.length,
      });
      setFinished(true);
      return;
    }

    animateSlide(() => {
      setCurrentQ((p) => p + 1);
      setSelected("");
      setChecked(false);
      setIsCorrect(false);
    });
  };

  const reset = () => {
    setCurrentQ(0);
    setSelected("");
    setChecked(false);
    setIsCorrect(false);
    setFinished(false);
    setScore(0);
    catProgress.setValue(0);
    isAnimating.current = false;
  };

  const CAT_SIZE = 36;
  const TRACK_WIDTH = screenWidth - 44;

  const catX = catProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - CAT_SIZE],
    extrapolate: "clamp",
  });

  if (finished) {
    return (
      <SafeAreaView style={styles.resultScreen}>
        <ScrollView
          contentContainerStyle={styles.resultScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow} maxFontSizeMultiplier={1.3}>
              YOU DID IT!
            </Text>
            <Text style={styles.resultText}>
              {"Con\u00ADgrats on fin\u00ADish\u00ADing the quiz!"}
            </Text>
            <Text style={styles.scoreText} maxFontSizeMultiplier={1.4}>
              {score} / {quiz.length} {"cor\u00ADrect"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.tryAgainBtn}
            onPress={reset}
            activeOpacity={0.85}
          >
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ_ = quiz[currentQ];
  if (!currentQ_) return null;

  const ANSWERS = [
    { key: "a", label: currentQ_.answer1 },
    { key: "b", label: currentQ_.answer2 },
    { key: "c", label: currentQ_.answer3 },
  ].filter((answer) => answer.label);

  const isLast = currentQ === quiz.length - 1;

  const getAnswerStyle = (key: string) => {
    if (!checked)
      return [styles.answerBtn, selected === key && styles.answerBtnSelected];
    if (isAllCorrectQuestion || key === answers[currentQ])
      return [styles.answerBtn, styles.answerBtnCorrect];
    if (key === selected && !isCorrect)
      return [styles.answerBtn, styles.answerBtnWrong];
    return [styles.answerBtn];
  };

  const getAnswerTextStyle = (key: string) => {
    if (!checked)
      return [styles.answerText, selected === key && styles.answerTextSelected];
    if (isAllCorrectQuestion || key === answers[currentQ])
      return [styles.answerText, { color: GREEN, fontWeight: "800" as const }];
    if (key === selected && !isCorrect)
      return [styles.answerText, { color: RED, fontWeight: "800" as const }];
    return [styles.answerText];
  };

  const isSelected = selected !== "";

  const getBottomButtonProps = () => {
    if (!checked) {
      return {
        text: "Check An\u00ADswer",
        onPress: handleCheck,
        disabled: !isSelected,
        style: [styles.nextBtn, !isSelected && styles.nextBtnDisabled],
      };
    }

    return {
      text: isLast ? "Fin\u00ADish Quiz" : "Next Ques\u00ADtion",
      onPress: handleNext,
      disabled: false,
      style: [
        styles.nextBtn,
        isCorrect ? styles.nextBtnCorrect : styles.nextBtnWrong,
      ],
    };
  };

  const buttonProps = getBottomButtonProps();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Confetti show={showConfetti} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.progressArea}>
            <Animated.Image
              source={CAT}
              style={[
                styles.progressCat,
                { transform: [{ translateX: catX }] },
              ]}
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

          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.questionText}>{currentQ_.question}</Text>
          </Animated.View>
        </View>

        <View style={styles.centeredBody}>
          <Animated.View
            style={[
              styles.answersArea,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {ANSWERS.map((answer) => {
              const isCorrectAnswer =
                isAllCorrectQuestion || answer.key === answers[currentQ];

              const isWrongSelected =
                !isAllCorrectQuestion &&
                checked &&
                selected === answer.key &&
                answer.key !== answers[currentQ];

              return (
                <TouchableOpacity
                  key={answer.key}
                  style={[getAnswerStyle(answer.key), styles.answerRow]}
                  onPress={() => handleSelect(answer.key)}
                  activeOpacity={0.85}
                  disabled={checked}
                >
                  <Text
                    style={[...getAnswerTextStyle(answer.key), { flex: 1 }]}
                  >
                    {answer.label}
                  </Text>

                  {checked && isCorrectAnswer && (
                    <Text style={styles.correctMark}>✓</Text>
                  )}

                  {isWrongSelected && <Text style={styles.wrongMark}>✕</Text>}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        {checked && (
          <View style={styles.resultBannerContainer}>
            <View
              style={[
                styles.resultBanner,
                isCorrect
                  ? styles.resultBannerCorrect
                  : styles.resultBannerWrong,
              ]}
            >
              <Text
                style={[
                  styles.resultBannerText,
                  {
                    color: isCorrect ? GREEN : RED,
                    flex: 1,
                    textAlign: "center",
                  },
                ]}
              >
                {isCorrect ? "Cor\u00ADrect!" : "Not quite!"}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={buttonProps.style}
          onPress={buttonProps.onPress}
          disabled={buttonProps.disabled}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>{buttonProps.text}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    justifyContent: "center",
    paddingBottom: 20,
  },
  progressArea: {
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
    top: -30,
  },
  questionText: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
    lineHeight: 26,
    marginTop: 10,
  },
  answersArea: {
    paddingHorizontal: 22,
    gap: 10,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  answerBtn: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 15,
    borderWidth: 2.5,
    borderColor: "rgba(44,26,14,0.1)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(44,26,14,0.15)",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  answerBtnSelected: {
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
    backgroundColor: "rgba(123,174,110,0.1)",
  },
  answerBtnCorrect: {
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
    backgroundColor: "rgba(123,174,110,0.12)",
  },
  answerBtnWrong: {
    borderColor: RED,
    borderBottomColor: RED_DARK,
    backgroundColor: "rgba(196,122,69,0.12)",
  },
  answerText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "600",
    color: INK_SOFT,
    lineHeight: 20,
  },
  answerTextSelected: {
    color: INK,
    fontWeight: "800",
  },
  correctMark: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 18,
    marginLeft: 10,
  },
  wrongMark: {
    color: RED,
    fontWeight: "900",
    fontSize: 18,
    marginLeft: 10,
  },
  resultBannerContainer: {
    justifyContent: "center",
    marginBottom: 12,
  },
  resultBanner: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  resultBannerCorrect: {
    backgroundColor: "rgba(123,174,110,0.1)",
    borderColor: GREEN,
    borderBottomColor: GREEN_DARK,
  },
  resultBannerWrong: {
    backgroundColor: "rgba(196,122,69,0.1)",
    borderColor: RED,
    borderBottomColor: RED_DARK,
  },
  resultBannerText: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  bottomSection: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
  },
  nextBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  nextBtnDisabled: {
    backgroundColor: "#D1E4CB",
    borderBottomColor: "#A3C29B",
    shadowOpacity: 0,
    elevation: 0,
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
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  resultScreen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  resultScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
    gap: 24,
  },
  resultCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    width: "80%",
    alignItems: "center",
    gap: 12,
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
  scoreText: {
    fontFamily: "Avenir",
    fontSize: 28,
    fontWeight: "900",
    color: GREEN,
    letterSpacing: -0.5,
  },
  resultEyebrow: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  resultText: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 26,
    color: INK,
  },
  tryAgainBtn: {
    width: "50%",
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: GREEN,
    borderRadius: 16,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: GREEN_DARK,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tryAgainText: {
    fontFamily: "Avenir",
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
