import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ThinkingOfAdopting() {

  const sections = ['Info', 'Trivia', 'FAQ'];

  const [activeTab, setActiveTab] = useState("Info");

  return (
    <View style = {styles.container}>

        <View style = {styles.bar}>

          {sections.map((section) => (
            <TouchableOpacity
            onPress = {() => {setActiveTab(section)}}
            >
              <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{section}</Text>
            </TouchableOpacity>
          ))}

        </View>
        <View style = {styles.content}>
          <ScrollView
            style = {styles.scrollContainer}
            showsVerticalScrollIndicator={true}
          >
            {activeTab == 'Info' &&
              <Text>Info</Text>
            }

            {activeTab == 'Trivia' &&
              <Text>Trivia</Text>
            }

            {activeTab == 'FAQ' &&
              <Text>FAQ</Text>
            }
          </ScrollView>



        </View>

    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 50,
    textAlign: 'center'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },

  bar: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 20,
    width: screenWidth * .75,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 30,
  },

  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: .6 * screenHeight,
    width: screenWidth * .75,
  },

  scrollContainer: {
    padding: 10,
  }

});
