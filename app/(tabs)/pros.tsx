import React from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';
import pros from '../data/thinkingOfAdopting/pros'


export default function Pros() {

  const colors = [
    '#87e8a8',
    '#6fd190',
    '#7abf91',
    '#67a17a',
    '#548f68',
  ]

  return (
    <ScrollView style = {styles.container}>
      <View style = {styles.containerInner}>

        {pros.map((pro, index) => (
            <View key={index} style = {
              [styles.card, {backgroundColor: colors[index]}]
              }>
              <Text style = {styles.title}>{pro.fact}</Text>
              <Text style = {styles.bullets}>- {pro.support1}</Text>
              <Text style = {styles.bullets}>- {pro.support2}</Text>
              <Text style = {styles.bullets}>- {pro.support3}</Text>
              {pro.support4 != "" && <Text style = {styles.bullets}>- {pro.support4}</Text>}
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
    paddingBottom: 50
  },

  card: {
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
