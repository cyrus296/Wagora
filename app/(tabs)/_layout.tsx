import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AMBER = "#F59E0B";
const ZINC = "#A1A1AA";
const WHITE = "#FFFFFF";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function IoniconsIcon({
  name,
  focused,
  size = 24,
}: {
  name: IoniconsName;
  focused: boolean;
  size?: number;
}) {
  return <Ionicons name={name} size={size} color={focused ? AMBER : ZINC} />;
}

function MCIcon({
  name,
  focused,
  size = 25,
}: {
  name: MCIName;
  focused: boolean;
  size?: number;
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={focused ? AMBER : ZINC}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AMBER,
        tabBarInactiveTintColor: ZINC,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Community",
          tabBarIcon: ({ focused }) => (
            <IoniconsIcon
              name={focused ? "people" : "people-outline"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Pet Mate",
          tabBarIcon: ({ focused }) => (
            <MCIcon
              name={focused ? "paw" : "paw-outline"}
              focused={focused}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ focused }) => (
            <IoniconsIcon
              name={focused ? "storefront" : "storefront-outline"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <IoniconsIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              focused={focused}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: WHITE,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabItem: {
    gap: 2,
  },
});
