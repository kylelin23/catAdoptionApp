import React, { useState } from 'react';
import { Text, Dimensions, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TabView } from 'react-native-tab-view';
import Checklist from '../../../components/ui/catParents/checklist';
import NewCats from '../../../components/ui/catParents/newCats';


const screenWidth = Dimensions.get('window').width;

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND = '#E8C9A0';
const WHITE = '#FFFAF5';

const CatssentialLists = ({ navigation }: { navigation: any }) => (
  <ScrollView
    style={[styles.scrollContainer, { backgroundColor: 'transparent' }]}
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <Checklist navigation={navigation} />
  </ScrollView>
);

const IntroducingNewCats = () => (
  <ScrollView
    style={styles.scrollContainer}
    showsVerticalScrollIndicator={false}
  >
    <Text>Introducing New Cats</Text>
  </ScrollView>
);

export default function CatParents({ navigation }: { navigation: any }) {

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'catssentialLists', title: 'Essentials' },
    { key: 'introducingNewCats', title: 'New Cats' },
    { key: 'cationary', title: 'Cationary' },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'catssentialLists':
        return <CatssentialLists navigation={navigation} />;
      case 'introducingNewCats':
        return <NewCats navigation={navigation}/>;
      case 'cationary':
        return <IntroducingNewCats />;
      default:
        return null;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBarWrapper}>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Text style={styles.backArrow}>{"<"}</Text>
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      {/* Page title */}
      <Text style={styles.pageTitle}>Cat{'\n'}Parents</Text>

      {/* Custom pill tab bar */}
      <View style={styles.tabPillContainer}>
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabPill, index === i && styles.tabPillActive]}
            onPress={() => setIndex(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabPillText, index === i && styles.tabPillTextActive]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );

  return (
    <View style={styles.container}>

      {/* Background blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={renderTabBar}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
  },

  blobTopRight: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F2DCBC',
    top: -60,
    right: -60,
    opacity: 0.7,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#C47A45',
    bottom: -40,
    left: -40,
    opacity: 0.3,
  },

  tabBarWrapper: {
    backgroundColor: SAND,
    paddingTop: 64,
    paddingHorizontal: 28,
    paddingBottom: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,250,245,0.5)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backArrow: {
    fontSize: 16,
    color: INK,
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: INK,
  },

  pageTitle: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 20,
  },

  tabPillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,250,245,0.4)',
    borderRadius: 50,
    padding: 4,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: INK,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: INK_SOFT,
  },
  tabPillTextActive: {
    color: WHITE,
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  },
});