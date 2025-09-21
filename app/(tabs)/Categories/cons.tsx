import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet } from 'react-native';







export default function Cons() {

  const [cons, setCons] = useState([
    // CHANGE THE CONS OVER HERE
    ["Icon", "Title", ["Bullet Point 1, Bullet Point 2"]],
  ]);



  return (
    <View style = {styles.container}>

      {cons.map((con, index) => (
            <View key={index}>
              <Text>{con[1]}: {con[2]}</Text>
            </View>
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
