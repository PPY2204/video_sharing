/**
 * Home Screen - Video Sharing App
 * Complete home feed matching design mockup
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import AudioSection from "@/components/AudioSection/AudioSection";
import Stories from "@/components/Stories";
import StreamSection from "@/components/StreamSection/StreamSection";
import TopicsGrid from "@/components/TopicsGrid/TopicsGrid";
import TrendingSection from "@/components/TrendingSection/TrendingSection";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>VV</Text>
                    </View>
                    <Text style={styles.appName}>Video Sharing App</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stories Section */}
                <View style={styles.storiesContainer}>
                    <Stories />
                </View>

                {/* Top Trending Section */}
                <TrendingSection />

                {/* Browse Topics Section */}
                <TopicsGrid />

                {/* Streaming Section */}
                <StreamSection />

                {/* Audio Section */}
                <AudioSection />

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#FF3B5C",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    logoText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    appName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    notificationButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    storiesContainer: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
    },
    bottomSpacing: {
        height: 40,
    },
});
