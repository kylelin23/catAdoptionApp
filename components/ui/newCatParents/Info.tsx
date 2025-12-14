import { ScrollView, Text, StyleSheet } from "react-native";

export default function Info() {
    return(
        <ScrollView>
            <Text>Info</Text>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        padding: 25,
    },
})