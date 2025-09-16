import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from 'react-native-tab-view';







export default function CatParents({navigation}: {navigation: any}) {

  const [faq, setFAQ] = useState([
    // CHANGE THE FAQs OVER HERE
    ['question', 'answer'],
  ]);

  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  const Info = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Info</Text>
    </ScrollView>
  );


  const Trivia = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <TouchableOpacity style = {styles.square}
        onPress = {() => {navigation.navigate("Trivia")}}
      >
      </TouchableOpacity>
    </ScrollView>
  );

  const FAQs = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <View>
        <View style = {{alignItems: 'center'}}>
          <Text style = {styles.titleText}>Frequently Asked Questions</Text>
        </View>
        <View style = {styles.faqContainer}>
          {faq.map((question, index) => (
            <View style = {styles.questionContainer} key = {index}>
              <TouchableOpacity
                onPress = {() => showAnswer(index)}
                style = {styles.question}>
                  <Text style = {{fontSize: 20, width: screenWidth * .7,}}>{question[0]}</Text>
                  <Text style = {{fontSize: 20}}>{openIndex === index ? "▲" : "▼"}</Text>
              </TouchableOpacity>
              {openIndex === index &&
                <Text style = {{fontSize: 20, color: 'blue'}}>{question[1]}</Text>
              }
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
      { key: 'info', title: 'Info' },
      { key: 'trivia', title: 'Trivia' },
      { key: 'faqs', title: 'FAQs' }
    ]);

    const renderScene = ({ route }: {route: any}) => {
      switch (route.key) {
        case 'info':
          return <Info />;
        case 'trivia':
          return <Trivia />;
        case 'faqs':
          return <FAQs />
        default:
          return null;
      }
    };



  return (
    <View style = {styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: screenWidth}}
          renderTabBar={(props) => (
            <View style = {{alignItems: 'center'}}>
              <TabBar
                {...props}
                style={{
                  borderRadius: 10,
                  backgroundColor: 'lightblue',
                  width: screenWidth * .8,
                }}
                indicatorStyle={{ backgroundColor: 'transparent' }}
                activeColor = 'black'
                inactiveColor='gray'
              />
            </View>
          )}
        />
        {/* <View style = {{alignItems: 'center'}}>
          <TouchableOpacity onPress = {() => {navigation.navigate('Home')}}>
            <MaterialIcons name="home" size={75} color="white" />
          </TouchableOpacity>
        </View> */}

    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    paddingTop: 70,
    paddingBottom: 30,
  },

  scrollContainer: {
    flex: 1,
    padding: 25,
  },

  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',

  },

  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
  },

  questionContainer: {
    gap: 10,
    borderColor: 'darkblue',
    borderWidth: 2,
    padding: 10,
  },

  faqContainer: {
    gap: 15,
    marginBottom: 15,
    width: screenWidth - 50,
  },

  square: {
    height: 50,
    width: 50,
    backgroundColor: 'red'
  }

});
