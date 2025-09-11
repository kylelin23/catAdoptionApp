import React, { useState } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, useWindowDimensions, TextStyle } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons } from "@expo/vector-icons";


const ARoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ffcccb' }}>
    <Text>Content of A</Text>
  </View>
);

const BRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#d1ffd6' }}>
    <Text>Content of B</Text>
  </View>
);


export default function CatParents({navigation} : {navigation: any}) {



  const [faq, setFAQ] = useState([
    // CHANGE THE FAQs OVER HERE
    ['question', 'answer'],
    ['question', 'answer']
  ]);

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'a', title: 'A' },
    { key: 'b', title: 'B' },
  ]);

  const renderScene = ({ route }: {route: any}) => {
    switch (route.key) {
      case 'a':
        return <ARoute />;
      case 'b':
        return <BRoute />;
      default:
        return null;
    }
  };
  const screenWidth = Dimensions.get('window').width;







  return (
    <View style = {styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: screenWidth}}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{borderRadius: 10, backgroundColor: 'white'}}
            indicatorStyle={{ backgroundColor: 'transparent' }}
            activeColor = 'black'
          />
        )}
      />

      <TouchableOpacity onPress = {() => {navigation.navigate('Home')}}>
        <MaterialIcons name="home" size={75} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 50,
    textAlign: 'center'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgb(154, 182, 212)',
    paddingTop: 50,

  },

});
