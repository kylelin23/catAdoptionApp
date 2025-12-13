import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from 'react-native-tab-view';







export default function CatLovers({navigation}: {navigation: any}) {

  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  const CatStories = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Cat Stories</Text>
    </ScrollView>
  );


  const CommunityCats = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Community Cats</Text>
    </ScrollView>
  );

  const TypesOfCats = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Types of Cats</Text>
    </ScrollView>
  );

  const Shelters = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Shelters</Text>
    </ScrollView>
  );

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
      { key: 'catStories', title: 'Cat Stories' },
      { key: 'communityCats', title: 'Community Cats' },
      { key: 'typesOfCats', title: 'Types Of Cats' },
    ]);

    const renderScene = ({ route }: {route: any}) => {
      switch (route.key) {
        case 'catStories':
          return <CatStories />;
        case 'communityCats':
          return <CommunityCats />;
        case 'typesOfCats':
          return <TypesOfCats />
        case 'shelters':
          return <Shelters />
        default:
          return null;
      }
    };



  return (
    <View style = {styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: screenWidth}}
          renderTabBar={(props) => (
            <View style = {{alignItems: 'center'}}>
              <TabBar
                {...props}
                style={{
                  borderRadius: 10,
                  backgroundColor: 'lightblue',
                  width: screenWidth * .8,
                }}
                indicatorStyle={{ backgroundColor: 'transparent' }}
                activeColor = 'black'
                inactiveColor='gray'
              />
            </View>
          )}
        />


    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    paddingTop: 30,
    paddingBottom: 30,
  },

  scrollContainer: {
    flex: 1,
    padding: 25,
  },

});
