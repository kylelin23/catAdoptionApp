import React, { useState, useEffect } from 'react';
import { Text, Image, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Papa from "papaparse";
import { MaterialIcons } from "@expo/vector-icons";


export default function ThinkingOfAdopting({navigation}: {navigation: any}) {


  const sections = ['Info', 'Trivia', 'FAQ'];

  const faq = useState([]);

  const [activeTab, setActiveTab] = useState("Info");
  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  // Fetch FAQs


  return (
    <View style = {styles.container}>

        <Image style = {styles.image} source={require('../../../assets/images/maggyPic.jpeg')} />

        <View style = {styles.bar}>

          {sections.map((section, index) => (
            <TouchableOpacity
            onPress = {() => {setActiveTab(section)}}
            key = {index}
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
              <View>
                <View style = {{alignItems: 'center'}}>
                  <Text>Frequently Asked Questions</Text>
                </View>
                {faq.map((question, index) => (
                  <View key = {index}>
                    <TouchableOpacity
                    onPress = {() => showAnswer(index)}
                    style = {styles.question}>
                      <Text>{question[0]}{openIndex === index ? "▲" : "▼"}</Text>
                    </TouchableOpacity>
                    {openIndex === index &&
                      <Text>{question[1]}</Text>
                    }
                  </View>
                ))}
              </View>
            }
          </ScrollView>



        </View>
        <TouchableOpacity onPress = {() => {navigation.navigate('Home')}}>
          <MaterialIcons name="home" size={75} color="white" />
        </TouchableOpacity>

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
    height: .4 * screenHeight,
    width: screenWidth * .75,
  },

  scrollContainer: {
    padding: 10,
  },

  question: {
    flexDirection: 'row',
  },

  image: {
    height: 200,
    width: screenWidth * .75,
    borderRadius: 10,
  }

});
