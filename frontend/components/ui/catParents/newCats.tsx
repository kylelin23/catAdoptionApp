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
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";

const PAW = require("../../../assets/images/paw.png");

const STEPS = [
  {
    key: "separate",
    number: "01",
    title: "Sep\u00ADar\u00ADate Spaces",
    tagline: "Keep them apart at first",
    accent: "#7A9BBE",
    dark: "#5C7A9A",
    bullets: [
      "Keep the cats in sep\u00ADar\u00ADate spaces.",
      "Set up the new cat in a qui\u00ADet room with a lit\u00ADter box, food, wa\u00ADter, a hid\u00ADing spot, and a scratch\u00ADing post.",
      "Keep the door closed.",
      "Do not al\u00ADlow face-to-face con\u00ADtact for the first 3–5 days.",
    ],
  },
  {
    key: "scent",
    number: "02",
    title: "Ex\u00ADchange Scents",
    tagline: "Cats re\u00ADcog\u00ADnize by scent be\u00ADfore sight",
    accent: "#D4956A",
    dark: "#A86E45",
    bullets: [
      "Ex\u00ADchange bed\u00ADding or blankets between cats.",
      "Feed cats on op\u00ADpos\u00ADite sides of the closed door.",
      "Pro\u00ADvide treats so cats as\u00ADso\u00ADci\u00ADate each oth\u00ADer's scents with pos\u00ADit\u00ADive out\u00ADcomes.",
    ],
  },
  {
    key: "supervised",
    number: "03",
    title: "Su\u00ADper\u00ADvised Meet\u00ADings",
    tagline: "Short and sweet vis\u00ADits",
    accent: "#7BAE6E",
    dark: "#5A8F50",
    bullets: [
      "Cats are ready when they show cur\u00ADi\u00ADous sniff\u00ADing at the door base\u00ADline.",
      "After sev\u00ADer\u00ADal days, crack open the door slightly.",
      "Let the cats meet briefly un\u00ADder close watch.",
      "Con\u00ADtin\u00ADue to pro\u00ADvide treats and keep ses\u00ADsions de\u00ADlib\u00ADer\u00ADately short.",
    ],
  },
  {
    key: "slow",
    number: "04",
    title: "Slow and Grad\u00ADu\u00ADal",
    tagline: "Pa\u00ADtience is key",
    accent: "#C47A45",
    dark: "#9E5C2E",
    bullets: [
      "Main\u00ADtain the same grad\u00ADu\u00ADal struc\u00ADture over days or weeks.",
      "Keep your daily rou\u00ADtines en\u00ADtirely con\u00ADsist\u00ADent.",
      "Do not force in\u00ADter\u00ADact\u00ADive spaces if either cat pulls away.",
      "Re\u00ADmem\u00ADber: Hiss\u00ADing is safe com\u00ADmu\u00ADnic\u00ADa\u00ADtion and is to\u00ADtally com\u00ADmon!",
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

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

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
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <View
            style={[
              styles.numberBadge,
              { backgroundColor: step.accent, borderBottomColor: step.dark },
            ]}
          >
            <Text style={styles.numberText} allowFontScaling={false}>
              {step.number}
            </Text>
          </View>

          <View style={styles.titleArea}>
            <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
              {"STEP "}
              {step.number}
            </Text>
            <Text
              style={styles.cardTitle}
              maxFontSizeMultiplier={1.4}
              numberOfLines={2}
            >
              {step.title}
            </Text>
            <Text
              style={styles.cardTagline}
              maxFontSizeMultiplier={1.3}
              numberOfLines={2}
            >
              {step.tagline}
            </Text>
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

        {isOpen && (
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
        )}
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
