import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from 'react-native-tab-view';







export default function ThinkingOfAdopting({navigation}: {navigation: any}) {

  const [quiz, setQuiz] = useState ([
    // CHANGE QUIZ OVER HERE
    ['1. Can you comfortably afford recurring expenses like food, litter, toys, and vet care (~$50–$100/month)?', "A. Yes I've budgeted for it", 'B. I could make it work', 'C. Not really sure', 'answer'],
    ['2. What if your cat needs a $500+ emergency procedure?', 'A. I have savings or plan to get pet insurance', 'B. I might panic but will find a way', 'C. I would have to loan from my family or friends', 'answer'],
    ['3. Are you prepared for annual costs such as vaccinations, check-ups, flea meds, or pet-sitting?', "A. Yes, I'm prepared for it", "B. It's on my mind", 'C. Not really', 'answer'],
    ['4. Cats can live 15–20 years. Are you ready for that length of commitment?', "A. Yes, I'm in it for the long haul", "B. Sounds a bit daunting but I'm ready", "C. Errrr... I can't plan past 2 years", 'answer'],
    ['5. How often are you away from home (work, travel, social life)?', "A. I'm home most days", "B. I'm out but there's always someone else home", "C. I travel for my work and don't have too much backup", 'answer'],
    ['6. Cats are independent but need loving care and attention daily. Are you ready to provide love and attention?', "A. Can't wait to pour my love onto a cat and open my heart", 'B. I see myself just as a caregiver', "C. Adopting a cat isn't for me, it's for someone else in the family!", 'answer'],
    ['7. How do you feel about cleaning up messes like hairballs or the occasional accident?', "A. Doesn’t bother me", "B. I’ll manage", 'C. Ugghhsss, no thanks', 'answer'],
    ['8. Are you willing to adjust your home (e.g., furniture, closed doors, scratching posts)?', "A. Absolutely, I can't wait", 'B. Somewhat... ', "C. I'm not ready to adjust at all", 'answer'],
    ['9. What if your cat scratches your favorite couch or wakes you at 3am or you develop allergies?', 'A. Not a big deal at all', "B. I'll get over it", 'C. Cat will have to go', 'answer'],
  ])

  //scoring criteria
  //A = 3 points B = 2 points C = 1 point	
	//23–27 points – Ready to Adopt! You probably already have a name ready!	
	//17–22 points – Almost There. Go cat sit or hang out at a shelter before taking the plunge.	
	//9–16 points – Not Yet Ready. Nothing is ever a complete "no" but we want you to feel ready and be ready.
    
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
    <View style = {{alignItems: 'center'}}>
      <View style = {styles.quizTitleContainer}>
        <Text style = {styles.quizTitleText}>Are You Ready to Adopt?</Text>
      </View>

      {quiz.map((question, index) => (
        <View key = {index}>
          <Text>{question[0]}</Text>
          <Text>{question[1]}</Text>
          <Text>{question[2]}</Text>
          <Text>{question[3]}</Text>
          <Text>{question[4]}</Text>
        </View>
      ))}
    </View>
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
  },

  quizTitleContainer: {
    backgroundColor: 'white',
    width: .5 * screenWidth,
    alignItems: 'center',
    padding: 20,
    borderRadius: 5,
    marginVertical: 20,
  },

  quizTitleText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  }


});
