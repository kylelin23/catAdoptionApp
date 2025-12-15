import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import quiz, { answers } from '../../../app/data/newCatParents/trivia';

export default function Trivia() {

  const [result, setResult] = useState("");

  const [questionNumber, setQuestionNumber] = useState(1);

  const [selected, setSelected] = useState('');

  const [nextShown, setNextShown] = useState(false);

  const [contentShown, setContentShown] = useState(true);

  const button = (letter: string) => {
    setSelected(letter);
  }

  const checkAnswer = () => {
    if (answers[questionNumber - 1] == selected){
      setResult('Correct! ');
      setNextShown(true);
    }
    else {
      setResult("Not Quite! ");
      setNextShown(false);
    }
  }

  const next = () => {
    if(questionNumber == 10){
      setContentShown(false);
    }
    else{
      setQuestionNumber(questionNumber + 1);
    }
    setSelected('');
    setResult('');
    setNextShown(false);
  }

  const restart = () => {
    setContentShown(true);
    setQuestionNumber(1);
  }

  return (

    <ScrollView contentContainerStyle = {{alignItems: 'center'}}>
      { contentShown &&
        <View style = {{alignItems: 'center'}}>
          <View style = {styles.quizTitleContainer}>
            <Text style = {styles.quizTitleText}>Test Your Cat Knowledge! </Text>
          </View>

          <View style = {{width: screenWidth, alignItems: 'center', gap: 10, marginBottom: 10}}>
            <View style = {styles.quizQuestionContainer}>
              <Text style = {styles.quizQuestionText}>{quiz[questionNumber - 1].question}</Text>
            </View>
            <TouchableOpacity style = {[styles.quizAnswerContainer, selected == 'a' && styles.selected]} onPress = {() => button('a')}>
              <Text style = {styles.quizAnswerText}>{quiz[questionNumber - 1].answer1}</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.quizAnswerContainer, selected == 'b' && styles.selected]} onPress = {() => button('b')}>
              <Text style = {styles.quizAnswerText}>{quiz[questionNumber - 1].answer2}</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.quizAnswerContainer, selected == 'c' && styles.selected]} onPress = {() => button('c')}>
              <Text style = {styles.quizAnswerText}>{quiz[questionNumber - 1].answer3}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style = {styles.submitButton} onPress = {checkAnswer}>
            <Text style = {styles.submitButtonText}>
              Check Answer
            </Text>
          </TouchableOpacity>
          <View style = {styles.resultContainer}>
            <Text style = {styles.resultText}>{result}</Text>
          </View>
          { nextShown &&
            <TouchableOpacity style = {styles.submitButton} onPress = {next}>
              <Text style = {styles.submitButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          }
        </View>
      }
      { !contentShown &&
        <View style = {{height: Dimensions.get('window').height - 250, alignItems: 'center', justifyContent: 'center'}}>
          <Text style = {styles.quizTitleText}>Congrats on finishing the test! </Text>
          <TouchableOpacity style = {styles.submitButton} onPress = {restart}>
            <Text style = {styles.submitButtonText}>
              Restart
            </Text>
          </TouchableOpacity>
        </View>
      }
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