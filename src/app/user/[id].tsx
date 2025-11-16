/**
 * User Profile Screen (Other Users)
 * Display another user's profile with their videos and stats
 * Accessed when viewing someone else's profile
 */

import { useUserProfile } from "@/hooks/useUsers";
import { supabaseService } from "@/services/supabase.service";
import type { User, Video } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 6) / 3;

interface VideoItem extends Video {
    isLiked?: boolean;
}

export default function UserProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const userId = (params.id as string) || "1";

    // Use real user data from Supabase
    const { user, isLoading: userLoading } = useUserProfile(userId);

    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"videos" | "liked">("liked");
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<User[]>([]);

    // Load user videos
    useEffect(() => {
        const loadVideos = async () => {
            if (!userId) return;

            setVideosLoading(true);
            try {
                const data = await supabaseService.videos.getVideosByUserId(userId);
                setVideos(data);
            } catch (error) {
            } finally {
                setVideosLoading(false);
            }
        };

        const loadSuggestedUsers = async () => {
            try {
                const users = await supabaseService.users.getUsers();
                // Filter out current user and take first 3
                const filtered = users.filter(u => u.id !== userId).slice(0, 3);
                setSuggestions(filtered);
            } catch (error) {
                console.error('Failed to load suggested users:', error);
            }
        };

        loadVideos();
        loadSuggestedUsers();
    }, [userId]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const userName = user?.username || "User";
    const userBio = user?.bio || "";
    const stats = {
        following: formatNumber(user?.following || 0),
        followers: formatNumber(user?.followers || 0),
        likes: formatNumber(user?.likes || 0),
    };

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    const handleRemoveSuggestion = (id: string) => {
        setSuggestions((prev) => prev.filter((user) => user.id !== id));
    };

    const renderVideoItem = ({ item }: { item: VideoItem }) => {
        const thumbnailSource = typeof item.thumbnail === 'string'
            ? { uri: item.thumbnail }
            : item.thumbnail;

        return (
            <TouchableOpacity
                style={styles.videoItem}
                onPress={() => router.push(`/video/${item.id}`)}
            >
                <Image source={thumbnailSource} style={styles.videoThumbnail} />
                <View style={styles.videoOverlay}>
                    <Ionicons name="play" size={16} color="#fff" />
                    <Text style={styles.viewCount}>{formatViews(item.views)} views</Text>
                </View>
                {item.isLiked && (
                    <View style={styles.likedBadge}>
                        <Ionicons name="heart" size={12} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (userLoading || videosLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF3B5C" />
                </View>
            </SafeAreaView>
        );
    }

    const displayVideos = activeTab === "videos" ? videos : videos.filter((v) => v.isLiked);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <FlatList
                data={displayVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.videoRow}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name={activeTab === "videos" ? "videocam-outline" : "heart-outline"} size={64} color="#E5E7EB" />
                        <Text style={styles.emptyText}>
                            {activeTab === "videos" ? "No videos yet" : "No liked videos yet"}
                        </Text>
                    </View>
                }
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                                <Ionicons name="chevron-back" size={28} color="#111827" />
                            </TouchableOpacity>
                            <View style={styles.headerRight}>
                                <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
                                    <Ionicons name="notifications-outline" size={24} color="#111827" />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
                                    <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Profile Info */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={
                                        user?.profileImage && typeof user.profileImage === 'string'
                                            ? { uri: user.profileImage }
                                            : { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop' }
                                    }
                                    style={styles.avatar}
                                />
                                {user?.isVerified && (
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    </View>
                                )}
                            </View>

                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.userBio}>{userBio}</Text>

                            {/* Stats */}
                            <View style={styles.statsContainer}>
                                <TouchableOpacity
                                    style={styles.statItem}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/user/following",
                                            params: {
                                                name: userName,
                                                followers: stats.followers,
                                                following: stats.following,
                                                tab: "following",
                                            },
                                        })
                                    }
                                >
                                    <Text style={styles.statValue}>{stats.following}</Text>
                                    <Text style={styles.statLabel}>Following</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.statItem}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/user/following",
                                            params: {
                                                name: userName,
                                                followers: stats.followers,
                                                following: stats.following,
                                                tab: "followers",
                                            },
                                        })
                                    }
                                >
                                    <Text style={styles.statValue}>{stats.followers}</Text>
                                    <Text style={styles.statLabel}>Followers</Text>
                                </TouchableOpacity>

                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.likes}</Text>
                                    <Text style={styles.statLabel}>Likes</Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                    onPress={() => setIsFollowing(!isFollowing)}
                                >
                                    <Text
                                        style={[
                                            styles.followBtnText,
                                            isFollowing && styles.followingBtnText,
                                        ]}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.messageBtn}>
                                    <Text style={styles.messageBtnText}>Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Suggested Accounts */}
                        {suggestions.length > 0 && (
                            <View style={styles.suggestionsSection}>
                                <View style={styles.suggestionsHeader}>
                                    <Text style={styles.suggestionsTitle}>Suggested accounts</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.viewMoreText}>View more</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.suggestionsRow}>
                                    {suggestions.map((suggestedUser) => (
                                        <View key={suggestedUser.id} style={styles.suggestionCard}>
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveSuggestion(suggestedUser.id)}
                                            >
                                                <Ionicons name="close" size={16} color="#666" />
                                            </TouchableOpacity>

                                            {suggestedUser.profileImage && (
                                                <Image 
                                                    source={
                                                        typeof suggestedUser.profileImage === 'string'
                                                            ? { uri: suggestedUser.profileImage }
                                                            : suggestedUser.profileImage
                                                    } 
                                                    style={styles.suggestionAvatar} 
                                                />
                                            )}
                                            <Text style={styles.suggestionName} numberOfLines={1}>
                                                {suggestedUser.fullName || suggestedUser.username}
                                            </Text>

                                            <TouchableOpacity style={styles.followSmallBtn}>
                                                <Text style={styles.followSmallBtnText}>Follow</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === "videos" && styles.tabActive]}
                                onPress={() => setActiveTab("videos")}
                            >
                                <Ionicons
                                    name="play"
                                    size={20}
                                    color={activeTab === "videos" ? "#EC4899" : "#6B7280"}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "videos" && styles.tabTextActive,
                                    ]}
                                >
                                    Videos
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tab, activeTab === "liked" && styles.tabActive]}
                                onPress={() => setActiveTab("liked")}
                            >
                                <Ionicons
                                    name="heart"
                                    size={20}
                                    color={activeTab === "liked" ? "#EC4899" : "#6B7280"}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "liked" && styles.tabTextActive,
                                    ]}
                                >
                                    Liked
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#E5E7EB",
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#EC4899',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    userBio: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    statItem: {
        alignItems: "center",
        minWidth: 60,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8,
        width: "100%",
        paddingHorizontal: 16,
    },
    followBtn: {
        flex: 1,
        backgroundColor: "#EC4899",
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: "center",
    },
    followingBtn: {
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    followBtnText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
    },
    followingBtnText: {
        color: "#111827",
    },
    messageBtn: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    messageBtnText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    suggestionsSection: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#FAFAFA",
    },
    suggestionsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    suggestionsTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    viewMoreText: {
        fontSize: 13,
        color: "#EC4899",
        fontWeight: "500",
    },
    suggestionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    suggestionCard: {
        flex: 1,
        maxWidth: (width - 48) / 3,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        position: "relative",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    removeButton: {
        position: "absolute",
        top: 4,
        right: 4,
        zIndex: 1,
        padding: 2,
    },
    suggestionAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    suggestionName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
        textAlign: "center",
    },
    followSmallBtn: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
        width: "100%",
    },
    followSmallBtnText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        marginBottom: 1,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 12,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#111827",
    },
    tabText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    tabTextActive: {
        color: "#111827",
        fontWeight: "600",
    },
    videoRow: {
        gap: 1,
        paddingHorizontal: 0,
    },
    videoItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE * 1.4,
        position: "relative",
        marginBottom: 1,
    },
    videoThumbnail: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
    },
    videoOverlay: {
        position: "absolute",
        bottom: 6,
        left: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    viewCount: {
        fontSize: 11,
        color: "#fff",
        fontWeight: "600",
    },
    likedBadge: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 59, 92, 0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        marginTop: 16,
        fontWeight: '500',
    },
});
