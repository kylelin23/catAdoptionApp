import React, { useState } from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';







export default function Cons() {

  const [cons, setCons] = useState([
    // CHANGE THE CONS OVER HERE
    ["Icon", "Cost", ["As with all pets, vet visits are the bulk of the expenses", "Ongoing costs include food, litter, toys and vaccinations", "Pet insurance is optional but will help during unexpected visits"]],
    ["Icon", "Commitment", ["Cats are family and can live for 15-20 years", "Cats will fall sick and need at-home care with medication", "While independent, cats also need playtime and bonding time"]],
    ["Icon", "Change", ["Be prepared to adapt your lifestyle to include your cat", "Find a reliable pet sitter while travelling", "Cats will shed, throw up hairballs and scratch furniture", "Cats at all stages need love and care"]],
  ]);

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
              <Text style = {styles.title}>{con[1]}</Text>
              {(con[2] as string[]).map((bullet, index) => (
                <Text key = {index} style = {styles.bullets}>{bullet}</Text>
              ))}
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
