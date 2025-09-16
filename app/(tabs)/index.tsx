import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({navigation}: {navigation: any}) {

  const pawButton = () => {
    navigation.navigate(" ");
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Catwise</Text>
      <Text style = {styles.subText}>Your complete guide to cat adoption</Text>
      <TouchableOpacity style = {styles.paw} onPress = {pawButton}>
        <Text>Get Started</Text>
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

  subText: {
    fontSize: 20
  },

  paw: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
