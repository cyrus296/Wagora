import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const AMBER = "#F59E0B";
const AMBER_DARK = "#D97706";
const AMBER_LIGHT = "#FEF3C7";
const SCREEN_W = Dimensions.get("window").width;

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type IoniName = React.ComponentProps<typeof Ionicons>["name"];

// ─── Types ────────────────────────────────────────────────────────────────────
type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: MCIName | IoniName;
  iconLib: "ionicons" | "material";
  accent: string;
  bg: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const OWNER = {
  name: "Nilesh",
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&q=90",
  location: "Pune, India",
};

const PET = {
  name: "Bruno",
  breed: "French Bulldog",
  age: "3 yrs",
  weight: "11 kg",
  avatar:
    "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=90",
  gender: "Male",
  health: 92,
};

const STAT_CARDS: StatCard[] = [
  {
    id: "1",
    label: "Next Vaccine",
    value: "Nov 12",
    icon: "needle" as MCIName,
    iconLib: "material",
    accent: "#10B981",
    bg: "#ECFDF5",
  },
  {
    id: "2",
    label: "Matches",
    value: "4",
    icon: "paw" as MCIName,
    iconLib: "material",
    accent: AMBER_DARK,
    bg: AMBER_LIGHT,
  },
  {
    id: "3",
    label: "Profile",
    value: "90%",
    icon: "person-circle-outline" as IoniName,
    iconLib: "ionicons",
    accent: "#6366F1",
    bg: "#EEF2FF",
  },
  {
    id: "4",
    label: "Vet Visit",
    value: "Dec 2",
    icon: "medical-outline" as IoniName,
    iconLib: "ionicons",
    accent: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    id: "5",
    label: "Weight",
    value: PET.weight,
    icon: "scale-bathroom" as MCIName,
    iconLib: "material",
    accent: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "6",
    label: "Gender",
    value: PET.gender,
    icon: "male-outline" as IoniName,
    iconLib: "ionicons",
    accent: "#3B82F6",
    bg: "#EFF6FF",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCardItem({ card }: { card: StatCard }) {
  return (
    <View style={[styles.statCard, { backgroundColor: card.bg }]}>
      <View style={[styles.statIconWrap, { backgroundColor: card.accent + "22" }]}>
        {card.iconLib === "material" ? (
          <MaterialCommunityIcons
            name={card.icon as MCIName}
            size={18}
            color={card.accent}
          />
        ) : (
          <Ionicons name={card.icon as IoniName} size={18} color={card.accent} />
        )}
      </View>
      <Text style={[styles.statValue, { color: card.accent }]}>{card.value}</Text>
      <Text style={styles.statLabel}>{card.label}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  subtitle,
  value,
  onChange,
  icon,
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon: MCIName;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <View style={styles.toggleIconWrap}>
          <MaterialCommunityIcons name={icon} size={18} color={AMBER_DARK} />
        </View>
        <View style={styles.toggleTextWrap}>
          <Text style={styles.toggleLabel}>{label}</Text>
          <Text style={styles.toggleSub}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#E4E4E7", true: AMBER }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#E4E4E7"
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const [lookingForMate, setLookingForMate] = useState(true);
  const [openForAdoption, setOpenForAdoption] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Top Header ─────────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.ownerRow}>
            <Image source={{ uri: OWNER.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.ownerName}>{OWNER.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color="#71717A" />
                <Text style={styles.locationText}>{OWNER.location}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#18181B" />
          </TouchableOpacity>
        </View>

        {/* ── Pet Card ────────────────────────────────────────────── */}
        <View style={styles.petCardWrap}>
          <LinearGradient
            colors={["#1C1917", "#292524", "#44403C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.petCard}
          >
            {/* Background paw pattern hint */}
            <View style={styles.petCardBgPaw}>
              <MaterialCommunityIcons
                name={"paw" as MCIName}
                size={160}
                color="rgba(255,255,255,0.04)"
              />
            </View>

            <View style={styles.petCardContent}>
              {/* Pet Avatar */}
              <View style={styles.petAvatarWrap}>
                <Image
                  source={{ uri: PET.avatar }}
                  style={styles.petAvatar}
                  resizeMode="cover"
                />
                <View style={styles.petAvatarBadge}>
                  <MaterialCommunityIcons
                    name={"paw" as MCIName}
                    size={10}
                    color="#FFF"
                  />
                </View>
              </View>

              {/* Pet Info */}
              <View style={styles.petCardInfo}>
                <Text style={styles.petCardName}>{PET.name}</Text>
                <Text style={styles.petCardBreed}>{PET.breed}</Text>
                <View style={styles.petCardMeta}>
                  <View style={styles.petMetaPill}>
                    <Text style={styles.petMetaText}>{PET.age}</Text>
                  </View>
                  <View style={styles.petMetaPill}>
                    <Text style={styles.petMetaText}>{PET.gender}</Text>
                  </View>
                </View>
              </View>

              {/* Health Score */}
              <View style={styles.healthScore}>
                <Text style={styles.healthScoreNum}>{PET.health}%</Text>
                <Text style={styles.healthScoreLabel}>Health</Text>
              </View>
            </View>

            {/* Health Bar */}
            <View style={styles.healthBarTrack}>
              <View style={[styles.healthBarFill, { width: `${PET.health}%` }]} />
            </View>

            {/* Edit button */}
            <TouchableOpacity style={styles.editPetBtn} activeOpacity={0.8}>
              <Ionicons name="pencil" size={13} color={AMBER} />
              <Text style={styles.editPetText}>Edit Profile</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ── Section: Toggles ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility Settings</Text>
          <View style={styles.toggleCard}>
            <ToggleRow
              label="Looking for a Mate"
              subtitle="Show Bruno in Pet Mate discovery"
              value={lookingForMate}
              onChange={setLookingForMate}
              icon={"heart-search" as MCIName}
            />
            <View style={styles.divider} />
            <ToggleRow
              label="Open for Adoption"
              subtitle="Allow adoption requests for Bruno"
              value={openForAdoption}
              onChange={setOpenForAdoption}
              icon={"home-heart" as MCIName}
            />
          </View>
        </View>

        {/* ── Section: Stats Grid ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            {STAT_CARDS.map((card) => (
              <StatCardItem key={card.id} card={card} />
            ))}
          </View>
        </View>

        {/* ── Section: Quick Actions ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsCard}>
            {[
              {
                label: "View Matches",
                icon: "paw" as MCIName,
                lib: "material" as const,
                color: AMBER_DARK,
              },
              {
                label: "Health Records",
                icon: "medical-outline" as IoniName,
                lib: "ionicons" as const,
                color: "#EF4444",
              },
              {
                label: "Find Nearby Vets",
                icon: "map-marker-plus" as MCIName,
                lib: "material" as const,
                color: "#10B981",
              },
            ].map((action, i, arr) => (
              <React.Fragment key={action.label}>
                <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color + "18" },
                    ]}
                  >
                    {action.lib === "material" ? (
                      <MaterialCommunityIcons
                        name={action.icon as MCIName}
                        size={18}
                        color={action.color}
                      />
                    ) : (
                      <Ionicons
                        name={action.icon as IoniName}
                        size={18}
                        color={action.color}
                      />
                    )}
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D4D4D8" />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },
  scroll: {
    paddingBottom: 20,
  },

  // Header
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: AMBER,
  },
  ownerInfo: {
    gap: 1,
  },
  greeting: {
    fontSize: 12,
    color: "#71717A",
    fontWeight: "500",
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18181B",
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    color: "#71717A",
    fontWeight: "500",
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },

  // Pet card
  petCardWrap: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 12,
  },
  petCard: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  petCardBgPaw: {
    position: "absolute",
    right: -20,
    bottom: -20,
  },
  petCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  petAvatarWrap: {
    position: "relative",
  },
  petAvatar: {
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
  },
  petAvatarBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: AMBER,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1C1917",
  },
  petCardInfo: {
    flex: 1,
    gap: 3,
  },
  petCardName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  petCardBreed: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  petCardMeta: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  petMetaPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  petMetaText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  healthScore: {
    alignItems: "center",
  },
  healthScoreNum: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: -0.5,
  },
  healthScoreLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    marginTop: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  healthBarTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 2,
    marginTop: 18,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  editPetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-end",
    marginTop: 14,
    backgroundColor: "rgba(245,158,11,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
  },
  editPetText: {
    fontSize: 12,
    color: AMBER,
    fontWeight: "700",
  },

  // Section
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#71717A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // Toggles
  toggleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toggleIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: AMBER_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTextWrap: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181B",
  },
  toggleSub: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 1,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F4F5",
    marginHorizontal: 18,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: (SCREEN_W - 40 - 20) / 3,
    borderRadius: 18,
    padding: 14,
    alignItems: "flex-start",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: "#71717A",
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  // Quick Actions
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#18181B",
  },
});
