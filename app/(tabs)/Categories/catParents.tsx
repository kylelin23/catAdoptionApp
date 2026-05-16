import React, { useRef, useEffect } from 'react';
import { Dimensions, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Animated, Image, ScrollView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import Checklist from '../../../components/ui/catParents/checklist';
import NewCats from '../../../components/ui/catParents/newCats';
import Cationary from '../../../components/ui/catParents/cationary';

const screenWidth = Dimensions.get('window').width;
const { height: H } = Dimensions.get('window');

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const SAND     = '#E8C9A0';
const WHITE    = '#FFFAF5';
const GREEN    = '#7BAE6E';

const CAT_IMG = require('../../../assets/images/catWave.png');

const CatssentialLists = ({ navigation }: { navigation: any }) => (
  <ScrollView
    style={{ flex: 1, backgroundColor: WHITE }}
    contentContainerStyle={{ flexGrow: 1, padding: 25, justifyContent: 'center' }}
    showsVerticalScrollIndicator={false}
  >
    <Checklist navigation={navigation} />
  </ScrollView>
);

export default function CatParents({ navigation }: { navigation: any }) {

  const [index, setIndex] = React.useState(0);

  const headerY     = useRef(new Animated.Value(-20)).current;
  const headerOp    = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerY,  { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
        Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.spring(bubbleScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const [routes] = React.useState([
    { key: 'checklist', title: 'Essentials' },
    { key: 'newCats',   title: 'New Cats'   },
    { key: 'cationary', title: 'Cationary'  },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'checklist': return <CatssentialLists navigation={navigation} />;
      case 'newCats':   return <NewCats />;
      case 'cationary': return <Cationary />;
      default:          return null;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBarWrapper}>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>{"<"}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.mascotArea, { opacity: headerOp, transform: [{ translateY: headerY }] }]}>

        <Image source={CAT_IMG} style={styles.catImg} resizeMode="contain" />

        <Animated.View style={[styles.bubbleWrapper, { transform: [{ scale: bubbleScale }] }]}>
          <View style={styles.bubbleRow}>
            <View style={styles.tail} />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>Cat Parents</Text>
            </View>
          </View>
        </Animated.View>

      </Animated.View>

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
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bgTop} />
        <View style={styles.bgBottom} />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: screenWidth }}
          renderTabBar={renderTabBar}
          style={{ backgroundColor: 'transparent' }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    overflow: 'hidden',
  },

  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: H * 0.52,
    backgroundColor: SAND,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: H * 0.55,
    backgroundColor: WHITE,
  },

  tabBarWrapper: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  backBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 8,
  },
  backText: {
    fontSize: 18, fontWeight: '700',
    color: INK, lineHeight: 22,
  },

  mascotArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  catImg: {
    width: 160,
    height: 160,
    flexShrink: 0,
    marginRight: -32,
  },

  bubbleWrapper: {
    flex: 1,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tail: {
    width: 0, height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: WHITE,
  },

  bubble: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: '900',
    color: INK,
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  tabPillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44,26,14,0.06)',
    borderRadius: 50,
    padding: 4,
    gap: 4,
    marginHorizontal: 8,
    marginTop: 12,
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
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '600',
    color: INK_SOFT,
  },
  tabPillTextActive: {
    color: WHITE,
    fontWeight: '800',
  },
});