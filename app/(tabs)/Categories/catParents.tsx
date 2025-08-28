import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function CatParents() {


  return (
    <View style = {styles.container}>
      <Text style = {styles.titleText}>Cat Parents</Text>
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
});
