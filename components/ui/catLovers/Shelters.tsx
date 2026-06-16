import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';

const INK        = '#2C1A0E';
const INK_SOFT   = '#6B4C35';
const WHITE      = '#FFFAF5';
const SAND       = '#E8C9A0';
const GREEN      = '#7BAE6E';
const GREEN_DARK = '#5A8F50';

// Google Places API (New) — Text Search. The key is read from an Expo public
// env var. Anything prefixed EXPO_PUBLIC_ is bundled into the app, so restrict
// this key in the Google Cloud console (iOS bundle id + Places API only).
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';
const SEARCH_RADIUS_METERS = 40000; // ~25 miles
// More cat-specific than "cat shelter" — skews results away from dog rescues.
const SEARCH_TERM = 'cat rescue';

// Fields to return from Places. nextPageToken must be in the mask for the API
// to hand back a token, which is what lets us page past the first 20 results.
const PLACES_FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location,places.websiteUri,places.editorialSummary,nextPageToken';

// Google has no cat-only place type, so "cat shelter" can still return dog
// rescues. Drop results whose name clearly signals dogs and never cats.
const DOG_TERMS = ['dog', 'dogs', 'canine', 'puppy', 'puppies', 'k9', 'k-9'];
const CAT_TERMS = ['cat', 'cats', 'kitten', 'kittens', 'feline', 'kitty'];

// When true, only keep places whose name mentions cats. Stricter — filters out
// most dog results, but also drops general shelters that don't say "cat".
const STRICT_CAT_ONLY = false;

function textHasWord(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some(term => new RegExp(`(^|[^a-z])${term}([^a-z]|$)`).test(lower));
}

function isLikelyDogOnly(text: string) {
  return textHasWord(text, DOG_TERMS) && !textHasWord(text, CAT_TERMS);
}

function shouldKeepShelter(text: string) {
  if (isLikelyDogOnly(text)) return false;
  if (STRICT_CAT_ONLY && !textHasWord(text, CAT_TERMS)) return false;
  return true;
}

// Geocode result types that mean "this is a place" (city, zip, region) rather
// than a business name. Used to decide whether to bias the search to it.
const LOCALITY_TYPES = [
  'locality',
  'postal_code',
  'postal_town',
  'sublocality',
  'neighborhood',
  'administrative_area_level_1',
  'administrative_area_level_2',
  'administrative_area_level_3',
];

// Turn typed text into coordinates so we can bias the search around it. Also
// reports whether the match is a locality (city/zip) vs. something else like a
// shelter name. Returns null on any failure so the caller can fall back.
async function geocodePlace(query: string) {
  try {
    const url = `${GEOCODE_ENDPOINT}?address=${encodeURIComponent(query)}&components=country:US&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results?.[0]) {
      const result = data.results[0];
      const types: string[] = result.types ?? [];
      const isLocality = types.some(t => LOCALITY_TYPES.includes(t));
      const loc = result.geometry.location;
      return { latitude: loc.lat, longitude: loc.lng, isLocality };
    }
    console.log('Geocode returned no result:', data.status);
    return null;
  } catch (error) {
    console.log('Geocode error:', error);
    return null;
  }
}

type Shelter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
};

// Haversine formula to compute distance over the Earth's surface in miles
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Pull the 5-digit zip from a formatted address. Google formats US addresses
// like "..., CA 95112, USA", so the zip is the last 5-digit group — taking the
// last one avoids grabbing a 5-digit street number earlier in the string.
function getZip(address: string) {
  const matches = address.match(/\b\d{5}(?:-\d{4})?\b/g);
  if (!matches) return null;
  return matches[matches.length - 1].slice(0, 5);
}

export default function Shelters({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loadingShelters, setLoadingShelters] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  // Distances are always measured from this point — the user's own location.
  const [distanceOrigin, setDistanceOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  // The typed city/zip when the last search was a locality search, else null.
  const [searchedLocality, setSearchedLocality] = useState<string | null>(null);

  useEffect(() => {
    requestAndFetchLocation();
  }, []);

  const requestAndFetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        // Still try to load shelters without a location bias
        fetchShelters(null);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location.coords);
      fetchShelters(location.coords);
    } catch (error) {
      console.log('Location acquisition error:', error);
      fetchShelters(null);
    }
  };

  // Query Google Places for cat shelters. The search is biased toward a point
  // when we have one: the user's location for an empty box, or the geocoded
  // center of a typed city/zip. For a city or zip the query stays the bare
  // search term (we narrow to the place client-side); only a shelter name is
  // folded into the query so Google name-matches it.
  const fetchShelters = async (
    coords: Location.LocationObjectCoords | null,
    query: string = ''
  ) => {
    try {
      setLoadingShelters(true);
      setFetchError(false);

      if (!GOOGLE_API_KEY) {
        console.log('Missing EXPO_PUBLIC_GOOGLE_MAPS_API_KEY');
        setFetchError(true);
        setShelters([]);
        return;
      }

      const trimmed = query.trim();

      let textQuery = SEARCH_TERM;
      let biasCoords: { latitude: number; longitude: number } | null = null;
      // The locality string to match against result addresses, if any.
      let locality: string | null = null;

      if (!trimmed) {
        // Empty box: search around the user
        biasCoords = coords;
      } else {
        // Resolve what they typed. A city or zip geocodes to a locality; a
        // shelter/rescue name does not.
        const place = await geocodePlace(trimmed);
        if (place && place.isLocality) {
          // Keep the query as the bare search term and bias to the place's
          // center. Folding the zip into the query (e.g. "cat rescue 95112")
          // makes Google run a category search that drops cat-adjacent places
          // like cat cafes; a biased "cat rescue" returns a broader set that we
          // then narrow to the exact zip client-side (see displayShelters), so
          // a place like The Dancing Cat can survive instead of being dropped
          // before we ever see it.
          biasCoords = { latitude: place.latitude, longitude: place.longitude };
          locality = trimmed;
        } else {
          // A name: fold it into the query so Google name-matches it. This lets
          // the search find a specific shelter even when it isn't near the user.
          textQuery = `${SEARCH_TERM} ${trimmed}`;
        }
      }

      // Distances are always measured from the user's own location, so a
      // result's "X miles away" badge means distance from you no matter what was
      // searched. (With no location permission, coords is null and no distance
      // is shown.)
      setDistanceOrigin(coords);
      setSearchedLocality(locality);

      const body: any = { textQuery };
      if (biasCoords) {
        body.locationBias = {
          circle: {
            center: { latitude: biasCoords.latitude, longitude: biasCoords.longitude },
            radius: SEARCH_RADIUS_METERS,
          },
        };
      }

      // The Places API (New) returns at most 20 results per page. In a dense
      // metro that cap can hide smaller cat places, so page through up to 3
      // times (~60 results) using the nextPageToken from each response.
      const allPlaces: any[] = [];
      let pageToken: string | null = null;
      let pagesFetched = 0;

      do {
        const requestBody = pageToken ? { ...body, pageToken } : body;
        const response = await fetch(PLACES_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': PLACES_FIELD_MASK,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log('Places API error:', data);
          // Hard-fail only if we have nothing yet. A later page failing should
          // not discard the results we already have in hand.
          if (allPlaces.length === 0) {
            setFetchError(true);
            setShelters([]);
            return;
          }
          break;
        }

        if (data.places) {
          allPlaces.push(...data.places);
        }
        pageToken = data.nextPageToken ?? null;
        pagesFetched += 1;
      } while (pageToken && pagesFetched < 3);

      const mapped: Shelter[] = allPlaces
        .filter((place: any) => {
          // Scan both the name and the short description, if present
          const text = `${place.displayName?.text ?? ''} ${place.editorialSummary?.text ?? ''}`;
          return shouldKeepShelter(text);
        })
        .map((place: any) => ({
          id: place.id,
          name: place.displayName?.text ?? 'Unknown shelter',
          address: place.formattedAddress ?? '',
          phone: '',
          website: place.websiteUri ?? '',
          latitude: place.location?.latitude ?? 0,
          longitude: place.location?.longitude ?? 0,
        }));
      setShelters(mapped);
    } catch (error) {
      console.log('Shelter fetch error:', error);
      setFetchError(true);
      setShelters([]);
    } finally {
      setLoadingShelters(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchShelters(userLocation, searchQuery);
  };

  // Build shelter cards containing calculated real-time distances
  const processedShelters = shelters.map(shelter => {
    if (distanceOrigin) {
      const miles = getHaversineDistance(
        distanceOrigin.latitude,
        distanceOrigin.longitude,
        shelter.latitude,
        shelter.longitude
      );
      return {
        ...shelter,
        distanceVal: miles,
        distanceStr: `${miles.toFixed(1)} miles away`,
      };
    }
    return { ...shelter, distanceVal: 0, distanceStr: '' };
  });

  // For a zip search, show only the shelters whose own address has that exact
  // zip, closest first. For a city search, float results in that place to the
  // top and keep the rest below in Google's order.
  let displayShelters = processedShelters;
  if (searchedLocality) {
    const searchedZip = searchedLocality.match(/\b\d{5}\b/)?.[0] ?? null;

    if (searchedZip) {
      displayShelters = processedShelters
        .filter(s => getZip(s.address) === searchedZip)
        .sort((a, b) => a.distanceVal - b.distanceVal);
    } else {
      const needle = searchedLocality.toLowerCase();
      const inPlace = processedShelters
        .filter(s => s.address.toLowerCase().includes(needle))
        .sort((a, b) => a.distanceVal - b.distanceVal);
      const others = processedShelters.filter(s => !s.address.toLowerCase().includes(needle));
      displayShelters = [...inPlace, ...others];
    }
  }

  const handleDirections = (address: string) => {
    const url = `maps://maps.apple.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Bar Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchInstructions}>
          Search for your nearest cat shelter/rescue by city, zip code, or name!
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter city, zip code, or name"
          placeholderTextColor="rgba(44,26,14,0.3)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.searchDisclaimer}>
          Disclaimer: Listings come from Google and may not be cat-specific. Please check a
          shelter/rescue's website to confirm before reaching out or visiting.
        </Text>
        {loadingShelters ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={GREEN} />
            <Text style={styles.emptyText}>Finding cat shelter/rescues...</Text>
          </View>
        ) : fetchError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Couldn't load shelters/rescues</Text>
            <Text style={styles.emptyText}>Check your connection and try again.</Text>
            <TouchableOpacity onPress={() => fetchShelters(userLocation, searchQuery)} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : displayShelters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No shelters/rescues found</Text>
            <Text style={styles.emptyText}>Try a different city or keyword.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              Showing {displayShelters.length} {displayShelters.length === 1 ? 'shelter/rescue' : 'shelters/rescues'}
            </Text>

            {displayShelters.map((shelter) => (
              <View key={shelter.id} style={styles.shelterCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.shelterName}>{shelter.name}</Text>
                  {shelter.distanceStr ? (
                    <Text style={styles.distanceBadge}>{shelter.distanceStr}</Text>
                  ) : null}
                </View>

                {shelter.address ? <Text style={styles.shelterAddress}>{shelter.address}</Text> : null}

                <View style={styles.actionRow}>
                  {shelter.address ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.routeBtn]}
                      onPress={() => handleDirections(shelter.address)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.routeBtnText}>Directions</Text>
                    </TouchableOpacity>
                  ) : null}

                  {shelter.website ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.webBtn]}
                      onPress={() => handleWebsite(shelter.website)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.webBtnText}>Website</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: WHITE },

  searchContainer: { paddingHorizontal: 22, paddingTop: 16, marginBottom: 6 },
  searchInstructions: { fontFamily: 'Avenir', fontSize: 15, fontWeight: '700', color: INK, marginBottom: 10, lineHeight: 20 },
  searchDisclaimer: { fontFamily: 'Avenir', fontSize: 11, fontWeight: '500', color: INK_SOFT, marginBottom: 14, lineHeight: 15, paddingHorizontal: 2 },
  searchInput: { fontFamily: 'Avenir', fontSize: 14, fontWeight: '500', color: INK, backgroundColor: 'rgba(44,26,14,0.04)', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: 'rgba(44,26,14,0.1)' },

  scrollContent: { paddingHorizontal: 22, paddingTop: 10 },
  resultsCount: { fontFamily: 'Avenir', fontSize: 12, fontWeight: '600', color: INK_SOFT, marginBottom: 14, paddingLeft: 2 },

  emptyState: { padding: 36, alignItems: 'center', gap: 8, backgroundColor: 'rgba(44,26,14,0.03)', borderRadius: 24, borderWidth: 1.5, borderColor: 'rgba(44,26,14,0.08)', marginTop: 20 },
  emptyTitle: { fontFamily: 'Avenir', fontSize: 16, fontWeight: '900', color: INK },
  emptyText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: INK_SOFT, textAlign: 'center' },
  retryBtn: { backgroundColor: 'rgba(212,149,106,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  retryBtnText: { fontFamily: 'Avenir', fontSize: 11, fontWeight: '700', color: '#A86E45' },

  shelterCard: { backgroundColor: WHITE, borderRadius: 20, padding: 18, borderWidth: 2, borderColor: 'rgba(44,26,14,0.06)', borderBottomWidth: 4, borderBottomColor: 'rgba(44,26,14,0.1)', marginBottom: 16, gap: 6, shadowColor: INK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  shelterName: { fontFamily: 'Avenir', fontSize: 16, fontWeight: '900', color: INK, flex: 1 },
  distanceBadge: { fontFamily: 'Avenir', fontSize: 11, fontWeight: '700', color: GREEN, backgroundColor: 'rgba(123,174,110,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  shelterAddress: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '400', color: INK_SOFT, lineHeight: 18, marginTop: 2 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  routeBtn: { backgroundColor: SAND, borderWidth: 1.5, borderColor: '#D4956A' },
  routeBtnText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '700', color: INK },

  webBtn: { backgroundColor: GREEN, borderBottomWidth: 3, borderBottomColor: GREEN_DARK },
  webBtnText: { fontFamily: 'Avenir', fontSize: 13, fontWeight: '800', color: WHITE },
});