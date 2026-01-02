import React, { useState } from 'react';
import { Text, ScrollView, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import cards from '../../../data/newCatParents/catLang'

export default function CatLanguage() {

    const showHappyAnswer = ( index: number ) => {
        if (!happyIndex.includes(index)){
            setHappyIndex([...happyIndex, index]);
        }
        else{
            setHappyIndex(happyIndex.filter(i => i != index))
        }
    }

    const [happyIndex, setHappyIndex] = useState([-1]);

    const showLovingAnswer = ( index: number ) => {
        if (!lovingIndex.includes(index)){
            setLovingIndex([...lovingIndex, index]);
        }
        else{
            setLovingIndex(lovingIndex.filter(i => i != index))
        }
    }

    const [lovingIndex, setLovingIndex] = useState([-1]);

    const showExcitedAnswer = ( index: number ) => {
        if (!excitedIndex.includes(index)){
            setExcitedIndex([...excitedIndex, index]);
        }
        else{
            setExcitedIndex(excitedIndex.filter(i => i != index))
        }
    }

    const [excitedIndex, setExcitedIndex] = useState([-1]);

    const showAngryAnswer = ( index: number ) => {
        if (!angryIndex.includes(index)){
            setAngryIndex([...angryIndex, index]);
        }
        else{
            setAngryIndex(angryIndex.filter(i => i != index))
        }
    }

    const [angryIndex, setAngryIndex] = useState([-1]);



    return (
        <ScrollView style = {styles.container}>
        <View style = {styles.containerInner}>

            {cards.map((card, index) => (
                <View key={index} style = {
                [styles.card, {backgroundColor: 'white'}]
                }>
                <Text style = {styles.title}>{card.title}</Text>
                <TouchableOpacity style = {styles.titleContainer} onPress = {() => showHappyAnswer(index)}>
                    <Text style = {{fontWeight: 'bold'}}>- Happy and Relaxed</Text>
                    <Text style = {{fontWeight: 'bold'}}>{happyIndex.includes(index) ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                { happyIndex.includes(index) &&
                    <Text style = {styles.bullets}>- {card.happy}</Text>
                }
                <TouchableOpacity style = {styles.titleContainer} onPress = {() => showLovingAnswer(index)}>
                    <Text style = {{fontWeight: 'bold'}}>- Loving Cat</Text>
                    <Text style = {{fontWeight: 'bold'}}>{lovingIndex.includes(index) ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                { lovingIndex.includes(index) &&
                    <Text style = {styles.bullets}>- {card.loving}</Text>
                }
                <TouchableOpacity style = {styles.titleContainer} onPress = {() => showExcitedAnswer(index)}>
                    <Text style = {{fontWeight: 'bold'}}>- Excited and Playful</Text>
                    <Text style = {{fontWeight: 'bold'}}>{excitedIndex.includes(index) ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                { excitedIndex.includes(index) &&
                    <Text style = {styles.bullets}>- {card.excited}</Text>
                }
                <TouchableOpacity style = {styles.titleContainer} onPress = {() => showAngryAnswer(index)}>
                    <Text style = {{fontWeight: 'bold'}}>- Angry, Fearful and Anxious Cat</Text>
                    <Text style = {{fontWeight: 'bold'}}>{angryIndex.includes(index) ? "▲" : "▼"}</Text>
                </TouchableOpacity>
                { angryIndex.includes(index) &&
                    <Text style = {styles.bullets}>- {card.angry}</Text>
                }
                </View>
            ))}
        </View>
        </ScrollView>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
  },

  containerInner: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 50
  },

  card: {
    padding: 20,
    width: .8*screenWidth,
    gap: 10,
    borderRadius: 15,
    borderWidth: 3,
  },

  title: {
    fontSize: 20,
    marginBottom: 10
  },

  titleContainer: {
    flexDirection: 'row',
    gap: 5,
  },

  bullets: {

  }
});
