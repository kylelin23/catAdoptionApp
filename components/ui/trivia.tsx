import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import quiz from '../../app/data/trivia'

export default function Trivia() {

  //scoring criteria
  //A = 3 points B = 2 points C = 1 point
  //23–27 points – Ready to Adopt! You probably already have a name ready!
  //17–22 points – Almost There. Go cat sit or hang out at a shelter before taking the plunge.
  //9–16 points – Not Yet Ready. Nothing is ever a complete "no" but we want you to feel ready and be ready.

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
            <Text style = {styles.quizQuestionText}>{question.question}</Text>
          </View>
          <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => aButton(qIndex)}>
            <Text style = {styles.quizAnswerText}>{question.answer1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => bButton(qIndex)}>
            <Text style = {styles.quizAnswerText}>{question.answer2}</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.quizAnswerContainer} onPress = {() => cButton(qIndex)}>
            <Text style = {styles.quizAnswerText}>{question.answer3}</Text>
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