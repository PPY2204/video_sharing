/**
 * User Following/Followers Screen
 * Shows list of users that a specific user follows or is followed by
 * Accessible from user profile page
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
    id: string;
    name: string;
    username?: string;
    avatar: ImageSourcePropType;
    isFollowing: boolean;
}

// Mock data
const MOCK_FOLLOWING: User[] = [
    {
        id: "1",
        name: "Kiran Glaucus",
        avatar: require("@/assets/images/home/You.png"),
        isFollowing: true,
    },
    {
        id: "2",
        name: "Sally Rooney",
        avatar: require("@/assets/images/home/Julia.png"),
        isFollowing: true,
    },
    {
        id: "3",
        name: "Marie Franco",
        avatar: require("@/assets/images/home/William.png"),
        isFollowing: true,
    },
    {
        id: "4",
        name: "Jena Nguyen",
        avatar: require("@/assets/images/home/Peter.png"),
        isFollowing: true,
    },
    {
        id: "5",
        name: "Kristin Watson",
        avatar: require("@/assets/images/home/Perfect-lady.png"),
        isFollowing: true,
    },
];

const MOCK_SUGGESTIONS: User[] = [
    {
        id: "s1",
        name: "Bobby Sandoval",
        avatar: require("@/assets/images/search/Laura.png"),
        isFollowing: false,
    },
    {
        id: "s2",
        name: "Jennie Ponce",
        avatar: require("@/assets/images/search/Lina.png"),
        isFollowing: false,
    },
    {
        id: "s3",
        name: "Anja O'Connor",
        avatar: require("@/assets/images/search/Cris.png"),
        isFollowing: false,
    },
];

export default function UserFollowingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const userName = params.name || "Ruth Sanders";
    const followersCount = params.followers || "368";
    const followingCount = params.following || "456";
    const initialTab = (params.tab as "followers" | "following") || "following";

    const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);
    const [following, setFollowing] = useState(MOCK_FOLLOWING);
    const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);

    const handleToggleFollow = (userId: string, isSuggestion: boolean = false) => {
        if (isSuggestion) {
            setSuggestions((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, isFollowing: !user.isFollowing }
                        : user
                )
            );
        } else {
            setFollowing((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, isFollowing: !user.isFollowing }
                        : user
                )
            );
        }
    };

    const handleRemoveSuggestion = (userId: string) => {
        setSuggestions((prev) => prev.filter((user) => user.id !== userId));
    };

    const renderUserItem = ({ item, isSuggestion = false }: { item: User; isSuggestion?: boolean }) => (
        <View style={styles.userItem}>
            <TouchableOpacity
                style={styles.userInfo}
                onPress={() => router.push({
                    pathname: "/user/[id]",
                    params: { id: item.id, name: item.name }
                })}
            >
                <Image source={item.avatar} style={styles.avatar} />
                <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.followButton,
                        item.isFollowing && styles.followingButton,
                    ]}
                    onPress={() => handleToggleFollow(item.id, isSuggestion)}
                >
                    <Text
                        style={[
                            styles.followButtonText,
                            item.isFollowing && styles.followingButtonText,
                        ]}
                    >
                        {item.isFollowing ? "Following" : "Follow"}
                    </Text>
                </TouchableOpacity>

                {!isSuggestion && (
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                )}

                {isSuggestion && (
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => handleRemoveSuggestion(item.id)}
                    >
                        <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderSuggestionItem = ({ item }: { item: User }) => renderUserItem({ item, isSuggestion: true });

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Image
                        source={require("@/assets/images/home/You.png")}
                        style={styles.headerAvatar}
                    />
                    <Text style={styles.headerName}>{userName}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "followers" && styles.tabActive]}
                    onPress={() => setActiveTab("followers")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "followers" && styles.tabTextActive,
                        ]}
                    >
                        {followersCount} followers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "following" && styles.tabActive]}
                    onPress={() => setActiveTab("following")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "following" && styles.tabTextActive,
                        ]}
                    >
                        {followingCount} following
                    </Text>
                </TouchableOpacity>
            </View>

            {/* User List */}
            <FlatList
                data={following}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    activeTab === "following" && suggestions.length > 0 ? (
                        <View style={styles.suggestionsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Suggestions for you</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewMoreText}>View more</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={suggestions}
                                renderItem={renderSuggestionItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                            />
                        </View>
                    ) : null
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    headerName: {
        fontSize: 17,
        fontWeight: "600",
        color: "#000",
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: "center",
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
    listContent: {
        paddingVertical: 8,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    userName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    followButton: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#3897F0",
    },
    followingButton: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
    },
    followingButtonText: {
        color: "#000",
    },
    moreButton: {
        padding: 4,
    },
    closeButton: {
        padding: 4,
    },
    suggestionsSection: {
        marginBottom: 16,
        paddingTop: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    viewMoreText: {
        fontSize: 14,
        color: "#3897F0",
        fontWeight: "500",
    },
});
