import { View, Image, StyleSheet } from "react-native";

const POOP_CHART = require('../../../../assets/images/stools.png');

export default function PoopMonitoring() {
  return (
    <View style={styles.container}>
      <Image
        source={POOP_CHART}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});