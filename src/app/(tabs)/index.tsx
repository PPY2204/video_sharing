/**
 * Home Tab Screen
 * Entry point for home feed
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import AudioSection from "@/components/home/AudioSection";
import Stories from "@/components/home/Stories";
import StreamSection from "@/components/home/StreamSection";
import TopicsGrid from "@/components/home/TopicsGrid";
import TrendingSection from "@/components/home/TrendingSection";

const { width: screenWidth } = Dimensions.get('window');

export default function HomeTab() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>VV</Text>
                    </View>
                    <Text style={styles.appName}>Video Verse</Text>
                </View>
                
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={22} color="#475569" />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
            >
                {/* Stories Section */}
                <View style={styles.storiesContainer}>
                    <Stories />
                </View>

                {/* Section Container with consistent spacing */}
                <View style={styles.sectionsContainer}>
                    {/* Top Trending Section */}
                    <View style={styles.sectionSpacing}>
                        <TrendingSection />
                    </View>

                    {/* Browse Topics Section */}
                    <View style={styles.sectionSpacing}>
                        <TopicsGrid />
                    </View>

                    {/* Streaming Section */}
                    <View style={styles.sectionSpacing}>
                        <StreamSection />
                    </View>

                    {/* Audio Section */}
                    <View style={styles.audioSection}>
                        <AudioSection />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Main container
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },

    // Header styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    logoContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#FF3B5C', // Fallback for gradient
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#FF3B5C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },

    logoText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5
    },

    appName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.5
    },

    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },

    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B5C',
        borderWidth: 1.5,
        borderColor: '#ffffff'
    },

    // ScrollView styles
    scrollView: {
        flex: 1
    },

    scrollContent: {
        paddingBottom: 90,
        paddingTop: 8
    },

    // Content sections
    storiesContainer: {
        paddingTop: 8,
        paddingBottom: 4,
        marginHorizontal: 2
    },

    sectionsContainer: {
        paddingHorizontal: 2
    },

    sectionSpacing: {
        marginBottom: 24
    },

    audioSection: {
        marginBottom: 8
    }
});

// Optional: Export styles for reuse in other components
export { styles as homeTabStyles };

