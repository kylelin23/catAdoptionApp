import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet } from 'react-native';







export default function Cons() {

  const [cons, setCons] = useState([
    // CHANGE THE CONS OVER HERE
    ['Add a con here'],
  ]);



  return (
    <View style = {styles.container}>

        {cons.map((con, index) => (
            <Text key={index}>{con}</Text>
        ))}

    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    justifyContent: 'center',
    alignItems: 'center',
  },



});
