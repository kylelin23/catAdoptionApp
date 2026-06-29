import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

function SkeletonBlock({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#C8A882",
          opacity,
        },
        style,
      ]}
    />
  );
}

export function FlipCardSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width={70} height={32} borderRadius={20} />

      <View style={styles.gap8}>
        <SkeletonBlock width={120} height={12} borderRadius={6} />
        <SkeletonBlock width={180} height={44} borderRadius={10} />
      </View>

      <View style={styles.cardSkeleton}>
        <SkeletonBlock width={40} height={12} borderRadius={6} />
        <View style={[styles.gap12, styles.flex1, styles.center]}>
          <SkeletonBlock width={"80%"} height={28} borderRadius={8} />
          <SkeletonBlock width={"60%"} height={28} borderRadius={8} />
        </View>
        <SkeletonBlock
          width={110}
          height={28}
          borderRadius={50}
          style={styles.selfCenter}
        />
      </View>

      <View style={styles.dotsRow}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <SkeletonBlock
            key={i}
            width={i === 0 ? 20 : 8}
            height={8}
            borderRadius={4}
          />
        ))}
      </View>

      <View style={styles.navRow}>
        <SkeletonBlock width={90} height={44} borderRadius={50} />
        <SkeletonBlock width={60} height={20} borderRadius={6} />
        <SkeletonBlock width={90} height={44} borderRadius={50} />
      </View>
    </View>
  );
}

export function FAQSkeleton() {
  return (
    <View style={styles.faqContainer}>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <View key={i} style={styles.faqRow}>
          <SkeletonBlock width={50} height={50} borderRadius={25} />
          <View style={styles.faqCard}>
            <SkeletonBlock width={"70%"} height={14} borderRadius={6} />
            <SkeletonBlock width={28} height={28} borderRadius={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function TriviaSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width={160} height={12} borderRadius={6} />

      <View style={styles.gap8}>
        <SkeletonBlock width={"100%"} height={8} borderRadius={4} />
      </View>

      <View style={styles.triviaCard}>
        <SkeletonBlock width={"90%"} height={22} borderRadius={8} />
        <SkeletonBlock width={"70%"} height={22} borderRadius={8} />

        <View style={[styles.gap12, styles.mt16]}>
          {[1, 2, 3].map((_, i) => (
            <SkeletonBlock
              key={i}
              width={"100%"}
              height={52}
              borderRadius={16}
            />
          ))}
        </View>
      </View>

      <SkeletonBlock width={"100%"} height={54} borderRadius={20} />

      <View style={styles.dotsRow}>
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonBlock
            key={i}
            width={i === 0 ? 20 : 7}
            height={7}
            borderRadius={4}
          />
        ))}
      </View>
    </View>
  );
}

export function CardPageSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.gap8}>
        <SkeletonBlock width={"100%"} height={8} borderRadius={4} />
      </View>

      <View style={styles.cardSkeleton}>
        <SkeletonBlock width={60} height={12} borderRadius={6} />
        <View style={[styles.gap12, styles.flex1, styles.center]}>
          <SkeletonBlock width={"50%"} height={12} borderRadius={6} />
          <SkeletonBlock width={"75%"} height={36} borderRadius={10} />
        </View>
        <SkeletonBlock
          width={120}
          height={28}
          borderRadius={50}
          style={styles.selfCenter}
        />
      </View>

      <View style={styles.dotsRow}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <SkeletonBlock
            key={i}
            width={i === 0 ? 20 : 7}
            height={7}
            borderRadius={4}
          />
        ))}
      </View>

      <View style={styles.navRow}>
        <SkeletonBlock width={90} height={44} borderRadius={50} />
        <SkeletonBlock width={60} height={20} borderRadius={6} />
        <SkeletonBlock width={90} height={44} borderRadius={50} />
      </View>
    </View>
  );
}

export function InfoCardsSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((_, i) => (
        <View key={i} style={styles.infoBanner}>
          <View style={styles.gap8}>
            <SkeletonBlock width={"60%"} height={20} borderRadius={8} />
            <SkeletonBlock width={"40%"} height={13} borderRadius={6} />
          </View>
          <View style={styles.infoFooter}>
            <SkeletonBlock width={24} height={24} borderRadius={12} />
            <SkeletonBlock width={34} height={34} borderRadius={17} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EAD8",
    paddingHorizontal: 22,
    paddingTop: 64,
    paddingBottom: 24,
    gap: 20,
    justifyContent: "space-between",
  },
  gap8: {
    gap: 8,
  },
  gap12: {
    gap: 12,
  },
  mt16: {
    marginTop: 16,
  },
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
  },
  selfCenter: {
    alignSelf: "center",
  },
  cardSkeleton: {
    flex: 1,
    backgroundColor: "rgba(200,165,130,0.18)",
    borderRadius: 32,
    padding: 26,
    gap: 12,
    justifyContent: "space-between",
  },
  triviaCard: {
    flex: 1,
    backgroundColor: "rgba(255,250,245,0.6)",
    borderRadius: 28,
    padding: 24,
    gap: 8,
    justifyContent: "flex-start",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqContainer: {
    flex: 1,
    backgroundColor: "#F5EAD8",
    paddingRight: 20,
    paddingTop: 20,
    gap: 14,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  faqCard: {
    flex: 1,
    backgroundColor: "rgba(255,250,245,0.6)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 8,
  },
  infoBanner: {
    backgroundColor: "rgba(200,165,130,0.18)",
    borderRadius: 28,
    padding: 24,
    gap: 12,
    minHeight: 120,
    justifyContent: "space-between",
  },
  infoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
