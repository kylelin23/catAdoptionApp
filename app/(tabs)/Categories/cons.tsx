import React, { useState } from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet } from 'react-native';







export default function Cons() {

  const [cons, setCons] = useState([
    // CHANGE THE CONS OVER HERE
    ["Icon", "Title", ["Bullet Point 1, Bullet Point 2"]],
  ]);



  return (
    <ScrollView style = {styles.container}>
      <View style = {styles.containerInner}>

        {cons.map((con, index) => (
            <View key={index} style = {styles.card}>
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