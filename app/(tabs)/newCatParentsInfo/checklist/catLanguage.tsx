import React from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';
import cards from '../../../data/newCatParents/catLang'

export default function CatLanguage() {

    return (
        <ScrollView style = {styles.container}>
        <View style = {styles.containerInner}>

            {cards.map((card, index) => (
                <View key={index} style = {
                [styles.card, {backgroundColor: 'white'}]
                }>
                <Text style = {styles.title}>{card.title}</Text>
                <Text style = {styles.bullets}>- {card.happy}</Text>
                <Text style = {styles.bullets}>- {card.loving}</Text>
                <Text style = {styles.bullets}>- {card.excited}</Text>
                <Text style = {styles.bullets}>- {card.angry}</Text>
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
