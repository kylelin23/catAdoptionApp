import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import food, { plants, householdItems, others } from '../../../data/newCatParents/catList1'
import { useState } from "react";

export default function CatList1 () {

    const [currentList, setCurrentList] = useState(food);
    const [nextButton, setNextButton] = useState(true);
    const [backButton, setBackButton] = useState(false);

    const nextButtonPress = () => {
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

    return (
        <View style = {styles.container}>
            <Text style = {styles.titleText}>Are These Items Toxic to Cats? </Text>
            {currentList.map((item) => (
                <View style = {styles.choiceContainer}>
                    <TouchableOpacity style = {styles.item}>
                        <Text style = {{textAlign: 'center'}}>{item.item}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.item}>
                        <Text style = {{textAlign: 'center'}}>{item.fakeAnswer}</Text>
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
    }
});