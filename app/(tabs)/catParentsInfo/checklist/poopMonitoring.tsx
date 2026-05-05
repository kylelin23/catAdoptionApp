import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";

const INK = '#2C1A0E';
const INK_SOFT = '#6B4C35';
const WHITE = '#FFFAF5';

const TYPES = [
  {
    type: 4,
    description: 'Smooth, soft sausage or snake',
    label: 'Normal',
    rating: 'Perfect!',
    ratingColor: '#4A9B6F',
    cardColor: '#C4DDB0',
  },
  {
    type: 3,
    description: 'Sausage shape with cracks in the surface',
    label: 'Normal',
    rating: 'Great!',
    ratingColor: '#4A9B6F',
    cardColor: '#C4DDB0',
  },
  {
    type: 5,
    description: 'Soft blobs with clear-cut edges',
    label: 'Lacking Fibre',
    rating: 'Monitor',
    ratingColor: '#C8973A',
    cardColor: '#F2D9A0',
  },
  {
    type: 2,
    description: 'Lumpy and sausage-like',
    label: 'Mild Constipation',
    rating: 'Monitor',
    ratingColor: '#C8973A',
    cardColor: '#F2D9A0',
  },
  {
    type: 6,
    description: 'Mushy consistency with ragged edges',
    label: 'Mild Diarrhea',
    rating: 'Concerning',
    ratingColor: '#D35400',
    cardColor: '#F2C9A0',
  },
  {
    type: 1,
    description: 'Separate hard lumps',
    label: 'Severe Constipation',
    rating: 'See a Vet',
    ratingColor: '#C0392B',
    cardColor: '#F2B8B0',
  },
  {
    type: 7,
    description: 'Liquid consistency with no solid pieces',
    label: 'Severe Diarrhea',
    rating: 'See a Vet',
    ratingColor: '#C0392B',
    cardColor: '#F2B8B0',
  },
];

export default function PoopMonitoring({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Poop Monitor</Text>
        <Text style={styles.headerSub}>Track your cat's health by poop type</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {TYPES.map((item) => (
          <View key={item.type} style={[styles.card, { backgroundColor: item.cardColor }]}>

            {/* Description */}
            <View style={styles.cardMiddle}>
              <Text style={styles.typeDescription}>{item.description}</Text>
              <Text style={styles.typeLabel}>{item.label}</Text>
            </View>

            {/* Rating badge */}
            <View style={[styles.ratingBadge, { backgroundColor: item.ratingColor }]}>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>

          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EAD8',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 0,
    gap: 12,
  },

  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: INK_SOFT,
  },

  header: {
    gap: 4,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 32,
    fontWeight: '900',
    color: INK,
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '400',
    color: INK_SOFT,
  },

  scrollContent: {
    gap: 10,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  cardMiddle: {
    flex: 1,
    gap: 4,
  },
  typeDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: INK,
    lineHeight: 18,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
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
    minWidth: 72,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: WHITE,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});