import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Info from '../../../components/ui/Info'
import FAQs from '../../../components/ui/FAQs'
import Trivia from '../../../components/ui/trivia'

export default function ThinkingOfAdopting({navigation}: {navigation: any}) {

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'info', title: 'Info' },
    { key: 'trivia', title: 'Trivia' },
    { key: 'faqs', title: 'FAQs' }
  ]);

  const [triviaKey, setTriviaKey] = React.useState(0);

  React.useEffect(() => {
    if (index != 1) {
      setTriviaKey(triviaKey + 1);
    }
  }, [index]);

  const renderScene = ({ route }: {route: any}) => {
    switch (route.key) {
      case 'info':
        return <Info navigation = {navigation}/>;
      case 'trivia':
        return <Trivia key={triviaKey} />;
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
    paddingBottom: 50,
  },
});