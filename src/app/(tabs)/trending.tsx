/**
 * Trending Videos Screen
 * Display trending/popular videos
 */

import { useTrendingVideos } from "@/hooks/useVideos";
import type { Video } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RenderItemProps {
    item: Video;
}

export default function TrendingScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
    const { videos: trendingVideos, isLoading } = useTrendingVideos(20);

    const formatCount = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderVideoItem = ({ item }: RenderItemProps) => {
        try {
            // Safety checks for null/undefined data
            if (!item) {
                return null;
            }

            const thumbnailSource = typeof item.thumbnail === 'string'
                ? { uri: item.thumbnail }
                : item.thumbnail;

            // Fallback avatar if no user data
            const avatarSource = item.user?.profileImage
                ? typeof item.user.profileImage === 'string'
                    ? { uri: item.user.profileImage }
                    : item.user.profileImage
                : null;

            return (
                <TouchableOpacity 
                    style={styles.videoCard} 
                    activeOpacity={0.8}
                    onPress={() => router.push(`/video/${item.id}`)}
                >
                    <Image source={thumbnailSource} style={styles.thumbnail} resizeMode="cover" />

                    {/* Duration Badge */}
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{formatDuration(item.duration || 0)}</Text>
                    </View>

                    {/* Video Info */}
                    <View style={styles.videoInfo}>
                        <View style={styles.userSection}>
                            {avatarSource && <Image source={avatarSource} style={styles.avatar} />}
                            <View style={styles.textSection}>
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title || 'Untitled Video'}
                                </Text>
                                <Text style={styles.username}>{item.user?.username || 'Unknown User'}</Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Ionicons name="play" size={14} color="#666" />
                                <Text style={styles.statText}>{formatCount(item.views || 0)}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="heart" size={14} color="#FF3B5C" />
                                <Text style={styles.statText}>{formatCount(item.likes || 0)}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } catch (error) {
            return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="flame" size={28} color="#FF3B5C" />
                    <Text style={styles.headerTitle}>Trending</Text>
                </View>
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
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF3B5C" />
                    <Text style={styles.loadingText}>Loading trending videos...</Text>
                </View>
            ) : trendingVideos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="flame-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No trending videos yet</Text>
                    <Text style={styles.emptySubtext}>Check back later for hot content!</Text>
                </View>
            ) : (
                <>
                    <Text style={{ padding: 16, color: '#999' }}>
                        Showing {trendingVideos.length} trending videos
                    </Text>
                    <FlatList
                        data={trendingVideos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
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
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
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
    listContainer: {
        padding: 16,
        gap: 16,
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
