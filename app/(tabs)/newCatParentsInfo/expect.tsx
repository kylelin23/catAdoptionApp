import React from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';
import expectCards from '../../data/newCatParents/expect'

export default function Expect() {

    return (
      <ScrollView style = {styles.container}>
        <View style = {styles.containerInner}>

            {expectCards.map((card, index) => (
                <View key={index} style = {
                [styles.card, {backgroundColor: 'white'}]
                }>
                <Text style = {styles.title}>{card.category}</Text>
                <Text style = {styles.bullets}>- {card.bullet1}</Text>
                <Text style = {styles.bullets}>- {card.bullet2}</Text>
                <Text style = {styles.bullets}>- {card.bullet3}</Text>
                <Text style = {styles.bullets}>- {card.bullet4}</Text>
                {card.bullet5 != "" && <Text style = {styles.bullets}>- {card.bullet5}</Text>}
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
