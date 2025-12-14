import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FAQs from '@/components/ui/newCatParents/FAQs';
import Trivia from '../../../components/ui/newCatParents/Trivia'
import Info from '../../../components/ui/newCatParents/Info'

export default function NewCatParents() {

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'info', title: 'Info' },
    { key: 'trivia', title: 'Trivia' },
    { key: 'faqs', title: 'FAQs' }
  ]);

  const renderScene = ({ route }: {route: any}) => {
    switch (route.key) {
      case 'info':
        return <Info />;
      case 'trivia':
        return <Trivia />;
      case 'faqs':
        return <FAQs />
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
});
