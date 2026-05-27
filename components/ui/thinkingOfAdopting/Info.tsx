import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";

const { height: H } = Dimensions.get("window");

const PROS = require("../../../assets/images/pros.png");
const CONS = require("../../../assets/images/cons.png");

const CARDS = [
  { key: 'pros', destination: 'Pros', image: PROS },
  { key: 'cons', destination: 'Cons', image: CONS },
];

export default function Info({ navigation }: { navigation: any }) {
  const scales      = useRef(CARDS.map(() => new Animated.Value(1))).current;
  const translateYs = useRef(CARDS.map(() => new Animated.Value(60))).current;
  const opacities   = useRef(CARDS.map(() => new Animated.Value(0))).current;
  const bobs        = useRef(CARDS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    CARDS.forEach((_, i) => {
      Animated.sequence([
        Animated.delay(i * 160),
        Animated.parallel([
          Animated.spring(translateYs[i], { toValue: 0, friction: 6, tension: 70, useNativeDriver: true }),
          Animated.timing(opacities[i],   { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]).start(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bobs[i], { toValue: -8, duration: 1200, useNativeDriver: true }),
            Animated.timing(bobs[i], { toValue: 0,  duration: 1200, useNativeDriver: true }),
          ])
        ).start();
      });
    });
  }, []);

  const handlePress = (index: number, destination: string) => {
    navigation.navigate(destination);

    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 0.92,
        useNativeDriver: true,
        friction: 4,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {CARDS.map((card, i) => (
        <Animated.View
          key={card.key}
          style={[
            styles.itemWrapper,
            {
              opacity:   opacities[i],
              transform: [{ translateY: translateYs[i] }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress(i, card.destination)}
            activeOpacity={1}
            style={styles.touchable}
          >
            <Animated.Image
              source={card.image}
              style={[
                styles.image,
                {
                  transform: [
                    { scale: scales[i] },
                    { translateY: bobs[i] },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  itemWrapper: {
    width: '100%',
    alignItems: 'center',
  },

  touchable: {
    width: '100%',
    alignItems: 'center',
  },

  image: {
    width: '75%',
    height: H * 0.20,  // was 0.28
  },
});