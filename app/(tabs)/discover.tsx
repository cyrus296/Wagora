import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_H = SCREEN_H * 0.71;

const AMBER = "#F59E0B";
const AMBER_DARK = "#D97706";

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type Pet = {
  id: string;
  name: string;
  age: string;
  breed: string;
  distance: string;
  image: string;
  tags: string[];
};

const PETS: Pet[] = [
  {
    id: "1",
    name: "Luna",
    age: "2 yrs",
    breed: "Golden Retriever",
    distance: "1.2 km away",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=90",
    tags: ["Playful", "Vaccinated", "Friendly"],
  },
  {
    id: "2",
    name: "Mochi",
    age: "1 yr",
    breed: "Shiba Inu",
    distance: "2.5 km away",
    image:
      "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=800&q=90",
    tags: ["Independent", "Trained"],
  },
  {
    id: "3",
    name: "Biscuit",
    age: "3 yrs",
    breed: "Beagle",
    distance: "0.8 km away",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=90",
    tags: ["Energetic", "Loves Walks"],
  },
  {
    id: "4",
    name: "Cleo",
    age: "4 yrs",
    breed: "Maine Coon",
    distance: "3.1 km away",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=90",
    tags: ["Calm", "Indoor"],
  },
  {
    id: "5",
    name: "Atlas",
    age: "2 yrs",
    breed: "Husky",
    distance: "1.9 km away",
    image:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=800&q=90",
    tags: ["Active", "Friendly"],
  },
];

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCount, setLikedCount] = useState(0);

  const likeAnim = useRef(new Animated.Value(1)).current;
  const passAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;

  const currentPet = PETS[currentIndex];
  const nextPet = PETS[currentIndex + 1];

  const springPress = (anim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 60,
        bounciness: 10,
      }),
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 60,
        bounciness: 10,
      }),
    ]).start(() => callback());
  };

  const dismissCard = (onDone: () => void) => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      cardAnim.setValue(1);
      onDone();
    });
  };

  const handleLike = () => {
    springPress(likeAnim, () => {
      dismissCard(() => {
        setLikedCount((c) => c + 1);
        setCurrentIndex((i) => i + 1);
      });
    });
  };

  const handlePass = () => {
    springPress(passAnim, () => {
      dismissCard(() => {
        setCurrentIndex((i) => i + 1);
      });
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Pet Mate</Text>
            <Text style={styles.headerSub}>Find your pet's perfect match</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#18181B" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {currentIndex >= PETS.length ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="paw" size={52} color={AMBER} />
            </View>
            <Text style={styles.emptyTitle}>You&apos;ve seen them all!</Text>
            <Text style={styles.emptySub}>
              Check back soon for more furry matches near you.
            </Text>
          </View>
        ) : (
          <>
            {/* Back card */}
            {nextPet && (
              <View style={[styles.card, styles.cardBehind]}>
                <Image
                  source={{ uri: nextPet.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Front card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardAnim,
                  transform: [{ scale: cardAnim }],
                },
              ]}
            >
              <Image
                source={{ uri: currentPet.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
                style={styles.gradient}
                locations={[0.25, 0.55, 1]}
              />

              <View style={styles.petInfo}>
                {/* Tags */}
                <View style={styles.tagsRow}>
                  {currentPet.tags.map((tag) => (
                    <BlurView
                      key={tag}
                      intensity={18}
                      tint="light"
                      style={styles.tag}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </BlurView>
                  ))}
                </View>

                {/* Name + Age */}
                <View style={styles.petNameRow}>
                  <Text style={styles.petName}>{currentPet.name}</Text>
                  <Text style={styles.petAge}>{currentPet.age}</Text>
                </View>
                <Text style={styles.petBreed}>{currentPet.breed}</Text>

                {/* Location pill */}
                <View style={styles.locationPill}>
                  <Text style={styles.locationText}>
                    📍 {currentPet.distance}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </View>

      {/* Action Buttons */}
      {currentIndex < PETS.length && (
        <View style={styles.actionRow}>
          {/* Pass */}
          <Animated.View style={{ transform: [{ scale: passAnim }] }}>
            <TouchableOpacity
              style={styles.passBtn}
              onPress={handlePass}
              activeOpacity={1}
            >
              <Ionicons name="close" size={30} color="#EF4444" />
            </TouchableOpacity>
          </Animated.View>

          {/* Super Like */}
          <TouchableOpacity style={styles.superBtn} activeOpacity={0.8}>
            <Ionicons name="star" size={19} color={AMBER} />
          </TouchableOpacity>

          {/* Like */}
          <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
            <TouchableOpacity
              style={styles.likeBtn}
              onPress={handleLike}
              activeOpacity={1}
            >
              <MaterialCommunityIcons
                name={"paw" as MCIName}
                size={28}
                color="#FFF"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Match counter */}
      <View style={styles.matchBadgeWrap}>
        <View style={styles.matchBadge}>
          <MaterialCommunityIcons
            name={"paw" as MCIName}
            size={12}
            color={AMBER}
          />
          <Text style={styles.matchBadgeText}>
            {likedCount} paw{likedCount !== 1 ? "s" : ""} today
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },
  safeArea: {
    backgroundColor: "#F8F8FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#18181B",
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: 13,
    color: "#71717A",
    marginTop: 1,
    fontWeight: "500",
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    position: "absolute",
    width: SCREEN_W - 40,
    height: CARD_H,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#E4E4E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
  cardBehind: {
    transform: [{ scale: 0.93 }, { translateY: 20 }],
    opacity: 0.6,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_H * 0.58,
  },
  petInfo: {
    position: "absolute",
    bottom: 28,
    left: 22,
    right: 22,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 14,
  },
  tag: {
    borderRadius: 50,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  tagText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  petNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  petName: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -1,
  },
  petAge: {
    fontSize: 21,
    color: "rgba(255,255,255,0.82)",
    fontWeight: "500",
  },
  petBreed: {
    fontSize: 15,
    color: "rgba(255,255,255,0.72)",
    fontWeight: "500",
    marginTop: 3,
  },
  locationPill: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  locationText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 6 : 14,
  },
  passBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
  },
  superBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: "#FEF3C7",
  },
  likeBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: AMBER,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  matchBadgeWrap: {
    alignItems: "center",
    paddingBottom: 10,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
  },
  matchBadgeText: {
    fontSize: 12,
    color: AMBER_DARK,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  emptyState: {
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18181B",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  emptySub: {
    fontSize: 14,
    color: "#71717A",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
});
