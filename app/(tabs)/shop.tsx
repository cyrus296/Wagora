import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const AMBER = "#F59E0B";
const AMBER_DARK = "#D97706";
const AMBER_LIGHT = "#FEF3C7";
const BG = "#F8F8FA";
const SURFACE = "#FFFFFF";
const TEXT_PRIMARY = "#18181B";
const TEXT_SECONDARY = "#71717A";
const TEXT_MUTED = "#A1A1AA";
const BORDER = "#E4E4E7";
const SCREEN_W = Dimensions.get("window").width;
const CARD_W = Math.floor((SCREEN_W - 52) / 2);

// ─── Icon types ───────────────────────────────────────────────────────────────
type IoniName = React.ComponentProps<typeof Ionicons>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES: { id: string; label: string; icon: IoniName }[] = [
  { id: "all", label: "All", icon: "apps-outline" },
  { id: "food", label: "Food", icon: "nutrition-outline" },
  { id: "toys", label: "Toys", icon: "game-controller-outline" },
  { id: "grooming", label: "Grooming", icon: "cut-outline" },
  { id: "accessories", label: "Accessories", icon: "pricetag-outline" },
  { id: "health", label: "Health", icon: "medkit-outline" },
  { id: "beds", label: "Beds", icon: "bed-outline" },
];

// ─── Products ─────────────────────────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  badge: "Best Seller" | "New" | "Sale" | "Organic" | null;
  category: string;
  tag?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Grain-Free Kibble",
    brand: "Royal Canin",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9a36abb?w=500&q=90",
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    category: "food",
  },
  {
    id: "p2",
    name: "Interactive Snuffle Mat",
    brand: "Kong",
    price: 649,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=90",
    rating: 4.6,
    reviews: 88,
    badge: "New",
    category: "toys",
  },
  {
    id: "p3",
    name: "Organic Flea Collar",
    brand: "Seresto",
    price: 849,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=90",
    rating: 4.9,
    reviews: 540,
    badge: "Organic",
    category: "health",
  },
  {
    id: "p4",
    name: "Slicker Grooming Brush",
    brand: "Furminator",
    price: 449,
    originalPrice: 549,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&q=90",
    rating: 4.7,
    reviews: 204,
    badge: "Sale",
    category: "grooming",
  },
  {
    id: "p5",
    name: "Memory Foam Pet Bed",
    brand: "Pawsome",
    price: 2199,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=90",
    rating: 4.8,
    reviews: 167,
    badge: "Best Seller",
    category: "beds",
  },
  {
    id: "p6",
    name: "Reflective Nylon Harness",
    brand: "Ruffwear",
    price: 1099,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=90",
    rating: 4.5,
    reviews: 99,
    badge: "New",
    category: "accessories",
  },
];

// ─── Boarding Facilities ──────────────────────────────────────────────────────
type Facility = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  pricePerNight: number;
  tags: string[];
  availableSlots: number;
  isPopular: boolean;
  amenities: { icon: IoniName; label: string }[];
};

const FACILITIES: Facility[] = [
  {
    id: "b1",
    name: "Pawsible Resort & Spa",
    tagline: "5-star luxury stay for your furry royalty",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=90",
    rating: 4.9,
    reviews: 238,
    distance: "3.2 km",
    location: "Koregaon Park, Pune",
    pricePerNight: 1200,
    tags: ["Cage-Free", "Pool Access", "24/7 Vet", "AC Rooms"],
    availableSlots: 3,
    isPopular: true,
    amenities: [
      { icon: "water-outline", label: "Pool" },
      { icon: "medical-outline", label: "Vet On-Site" },
      { icon: "leaf-outline", label: "Organic Meals" },
      { icon: "camera-outline", label: "Webcam Access" },
    ],
  },
  {
    id: "b2",
    name: "Happy Tails Boarding",
    tagline: "Home away from home, with extra belly rubs",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=90",
    rating: 4.7,
    reviews: 156,
    distance: "6.0 km",
    location: "Baner, Pune",
    pricePerNight: 799,
    tags: ["Cage-Free", "Daily Walks", "Grooming Included"],
    availableSlots: 7,
    isPopular: false,
    amenities: [
      { icon: "walk-outline" as IoniName, label: "Daily Walks" },
      { icon: "cut-outline", label: "Grooming" },
      { icon: "partly-sunny-outline", label: "Outdoor Play" },
      { icon: "phone-portrait-outline", label: "Daily Updates" },
    ],
  },
  {
    id: "b3",
    name: "Urban Paws Retreat",
    tagline: "Professional care in a calm, spacious environment",
    image:
      "https://images.unsplash.com/photo-1518715308788-3005759c61d3?w=900&q=90",
    rating: 4.6,
    reviews: 94,
    distance: "9.5 km",
    location: "Viman Nagar, Pune",
    pricePerNight: 649,
    tags: ["Vet Checkup on Arrival", "Socialization Play"],
    availableSlots: 12,
    isPopular: false,
    amenities: [
      { icon: "fitness-outline", label: "Agility Yard" },
      { icon: "medkit-outline", label: "Health Check" },
      { icon: "people-outline", label: "Socialization" },
      { icon: "shield-checkmark-outline", label: "Insured" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

function discountPct(price: number, original: number) {
  return Math.round((1 - price / original) * 100);
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Ionicons name="star" size={size} color={AMBER} />
      <Text style={{ fontSize: size, fontWeight: "700", color: TEXT_PRIMARY }}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════════════════════════
function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: string) => void;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(0);
  const addScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const badgeColor =
    product.badge === "New"
      ? "#10B981"
      : product.badge === "Sale"
      ? "#EF4444"
      : product.badge === "Organic"
      ? "#059669"
      : AMBER_DARK;

  const handleAdd = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(addScale, {
        toValue: 0.85,
        useNativeDriver: true,
        speed: 80,
        bounciness: 8,
      }),
      Animated.spring(addScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 80,
      }),
    ]).start();
    setQty((q) => q + 1);
    onAddToCart(product.id);
  }, [addScale, onAddToCart, product.id]);

  const handleWishlist = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 60,
        bounciness: 12,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 60,
      }),
    ]).start();
    setWishlisted((v) => !v);
  }, [heartScale]);

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.92}
      onPress={() => {}}
    >
      {/* Image Zone */}
      <View style={styles.productImageWrap}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Badge */}
        {product.badge && (
          <View style={[styles.productBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.productBadgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Discount pill */}
        {product.originalPrice && (
          <View style={styles.discountPill}>
            <Text style={styles.discountPillText}>
              -{discountPct(product.price, product.originalPrice)}%
            </Text>
          </View>
        )}

        {/* Wishlist */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleWishlist}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={15}
              color={wishlisted ? "#EF4444" : TEXT_SECONDARY}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Info Zone */}
      <View style={styles.productInfo}>
        <Text style={styles.productBrand} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.productRatingRow}>
          <StarRating rating={product.rating} size={11} />
          <Text style={styles.productReviews}>({product.reviews})</Text>
        </View>

        {/* Price row */}
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{formatINR(product.price)}</Text>
          {product.originalPrice && (
            <Text style={styles.productOriginal}>
              {formatINR(product.originalPrice)}
            </Text>
          )}
        </View>

        {/* Add to Cart */}
        <Animated.View style={{ transform: [{ scale: addScale }] }}>
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAdd}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={14} color="#FFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (qty > 1) setQty((q) => q - 1);
                  else {
                    setQty(0);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={qty === 1 ? "trash-outline" : "remove"}
                  size={13}
                  color={qty === 1 ? "#EF4444" : TEXT_PRIMARY}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleAdd}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={13} color={TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOARDING CARD
// ═══════════════════════════════════════════════════════════════════════════════
function BoardingCard({ facility }: { facility: Facility }) {
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleBook = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 80,
        bounciness: 6,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 80,
      }),
    ]).start(() => {
      Alert.alert(
        "Availability Check",
        `Fetching open slots at ${facility.name}…\n\n${facility.availableSlots} slots available this week.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Book Now",
            onPress: () => {},
          },
        ]
      );
    });
  }, [btnScale, facility.name, facility.availableSlots]);

  return (
    <View style={styles.boardingCard}>
      {/* Hero Image */}
      <View style={styles.boardingImageWrap}>
        <Image
          source={{ uri: facility.image }}
          style={styles.boardingImage}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={styles.boardingGradient}
          locations={[0.5, 1]}
        />

        {/* Popular badge */}
        {facility.isPopular && (
          <View style={styles.popularBadge}>
            <MaterialCommunityIcons
              name={"fire" as MCIName}
              size={11}
              color="#FFF"
            />
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
        )}

        {/* Slots indicator */}
        <View
          style={[
            styles.slotsBadge,
            facility.availableSlots <= 3 && styles.slotsBadgeUrgent,
          ]}
        >
          <View
            style={[
              styles.slotsDot,
              { backgroundColor: facility.availableSlots <= 3 ? "#EF4444" : "#10B981" },
            ]}
          />
          <Text style={styles.slotsText}>
            {facility.availableSlots} slot{facility.availableSlots !== 1 ? "s" : ""} left
          </Text>
        </View>

        {/* Price on image */}
        <View style={styles.priceOnImage}>
          <Text style={styles.priceOnImageText}>
            {formatINR(facility.pricePerNight)}
          </Text>
          <Text style={styles.priceOnImageSub}>/night</Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.boardingBody}>
        {/* Header row */}
        <View style={styles.boardingHeaderRow}>
          <View style={styles.boardingTitleWrap}>
            <Text style={styles.boardingName}>{facility.name}</Text>
            <Text style={styles.boardingTagline} numberOfLines={1}>
              {facility.tagline}
            </Text>
          </View>
          <View style={styles.boardingRatingWrap}>
            <StarRating rating={facility.rating} size={13} />
            <Text style={styles.boardingReviews}>{facility.reviews} reviews</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.boardingLocation}>
          <Ionicons name="location-outline" size={13} color={AMBER_DARK} />
          <Text style={styles.boardingLocationText}>
            {facility.distance} away · {facility.location}
          </Text>
        </View>

        {/* Amenities icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.amenitiesScroll}
        >
          {facility.amenities.map((am) => (
            <View key={am.label} style={styles.amenityChip}>
              <Ionicons name={am.icon} size={13} color={AMBER_DARK} />
              <Text style={styles.amenityLabel}>{am.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Feature tags */}
        <View style={styles.tagsRow}>
          {facility.tags.map((tag) => (
            <View key={tag} style={styles.featureTag}>
              <Ionicons
                name="checkmark-circle-outline"
                size={11}
                color="#10B981"
              />
              <Text style={styles.featureTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.boardingDivider} />

        {/* Action row */}
        <View style={styles.boardingActionRow}>
          <TouchableOpacity style={styles.boardingSecondaryBtn} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={15} color={TEXT_SECONDARY} />
            <Text style={styles.boardingSecondaryBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boardingSecondaryBtn} activeOpacity={0.7}>
            <Ionicons name="map-outline" size={15} color={TEXT_SECONDARY} />
            <Text style={styles.boardingSecondaryBtnText}>Directions</Text>
          </TouchableOpacity>

          <Animated.View style={[{ flex: 1 }, { transform: [{ scale: btnScale }] }]}>
            <TouchableOpacity
              style={styles.boardingCTA}
              onPress={handleBook}
              activeOpacity={0.88}
            >
              <Text style={styles.boardingCTAText}>Check Availability</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ESSENTIALS VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function EssentialsView({
  cartCount,
  onAddToCart,
}: {
  cartCount: number;
  onAddToCart: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={TEXT_MUTED} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands…"
            placeholderTextColor={TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={TEXT_MUTED} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterIconBtn} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, active && styles.catChipActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={cat.icon}
                size={13}
                color={active ? "#FFF" : TEXT_SECONDARY}
              />
              <Text
                style={[styles.catChipText, active && styles.catChipTextActive]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Promo Banner */}
      <TouchableOpacity
        style={styles.bannerWrap}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["#1C1917", "#292524"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          {/* Background paw */}
          <View style={styles.bannerBgPaw}>
            <MaterialCommunityIcons
              name={"paw" as MCIName}
              size={130}
              color="rgba(255,255,255,0.04)"
            />
          </View>

          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Ionicons name="flash" size={10} color="#18181B" />
              <Text style={styles.bannerBadgeText}>Flash Sale · 6h left</Text>
            </View>
            <Text style={styles.bannerTitle}>20% Off{"\n"}All Pet Food</Text>
            <Text style={styles.bannerSub}>Use code WAGORA20 at checkout</Text>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.8}>
              <Text style={styles.bannerBtnText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={13} color="#18181B" />
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&q=90",
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {activeCategory === "all"
              ? "Featured Products"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </Text>
          <Text style={styles.sectionSub}>{filtered.length} items</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <View style={styles.productsGrid}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={44} color="#D4D4D8" />
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySub}>
            Try a different category or search term
          </Text>
        </View>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOARDING VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function BoardingView() {
  const [dateFilter, setDateFilter] = useState("this-week");

  const DATE_FILTERS = [
    { id: "this-week", label: "This Week" },
    { id: "next-week", label: "Next Week" },
    { id: "this-month", label: "This Month" },
  ];

  return (
    <>
      {/* Sub-header */}
      <View style={styles.boardingHero}>
        <Text style={styles.boardingHeroTitle}>
          Find Premium Boarding 🐾
        </Text>
        <Text style={styles.boardingHeroSub}>
          Cage-free, vet-monitored facilities near you
        </Text>

        {/* Date filter */}
        <View style={styles.dateFilterRow}>
          {DATE_FILTERS.map((df) => {
            const active = dateFilter === df.id;
            return (
              <TouchableOpacity
                key={df.id}
                style={[styles.dateChip, active && styles.dateChipActive]}
                onPress={() => setDateFilter(df.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dateChipText, active && styles.dateChipTextActive]}
                >
                  {df.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sort & Filter bar */}
      <View style={styles.sortBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScroll}
        >
          {[
            { id: "rating", label: "Top Rated", icon: "star-outline" as IoniName },
            { id: "distance", label: "Nearest", icon: "navigate-outline" as IoniName },
            { id: "price", label: "Price: Low", icon: "trending-up-outline" as IoniName },
            { id: "avail", label: "Available Now", icon: "checkmark-circle-outline" as IoniName },
          ].map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sortChip, i === 0 && styles.sortChipActive]}
              activeOpacity={0.75}
            >
              <Ionicons
                name={s.icon}
                size={12}
                color={i === 0 ? AMBER_DARK : TEXT_SECONDARY}
              />
              <Text
                style={[styles.sortChipText, i === 0 && styles.sortChipTextActive]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.mapViewBtn} activeOpacity={0.7}>
          <Ionicons name="map-outline" size={15} color={TEXT_PRIMARY} />
          <Text style={styles.mapViewText}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Facility Cards */}
      <View style={styles.facilitiesContainer}>
        {FACILITIES.map((facility) => (
          <BoardingCard key={facility.id} facility={facility} />
        ))}
      </View>

      {/* Trust banner */}
      <View style={styles.trustBanner}>
        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons name="shield-checkmark-outline" size={20} color={AMBER} />
          </View>
          <Text style={styles.trustLabel}>Verified Facilities</Text>
        </View>
        <View style={styles.trustDivider} />
        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons name="medical-outline" size={20} color={AMBER} />
          </View>
          <Text style={styles.trustLabel}>Vet Partnerships</Text>
        </View>
        <View style={styles.trustDivider} />
        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons name="refresh-outline" size={20} color={AMBER} />
          </View>
          <Text style={styles.trustLabel}>Free Cancellation</Text>
        </View>
      </View>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState<"essentials" | "boarding">(
    "essentials"
  );
  const [cartItems, setCartItems] = useState<string[]>([]);
  const cartBadgeScale = useRef(new Animated.Value(1)).current;
  const segmentAnim = useRef(new Animated.Value(0)).current;

  const handleAddToCart = useCallback(
    (id: string) => {
      setCartItems((prev) => [...prev, id]);
      Animated.sequence([
        Animated.spring(cartBadgeScale, {
          toValue: 1.4,
          useNativeDriver: true,
          speed: 80,
          bounciness: 14,
        }),
        Animated.spring(cartBadgeScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 80,
        }),
      ]).start();
    },
    [cartBadgeScale]
  );

  const switchTab = useCallback(
    (tab: "essentials" | "boarding") => {
      Haptics.selectionAsync();
      setActiveTab(tab);
      Animated.spring(segmentAnim, {
        toValue: tab === "essentials" ? 0 : 1,
        useNativeDriver: false,
        speed: 18,
        bounciness: 4,
      }).start();
    },
    [segmentAnim]
  );

  const segmentTranslate = segmentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (SCREEN_W - 40) / 2 - 4],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shop & Services</Text>
          <Text style={styles.headerSub}>Curated for Bruno & you</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Ionicons name="person-circle-outline" size={22} color={TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Segmented Control ─────────────────────────────── */}
      <View style={styles.segmentWrap}>
        {/* Animated sliding pill */}
        <Animated.View
          style={[
            styles.segmentPill,
            { transform: [{ translateX: segmentTranslate }] },
          ]}
        />

        <TouchableOpacity
          style={styles.segmentBtn}
          onPress={() => switchTab("essentials")}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={"shopping" as MCIName}
            size={15}
            color={activeTab === "essentials" ? TEXT_PRIMARY : TEXT_MUTED}
          />
          <Text
            style={[
              styles.segmentLabel,
              activeTab === "essentials" && styles.segmentLabelActive,
            ]}
          >
            Essentials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segmentBtn}
          onPress={() => switchTab("boarding")}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={"home-heart" as MCIName}
            size={15}
            color={activeTab === "boarding" ? TEXT_PRIMARY : TEXT_MUTED}
          />
          <Text
            style={[
              styles.segmentLabel,
              activeTab === "boarding" && styles.segmentLabelActive,
            ]}
          >
            Boarding
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Content ────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "essentials" ? (
          <EssentialsView
            cartCount={cartItems.length}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <BoardingView />
        )}

        <View style={{ height: 96 }} />
      </ScrollView>

      {/* ── Floating Cart FAB ─────────────────────────────── */}
      {activeTab === "essentials" && (
        <TouchableOpacity
          style={styles.cartFAB}
          activeOpacity={0.88}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
              "Your Cart 🛍️",
              cartItems.length === 0
                ? "Your cart is empty. Start adding some treats!"
                : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart.`,
              [{ text: "OK" }]
            );
          }}
        >
          <View style={styles.cartFABInner}>
            <Ionicons name="bag-outline" size={24} color="#FFF" />
            {cartItems.length > 0 && (
              <Animated.View
                style={[
                  styles.cartFABBadge,
                  { transform: [{ scale: cartBadgeScale }] },
                ]}
              >
                <Text style={styles.cartFABBadgeText}>
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </Text>
              </Animated.View>
            )}
          </View>
          <Text style={styles.cartFABLabel}>
            {cartItems.length === 0
              ? "Cart"
              : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 12 },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12.5,
    color: TEXT_SECONDARY,
    fontWeight: "500",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SURFACE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Segmented Control ────────────────────────────────────
  segmentWrap: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#EDEDF0",
    borderRadius: 16,
    padding: 4,
    position: "relative",
    height: 48,
  },
  segmentPill: {
    position: "absolute",
    top: 4,
    left: 4,
    width: (SCREEN_W - 40) / 2 - 4,
    height: 40,
    backgroundColor: SURFACE,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    zIndex: 1,
  },
  segmentLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: TEXT_MUTED,
    letterSpacing: 0.1,
  },
  segmentLabelActive: {
    color: TEXT_PRIMARY,
  },

  // ── Search ───────────────────────────────────────────────
  searchWrap: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: "500",
    padding: 0,
  },
  filterIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: SURFACE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  // ── Categories ───────────────────────────────────────────
  categoriesScroll: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  catChipActive: {
    backgroundColor: TEXT_PRIMARY,
    borderColor: TEXT_PRIMARY,
  },
  catChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  catChipTextActive: { color: "#FFF" },

  // ── Promo Banner ─────────────────────────────────────────
  bannerWrap: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  banner: {
    flexDirection: "row",
    minHeight: 152,
    overflow: "hidden",
    borderRadius: 22,
    position: "relative",
  },
  bannerBgPaw: {
    position: "absolute",
    right: 110,
    top: -10,
    zIndex: 0,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 6,
    zIndex: 1,
  },
  bannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: AMBER,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 2,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#18181B",
    letterSpacing: 0.2,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: AMBER,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    marginTop: 4,
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#18181B",
  },
  bannerImage: {
    width: 110,
    height: "100%",
    opacity: 0.75,
  },

  // ── Section Header ───────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 11.5,
    color: TEXT_MUTED,
    fontWeight: "500",
    marginTop: 1,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: AMBER_DARK,
  },

  // ── Products Grid ────────────────────────────────────────
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
  productCard: {
    width: CARD_W,
    backgroundColor: SURFACE,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  productImageWrap: {
    position: "relative",
    height: CARD_W,
    backgroundColor: "#F4F4F5",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 50,
  },
  productBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  discountPill: {
    position: "absolute",
    bottom: 9,
    left: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 50,
  },
  discountPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFF",
  },
  wishlistBtn: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    padding: 12,
    gap: 3,
  },
  productBrand: {
    fontSize: 9.5,
    color: TEXT_MUTED,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  productName: {
    fontSize: 12.5,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    lineHeight: 17,
  },
  productRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  productReviews: {
    fontSize: 10.5,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  productOriginal: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },

  // Add to cart / Qty
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: AMBER,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFF",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F4F5",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  qtyBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    minWidth: 20,
    textAlign: "center",
  },

  // ── Empty State ──────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  emptySub: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    fontWeight: "500",
  },

  // ── Boarding Hero ────────────────────────────────────────
  boardingHero: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  boardingHeroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  boardingHeroSub: {
    fontSize: 13.5,
    color: TEXT_SECONDARY,
    fontWeight: "500",
    marginBottom: 14,
  },
  dateFilterRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  dateChipActive: {
    backgroundColor: AMBER_LIGHT,
    borderColor: AMBER,
  },
  dateChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  dateChipTextActive: {
    color: AMBER_DARK,
  },

  // ── Sort Bar ─────────────────────────────────────────────
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 16,
  },
  sortScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sortChipActive: {
    backgroundColor: AMBER_LIGHT,
    borderColor: AMBER,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  sortChipTextActive: {
    color: AMBER_DARK,
  },
  mapViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: TEXT_PRIMARY,
    marginLeft: 4,
  },
  mapViewText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFF",
  },

  // ── Facilities ───────────────────────────────────────────
  facilitiesContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  boardingCard: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 6,
  },
  boardingImageWrap: {
    height: 200,
    position: "relative",
  },
  boardingImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E4E4E7",
  },
  boardingGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  popularBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EF4444",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.2,
  },
  slotsBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  slotsBadgeUrgent: {
    backgroundColor: "#FFF1F2",
  },
  slotsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slotsText: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  priceOnImage: {
    position: "absolute",
    bottom: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  priceOnImageText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  priceOnImageSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },

  boardingBody: {
    padding: 18,
    gap: 10,
  },
  boardingHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  boardingTitleWrap: { flex: 1 },
  boardingName: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  boardingTagline: {
    fontSize: 12.5,
    color: TEXT_SECONDARY,
    fontWeight: "500",
    marginTop: 2,
  },
  boardingRatingWrap: {
    alignItems: "flex-end",
    gap: 2,
  },
  boardingReviews: {
    fontSize: 10.5,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  boardingLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  boardingLocationText: {
    fontSize: 12.5,
    color: TEXT_SECONDARY,
    fontWeight: "600",
  },

  // Amenities
  amenitiesScroll: {
    gap: 6,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: AMBER_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.25)",
  },
  amenityLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: AMBER_DARK,
  },

  // Feature tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  featureTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },

  boardingDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 2,
  },

  // Boarding Actions
  boardingActionRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  boardingSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: BORDER,
  },
  boardingSecondaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_SECONDARY,
  },
  boardingCTA: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: AMBER,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 6,
  },
  boardingCTAText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.1,
  },

  // Trust Banner
  trustBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  trustItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  trustIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AMBER_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  trustDivider: {
    width: 1,
    height: 40,
    backgroundColor: BORDER,
  },

  // ── Floating Cart FAB ────────────────────────────────────
  cartFAB: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 20,
    right: 20,
    backgroundColor: TEXT_PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 14,
  },
  cartFABInner: {
    position: "relative",
  },
  cartFABBadge: {
    position: "absolute",
    top: -7,
    right: -9,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: AMBER,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: TEXT_PRIMARY,
  },
  cartFABBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFF",
  },
  cartFABLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.1,
  },
});
