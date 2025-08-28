import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function AreYou({navigation}: {navigation: any}) {

  const thinkingOfAdopting = () => {
    navigation.navigate("Thinking of Adopting");
  }

  const newCatParents = () => {
    navigation.navigate("New Cat Parents");
  }

  const catParents = () => {
    navigation.navigate("Cat Parents");
  }

  const catLovers = () => {
    navigation.navigate("Cat Lovers");
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Are You: </Text>
      <TouchableOpacity style = {styles.paw} onPress = {thinkingOfAdopting}>
        <Text style = {styles.category}>Thinking of Adopting</Text>
        <Text>Maybe adopt cat soon ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw} onPress = {newCatParents}>
        <Text style = {styles.category}>New Cat Parents</Text>
        <Text>Just got a cat !</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw} onPress = {catParents}>
        <Text style = {styles.category}>Cat Parents</Text>
        <Text>Already a cat parent !</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw} onPress = {catLovers}>
        <Text style = {styles.category}>Cat Lovers</Text>
        <Text>Just love cats !</Text>
      </TouchableOpacity>

    </View>
  );
}

// const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 35,
    width: 300,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },

  paw: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 75,
    width: 300,
    justifyContent: 'center',
    padding: 10,
    gap: 5,
  },

  category: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});
