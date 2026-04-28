import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";

const INK = "#2C1A0E";
const SAND = "#E8C9A0";

const screenWidth = Dimensions.get("window").width;

const PROS = require("../../../assets/images/pros.png");
const CONS = require("../../../assets/images/cons.png");

export default function Info({ navigation }: { navigation: any }) {
  const prosScale = useRef(new Animated.Value(1)).current;
  const consScale = useRef(new Animated.Value(1)).current;

  const animatePress = (anim: Animated.Value, destination: string) => {
    Animated.spring(anim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
    }).start(() => {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
      navigation.navigate(destination);
    });
  };

  return (
    <View style={styles.container}>
      {/* Pros */}
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ scale: prosScale }] }]}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => animatePress(prosScale, "Pros")}
          activeOpacity={1}
        >
          <Image source={PROS} style={styles.cardImage} resizeMode="contain" />
        </TouchableOpacity>
      </Animated.View>

      {/* Cons */}
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ scale: consScale }] }]}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => animatePress(consScale, "Cons")}
          activeOpacity={1}
        >
          <Image source={CONS} style={styles.cardImage} resizeMode="contain" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    gap: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  cardWrapper: {
    width: "100%",
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },

  card: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  cardImage: {
    width: "100%",
    height: 180,
  },
});