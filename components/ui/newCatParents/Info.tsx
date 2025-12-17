import React from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Info({navigation}: {navigation: any}) {
    return (
      <ScrollView contentContainerStyle = {{marginTop: 50, paddingBottom: 50, alignItems: 'center', gap: 50, justifyContent: 'center'}}>
        <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("What to Buy in Preparation")}>
          <Text style = {styles.proConText}>What to Buy in Preparation</Text>
          <Text style = {{textAlign: 'center'}}>Make sure you are prepared! </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("What to Expect in the First Week")}>
          <Text style = {styles.proConText}>What to Expect in the First Week</Text>
          <Text style = {{textAlign: 'center'}}>Know what to expect!</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("Checklist")}>
          <Text style = {styles.proConText}>Checklist</Text>
          <Text style = {{textAlign: 'center'}}>Make sure you check all boxes!</Text>
        </TouchableOpacity>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
    square: {
        height: 200,
        width: 200,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        gap: 5,
        padding: 12,
    },

    proConText: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
});