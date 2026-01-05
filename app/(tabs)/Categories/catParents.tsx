import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Checklist from '../../../components/ui/catParents/checklist'



export default function CatParents({navigation}: {navigation: any}) {

  const [openIndex, setOpenIndex] = useState(-1);

  const showAnswer = ( index: number ) => {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  const CatssentialLists = () => (
    <ScrollView
      style = {styles.scrollContainer}
      contentContainerStyle = {styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <Checklist navigation = {navigation}/>
    </ScrollView>
  );


  const IntroducingNewCats = () => (
    <ScrollView
      style = {styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text>Introducing New Cats</Text>
    </ScrollView>
  );

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
      { key: 'catssentialLists', title: 'Essentials' },
      { key: 'introducingNewCats', title: 'New Cats' },
      { key: 'cationary', title: 'Cationary' },
    ]);

    const renderScene = ({ route }: {route: any}) => {
      switch (route.key) {
        case 'catssentialLists':
          return <CatssentialLists />;
        case 'introducingNewCats':
          return <IntroducingNewCats />;
        case 'cationary':
          return <IntroducingNewCats />;
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
  },

  scrollContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  }

});
