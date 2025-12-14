import React from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';
import cons from '../data/thinkingOfAdopting/cons';

export default function Cons() {

  const colors = [
    '#f2c068',
    '#dbab56',
    '#d49e3f'
  ]

  return (
    <ScrollView style = {styles.container}>
      <View style = {styles.containerInner}>
        {cons.map((con, index) => (
            <View key={index} style = {
              [styles.card, {backgroundColor: colors[index]}]
            }>
              <Text style = {styles.title}>{con.category}</Text>
              <Text style = {styles.bullets}>- {con.support1}</Text>
              <Text style = {styles.bullets}>- {con.support2}</Text>
              <Text style = {styles.bullets}>- {con.support3}</Text>
            </View>
        ))}
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
  },

  containerInner: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    width: .8*screenWidth,
    gap: 10,
    borderRadius: 15,
    borderWidth: 3,
  },

  title: {
    fontSize: 20,
    marginBottom: 10
  },

  bullets: {

  }
});
