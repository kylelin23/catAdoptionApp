import { View, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView, Image } from "react-native";

const INK      = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE    = '#FFFAF5';

const PAW = require('../../../../assets/images/paw.png');

const STOOL_IMAGES: { [key: number]: any } = {
  1: require('../../../../assets/images/stools copy.png'),
  2: require('../../../../assets/images/stools copy 2.png'),
  3: require('../../../../assets/images/stools copy 3.png'),
  4: require('../../../../assets/images/stools copy 4.png'),
  5: require('../../../../assets/images/stools copy 5.png'),
  6: require('../../../../assets/images/stools copy 6.png'),
  7: require('../../../../assets/images/stools copy 7.png'),
};

const TYPES = [
  {
    type: 4,
    description: 'Smooth, soft sausage or snake',
    label: 'Normal',
    rating: 'Perfect!',
    border: '#7BAE6E',
    dark: '#5A8F50',
    cardColor: '#C4DDB0',
    ratingColor: '#7BAE6E',
    ratingDark: '#5A8F50',
  },
  {
    type: 3,
    description: 'Sausage shape with cracks in the surface',
    label: 'Normal',
    rating: 'Great!',
    border: '#7BAE6E',
    dark: '#5A8F50',
    cardColor: '#C4DDB0',
    ratingColor: '#7BAE6E',
    ratingDark: '#5A8F50',
  },
  {
    type: 5,
    description: 'Soft blobs with clear-cut edges',
    label: 'Lacking Fibre',
    rating: 'Monitor',
    border: '#D4956A',
    dark: '#A86E45',
    cardColor: '#F2D9A0',
    ratingColor: '#D4956A',
    ratingDark: '#A86E45',
  },
  {
    type: 2,
    description: 'Lumpy and sausage-like',
    label: 'Mild Constipation',
    rating: 'Monitor',
    border: '#D4956A',
    dark: '#A86E45',
    cardColor: '#F2D9A0',
    ratingColor: '#D4956A',
    ratingDark: '#A86E45',
  },
  {
    type: 6,
    description: 'Mushy consistency with ragged edges',
    label: 'Mild Diarrhea',
    rating: 'Concerning',
    border: '#C47A45',
    dark: '#9E5C2E',
    cardColor: '#F2C9A0',
    ratingColor: '#C47A45',
    ratingDark: '#9E5C2E',
  },
  {
    type: 1,
    description: 'Separate hard lumps',
    label: 'Severe Constipation',
    rating: 'See a Vet',
    border: '#C0392B',
    dark: '#922B21',
    cardColor: '#F2B8B0',
    ratingColor: '#C0392B',
    ratingDark: '#922B21',
  },
  {
    type: 7,
    description: 'Liquid consistency with no solid pieces',
    label: 'Severe Diarrhea',
    rating: 'See a Vet',
    border: '#C0392B',
    dark: '#922B21',
    cardColor: '#F2B8B0',
    ratingColor: '#C0392B',
    ratingDark: '#922B21',
  },
];

export default function PoopMonitoring({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>CAT PARENTS</Text>
            <Text style={styles.pageTitle}>Poop Monitor</Text>
            <Text style={styles.pageSub}>Track your cat's health by poop type</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {TYPES.map((item) => (
            <View
              key={item.type}
              style={[styles.card, {
                backgroundColor: item.cardColor,
                borderColor: item.border,
                borderBottomColor: item.dark,
              }]}
            >
              {/* Paw badge */}
              <View style={[styles.pawBadge, { backgroundColor: item.border, borderBottomColor: item.dark }]}>
                <Image source={PAW} style={styles.pawIcon} resizeMode="contain" />
              </View>

              {/* Stool image */}
              <Image
                source={STOOL_IMAGES[item.type]}
                style={styles.stoolImage}
                resizeMode="contain"
              />

              {/* Description */}
              <View style={styles.cardMiddle}>
                <Text style={styles.typeDescription}>{item.description}</Text>
                <Text style={styles.typeLabel}>{item.label}</Text>
              </View>

              {/* Rating */}
              <View style={[styles.ratingBadge, { backgroundColor: item.ratingColor, borderBottomColor: item.ratingDark }]}>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>

            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(44,26,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  backBtnText: {
    fontSize: 18, fontWeight: '700',
    color: INK, lineHeight: 22,
  },
  headerCenter: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontFamily: 'Avenir',
    fontSize: 10, fontWeight: '800',
    color: 'rgba(44,26,14,0.4)',
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: 'Avenir',
    fontSize: 26, fontWeight: '900',
    color: INK, letterSpacing: -0.5,
  },
  pageSub: {
    fontFamily: 'Avenir',
    fontSize: 12, fontWeight: '400',
    color: INK_SOFT,
  },

  scrollContent: {
    gap: 10,
  },

  card: {
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2.5,
    borderBottomWidth: 4,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  pawBadge: {
    width: 36, height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  pawIcon: {
    width: 18, height: 18,
    tintColor: WHITE,
  },

  stoolImage: {
    width: 52,
    height: 52,
    flexShrink: 0,
  },

  cardMiddle: {
    flex: 1,
    gap: 3,
  },
  typeDescription: {
    fontFamily: 'Avenir',
    fontSize: 13, fontWeight: '600',
    color: INK, lineHeight: 18,
  },
  typeLabel: {
    fontFamily: 'Avenir',
    fontSize: 11, fontWeight: '700',
    color: INK_SOFT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  ratingBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 76,
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  ratingText: {
    fontFamily: 'Avenir',
    fontSize: 11, fontWeight: '900',
    color: WHITE,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});