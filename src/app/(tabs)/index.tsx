/**
 * Home Tab Screen
 * Entry point for home feed
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import AudioSection from "@/components/home/AudioSection";
import Stories from "@/components/home/Stories";
import StreamSection from "@/components/home/StreamSection";
import TopicsGrid from "@/components/home/TopicsGrid";
import TrendingSection from "@/components/home/TrendingSection";

// Import data to verify it loads

export default function HomeTab() {
    const router = useRouter();

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
                        boxShadow: '0px 2px 4px rgba(255, 59, 92, 0.3)',
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
