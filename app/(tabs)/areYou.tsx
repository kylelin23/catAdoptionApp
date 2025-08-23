import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

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
      <TouchableOpacity style = {styles.paw1} onPress = {thinkingOfAdopting}>
        <Text style = {{textAlign: 'center'}}>Thinking of Adopting</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw2} onPress = {newCatParents}>
        <Text style = {{textAlign: 'center'}}>New Cat Parents</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw3} onPress = {catParents}>
        <Text style = {{textAlign: 'center'}}>Cat Parents</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw4} onPress = {catLovers}>
        <Text style = {{textAlign: 'center'}}>Cat Lovers</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 50,
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },

  paw1: {
    backgroundColor: 'rgb(95, 180, 150)',
    borderRadius: 100,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  paw2: {
    backgroundColor: 'rgb(109, 186, 135)',
    borderRadius: 100,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  paw3: {
    backgroundColor: 'rgb(197, 208, 147)',
    borderRadius: 100,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  paw4: {
    backgroundColor: 'rgb(178, 178, 81)',
    borderRadius: 100,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
