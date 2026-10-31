import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const AMBER = "#F59E0B";
const AMBER_DARK = "#D97706";
const AMBER_LIGHT = "#FEF3C7";
const BG = "#F8F8FA";
const SURFACE = "#FFFFFF";
const TEXT_PRIMARY = "#18181B";
const TEXT_SECONDARY = "#71717A";
const BORDER = "#F4F4F5";
const SCREEN_W = Dimensions.get("window").width;

// ─── Types ────────────────────────────────────────────────────────────────────
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type IoniName = React.ComponentProps<typeof Ionicons>["name"];

type Story = {
  id: string;
  name: string;
  avatar: string;
  isOwn: boolean;
  unseen?: boolean;
};

type Post = {
  id: string;
  ownerName: string;
  ownerHandle: string;
  ownerAvatar: string;
  petName: string;
  timeAgo: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  location: string;
  isAdoption?: boolean;
  tags?: string[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STORIES: Story[] = [
  {
    id: "0",
    name: "Your Story",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=160&q=90",
    isOwn: true,
  },
  {
    id: "1",
    name: "Luna",
    avatar:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=160&q=90",
    isOwn: false,
    unseen: true,
  },
  {
    id: "2",
    name: "Mochi",
    avatar:
      "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=160&q=90",
    isOwn: false,
    unseen: true,
  },
  {
    id: "3",
    name: "Biscuit",
    avatar:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=160&q=90",
    isOwn: false,
    unseen: false,
  },
  {
    id: "4",
    name: "Cleo",
    avatar:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=160&q=90",
    isOwn: false,
    unseen: true,
  },
  {
    id: "5",
    name: "Atlas",
    avatar:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=160&q=90",
    isOwn: false,
    unseen: false,
  },
];

const FEED_FILTERS = [
  { id: "following", label: "Following", icon: "people-outline" as IoniName },
  { id: "trending", label: "Trending", icon: "flame-outline" as IoniName },
  { id: "adoption", label: "Adoption Needs", icon: "heart-outline" as IoniName },
  { id: "training", label: "Training Tips", icon: "ribbon-outline" as IoniName },
  { id: "local", label: "Near Me", icon: "location-outline" as IoniName },
];

const POSTS: Post[] = [
  {
    id: "1",
    ownerName: "Priya Sharma",
    ownerHandle: "@priya.pawmom",
    ownerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=90",
    petName: "Luna",
    timeAgo: "2h",
    caption:
      "Golden hour walks with my best girl 🌅✨ She found this field all by herself and just ran — pure joy. These are the moments that make everything worth it. #GoldenRetriever #DogMom #WagoraCommunity",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=90",
    likes: 142,
    comments: 18,
    shares: 6,
    location: "Pune, India",
    tags: ["GoldenRetriever", "DogMom"],
  },
  {
    id: "2",
    ownerName: "Happy Paws Shelter",
    ownerHandle: "@happypaws.in",
    ownerAvatar:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=160&q=90",
    petName: "Biscuit",
    timeAgo: "4h",
    caption:
      "Meet Biscuit 🍪 — 3-year-old Beagle, fully vaccinated, house-trained, and an absolute sweetheart. He loves cuddles and long walks. Looking for a loving forever home in Pune or Mumbai. DM us to adopt!",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=900&q=90",
    likes: 234,
    comments: 41,
    shares: 88,
    location: "Pune Shelter, India",
    isAdoption: true,
    tags: ["AdoptDontShop", "Beagle"],
  },
  {
    id: "3",
    ownerName: "Rahul Mehta",
    ownerHandle: "@rahul.shibaguy",
    ownerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=90",
    petName: "Mochi",
    timeAgo: "5h",
    caption:
      "Mochi discovered what a garden is today 🌿🐾 Can't stop laughing at this derpy face — he sniffed every single flower at least twice. Training tip: use garden time as enrichment! Keeps them mentally sharp 🧠",
    image:
      "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=900&q=90",
    likes: 89,
    comments: 7,
    shares: 3,
    location: "Mumbai, India",
    tags: ["ShibaInu", "TrainingTips"],
  },
  {
    id: "4",
    ownerName: "Sneha Kulkarni",
    ownerHandle: "@sneha.catmom",
    ownerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=90",
    petName: "Cleo",
    timeAgo: "8h",
    caption:
      "Royalty does not need to explain itself 👑 Cleo has claimed the entire sofa as her territory and I am NOT complaining. Maine Coon owners — you understand! 🐱",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=90",
    likes: 307,
    comments: 52,
    shares: 14,
    location: "Bangalore, India",
    tags: ["MaineCoon", "CatLife"],
  },
];

// ─── Story Bubble ─────────────────────────────────────────────────────────────
function StoryBubble({ story }: { story: Story }) {
  const ringStyle = story.isOwn
    ? styles.storyRingOwn
    : story.unseen
    ? styles.storyRingUnseen
    : styles.storyRingSeen;

  return (
    <TouchableOpacity style={styles.storyWrap} activeOpacity={0.75}>
      <View style={[styles.storyRingBase, ringStyle]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
        {story.isOwn && (
          <View style={styles.addStoryBtn}>
            <Ionicons name="add" size={11} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {story.name}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const likeScale = React.useRef(new Animated.Value(1)).current;

  const handleLike = useCallback(() => {
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.35,
        useNativeDriver: true,
        speed: 60,
        bounciness: 14,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 60,
      }),
    ]).start();
    setLiked((v) => !v);
  }, [likeScale]);

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <View style={styles.postCard}>
      {/* Adoption Banner */}
      {post.isAdoption && (
        <View style={styles.adoptionBanner}>
          <Ionicons name="heart" size={13} color="#EF4444" />
          <Text style={styles.adoptionBannerText}>Adoption Listing</Text>
          <View style={styles.adoptionBannerSpacer} />
          <TouchableOpacity style={styles.adoptionCTA} activeOpacity={0.8}>
            <Text style={styles.adoptionCTAText}>Inquire →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postAvatarWrap}>
          <Image source={{ uri: post.ownerAvatar }} style={styles.postAvatar} />
          {post.isAdoption && <View style={styles.shelterBadgeDot} />}
        </View>

        <View style={styles.postHeaderText}>
          <View style={styles.postOwnerRow}>
            <Text style={styles.postOwner}>{post.ownerName}</Text>
            {post.isAdoption && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={11} color={AMBER} />
              </View>
            )}
          </View>
          <Text style={styles.postMeta}>
            with <Text style={styles.postPetName}>{post.petName}</Text>
            {"  ·  "}
            <Text style={styles.postHandle}>{post.ownerHandle}</Text>
          </Text>
          <View style={styles.postTimeRow}>
            <Ionicons name="time-outline" size={10} color="#A1A1AA" />
            <Text style={styles.postTime}>{post.timeAgo} ago</Text>
            {"  "}
            <Ionicons name="location-outline" size={10} color="#A1A1AA" />
            <Text style={styles.postTime}>{post.location}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.postMenuBtn} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#A1A1AA" />
        </TouchableOpacity>
      </View>

      {/* Caption (above image, Twitter-style) */}
      <Text style={styles.postCaption} numberOfLines={3}>
        {post.caption}
      </Text>

      {/* Post Image */}
      <View style={styles.postImageWrap}>
        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
        {/* Image overlay gradient hint */}
      </View>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScroll}
        >
          {post.tags.map((tag) => (
            <TouchableOpacity key={tag} style={styles.tagPill} activeOpacity={0.7}>
              <Text style={styles.tagPillText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statAvatarStack}>
            <View style={[styles.statAvatarDot, { backgroundColor: "#EF4444" }]} />
            <View style={[styles.statAvatarDot, { backgroundColor: AMBER, marginLeft: -4 }]} />
            <View style={[styles.statAvatarDot, { backgroundColor: "#6366F1", marginLeft: -4 }]} />
          </View>
          <Text style={styles.statText}>
            {formatCount(post.likes + (liked ? 1 : 0))} likes
          </Text>
        </View>
        <Text style={styles.statDivider}>·</Text>
        <Text style={styles.statText}>{post.comments} comments</Text>
        <Text style={styles.statDivider}>·</Text>
        <Text style={styles.statText}>{post.shares} shares</Text>
      </View>

      {/* Divider */}
      <View style={styles.actionDivider} />

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {/* Like */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#EF4444" : TEXT_SECONDARY}
            />
          </Animated.View>
          <Text style={[styles.actionLabel, liked && { color: "#EF4444" }]}>
            {liked ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={21} color={TEXT_SECONDARY} />
          <Text style={styles.actionLabel}>Comment</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-redo-outline" size={21} color={TEXT_SECONDARY} />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Bookmark */}
        <TouchableOpacity
          style={styles.actionBtnSingle}
          onPress={() => setBookmarked((v) => !v)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={21}
            color={bookmarked ? AMBER : TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const [activeFilter, setActiveFilter] = useState("following");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* ── Top Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Wagora Wordmark */}
          <View style={styles.logoWrap}>
            <MaterialCommunityIcons
              name={"paw" as MCIName}
              size={20}
              color={AMBER}
            />
            <Text style={styles.logoText}>wagora</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Search */}
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={21} color={TEXT_PRIMARY} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={TEXT_PRIMARY}
            />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

          {/* New Post CTA */}
          <TouchableOpacity
            style={styles.newPostBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/create")}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.newPostText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Feed Body ──────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        scrollEventThrottle={16}
      >
        {/* Stories Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {STORIES.map((story) => (
            <StoryBubble key={story.id} story={story} />
          ))}
        </ScrollView>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FEED_FILTERS.map((f) => {
            const active = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(f.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={f.icon}
                  size={13}
                  color={active ? SURFACE : TEXT_SECONDARY}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            {FEED_FILTERS.find((f) => f.id === activeFilter)?.label ?? "Feed"}
          </Text>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlinePillText}>124 online</Text>
          </View>
        </View>

        {/* Posts */}
        <View style={styles.feed}>
          {POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        {/* Load More hint */}
        <TouchableOpacity style={styles.loadMore} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={16} color={AMBER_DARK} />
          <Text style={styles.loadMoreText}>Load more posts</Text>
        </TouchableOpacity>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 16 },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: BG,
  },
  headerLeft: {},
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: BG,
  },
  newPostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: AMBER,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newPostText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.1,
  },

  // ── Stories ──────────────────────────────────────────────
  storiesScroll: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 14,
  },
  storyWrap: {
    alignItems: "center",
    gap: 6,
    width: 64,
  },
  storyRingBase: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  storyRingUnseen: {
    borderWidth: 2.5,
    borderColor: AMBER,
    padding: 2,
  },
  storyRingSeen: {
    borderWidth: 2,
    borderColor: "#D4D4D8",
    padding: 2,
  },
  storyRingOwn: {
    borderWidth: 2,
    borderColor: "#D4D4D8",
    borderStyle: "dashed",
    padding: 2,
  },
  storyAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E4E4E7",
  },
  addStoryBtn: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AMBER,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: BG,
  },
  storyName: {
    fontSize: 10.5,
    color: "#52525B",
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Filters ──────────────────────────────────────────────
  filtersScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: TEXT_PRIMARY,
    borderColor: TEXT_PRIMARY,
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  filterChipTextActive: {
    color: SURFACE,
  },

  // ── Section Header ───────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  onlinePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },

  // ── Feed ─────────────────────────────────────────────────
  feed: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // ── Post Card ────────────────────────────────────────────
  postCard: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },

  // Adoption Banner
  adoptionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE4E6",
  },
  adoptionBannerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#BE123C",
  },
  adoptionBannerSpacer: { flex: 1 },
  adoptionCTA: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  adoptionCTAText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFF",
  },

  // Post Header
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    paddingBottom: 10,
    gap: 10,
  },
  postAvatarWrap: {
    position: "relative",
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E4E4E7",
  },
  shelterBadgeDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: SURFACE,
  },
  postHeaderText: { flex: 1, gap: 1 },
  postOwnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  postOwner: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AMBER_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  postMeta: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },
  postPetName: {
    fontWeight: "700",
    color: AMBER_DARK,
  },
  postHandle: {
    color: "#A1A1AA",
  },
  postTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  postTime: {
    fontSize: 10.5,
    color: "#A1A1AA",
    fontWeight: "500",
  },
  postMenuBtn: {
    padding: 4,
    marginTop: 2,
  },

  // Post Caption
  postCaption: {
    fontSize: 14,
    color: "#3F3F46",
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingBottom: 12,
    fontWeight: "400",
  },

  // Post Image
  postImageWrap: {
    marginHorizontal: 14,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 2,
  },
  postImage: {
    width: "100%",
    height: SCREEN_W - 60,
    backgroundColor: "#E4E4E7",
  },

  // Tags
  tagsScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  tagPill: {
    backgroundColor: AMBER_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  tagPillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: AMBER_DARK,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 6,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statAvatarStack: {
    flexDirection: "row",
  },
  statAvatarDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: SURFACE,
  },
  statText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },
  statDivider: {
    color: "#D4D4D8",
    fontSize: 12,
  },

  // Action Bar
  actionDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 14,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12.5,
    color: TEXT_SECONDARY,
    fontWeight: "600",
  },
  actionBtnSingle: {
    padding: 8,
    paddingHorizontal: 12,
  },

  // Load More
  loadMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
    paddingVertical: 12,
    marginHorizontal: 40,
    borderRadius: 50,
    backgroundColor: AMBER_LIGHT,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: AMBER_DARK,
  },
});
