import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({navigation}: {navigation: any}) {

  const pawButton = () => {
    navigation.navigate("Are You");
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Catwise</Text>
      <Text style = {styles.subText}>Your complete guide to cat adoption</Text>
      <TouchableOpacity style = {styles.paw} onPress = {pawButton}>
        <Text>Enter</Text>
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
    backgroundColor: 'gray',
    borderRadius: 100,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
