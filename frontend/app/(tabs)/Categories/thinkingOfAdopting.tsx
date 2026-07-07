import React, { useRef, useEffect } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
} from "react-native";
import { TabView } from "react-native-tab-view";
import Info from "../../../components/ui/thinkingOfAdopting/Info";
import FAQs from "../../../components/ui/thinkingOfAdopting/FAQs";
import Trivia from "../../../components/ui/thinkingOfAdopting/trivia";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

const screenWidth = Dimensions.get("window").width;
const { height: H } = Dimensions.get("window");

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const SAND = "#E8C9A0";
const WHITE = "#FFFAF5";
const GREEN = "#7BAE6E";

const CAT_IMG = require("../../../assets/images/catWave.png");

export default function ThinkingOfAdopting({
  navigation,
}: {
  navigation: any;
}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "info", title: "Info" },
    { key: "trivia", title: "Checklist" },
    { key: "faqs", title: "FAQs" },
  ]);
  const [triviaKey, setTriviaKey] = React.useState(0);

  const headerY = useRef(new Animated.Value(-20)).current;
  const headerOp = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerY, {
          toValue: 0,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(headerOp, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(bubbleScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  useEffect(() => {
    if (index === 0) {
      mixpanel.track("Screen Opened", {
        "Screen Name": "Thinking of Adopting Info",
      });
    }
  }, [index]);

  useEffect(() => {
    if (index === 1) {
      mixpanel.track("Screen Opened", {
        "Screen Name": "Thinking of Adopting Checklist",
      });
    }
  }, [index]);

  useEffect(() => {
    if (index === 2) {
      mixpanel.track("Screen Opened", {
        "Screen Name": "Thinking of Adopting FAQs",
      });
    }
  }, [index]);

  React.useEffect(() => {
    if (index !== 1) setTriviaKey((prev) => prev + 1);
  }, [index]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "info":
        return <Info navigation={navigation} />;
      case "trivia":
        return <Trivia key={triviaKey} />;
      case "faqs":
        return <FAQs />;
      default:
        return null;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBarWrapper}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text
          style={styles.backText}
          allowFontScaling={false}
        >
          {"<"}
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.mascotArea,
          { opacity: headerOp, transform: [{ translateY: headerY }] },
        ]}
      >
        <Image source={CAT_IMG} style={styles.catImg} resizeMode="contain" />

        <Animated.View
          style={[
            styles.bubbleWrapper,
            { transform: [{ scale: bubbleScale }] },
          ]}
        >
          <View style={styles.bubbleRow}>
            <View style={styles.tail} />
            <View style={styles.bubble}>
              <Text
                style={styles.bubbleText}
                maxFontSizeMultiplier={1.3}
              >
                Thinking of Adopting?
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <View style={styles.tabPillContainer}>
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabPill, index === i && styles.tabPillActive]}
            onPress={() => setIndex(i)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabPillText,
                index === i && styles.tabPillTextActive,
              ]}
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
        style={{ backgroundColor: "transparent" }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  bgTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.4,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.55,
    backgroundColor: "white",
  },
  tabBarWrapper: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 4,
    marginLeft: 8,
  },
  backText: {
    fontSize: 18,
    fontWeight: "700",
    color: INK,
    lineHeight: 22,
  },
  mascotArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  catImg: {
    width: 120,
    height: 120,
    flexShrink: 0,
    marginRight: -24,
  },
  bubbleWrapper: {
    flex: 1,
    marginRight: 8,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: WHITE,
  },
  bubble: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleText: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(44,26,14,0.12)",
  },
  progressDotActive: {
    backgroundColor: INK,
    width: 22,
  },
  progressDotDone: {
    backgroundColor: GREEN,
  },
  tabPillContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(44,26,14,0.06)",
    borderRadius: 50,
    padding: 4,
    gap: 4,
    marginHorizontal: 8,
  },
  tabPill: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillActive: {
    backgroundColor: INK,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tabPillText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "600",
    color: INK_SOFT,
  },
  tabPillTextActive: {
    color: WHITE,
    fontWeight: "800",
  },
});