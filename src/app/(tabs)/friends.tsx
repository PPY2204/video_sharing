/**
 * Friends/Following Screen
 * Display user's friends and following list
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Friend {
    id: string;
    name: string;
    username: string;
    avatar: ImageSourcePropType;
    isFollowing: boolean;
    mutualFriends: number;
    videos: number;
}

interface RenderFriendItemProps {
    item: Friend;
}

// Mock data for friends
const friendsList: Friend[] = [
    {
        id: "1",
        name: "Sarah Wilson",
        username: "@sarahw",
        avatar: require("@/assets/images/home/You.png"),
        isFollowing: true,
        mutualFriends: 12,
        videos: 45,
    },
    {
        id: "2",
        name: "Mike Chen",
        username: "@mikec",
        avatar: require("@/assets/images/home/Julia.png"),
        isFollowing: true,
        mutualFriends: 8,
        videos: 32,
    },
    {
        id: "3",
        name: "Emily Davis",
        username: "@emilyd",
        avatar: require("@/assets/images/home/William.png"),
        isFollowing: false,
        mutualFriends: 15,
        videos: 67,
    },
];

export default function FriendsScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState<"following" | "followers">("following");
    const [friends, setFriends] = useState(friendsList);

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
            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderFriendItem = ({ item }: RenderFriendItemProps) => (
        <View style={styles.friendCard}>
            <TouchableOpacity style={styles.friendInfo} activeOpacity={0.7}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{item.name}</Text>
                    <Text style={styles.username}>{item.username}</Text>
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Friends</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="person-add" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#999"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === "following" && styles.tabActive]}
                    onPress={() => setTab("following")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === "following" && styles.tabTextActive,
                        ]}
                    >
                        Following
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === "followers" && styles.tabActive]}
                    onPress={() => setTab("followers")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === "followers" && styles.tabTextActive,
                        ]}
                    >
                        Followers
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Friends List */}
            <FlatList
                data={filteredFriends}
                renderItem={renderFriendItem}
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
});
