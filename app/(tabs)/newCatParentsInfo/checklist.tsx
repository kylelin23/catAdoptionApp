import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function CheckList({navigation}: {navigation: any}) {

  const catList1 = () => {
    navigation.navigate("Toxic Foods, Plants and Items");
  }

  const catLanguage = () => {
    navigation.navigate("Cat Language");
  }

  const poopMonitoring = () => {
    navigation.navigate("Poop Monitoring Scores");
  }

  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Choose a Checklist: </Text>
      <TouchableOpacity style = {styles.paw} onPress = {catList1}>
        <Text style = {styles.category}>Toxic Foods, Plants and Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw} onPress = {catLanguage}>
        <Text style = {styles.category}>Cat Language</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.paw} onPress = {poopMonitoring}>
        <Text style = {styles.category}>Poop Monitoring Scores</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    borderRadius: 15,
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
