import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from 'react-native-tab-view';







export default function ThinkingOfAdopting({navigation}: {navigation: any}) {

  const [faq, setFAQ] = useState([
    // CHANGE THE FAQs OVER HERE
    ['Should I adopt one or more cats? Will one cat be lonely?', "It all depends! Many households start out with one cat and add a second cat later while some find out that their cat may prefer to be the only cat."],
    ['How do I choose between a kitten, adult cat or senior cat?', "Each phase of a cat's life brings a different kind of joy, from the playful mischief of a kitten to the calm, affectionate companionship of a senior. What are you looking for?"],
    ['The cats are all so cute but I want to wait for a cat to choose me.', 'This is another common debate and there is no wrong way to choosing your cat. Some cats may naturally be more affectionate and other cats love from a distance.'],
    ['How do I prepare my home for a new cat?', "A cat's basic needs are food, water, and litter box. And of course, pets and love! When you are ready to adopt, head over to our New Cat Parents' section to find out more."],
    ["What do I do when I need to go away?", 'Cats can be alone for one or two days with food and water but any longer than that, there should be a cat sitter checking in your cat at least once a day.'],
    ['Can a cat be around babies and little kids?', "Yes! But just as you won't leave a young child alone, interactions between little kids and cats should be supervised. It's a great opportunity to teach them how to handle cats gently and lovingly."],
    ['Will they scratch up my furniture?', 'Cats scratch for a reason! They do it to sharpen their claws, mark their territory or perhaps out of boredom. Provide scratching posts and gently deter them from scratching. Declawing is inhumane and should not be done.'],
    ['Does the cat stay indoor and/or outdoor?', 'Indoor please! Being indoor protects them from cars, other predatory animals, and diseases.'],
    ['How much does it cost?', 'Providing cat food, water and litter are a necessity. On average, expect to pay a minimum of $30-50 each month.'],
    ["What if my current pet can't get along with the new cat?", "Expect time for the transition. But if you're worried about whether the cats will get along, introducing kittens are generally an easier transition."],
    ['What is the most important thing I should know before adopting?', "Cats are not toys and they become part of your family when you adopt them. Please do not abandon them. You are their entire lives."],
  ]);

  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  const Info = () => (
    <View style = {{alignItems: 'center', gap: 50, justifyContent: 'center', flex: 1}}>
      <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("Pros")}>
        <Text style = {styles.proConText}>Pros</Text>
        <Text>Key benefits</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("Cons")}>
        <Text style = {styles.proConText}>Cons</Text>
        <Text>Things to Consider</Text>
      </TouchableOpacity>
    </View>
  );


  const Trivia = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >

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
    paddingTop: 30,
    paddingBottom: 50,
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
    height: 200,
    width: 200,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    gap: 5
  },

  proConText: {
    fontWeight: 'bold',
    fontSize: 25
  }


});
