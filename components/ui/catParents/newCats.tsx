import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  Image,
  SafeAreaView,
} from "react-native";
import { mixpanel } from "../../../lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";

const PAW = require("../../../assets/images/paw.png");

const STEPS = [
  {
    key: "separate",
    number: "01",
    title: "Separate Spaces",
    tagline: "Keep them apart at first",
    accent: "#7A9BBE",
    dark: "#5C7A9A",
    bullets: [
      "Keep the cats in separate spaces.",
      "Set up the new cat in a quiet room with a litter box, food, water, a hiding spot, and a scratching post.",
      "Keep the door closed.",
      "Do not allow face-to-face contact for the first 3–5 days.",
    ],
  },
  {
    key: "scent",
    number: "02",
    title: "Exchange Scents",
    tagline: "Cats recognize by scent before sight",
    accent: "#D4956A",
    dark: "#A86E45",
    bullets: [
      "Exchange bedding or blankets between cats.",
      "Feed cats on opposite sides of the closed door.",
      "Provide treats so cats associate each other's scents with positive outcomes.",
    ],
  },
  {
    key: "supervised",
    number: "03",
    title: "Supervised Meetings",
    tagline: "Short and sweet visits",
    accent: "#7BAE6E",
    dark: "#5A8F50",
    bullets: [
      "Cats are ready when they show curious sniffing at the door baseline.",
      "After several days, crack open the door slightly.",
      "Let the cats meet briefly under close watch.",
      "Continue to provide treats and keep sessions deliberately short.",
    ],
  },
  {
    key: "slow",
    number: "04",
    title: "Slow and Gradual",
    tagline: "Patience is key",
    accent: "#C47A45",
    dark: "#9E5C2E",
    bullets: [
      "Maintain the same gradual structure over days or weeks.",
      "Keep your daily routines entirely consistent.",
      "Do not force interactive spaces if either cat pulls away.",
      "Remember: Hissing is safe communication and is totally common!",
    ],
  },
];

function StepItem({
  step,
  isOpen,
  onPress,
}: {
  step: (typeof STEPS)[0];
  isOpen: boolean;
  onPress: () => void;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const contentHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentHeightAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const contentOpacity = contentHeightAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  const maxHeight = contentHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  return (
    <View style={styles.itemWrapper}>
      <View
        style={[
          styles.card,
          {
            borderColor: "rgba(44,26,14,0.06)",
            borderBottomColor: "rgba(44,26,14,0.12)",
          },
          isOpen && { borderLeftColor: step.accent },
        ]}
      >
        <TouchableOpacity
          style={styles.headerRow}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View
            style={[
              styles.numberBadge,
              { backgroundColor: step.accent, borderBottomColor: step.dark },
            ]}
          >
            <Text style={styles.numberText}>{step.number}</Text>
          </View>

          <View style={styles.titleArea}>
            <Text style={styles.eyebrow}>STEP {step.number}</Text>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardTagline}>{step.tagline}</Text>
          </View>

          <Animated.Image
            source={PAW}
            style={[
              styles.pawChevron,
              { tintColor: INK_SOFT, transform: [{ rotate }] },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Animated.View
          style={{ maxHeight, opacity: contentOpacity, overflow: "hidden" }}
        >
          <View style={styles.bulletsArea}>
            <View style={styles.divider} />
            {step.bullets.map((bullet, i) => (
              <View key={i} style={styles.bulletRow}>
                <Image
                  source={PAW}
                  style={[styles.bulletPaw, { tintColor: step.accent }]}
                  resizeMode="contain"
                />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export default function NewCats() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    if (isOpening) {
      mixpanel.track("New Cats Step Opened", {
        "Screen Name": "New Cats",
        "Step Title": STEPS[index].title,
        "Step Number": STEPS[index].number,
      });
    }
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageSubtitle}>
            Follow these steps and tap each card to safely introduce new feline
            friends.
          </Text>

          {STEPS.map((step, index) => (
            <StepItem
              key={step.key}
              step={step}
              isOpen={openIndex === index}
              onPress={() => toggle(index)}
            />
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    gap: 16,
  },
  pageSubtitle: {
    fontFamily: "Avenir",
    fontSize: 15,
    color: INK_SOFT,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  itemWrapper: {
    position: "relative",
    marginVertical: 2,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 2,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderLeftWidth: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  numberText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "900",
    color: WHITE,
  },
  titleArea: {
    flex: 1,
    gap: 1,
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.35)",
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.3,
  },
  cardTagline: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "500",
    color: INK_SOFT,
    lineHeight: 16,
    marginTop: 2,
  },
  pawChevron: {
    width: 22,
    height: 22,
    flexShrink: 0,
  },
  bulletsArea: {
    gap: 12,
    marginTop: 16,
    paddingBottom: 4,
  },
  divider: {
    height: 1.5,
    backgroundColor: "rgba(44,26,14,0.06)",
    borderRadius: 1,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bulletPaw: {
    width: 14,
    height: 14,
    marginTop: 3,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "500",
    color: INK,
    lineHeight: 21,
  },
});
