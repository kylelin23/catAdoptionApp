import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mixpanel } from "../../../frontend/lib/mixpanel";

const { width: W, height: H } = Dimensions.get("window");

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const SAND = "#E8C9A0";
const WHITE = "#FFFAF5";

const PAW = require("../../assets/images/paw.png");

const CAT_IMAGES = [
  require("../../assets/images/cat.png"),
  require("../../assets/images/catStretch.png"),
];

const CATEGORIES = [
  {
    key: "thinking",
    route: "Thinking of Adopting",
    title: "Think\u00ADing of Adopt\u00ADing",
    subtitle: "Consid\u00ADering get\u00ADting a cat",
    color: "#C4DDB0",
    border: "#7BAE6E",
    dark: "#5A8F50",
  },
  {
    key: "new",
    route: "New Cat Parents",
    title: "New Cat Par\u00ADents",
    subtitle: "Just brought a cat home",
    color: "#C8D8E8",
    border: "#7A9BBE",
    dark: "#5C7A9A",
  },
  {
    key: "parents",
    route: "Cat Parents",
    title: "Cat Par\u00ADents",
    subtitle: "Al\u00ADready a cat par\u00ADent",
    color: "#F2C9A0",
    border: "#D4956A",
    dark: "#A86E45",
  },
  {
    key: "lovers",
    route: "Cat Lovers",
    title: "Cat Lov\u00ADers",
    subtitle: "Just ob\u00ADsessed with cats!",
    color: "#F9D5D5",
    border: "#E29A9A",
    dark: "#B56B6B",
  },
];

function CategoryCard({
  cat,
  index,
  onPress,
}: {
  cat: (typeof CATEGORIES)[0];
  index: number;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(pressAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
    }).start();
  const onPressOut = () =>
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity,
          transform: [{ scale: Animated.multiply(scale, pressAnim) }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cat.color,
            borderColor: cat.border,
            borderBottomColor: cat.dark,
          },
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View
          style={[
            styles.cardSwatch,
            { backgroundColor: cat.border, borderBottomColor: cat.dark },
          ]}
        >
          <Image source={PAW} style={styles.cardPaw} resizeMode="contain" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{cat.title}</Text>
          <Text style={styles.cardSub}>{cat.subtitle}</Text>
        </View>
        <View
          style={[
            styles.chevron,
            { backgroundColor: cat.border, borderBottomColor: cat.dark },
          ]}
        >
          <Text style={styles.chevronText} allowFontScaling={false}>
            ›
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AreYou({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const headerY = useRef(new Animated.Value(-20)).current;
  const headerOp = useRef(new Animated.Value(0)).current;
  const catScale = useRef(new Animated.Value(0)).current;
  const catOpacity = useRef(new Animated.Value(0)).current;
  const catBounce = useRef(new Animated.Value(0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;
  const imgOpacity = useRef(new Animated.Value(1)).current;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollContainerHeight, setScrollContainerHeight] = useState(1);
  const [scrollContentHeight, setScrollContentHeight] = useState(1);

  const handleListScroll = (e: any) => {
    scrollY.setValue(e.nativeEvent.contentOffset.y);
  };

  const needsScrollbar = scrollContentHeight > scrollContainerHeight + 1;
  const thumbHeight = needsScrollbar
    ? Math.max(
        24,
        (scrollContainerHeight / scrollContentHeight) * scrollContainerHeight,
      )
    : scrollContainerHeight;
  const thumbTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(scrollContentHeight - scrollContainerHeight, 1)],
    outputRange: [0, Math.max(scrollContainerHeight - thumbHeight, 0)],
    extrapolate: "clamp",
  });

  useEffect(() => {
    mixpanel.track("Screen Opened", {
      "Screen Name": "Are You",
    });
  }, []);

  useEffect(() => {
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
      Animated.spring(catScale, {
        toValue: 1,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
      Animated.timing(catOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(catBounce, {
            toValue: -6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(catBounce, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(circlePulse, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(circlePulse, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      intervalRef.current = setInterval(() => {
        Animated.timing(imgOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex((prev) => (prev + 1) % CAT_IMAGES.length);
          Animated.timing(imgOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start();
        });
      }, 2400);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.sandSection, { paddingTop: insets.top }]}>
        <View style={styles.topSpacer} />

        <Animated.View
          style={[
            styles.headerArea,
            { opacity: headerOp, transform: [{ translateY: headerY }] },
          ]}
        >
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.4}>
            CATWISE
          </Text>
          <Text style={styles.pageTitle} maxFontSizeMultiplier={1.6}>
            Who are you?
          </Text>
        </Animated.View>

        <View style={styles.mascotArea}>
          <Animated.View
            style={[styles.shadowRing, { transform: [{ scale: circlePulse }] }]}
          />
          <Animated.View
            style={[
              styles.catWrapper,
              {
                opacity: catOpacity,
                transform: [{ scale: catScale }, { translateY: catBounce }],
              },
            ]}
          >
            <View style={styles.catCircle}>
              <Animated.Image
                source={CAT_IMAGES[currentIndex]}
                style={[styles.catImage, { opacity: imgOpacity }]}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </View>
      </View>

      <View style={styles.whiteSection}>
        <View
          style={styles.scrollWrapper}
          onLayout={(e) =>
            setScrollContainerHeight(e.nativeEvent.layout.height)
          }
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 16 },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            onContentSizeChange={(_, h) => setScrollContentHeight(h)}
            onScroll={handleListScroll}
          >
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.key}
                cat={cat}
                index={i}
                onPress={() => navigation.navigate(cat.route)}
              />
            ))}
          </ScrollView>

          <View style={styles.scrollTrack}>
            <Animated.View
              style={[
                styles.scrollThumb,
                {
                  height: thumbHeight,
                  transform: [{ translateY: thumbTranslateY }],
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: "hidden",
  },
  sandSection: {
    flex: 0.75,
    backgroundColor: SAND,
  },
  topSpacer: {
    height: 14,
    marginTop: 10,
  },
  headerArea: {
    alignItems: "center",
    marginTop: 6,
    gap: 2,
    paddingHorizontal: 16,
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: "Avenir",
    fontSize: 29,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  mascotArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(44,26,14,0.06)",
  },
  catWrapper: {
    width: 136,
    height: 136,
    borderRadius: 68,
    shadowColor: "#A0622A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  catCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,250,245,0.8)",
    backgroundColor: "rgba(255,250,245,0.3)",
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
  whiteSection: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 15,
    flexGrow: 1,
    justifyContent: "center",
  },
  scrollTrack: {
    width: 4,
    marginRight: 4,
    marginVertical: 8,
    borderRadius: 2,
    backgroundColor: "rgba(44,26,14,0.08)",
    overflow: "hidden",
  },
  scrollThumb: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#7BAE6E",
  },
  cardWrapper: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    minHeight: 74,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 16,
    borderWidth: 2.5,
    borderBottomWidth: 4,
  },
  cardSwatch: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  cardPaw: {
    width: 20,
    height: 20,
    tintColor: WHITE,
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
  },
  chevron: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  chevronText: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 24,
    color: WHITE,
  },
});
