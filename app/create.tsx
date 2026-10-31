import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type IoniName = React.ComponentProps<typeof Ionicons>["name"];

// ─── Mock current user ────────────────────────────────────────────────────────
const CURRENT_USER = {
  name: "Nilesh M.",
  handle: "@nilesh.wagora",
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=160&q=90",
  petName: "Bruno",
};

// ─── Pet Tag Selector ─────────────────────────────────────────────────────────
const PETS = [
  { id: "bruno", name: "Bruno", breed: "French Bulldog", emoji: "🐶" },
  { id: "new", name: "Another Pet", breed: "Add new", emoji: "➕" },
];

// ─── Media Type Options ───────────────────────────────────────────────────────
const MEDIA_TYPES: { id: string; label: string; icon: IoniName }[] = [
  { id: "photo", label: "Photo", icon: "image-outline" },
  { id: "video", label: "Video", icon: "videocam-outline" },
  { id: "reel", label: "Reel", icon: "play-circle-outline" },
];

// ─── Tag Categories ───────────────────────────────────────────────────────────
const QUICK_TAGS = [
  "#DogMom",
  "#PetLife",
  "#AdoptDontShop",
  "#CatPerson",
  "#TrainingTips",
  "#Wagora",
];

// ─── Visibility Options ───────────────────────────────────────────────────────
const VISIBILITY: { id: string; label: string; icon: IoniName; desc: string }[] = [
  { id: "public", label: "Everyone", icon: "earth-outline", desc: "Visible to all Wagora users" },
  { id: "followers", label: "Followers", icon: "people-outline", desc: "Only your followers" },
  { id: "private", label: "Only Me", icon: "lock-closed-outline", desc: "Private draft" },
];

// ─── Character limit ──────────────────────────────────────────────────────────
const MAX_CAPTION = 280;

export default function CreatePostScreen() {
  // State
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedPet, setSelectedPet] = useState("bruno");
  const [mediaType, setMediaType] = useState("photo");
  const [isAdoption, setIsAdoption] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const uploadPressAnim = useRef(new Animated.Value(1)).current;
  const shareAnim = useRef(new Animated.Value(1)).current;

  const charCount = caption.length;
  const charRemaining = MAX_CAPTION - charCount;
  const isOverLimit = charCount > MAX_CAPTION;
  const canPost = mediaUri !== null && caption.trim().length > 0 && !isOverLimit;

  // ── Handlers ────────────────────────────────────────────
  const pickImage = useCallback(async () => {
    Animated.sequence([
      Animated.spring(uploadPressAnim, { toValue: 0.95, useNativeDriver: true, speed: 60 }),
      Animated.spring(uploadPressAnim, { toValue: 1, useNativeDriver: true, speed: 60 }),
    ]).start();

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Wagora needs access to your photo library to upload pet photos.",
        [{ text: "OK" }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
    }
  }, [uploadPressAnim]);

  const removeImage = useCallback(() => {
    Alert.alert("Remove photo?", "This will clear your selected photo.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setMediaUri(null) },
    ]);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleShare = useCallback(() => {
    if (!canPost) return;
    Animated.sequence([
      Animated.spring(shareAnim, { toValue: 0.93, useNativeDriver: true, speed: 80 }),
      Animated.spring(shareAnim, { toValue: 1, useNativeDriver: true, speed: 80 }),
    ]).start(() => {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          "Posted! 🎉",
          "Your post is now live on the Wagora community feed.",
          [{ text: "Done", onPress: () => router.back() }]
        );
      }, 1200);
    });
  }, [canPost, shareAnim]);

  // ── Render ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* ── Top Nav ─────────────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={TEXT_PRIMARY} />
        </TouchableOpacity>

        <View style={styles.navTitle}>
          <MaterialCommunityIcons name={"paw" as MCIName} size={16} color={AMBER} />
          <Text style={styles.navTitleText}>New Post</Text>
        </View>

        {/* Draft save */}
        <TouchableOpacity style={styles.draftBtn} activeOpacity={0.7}>
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Author Row ──────────────────────────────── */}
          <View style={styles.authorRow}>
            <Image
              source={{ uri: CURRENT_USER.avatar }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{CURRENT_USER.name}</Text>
              <Text style={styles.authorHandle}>{CURRENT_USER.handle}</Text>
            </View>
          </View>

          {/* ── Caption Input ───────────────────────────── */}
          <View style={styles.captionWrap}>
            <TextInput
              style={styles.captionInput}
              placeholder="What is your pet up to? Share a moment… 🐾"
              placeholderTextColor={TEXT_MUTED}
              multiline
              maxLength={MAX_CAPTION + 20}
              value={caption}
              onChangeText={setCaption}
              textAlignVertical="top"
              returnKeyType="default"
              autoCorrect
            />

            {/* Character count */}
            <View style={styles.charCountRow}>
              <View
                style={[
                  styles.charCountBar,
                  {
                    width: `${Math.min((charCount / MAX_CAPTION) * 100, 100)}%`,
                    backgroundColor: isOverLimit
                      ? "#EF4444"
                      : charRemaining < 40
                      ? AMBER
                      : "#10B981",
                  },
                ]}
              />
              <Text
                style={[
                  styles.charCountText,
                  isOverLimit && { color: "#EF4444" },
                ]}
              >
                {charRemaining}
              </Text>
            </View>
          </View>

          {/* ── Quick Tags ──────────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Add Tags</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScroll}
            >
              {QUICK_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, active && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[styles.tagChipText, active && styles.tagChipTextActive]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Media Section ───────────────────────────── */}
          <View style={styles.sectionCard}>
            {/* Media type toggle */}
            <View style={styles.mediaTypeRow}>
              {MEDIA_TYPES.map((mt) => {
                const active = mediaType === mt.id;
                return (
                  <TouchableOpacity
                    key={mt.id}
                    style={[styles.mediaTypeChip, active && styles.mediaTypeChipActive]}
                    onPress={() => setMediaType(mt.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={mt.icon}
                      size={14}
                      color={active ? "#FFF" : TEXT_SECONDARY}
                    />
                    <Text
                      style={[
                        styles.mediaTypeText,
                        active && styles.mediaTypeTextActive,
                      ]}
                    >
                      {mt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Upload Zone */}
            {mediaUri ? (
              // Preview
              <View style={styles.previewWrap}>
                <Image
                  source={{ uri: mediaUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={removeImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={pickImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera-outline" size={16} color="#FFF" />
                  <Text style={styles.changeImageText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Upload prompt
              <Animated.View style={{ transform: [{ scale: uploadPressAnim }] }}>
                <TouchableOpacity
                  style={styles.uploadZone}
                  onPress={pickImage}
                  activeOpacity={0.85}
                >
                  <View style={styles.uploadIconWrap}>
                    <Ionicons name="cloud-upload-outline" size={34} color={AMBER} />
                  </View>
                  <Text style={styles.uploadTitle}>Upload a Photo</Text>
                  <Text style={styles.uploadSub}>
                    Tap to choose from your library{"\n"}JPG, PNG · Up to 10 MB
                  </Text>
                  <View style={styles.uploadCTABtn}>
                    <Ionicons name="images-outline" size={15} color={AMBER_DARK} />
                    <Text style={styles.uploadCTAText}>Browse Library</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* ── Pet Tag ─────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Tag Your Pet</Text>
            <View style={styles.petList}>
              {PETS.map((pet) => {
                const selected = selectedPet === pet.id;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petItem, selected && styles.petItemSelected]}
                    onPress={() => setSelectedPet(pet.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.petEmoji}>{pet.emoji}</Text>
                    <View style={styles.petItemInfo}>
                      <Text
                        style={[styles.petItemName, selected && { color: AMBER_DARK }]}
                      >
                        {pet.name}
                      </Text>
                      <Text style={styles.petItemBreed}>{pet.breed}</Text>
                    </View>
                    {selected && (
                      <View style={styles.petCheckWrap}>
                        <Ionicons name="checkmark-circle" size={20} color={AMBER} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Location ────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Location</Text>
            <View style={styles.locationInputWrap}>
              <Ionicons name="location-outline" size={18} color={AMBER_DARK} />
              <TextInput
                style={styles.locationInput}
                placeholder="Add location (optional)"
                placeholderTextColor={TEXT_MUTED}
                value={location}
                onChangeText={setLocation}
                returnKeyType="done"
              />
              {location.length > 0 && (
                <TouchableOpacity onPress={() => setLocation("")} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Settings Card ───────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Settings</Text>

            {/* Adoption Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: "#FFF1F2" }]}>
                  <Ionicons name="heart-outline" size={17} color="#EF4444" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Post as Adoption Listing</Text>
                  <Text style={styles.settingDesc}>
                    Marks this post for the Adoption portal. Shelters &amp; rescues only.
                  </Text>
                </View>
              </View>
              <Switch
                value={isAdoption}
                onValueChange={setIsAdoption}
                trackColor={{ false: "#E4E4E7", true: "#FCA5A5" }}
                thumbColor={isAdoption ? "#EF4444" : "#FFFFFF"}
                ios_backgroundColor="#E4E4E7"
              />
            </View>

            {isAdoption && (
              <View style={styles.adoptionInfoBanner}>
                <Ionicons name="information-circle-outline" size={16} color="#BE123C" />
                <Text style={styles.adoptionInfoText}>
                  Adoption listings are reviewed within 24 hours and displayed in the Adoption section with a dedicated badge.
                </Text>
              </View>
            )}

            <View style={styles.sectionDivider} />

            {/* Visibility Selector */}
            <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Audience</Text>
            {VISIBILITY.map((vis, i) => {
              const selected = visibility === vis.id;
              return (
                <React.Fragment key={vis.id}>
                  <TouchableOpacity
                    style={styles.visibilityRow}
                    onPress={() => setVisibility(vis.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.visibilityIcon,
                        { backgroundColor: selected ? AMBER_LIGHT : BG },
                      ]}
                    >
                      <Ionicons
                        name={vis.icon}
                        size={16}
                        color={selected ? AMBER_DARK : TEXT_SECONDARY}
                      />
                    </View>
                    <View style={styles.visibilityInfo}>
                      <Text
                        style={[
                          styles.visibilityLabel,
                          selected && { color: AMBER_DARK },
                        ]}
                      >
                        {vis.label}
                      </Text>
                      <Text style={styles.visibilityDesc}>{vis.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterActive,
                      ]}
                    >
                      {selected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                  {i < VISIBILITY.length - 1 && <View style={styles.sectionDivider} />}
                </React.Fragment>
              );
            })}
          </View>

          {/* Bottom spacer for sticky button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Sticky Share Button ─────────────────────── */}
        <View style={styles.stickyBottom}>
          <View style={styles.stickyMeta}>
            {canPost ? (
              <View style={styles.readyPill}>
                <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                <Text style={styles.readyText}>Ready to share</Text>
              </View>
            ) : (
              <Text style={styles.missingHint}>
                {!mediaUri
                  ? "Add a photo to continue"
                  : caption.trim().length === 0
                  ? "Write a caption"
                  : "Caption too long"}
              </Text>
            )}
          </View>

          <Animated.View style={{ transform: [{ scale: shareAnim }] }}>
            <TouchableOpacity
              style={[styles.shareBtn, !canPost && styles.shareBtnDisabled]}
              onPress={handleShare}
              disabled={!canPost || isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <Text style={styles.shareBtnText}>Posting…</Text>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={"send" as MCIName}
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.shareBtnText}>Share to Community</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // ── Top Nav ──────────────────────────────────────────────
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  closeBtn: {
    width: 38,
    height: 38,
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
  navTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navTitleText: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  draftBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  draftText: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_SECONDARY,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // ── Author Row ───────────────────────────────────────────
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  authorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderColor: AMBER,
  },
  authorInfo: { gap: 2 },
  authorName: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  authorHandle: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: "500",
  },

  // ── Caption ──────────────────────────────────────────────
  captionWrap: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  captionInput: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    lineHeight: 23,
    minHeight: 90,
    fontWeight: "400",
  },
  charCountRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  charCountBar: {
    height: 3,
    borderRadius: 2,
    flex: 1,
    backgroundColor: "#10B981",
  },
  charCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_MUTED,
    minWidth: 28,
    textAlign: "right",
  },

  // ── Section Card ─────────────────────────────────────────
  sectionCard: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 12,
  },

  // ── Tags ─────────────────────────────────────────────────
  tagsScroll: {
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 50,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  tagChipActive: {
    backgroundColor: AMBER_LIGHT,
    borderColor: AMBER,
  },
  tagChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  tagChipTextActive: {
    color: AMBER_DARK,
    fontWeight: "700",
  },

  // ── Media ────────────────────────────────────────────────
  mediaTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  mediaTypeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  mediaTypeChipActive: {
    backgroundColor: TEXT_PRIMARY,
    borderColor: TEXT_PRIMARY,
  },
  mediaTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  mediaTypeTextActive: {
    color: SURFACE,
  },

  uploadZone: {
    borderWidth: 2,
    borderColor: "#D4D4D8",
    borderStyle: "dashed",
    borderRadius: 20,
    paddingVertical: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: BG,
  },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AMBER_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  uploadSub: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  uploadCTABtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: AMBER_LIGHT,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: AMBER,
  },
  uploadCTAText: {
    fontSize: 13,
    fontWeight: "700",
    color: AMBER_DARK,
  },

  previewWrap: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: SCREEN_W - 64,
    backgroundColor: "#E4E4E7",
    borderRadius: 16,
  },
  removeImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  changeImageBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 50,
  },
  changeImageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFF",
  },

  // ── Pet selector ─────────────────────────────────────────
  petList: {
    gap: 8,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  petItemSelected: {
    backgroundColor: AMBER_LIGHT,
    borderColor: AMBER,
  },
  petEmoji: { fontSize: 22 },
  petItemInfo: { flex: 1 },
  petItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  petItemBreed: {
    fontSize: 11.5,
    color: TEXT_MUTED,
    fontWeight: "500",
    marginTop: 1,
  },
  petCheckWrap: {},

  // ── Location ─────────────────────────────────────────────
  locationInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontWeight: "500",
  },

  // ── Settings ─────────────────────────────────────────────
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: { flex: 1 },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  settingDesc: {
    fontSize: 11.5,
    color: TEXT_MUTED,
    lineHeight: 16,
    marginTop: 2,
    fontWeight: "500",
  },
  adoptionInfoBanner: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFE4E6",
  },
  adoptionInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#BE123C",
    lineHeight: 18,
    fontWeight: "500",
  },

  // Visibility
  visibilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  visibilityIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  visibilityInfo: { flex: 1 },
  visibilityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  visibilityDesc: {
    fontSize: 11.5,
    color: TEXT_MUTED,
    fontWeight: "500",
    marginTop: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: {
    borderColor: AMBER,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AMBER,
  },

  // ── Sticky Bottom ────────────────────────────────────────
  stickyBottom: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
  },
  stickyMeta: {
    alignItems: "center",
  },
  readyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
  },
  readyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  missingHint: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: AMBER,
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  shareBtnDisabled: {
    backgroundColor: "#D4D4D8",
    shadowOpacity: 0,
    elevation: 0,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.2,
  },
});
