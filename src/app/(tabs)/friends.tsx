/**
 * Friends/Following Screen
 * Display user's friends and following list
 */

import { supabaseService } from "@/services/supabase.service";
import type { User } from "@/types";
import React, { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface Friend extends User {
    isFollowing: boolean;
    mutualFriends: number;
    videos: number;
}

interface RenderFriendItemProps {
    item: Friend;
}

export default function FriendsScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState<"following" | "followers">("following");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFriends = async () => {
            try {
                const users = await supabaseService.users.getUsers();
                const friendsWithData: Friend[] = users.map(user => ({
                    ...user,
                    isFollowing: Math.random() > 0.3, // Random for demo
                    mutualFriends: Math.floor(Math.random() * 20),
                    videos: Math.floor(Math.random() * 100),
                }));
                setFriends(friendsWithData);
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        loadFriends();
    }, []);

    const handleToggleFollow = (userId: string) => {
        setFriends((prev) =>
            prev.map((friend) =>
                friend.id === userId
                    ? { ...friend, isFollowing: !friend.isFollowing }
                    : friend
            )
        );
    };

    const filteredFriends = friends.filter(
        (friend) =>
            (friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderFriendItem = ({ item }: RenderFriendItemProps) => {
        const avatarSource = item.profileImage
            ? typeof item.profileImage === 'string'
                ? { uri: item.profileImage }
                : item.profileImage
            : null;

        return (
            <View style={styles.friendCard}>
                <TouchableOpacity style={styles.friendInfo} activeOpacity={0.7}>
                    {avatarSource && (
                        <Image source={avatarSource} style={styles.avatar} />
                    )}
                    <View style={styles.friendDetails}>
                        <Text style={styles.friendName}>{item.fullName || item.username}</Text>
                        <Text style={styles.username}>@{item.username}</Text>
                    <Text style={styles.mutualFriends}>
                        {item.mutualFriends} mutual · {item.videos} videos
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.followButton,
                    item.isFollowing && styles.followingButton,
                ]}
                onPress={() => handleToggleFollow(item.id)}
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
        </View>
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
    addButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    tabContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
    },
    tabActive: {
        backgroundColor: "#FF3B5C",
    },
    tabText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#666",
    },
    tabTextActive: {
        color: "#fff",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    friendCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    friendInfo: {
        flexDirection: "row",
        flex: 1,
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    friendDetails: {
        flex: 1,
        justifyContent: "center",
    },
    friendName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 2,
    },
    username: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    mutualFriends: {
        fontSize: 12,
        color: "#999",
    },
    followButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#FF3B5C",
    },
    followingButton: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
    },
    followingButtonText: {
        color: "#666",
    },
}
);
}
