import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import HomeLogo from "@/assets/icons/home.svg";
import PlusLogo from "@/assets/icons/plus.svg";
import ProfileLogo from "@/assets/icons/profile.svg";
import SearchLogo from "@/assets/icons/search.svg";

const ACCENT = "#ff2d55";
const INACTIVE = "#8e8e93";

interface CreateButtonProps {
  children: React.ReactNode;
  onPress?: (event: any) => void;
}

function CreateButton({ children, onPress }: CreateButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.createWrapper}>
      <View style={styles.createButton}>{children}</View>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}
    >
      {/* Main Tabs - Visible in Tab Bar */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <HomeLogo width={size} height={size} stroke={color} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <SearchLogo width={size} height={size} stroke={color} />,
        }}
      />

      <Tabs.Screen
        name="create-video"
        options={{
          title: "",
          tabBarIcon: ({ size }) => <PlusLogo width={size + 14} height={size + 14} stroke="#fff" />,
          tabBarButton: (props) => <CreateButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <ProfileLogo width={size} height={size} stroke={color} />,
        }}
      />

      {/* Hidden Routes - Accessible but not in tab bar */}
      <Tabs.Screen
        name="trending"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "android" ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 26 : 10,
    borderTopWidth: 0,
    backgroundColor: "#fff",
    elevation: 12,
    boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.08)",
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
  createWrapper: {
    top: Platform.OS === "ios" ? -26 : -18,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  createButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(255, 59, 92, 0.4)",
    elevation: 8,
  },
});
