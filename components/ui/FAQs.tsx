import React, { useState } from 'react';
import { Text, Dimensions, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function FAQs () {

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

    const showAnswer = ( index: number ) => {
        setOpenIndex(openIndex === index ? -1 : index);
    }

    const [openIndex, setOpenIndex] = useState(-1);


    return (
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
    )
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    titleText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15,
    },

    scrollContainer: {
        flex: 1,
        padding: 25,
    },

    faqContainer: {
        gap: 15,
        marginBottom: 15,
        width: screenWidth - 50,
    },

    questionContainer: {
        gap: 10,
        borderColor: 'darkblue',
        borderWidth: 2,
        padding: 10,
    },

    question: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        justifyContent: 'space-between',

    },
});