import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as Location from "expo-location";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";
const SAND = "#E8C9A0";
const GREEN = "#7BAE6E";
const GREEN_DARK = "#5A8F50";

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:5001";

type Shelter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
};

function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getZip(address: string) {
  const matches = address.match(/\b\d{5}(?:-\d{4})?\b/g);
  if (!matches) return null;
  return matches[matches.length - 1].slice(0, 5);
}

export default function Shelters({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loadingShelters, setLoadingShelters] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [distanceOrigin, setDistanceOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchedLocality, setSearchedLocality] = useState<string | null>(null);

  useEffect(() => {
    requestAndFetchLocation();
  }, []);

  const requestAndFetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        fetchShelters(null);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location.coords);
      fetchShelters(location.coords);
    } catch (error) {
      console.log("Location acquisition error:", error);
      fetchShelters(null);
    }
  };

  const fetchShelters = async (
    coords: Location.LocationObjectCoords | null,
    query: string = "",
  ) => {
    try {
      setLoadingShelters(true);
      setFetchError(false);

      const trimmed = query.trim();

      setDistanceOrigin(coords);

      const params = new URLSearchParams();
      if (trimmed) params.set("query", trimmed);
      if (coords) {
        params.set("lat", coords.latitude.toString());
        params.set("lng", coords.longitude.toString());
      }

      const res = await fetch(
        `${BACKEND_URL}/api/shelters?${params.toString()}`,
      );

      if (!res.ok) {
        console.log("Shelter fetch failed:", res.status);
        setFetchError(true);
        setShelters([]);
        return;
      }

      const data = await res.json();
      setShelters(data.shelters);
      setSearchedLocality(data.searchedLocality);
    } catch (error) {
      console.log("Shelter fetch error:", error);
      setFetchError(true);
      setShelters([]);
    } finally {
      setLoadingShelters(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchShelters(userLocation, searchQuery);
  };

  const processedShelters = shelters.map((shelter) => {
    if (distanceOrigin) {
      const miles = getHaversineDistance(
        distanceOrigin.latitude,
        distanceOrigin.longitude,
        shelter.latitude,
        shelter.longitude,
      );
      return {
        ...shelter,
        distanceVal: miles,
        distanceStr: `${miles.toFixed(1)} miles away`,
      };
    }
    return { ...shelter, distanceVal: 0, distanceStr: "" };
  });

  let displayShelters = processedShelters;
  if (searchedLocality) {
    const searchedZip = searchedLocality.match(/\b\d{5}\b/)?.[0] ?? null;

    if (searchedZip) {
      displayShelters = processedShelters
        .filter((s) => getZip(s.address) === searchedZip)
        .sort((a, b) => a.distanceVal - b.distanceVal);
    } else {
      const needle = searchedLocality.toLowerCase();
      const inPlace = processedShelters
        .filter((s) => s.address.toLowerCase().includes(needle))
        .sort((a, b) => a.distanceVal - b.distanceVal);
      const others = processedShelters.filter(
        (s) => !s.address.toLowerCase().includes(needle),
      );
      displayShelters = [...inPlace, ...others];
    }
  } else if (distanceOrigin) {
    displayShelters = [...processedShelters].sort(
      (a, b) => a.distanceVal - b.distanceVal,
    );
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
      <View style={styles.searchContainer}>
        <Text style={styles.searchInstructions}>
          Search for your nearest cat shelter/rescue by city, zip code, or name!
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="City, zip code, or shelter/rescue"
          placeholderTextColor="rgba(44,26,14,0.3)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.searchDisclaimer}>
          Listings come from Google and may not be cat-specific. Please check a
          shelter/rescue's website to confirm before reaching out or visiting.
        </Text>
        {loadingShelters ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={GREEN} />
            <Text style={styles.emptyText}>Finding cat shelter/rescues...</Text>
          </View>
        ) : fetchError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              Couldn't load shelters/rescues
            </Text>
            <Text style={styles.emptyText}>
              Check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={() => fetchShelters(userLocation, searchQuery)}
              style={styles.retryBtn}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : displayShelters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No shelters/rescues found</Text>
            <Text style={styles.emptyText}>
              Try a different city or keyword.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              Showing {displayShelters.length}{" "}
              {displayShelters.length === 1
                ? "shelter/rescue"
                : "shelters/rescues"}
            </Text>

            {displayShelters.map((shelter) => (
              <View key={shelter.id} style={styles.shelterCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.shelterName}>{shelter.name}</Text>
                  {shelter.distanceStr ? (
                    <Text style={styles.distanceBadge}>
                      {shelter.distanceStr}
                    </Text>
                  ) : null}
                </View>

                {shelter.address ? (
                  <Text style={styles.shelterAddress}>{shelter.address}</Text>
                ) : null}

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
        <View style={styles.scrollBottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },

  searchContainer: {
    paddingHorizontal: 22,
    paddingTop: 16,
    marginBottom: 6,
  },
  searchInstructions: {
    fontFamily: "Avenir",
    fontSize: 15,
    fontWeight: "700",
    color: INK,
    marginBottom: 10,
    lineHeight: 20,
  },
  searchDisclaimer: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "500",
    color: INK_SOFT,
    marginBottom: 14,
    lineHeight: 15,
    paddingHorizontal: 2,
  },
  searchInput: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "500",
    color: INK,
    backgroundColor: "rgba(44,26,14,0.04)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.1)",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  scrollBottomSpacer: {
    height: 40,
  },
  resultsCount: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "600",
    color: INK_SOFT,
    marginBottom: 14,
    paddingLeft: 2,
  },

  emptyState: {
    padding: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(44,26,14,0.03)",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(44,26,14,0.08)",
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
  },
  emptyText: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "400",
    color: INK_SOFT,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "rgba(212,149,106,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  retryBtnText: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "700",
    color: "#A86E45",
  },

  shelterCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: "rgba(44,26,14,0.06)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(44,26,14,0.1)",
    marginBottom: 16,
    gap: 6,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  shelterName: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: INK,
    flex: 1,
  },
  distanceBadge: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "700",
    color: GREEN,
    backgroundColor: "rgba(123,174,110,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  shelterAddress: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "400",
    color: INK_SOFT,
    lineHeight: 18,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  routeBtn: {
    backgroundColor: SAND,
    borderWidth: 1.5,
    borderColor: "#D4956A",
  },
  routeBtnText: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "700",
    color: INK,
  },

  webBtn: {
    backgroundColor: GREEN,
    borderBottomWidth: 3,
    borderBottomColor: GREEN_DARK,
  },
  webBtnText: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "800",
    color: WHITE,
  },
});
