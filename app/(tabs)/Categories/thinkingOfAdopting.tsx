import React, { useState } from 'react';
import { Text, Image, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";




export default function ThinkingOfAdopting({navigation}: {navigation: any}) {


  const sections = ['Info', 'Trivia', 'FAQ'];

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
    ['What is the most important thing I should know before adopting?', "Nothing! We all learn as we go along. Welcome to our cat community!"],
  ]);

  const [activeTab, setActiveTab] = useState("Info");
  const [openIndex, setOpenIndex] = useState(-1);


  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  // Fetch FAQs


  return (
    <View style = {styles.container}>

        {/* <Image style = {styles.image} source={require('../../../assets/images/maggyPic.jpeg')} /> */}

        <View style = {styles.bar}>

          {sections.map((section, index) => (
            <TouchableOpacity
            onPress = {() => {setActiveTab(section)}}
            key = {index}
            >
              <Text style = {{fontSize: 20, fontWeight: 'bold'}}>{section}</Text>
            </TouchableOpacity>
          ))}

        </View>
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
            }
          </ScrollView>



        <TouchableOpacity onPress = {() => {navigation.navigate('Home')}}>
          <MaterialIcons name="home" size={75} color="white" />
        </TouchableOpacity>

    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingTop: 70,
    paddingBottom: 30,
  },

  bar: {
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    borderRadius: 20,
    width: screenWidth * .75,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
  },

  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: .4 * screenHeight,
    width: screenWidth * .75,
  },

  scrollContainer: {
    padding: 25,
  },

  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',

  },

  image: {
    height: 200,
    width: screenWidth * .75,
    borderRadius: 10,
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

});
