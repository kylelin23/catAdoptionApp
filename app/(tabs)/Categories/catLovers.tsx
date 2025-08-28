import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function CatLovers({navigation}: {navigation: any}) {

  const FAQs = () => {
    navigation.navigate("Cat Lovers: FAQs")
  }

  const trivia = () => {
    navigation.navigate("Cat Lovers: Trivia")
  }

  const whatToExpect = () => {
    navigation.navigate("Cat Lovers: What to Expect")
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Cat Lovers</Text>

        <TouchableOpacity style = {styles.paw1} onPress = {FAQs}>
          <Text style = {{textAlign: 'center'}}>FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.paw2} onPress = {trivia}>
          <Text style = {{textAlign: 'center'}}>Trivia</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.paw3} onPress = {whatToExpect}>
          <Text style = {{textAlign: 'center'}}>What To Expect</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 50,
    textAlign: 'center'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
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
});
