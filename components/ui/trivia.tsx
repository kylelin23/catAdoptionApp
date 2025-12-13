import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function Trivia() {

    const [quiz, setQuiz] = useState ([
        // CHANGE QUIZ OVER HERE
        ['1. Can you comfortably afford recurring expenses like food, litter, toys, and vet care (~$50 to $100/month)?', "A. Yes I've budgeted for it", 'B. I could make it work', 'C. Not really sure'],
        ['2. What if your cat needs a $500+ emergency procedure?', 'A. I have savings or plan to get pet insurance', 'B. I might panic but will find a way', 'C. I would have to loan from my family or friends'],
        ['3. Are you prepared for annual costs such as vaccinations, check-ups, flea meds, or pet-sitting?', "A. Yes, I'm prepared for it", "B. It's on my mind", 'C. Not really'],
        ['4. Cats can live 15 to 20 years. Are you ready for that length of commitment?', "A. Yes, I'm in it for the long haul", "B. Sounds a bit daunting but I'm ready", "C. Errrr... I can't plan past 2 years"],
        ['5. How often are you away from home (work, travel, social life)?', "A. I'm home most days", "B. I'm out but there's always someone else home", "C. I travel for my work and don't have too much backup"],
        ['6. Cats are independent but need loving care and attention daily. Are you ready to provide love and attention?', "A. Can't wait to pour my love onto a cat and open my heart", 'B. I see myself just as a caregiver', "C. Adopting a cat isn't for me, it's for someone else in the family!"],
        ['7. How do you feel about cleaning up messes like hairballs or the occasional accident?', "A. Doesn’t bother me", "B. I’ll manage", 'C. Ugghhsss, no thanks'],
        ['8. Are you willing to adjust your home (e.g., furniture, closed doors, scratching posts)?', "A. Absolutely, I can't wait", 'B. Somewhat... ', "C. I'm not ready to adjust at all"],
        ['9. What if your cat scratches your favorite couch or wakes you at 3am or you develop allergies?', 'A. Not a big deal at all', "B. I'll get over it", 'C. Cat will have to go'],
    ])

    const [questions, setQuestions] = useState(
        Array(9).fill(0)
    )

    const [total, setTotal] = useState(0);

    const aButton = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = 3;
        setQuestions(newQuestions);

        let sum = 0;
        for (let q = 0; q < questions.length; q++){
          sum += questions[q];
        }
        setTotal(sum);
    }

    const bButton = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = 2;
        setQuestions(newQuestions);

        let sum = 0;
        for (let q = 0; q < questions.length; q++){
          sum += questions[q];
        }
        setTotal(sum);
    }

    const cButton = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = 1;
        setQuestions(newQuestions);

        let sum = 0;
        for (let q = 0; q < questions.length; q++){
          sum += questions[q];
        }
        setTotal(sum);
    }

    return (
        <ScrollView contentContainerStyle = {{alignItems: 'center'}}>
            <View style = {styles.quizTitleContainer}>
                <Text style = {styles.quizTitleText}>Are You Ready to Adopt?{questions} Total: {total}</Text>
            </View>

            {quiz.map((question, qIndex) => (
                <View style = {{width: screenWidth, alignItems: 'center', gap: 10, marginBottom: 10}} key = {qIndex}>
                    <Text>{qIndex + 1}</Text>
                    <View style = {styles.quizQuestionContainer}>
                        <Text style = {styles.quizQuestionText}>{question[0]}</Text>
                    </View>
                    <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => aButton(qIndex)}>
                        <Text style = {styles.quizAnswerText}>{question[1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => bButton(qIndex)}>
                        <Text style = {styles.quizAnswerText}>{question[2]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => cButton(qIndex)}>
                        <Text style = {styles.quizAnswerText}>{question[3]}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    )
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    quizTitleContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  quizTitleText: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },

  quizQuestionContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 5,
  },

  quizAnswerContainer: {
    padding: 5,
    width: screenWidth * .8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },

  quizAnswerText: {
    fontSize: 15,
  },

  quizQuestionText: {
    fontSize: 15,
    fontWeight: 'bold',
  }
})