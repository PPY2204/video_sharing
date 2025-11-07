import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import FriendsLogo from "@/assets/icons/friends.svg";
import HomeLogo from "@/assets/icons/home.svg";
import PlusLogo from "@/assets/icons/plus.svg";
import ProfileLogo from "@/assets/icons/profile.svg";
import SearchLogo from "@/assets/icons/search.svg";

const ACCENT = "#ff2d55";
const INACTIVE = "#8e8e93";

// function CreateButton({ children, onPress }: any) {
//   return (
//     <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.createWrapper}>
//       <View style={styles.createButton}>{children}</View>
//     </TouchableOpacity>
//   );
// }

function CreateButton({ children, onPress }: any) {
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
      <Tabs.Screen
        name="home"
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
          tabBarIcon: ({ size }) => <PlusLogo width={size + 18} height={size + 18} stroke={ACCENT} />,
          tabBarButton: (props) => <CreateButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => <FriendsLogo width={size} height={size} stroke={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "My profile",
          tabBarIcon: ({ color, size }) => <ProfileLogo width={size} height={size} stroke={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 88 : 70,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 26 : 8,
    borderTopWidth: 0.5,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
    elevation: 8,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
  createWrapper: {
    top: Platform.OS === "ios" ? -26 : -18,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  createButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
});