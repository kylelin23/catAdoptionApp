import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Info({navigation}: {navigation: any}) {
    return (
        <View style = {{alignItems: 'center', gap: 50, justifyContent: 'center', flex: 1}}>
              <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("Pros")}>
                <Text style = {styles.proConText}>Pros</Text>
                <Text>Key benefits</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.square} onPress = {() => navigation.navigate("Cons")}>
                <Text style = {styles.proConText}>Cons</Text>
                <Text>Things to Consider</Text>
              </TouchableOpacity>
            </View>
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
        gap: 5
    },

    proConText: {
        fontWeight: 'bold',
        fontSize: 25
    },
});