/**
 * Home Tab Screen
 * Entry point for home feed
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import AudioSection from "@/components/AudioSection/AudioSection";
import Stories from "@/components/Stories";
import StreamSection from "@/components/StreamSection/StreamSection";
import TopicsGrid from "@/components/TopicsGrid/TopicsGrid";
import TrendingSection from "@/components/TrendingSection/TrendingSection";

// Import data to verify it loads
import { audiosData, storiesData, streamsData, topicsData, trendingData } from "@/data/homeData";

export default function HomeTab() {
    useEffect(() => {
        // Debug: Log data to verify it loads
        console.log("=== HOME TAB LOADED ===");
        console.log("Stories count:", storiesData.length);
        console.log("Trending count:", trendingData.length);
        console.log("Topics count:", topicsData.length);
        console.log("Streams count:", streamsData.length);
        console.log("Audios count:", audiosData.length);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: '#fff'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: '#FF3B5C',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                        shadowColor: '#FF3B5C',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3
                    }}>
                        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>VV</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>Video Sharing App</Text>
                </View>
                <TouchableOpacity style={{
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: '#f9f9f9'
                }}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                style={{ flex: 1 }}
            >
                {/* Stories Section */}
                <View style={{ paddingTop: 4 }}>
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
            </ScrollView>
        </SafeAreaView>
    );
}