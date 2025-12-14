import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import quiz from '../../../app/data/thinkingOfAdopting/trivia'

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

  const [result, setResult] = useState("");

  const button = (qIndex: number, points: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex] = points;
    setQuestions(newQuestions);

    let sum = 0;
    for (let q = 0; q < questions.length; q++){
      sum += questions[q];
    }
    setTotal(sum);
  }

  const submit = () => {
    for (let q = 0; q < questions.length; q++){
      if (questions[q] == 0){
        alert("Need to answer all questions first");
        return;
      }
    }
    if (total < 16){
      setResult('Not Yet Ready. Nothing is ever a complete "no" but we want you to feel ready and be ready.')
    }
    else if (total < 22){
      setResult("Almost There. Go cat sit or hang out at a shelter before taking the plunge.")
    }
    else {
      setResult("Ready to Adopt! You probably already have a name ready!")
    }


  }

  return (
    <ScrollView contentContainerStyle = {{alignItems: 'center'}}>
      <View style = {styles.quizTitleContainer}>
        <Text style = {styles.quizTitleText}>Are You Ready to Adopt? </Text>
      </View>


      {quiz.map((question, qIndex) => (
        <View style = {{width: screenWidth, alignItems: 'center', gap: 10, marginBottom: 10}} key = {qIndex}>
          <View style = {styles.quizQuestionContainer}>
            <Text style = {styles.quizQuestionText}>{question.question}</Text>
          </View>
          <TouchableOpacity style = {[styles.quizAnswerContainer, (questions[qIndex] == 3) && styles.selected]} onPress = {() => button(qIndex, 3)}>
            <Text style = {styles.quizAnswerText}>{question.answer1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {[styles.quizAnswerContainer, (questions[qIndex] == 2) && styles.selected]} onPress = {() => button(qIndex, 2)}>
            <Text style = {styles.quizAnswerText}>{question.answer2}</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {[styles.quizAnswerContainer, (questions[qIndex] == 1) && styles.selected]} onPress = {() => button(qIndex, 1)}>
            <Text style = {styles.quizAnswerText}>{question.answer3}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style = {styles.submitButton} onPress = {submit}>
        <Text style = {styles.submitButtonText}>
          Submit
        </Text>
      </TouchableOpacity>
      <View style = {styles.resultContainer}>
        <Text style = {styles.resultText}>{result}</Text>
      </View>
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
  },

  submitButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  submitButtonText: {
    color: 'black',
  },

  resultContainer: {
    width: .7 * screenWidth,
    marginTop: 30,
  },

  resultText: {
    color: 'red',
    fontSize: 20,
  },

  selected: {
    borderWidth: 3,
    borderColor: 'red',
  }
})