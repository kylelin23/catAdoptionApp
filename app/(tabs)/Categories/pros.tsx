import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet } from 'react-native';







export default function Pros() {

  const [pros, setPros] = useState([
    // CHANGE THE PROS OVER HERE
    ["Icon", "Title", ["Bullet Point 1, Bullet Point 2"]],
  ]);



  return (
    <View style = {styles.container}>

        {pros.map((pro, index) => (
            <View key={index}>
              <Text>{pro[1]}: {pro[2]}</Text>
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
