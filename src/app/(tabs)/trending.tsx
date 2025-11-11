/**
 * Trending Videos Screen
 * Display trending/popular videos
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for trending videos
const trendingVideos = [
    {
        id: "1",
        thumbnail: require("@/assets/images/home/Perfect-lady.png"),
        title: "Amazing Dance Performance",
        views: "2.5M",
        likes: "150K",
        user: {
            name: "Sarah Wilson",
            avatar: require("@/assets/images/home/You.png"),
        },
        duration: "0:45",
    },
    {
        id: "2",
        thumbnail: require("@/assets/images/home/Rose.png"),
        title: "Cooking Tutorial: Perfect Pasta",
        views: "1.8M",
        likes: "98K",
        user: {
            name: "Chef Mike",
            avatar: require("@/assets/images/home/Julia.png"),
        },
        duration: "2:15",
    },
    {
        id: "3",
        thumbnail: require("@/assets/images/home/Experience.png"),
        title: "Travel Vlog: Japan 2024",
        views: "3.2M",
        likes: "210K",
        user: {
            name: "Travel With Me",
            avatar: require("@/assets/images/home/William.png"),
        },
        duration: "5:30",
    },
    {
        id: "4",
        thumbnail: require("@/assets/images/home/Yourself.png"),
        title: "Funny Cat Compilation",
        views: "5.1M",
        likes: "420K",
        user: {
            name: "Pet Lovers",
            avatar: require("@/assets/images/home/Peter.png"),
        },
        duration: "3:20",
    },
];

interface VideoItem {
    id: string;
    thumbnail: any;
    duration: string;
    user: {
        name: string;
        avatar: any;
    };
    title: string;
    views: string;
    likes: string;
}

interface RenderItemProps {
    item: VideoItem;
}

export default function TrendingScreen() {
    const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");

    const renderVideoItem = ({ item }: RenderItemProps) => (
        <TouchableOpacity style={styles.videoCard} activeOpacity={0.8}>
            <Image source={item.thumbnail} style={styles.thumbnail} resizeMode="cover" />

            {/* Duration Badge */}
            <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
            </View>

            {/* Video Info */}
            <View style={styles.videoInfo}>
                <View style={styles.userSection}>
                    <Image source={item.user.avatar} style={styles.avatar} />
                    <View style={styles.textSection}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <Text style={styles.username}>{item.user.name}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="play" size={14} color="#666" />
                        <Text style={styles.statText}>{item.views}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="heart" size={14} color="#FF3B5C" />
                        <Text style={styles.statText}>{item.likes}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🔥 Trending</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {(["all", "today", "week", "month"] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.filterTab, filter === tab && styles.filterTabActive]}
                        onPress={() => setFilter(tab)}
                    >
                        <Text
                            style={[
                                styles.filterTabText,
                                filter === tab && styles.filterTabTextActive,
                            ]}
                        >
                            {tab === "all" ? "All Time" : tab === "today" ? "Today" : tab === "week" ? "This Week" : "This Month"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Trending Videos List */}
            <FlatList
                data={trendingVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    filterButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
    },
    filterTabActive: {
        backgroundColor: "#FF3B5C",
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
    },
    filterTabTextActive: {
        color: "#fff",
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    videoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        elevation: 3,
    },
    thumbnail: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
    },
    durationBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    videoInfo: {
        padding: 12,
    },
    userSection: {
        flexDirection: "row",
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textSection: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    username: {
        fontSize: 14,
        color: "#666",
    },
    statsRow: {
        flexDirection: "row",
        gap: 16,
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
});
