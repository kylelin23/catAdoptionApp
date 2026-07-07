import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { mixpanel } from "../../../../frontend/lib/mixpanel";

const INK = "#2C1A0E";
const INK_SOFT = "#6B4C35";
const WHITE = "#FFFAF5";

const STOOL_IMAGES: { [key: number]: any } = {
  1: require("../../../assets/images/stools copy.png"),
  2: require("../../../assets/images/stools copy 2.png"),
  3: require("../../../assets/images/stools copy 3.png"),
  4: require("../../../assets/images/stools copy 4.png"),
  5: require("../../../assets/images/stools copy 5.png"),
  6: require("../../../assets/images/stools copy 6.png"),
  7: require("../../../assets/images/stools copy 7.png"),
};

const TYPES = [
  {
    type: 1,
    description: "Sep\u00ADar\u00ADate hard lumps",
    label: "Se\u00ADvere Con\u00ADstip\u00ADa\u00ADtion",
    rating: "See a Vet",
    border: "#C0392B",
    dark: "#922B21",
    cardColor: "#F2B8B0",
    ratingColor: "rgba(192, 57, 43, 0.12)",
    textColor: "#922B21",
  },
  {
    type: 2,
    description: "Lumpy and saus\u00ADage-like",
    label: "Mild Con\u00ADstip\u00ADa\u00ADtion",
    rating: "Mon\u00ADit\u00ADor",
    border: "#D4956A",
    dark: "#A86E45",
    cardColor: "#F2D9A0",
    ratingColor: "rgba(168, 110, 69, 0.15)",
    textColor: "#A86E45",
  },
  {
    type: 3,
    description: "Saus\u00ADage shape with cracks in the sur\u00ADface",
    label: "Nor\u00ADmal",
    rating: "Great!",
    border: "#7BAE6E",
    dark: "#5A8F50",
    cardColor: "#C4DDB0",
    ratingColor: "rgba(90, 143, 80, 0.15)",
    textColor: "#5A8F50",
  },
  {
    type: 4,
    description: "Smooth, soft saus\u00ADage or snake",
    label: "Nor\u00ADmal",
    rating: "Per\u00ADfect!",
    border: "#7BAE6E",
    dark: "#5A8F50",
    cardColor: "#C4DDB0",
    ratingColor: "rgba(90, 143, 80, 0.15)",
    textColor: "#5A8F50",
  },
  {
    type: 5,
    description: "Soft blobs with clear-cut edges",
    label: "Lack\u00ADing Fibre",
    rating: "Mon\u00ADit\u00ADor",
    border: "#D4956A",
    dark: "#A86E45",
    cardColor: "#F2D9A0",
    ratingColor: "rgba(168, 110, 69, 0.15)",
    textColor: "#A86E45",
  },
  {
    type: 6,
    description: "Mushy con\u00ADsist\u00ADency with ragged edges",
    label: "Mild Di\u00ADar\u00ADrhea",
    rating: "Con\u00ADcern\u00ADing",
    border: "#C47A45",
    dark: "#9E5C2E",
    cardColor: "#F2C9A0",
    ratingColor: "rgba(158, 92, 46, 0.15)",
    textColor: "#9E5C2E",
  },
  {
    type: 7,
    description: "Liquid con\u00ADsist\u00ADency with no sol\u00ADid pieces",
    label: "Se\u00ADvere Di\u00ADar\u00ADrhea",
    rating: "See a Vet",
    border: "#C0392B",
    dark: "#922B21",
    cardColor: "#F2B8B0",
    ratingColor: "rgba(192, 57, 43, 0.12)",
    textColor: "#922B21",
  },
];

export default function PoopMonitoring({ navigation }: { navigation: any }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    mixpanel.track("Screen Opened", {
      "Screen Name": "Poop Monitoring",
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText} allowFontScaling={false}>
              {"<"}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
              CAT PARENTS
            </Text>
            <Text
              style={styles.pageTitle}
              maxFontSizeMultiplier={1.4}
              numberOfLines={2}
            >
              Poop Monitor
            </Text>
            <Text
              style={styles.pageSub}
              maxFontSizeMultiplier={1.3}
              numberOfLines={2}
            >
              Track your cat's health by poop type
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          delaysContentTouches={false}
        >
          {TYPES.map((item) => (
            <View
              key={item.type}
              style={[
                styles.card,
                {
                  backgroundColor: item.cardColor,
                  borderColor: item.border,
                  borderBottomColor: item.dark,
                },
              ]}
            >
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: item.border,
                    borderBottomColor: item.dark,
                  },
                ]}
              >
                <Text style={styles.typeBadgeText} allowFontScaling={false}>
                  {item.type}
                </Text>
              </View>

              <View style={styles.imageWrapper}>
                <Image
                  source={STOOL_IMAGES[item.type]}
                  style={styles.stoolImage}
                  resizeMode="contain"
                />
                <Pressable
                  style={styles.absolutePressable}
                  onPress={() => setSelectedImage(item.type)}
                />
              </View>

              <View style={styles.cardMiddle}>
                <Text
                  style={styles.typeDescription}
                  maxFontSizeMultiplier={1.5}
                >
                  {item.description}
                </Text>
                <Text style={styles.typeLabel} maxFontSizeMultiplier={1.4}>
                  {item.label}
                </Text>
              </View>

              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: item.ratingColor },
                ]}
              >
                <Text
                  style={[styles.ratingText, { color: item.textColor }]}
                  maxFontSizeMultiplier={1.4}
                  numberOfLines={2}
                >
                  {item.rating}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>

        <Modal
          visible={selectedImage !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setSelectedImage(null)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedImage && (
                <>
                  <Text style={styles.modalTitle} maxFontSizeMultiplier={1.4}>
                    {"Type "}
                    {selectedImage}
                  </Text>
                  <Image
                    source={STOOL_IMAGES[selectedImage]}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={styles.modalCloseText}
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={2}
                  >
                    Tap anywhere outside to close
                  </Text>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(44,26,14,0.08)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: INK,
    lineHeight: 22,
  },
  headerCenter: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontFamily: "Avenir",
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(44,26,14,0.4)",
    letterSpacing: 2,
  },
  pageTitle: {
    fontFamily: "Avenir",
    fontSize: 26,
    fontWeight: "900",
    color: INK,
    letterSpacing: -0.5,
  },
  pageSub: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "400",
    color: INK_SOFT,
  },
  scrollContent: {
    gap: 10,
  },
  card: {
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2.5,
    borderBottomWidth: 4,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderBottomWidth: 3,
  },
  typeBadgeText: {
    fontFamily: "Avenir",
    fontSize: 16,
    fontWeight: "900",
    color: WHITE,
  },
  imageWrapper: {
    width: 52,
    height: 52,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  stoolImage: {
    width: 52,
    height: 52,
  },
  absolutePressable: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: "transparent",
    zIndex: 99,
  },
  cardMiddle: {
    flex: 1,
    gap: 3,
  },
  typeDescription: {
    fontFamily: "Avenir",
    fontSize: 13,
    fontWeight: "600",
    color: INK,
    lineHeight: 18,
    marginBottom: 2,
  },
  typeLabel: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "700",
    color: INK_SOFT,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  ratingBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 76,
    flexShrink: 0,
  },
  ratingText: {
    fontFamily: "Avenir",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(44, 26, 14, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 3,
    borderColor: INK,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: "900",
    color: INK,
    marginBottom: 16,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalCloseText: {
    fontFamily: "Avenir",
    fontSize: 12,
    fontWeight: "600",
    color: INK_SOFT,
    opacity: 0.6,
  },
});
