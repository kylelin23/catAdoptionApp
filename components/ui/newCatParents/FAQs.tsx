import React, { useState } from 'react';
import { Text, Dimensions, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import faqs from '../../../app/data/newCatParents/faqs'

export default function FAQs () {

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
                    {faqs.map((question, index) => (
                        <View style = {styles.questionContainer} key = {index}>
                        <TouchableOpacity
                            onPress = {() => showAnswer(index)}
                            style = {styles.question}>
                            <Text style = {{fontSize: 20, width: screenWidth * .7,}}>{question.question}</Text>
                            <Text style = {{fontSize: 20}}>{openIndex === index ? "▲" : "▼"}</Text>
                        </TouchableOpacity>
                        {openIndex === index &&
                            <Text style = {{fontSize: 20, color: 'blue'}}>{question.answer}</Text>
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