import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from 'react-native-tab-view';







export default function NewCatParents({navigation}: {navigation: any}) {

  const [faq, setFAQ] = useState([
    // CHANGE THE FAQs OVER HERE
    ['What do I need for the first week?', 'Start out with the basics! Litter (and litter box), wet and dry food (and food and water bowls) and some simple toys! Key here is to not over buy.'],
    ['My cat is not eating, what do I do?', "It's common for cats to hide and not eat in new surroundings. Offer wet food as they're more likely to be enticed by the smell. Leave them alone and they're more likely to eat when no one is around."],      ['How often should I be cleaning the litter box?', "At least once a day to make sure they're using the litter box and not constipated or dehydrated."],
    ["I can't find my cat!", "That happens to lots of new cat parents the first day! It helps to keep your cat contained in one room for the first week. But make sure there are covered cat beds or spaces for them to use and decompress."],
    ['My resident cat is hissing at our new cat', "There's not much to do here but give it time and take it slow. Continue to spend time with your resident cat so they don't feel threatened or sad that they may be losing you."],
    ["I can't sleep at night", "Cats are nocturnal and zoomies is the term we use when cats get their burst of energy at night! Over time, they will get used to your family's sleeping schedule and I promise, it will work itself out!"],
    ['Am I feeding enough? Too much?', 'Cats need different amounts of food at different phases. Kittens and nursing mothers need a lot more! Always check the suggested amount on the instructions listed on the dry and wet food and avoid overfeeding.'],
    ['Should I let my cat on the kitchen counter? Bed? Anywhere they want?', "Honestly, I haven't met anyone who's been successful at keeping their cat off counters or beds! If you're worried about germs, it's always a good idea to wipe down counters and avoid eating food directly from counters. As for the bed, they actually make great sleeping partners!"],
    ['How can I make my cat a lap cat?', "The key word here is 'make'. Cats are infamous for not being made to do anything and that is the truth, not a myth. Love your cats for who they are, not who you want them to be!"],
    ['Do I need to bathe my cat?', "Nope! Unless they got into a messy situation, cats are fussy about grooming themselves and keeping themselves clean. In fact, if they stop grooming, it's a sign of illness and time to watch out for what could be wrong."],
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
