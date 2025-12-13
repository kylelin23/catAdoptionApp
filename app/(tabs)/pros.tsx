import React, { useState } from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';







export default function Pros() {

  const [pros, setPros] = useState([
    // CHANGE THE PROS OVER HERE
    ["Icon", "Cats provide emotional support", ["Purring decreases hormone related to stress", "Stroking a cat slows down breathing", "Cats are great companions", "Provides routine and sense of responsibility"]],
    ["Icon", "Cats are independent", ["They don't need to be taken out for walks!", "Cats can entertain themselves", "Cats sleep quite a bit"]],
    ["Icon", "Doesn't require too much space", ["Great for apartments", "Windows are a must though", "Can provide a catio outdoors", "Cats are already litter trained"]],
    ["Icon", "Cats are family", ["Creates strong bonds with humans", "Develop a deep sense of attachment and affection", "Cat antics are stress relieving!"]],
    ["Icon", "It will change you", ["Having a cat will change you", "They will tug at your heartstrings", "They will remind you that what's truly important is being present in the present"]],
  ]);

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
              <Text style = {styles.title}>{pro[1]}</Text>
              {(pro[2] as string[]).map((bullet, index) => (
                <Text key = {index} style = {styles.bullets}>- {bullet}</Text>
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
