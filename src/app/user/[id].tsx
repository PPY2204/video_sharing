/**
 * User Profile Screen (Other Users)
 * Display another user's profile with their videos and stats
 * Accessed when viewing someone else's profile
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 6) / 3;

interface VideoItem {
    id: string;
    thumbnail: ImageSourcePropType;
    views: string;
    isLiked?: boolean;
}

// Mock data
const MOCK_VIDEOS: VideoItem[] = [
    {
        id: "1",
        thumbnail: require("@/assets/images/search/container-43.png"),
        views: "1.5M",
    },
    {
        id: "2",
        thumbnail: require("@/assets/images/search/container-44.png"),
        views: "1.5M",
        isLiked: true,
    },
    {
        id: "3",
        thumbnail: require("@/assets/images/search/container-40.png"),
        views: "1.6M",
        isLiked: true,
    },
    {
        id: "4",
        thumbnail: require("@/assets/images/search/container-38.png"),
        views: "1.5M",
    },
    {
        id: "5",
        thumbnail: require("@/assets/images/search/container-41.png"),
        views: "1.5M",
        isLiked: true,
    },
    {
        id: "6",
        thumbnail: require("@/assets/images/search/container-45.png"),
        views: "1.5M",
    },
];

const SUGGESTED_USERS = [
    {
        id: "s1",
        name: "Flaura",
        avatar: require("@/assets/images/home/You.png"),
    },
    {
        id: "s2",
        name: "Bobb",
        avatar: require("@/assets/images/home/Julia.png"),
    },
    {
        id: "s3",
        name: "Kiddy",
        avatar: require("@/assets/images/home/William.png"),
    },
];

export default function UserProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const userId = params.id || "1";
    const userName = params.name || "Kiran Glaucus";
    const userBio = params.bio || "I love a colorful life ❤️❤️❤️";

    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"videos" | "liked">("liked");
    const [videos] = useState(MOCK_VIDEOS);
    const [suggestions, setSuggestions] = useState(SUGGESTED_USERS);

    const stats = {
        following: "203",
        followers: "628",
        likes: "2634",
    };

    const handleRemoveSuggestion = (id: string) => {
        setSuggestions((prev) => prev.filter((user) => user.id !== id));
    };

    const renderVideoItem = ({ item }: { item: VideoItem }) => (
        <TouchableOpacity
            style={styles.videoItem}
            onPress={() => router.push(`/video/${item.id}`)}
        >
            <Image source={item.thumbnail} style={styles.videoThumbnail} />
            <View style={styles.videoOverlay}>
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.viewCount}>{item.views} views</Text>
            </View>
            {item.isLiked && (
                <View style={styles.likedBadge}>
                    <Ionicons name="heart" size={12} color="#fff" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <FlatList
                data={activeTab === "videos" ? videos.filter((v) => !v.isLiked) : videos.filter((v) => v.isLiked)}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.videoRow}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="chevron-back" size={28} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="notifications-outline" size={26} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-vertical" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Profile Info */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={require("@/assets/images/home/You.png")}
                                    style={styles.avatar}
                                />
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
                                    {suggestions.map((user) => (
                                        <View key={user.id} style={styles.suggestionCard}>
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveSuggestion(user.id)}
                                            >
                                                <Ionicons name="close" size={16} color="#666" />
                                            </TouchableOpacity>

                                            <Image source={user.avatar} style={styles.suggestionAvatar} />
                                            <Text style={styles.suggestionName} numberOfLines={1}>
                                                {user.name}
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
                                    color={activeTab === "videos" ? "#FF3B5C" : "#666"}
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
                                    color={activeTab === "liked" ? "#FF3B5C" : "#666"}
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
    profileSection: {
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        padding: 3,
        backgroundColor: "#FF3B5C",
        marginBottom: 12,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#fff",
    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        marginBottom: 8,
    },
    userBio: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 40,
        marginBottom: 20,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },
    statLabel: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    followBtn: {
        flex: 1,
        backgroundColor: "#FF3B5C",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    followingBtn: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    followBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    followingBtnText: {
        color: "#000",
    },
    messageBtn: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    messageBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    suggestionsSection: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    suggestionsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    viewMoreText: {
        fontSize: 14,
        color: "#3897F0",
        fontWeight: "500",
    },
    suggestionsRow: {
        flexDirection: "row",
        gap: 12,
    },
    suggestionCard: {
        width: 110,
        backgroundColor: "#fafafa",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        position: "relative",
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 1,
    },
    suggestionAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 8,
    },
    suggestionName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        marginBottom: 8,
        textAlign: "center",
    },
    followSmallBtn: {
        backgroundColor: "#3897F0",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 6,
    },
    followSmallBtnText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#fff",
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        marginBottom: 2,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 16,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#FF3B5C",
    },
    tabText: {
        fontSize: 15,
        color: "#666",
        fontWeight: "500",
    },
    tabTextActive: {
        color: "#FF3B5C",
        fontWeight: "600",
    },
    videoRow: {
        gap: 2,
    },
    videoItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE * 1.4,
        position: "relative",
        marginBottom: 2,
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
});
