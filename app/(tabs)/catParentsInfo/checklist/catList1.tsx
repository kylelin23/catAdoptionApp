import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import food, { plants, householdItems, others } from '../../../data/catParents/catList1'
import { useState } from "react";

export default function CatList1 () {

    const [currentList, setCurrentList] = useState(food);
    const [nextButton, setNextButton] = useState(true);
    const [backButton, setBackButton] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
    const [fakeAnswer, setFakeAnswer] = useState('');
    const [realAnswer, setRealAnswer] = useState('');
    const [invisibleAnswer, setInvisibleAnswer] = useState([-1]);
    const [invisibleItem, setInvisibleItem] = useState([-1]);

    const nextButtonPress = () => {
        setSelectedItemIndex(-1);
        setSelectedAnswerIndex(-1);
        setInvisibleItem([-1]);
        setInvisibleAnswer([-1]);
        if(currentList == food){
            setCurrentList(plants);
            setBackButton(true);
        }
        if(currentList == plants){
            setCurrentList(householdItems);
        }
        if(currentList == householdItems){
            setCurrentList(others);
            setNextButton(false);
        }
    }

    const backButtonPress = () => {
        setSelectedItemIndex(-1);
        setSelectedAnswerIndex(-1);
        setInvisibleItem([-1]);
        setInvisibleAnswer([-1]);
        if(currentList == plants){
            setCurrentList(food);
            setBackButton(false);
        }
        if(currentList == householdItems){
            setCurrentList(plants);
        }
        if(currentList == others){
            setCurrentList(householdItems);
            setNextButton(true);
        }
    }

    const itemPress = (itemIdx: number, answer: string) => {
        setSelectedItemIndex(itemIdx);

        if (answer === fakeAnswer && answer !== '') {
            setInvisibleItem(prev => [...prev, itemIdx]);
            setInvisibleAnswer(prev => [...prev, selectedAnswerIndex]);
            setSelectedItemIndex(-1);
            setSelectedAnswerIndex(-1);
            setRealAnswer('');
            setFakeAnswer('');
        } else {
            setRealAnswer(answer);
        }
    };

    const answerPress = (ansIdx: number, fake: string) => {
        setSelectedAnswerIndex(ansIdx);

        if (realAnswer === fake && fake !== '') {
            setInvisibleItem(prev => [...prev, selectedItemIndex]);
            setInvisibleAnswer(prev => [...prev, ansIdx]);
            setSelectedItemIndex(-1);
            setSelectedAnswerIndex(-1);
            setRealAnswer('');
            setFakeAnswer('');
        } else {
            setFakeAnswer(fake);
        }
    };


    return (
        <View style = {styles.container}>
            <Text style = {styles.titleText}>Are These Items Toxic to Cats? </Text>
            {currentList.map((item, index) => (
                <View key = {index} style = {styles.choiceContainer}>
                    <TouchableOpacity onPress = {() => itemPress(index, item.answer)} style = {
                        [
                            styles.item,
                            selectedItemIndex == index && {borderWidth : 2},
                            invisibleItem.includes(index) && styles.invisible
                        ]
                    }>
                        <Text style = {[{textAlign: 'center'}, invisibleItem.includes(index) && styles.invisible]}>{item.item}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress = {() => answerPress(index, item.fakeAnswer)} style = {
                        [
                            styles.item,
                            selectedAnswerIndex == index && {borderWidth : 2},
                            invisibleAnswer.includes(index) && styles.invisible
                        ]
                    }>
                        <Text style = {[{textAlign: 'center'}, invisibleAnswer.includes(index) && styles.invisible]}>{item.fakeAnswer}</Text>
                    </TouchableOpacity>

                </View>
            ))}
            {nextButton &&
                <TouchableOpacity style = {styles.submitButton} onPress = {nextButtonPress}>
                    <Text style = {styles.submitButtonText}>
                        Next
                    </Text>
                </TouchableOpacity>
            }
            {backButton &&
                <TouchableOpacity style = {styles.submitButton} onPress = {backButtonPress}>
                    <Text style = {styles.submitButtonText}>
                        Back
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        backgroundColor: 'rgb(154, 182, 212)',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10,
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
    item: {
        borderRadius: 5,
        padding: 5,
        marginTop: 20,
        borderColor: 'black',
        borderWidth: 1,
        width: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    choiceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 100,
        width: screenWidth,
    },

    invisible: {
        borderWidth: 0,
        color: 'transparent',
    }
});