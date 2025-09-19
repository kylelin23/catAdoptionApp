import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet } from 'react-native';







export default function Pros() {

  const [pros, setPros] = useState([
    // CHANGE THE PROS OVER HERE
    ['Add a pro here'],
    ['Here is another pro'],
  ]);



  return (
    <View style = {styles.container}>

        {pros.map((pro, index) => (
            <Text key={index}>{pro}</Text>
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
