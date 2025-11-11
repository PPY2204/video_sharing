/**
 * Video Detail Screen
 * Full-screen video player with comments and interactions
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function VideoDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // Mock video data
    const video = {
        id: params.id || "1",
        title: "Amazing Dance Performance 🔥",
        description: "Check out this amazing dance performance! #dance #trending #viral",
        videoUrl: "https://example.com/video.mp4",
        thumbnail: require("@/assets/images/home/Perfect-lady.png"),
        views: "2.5M",
        likes: "150K",
        comments: "2.3K",
        shares: "890",
        user: {
            name: "Sarah Wilson",
            username: "@sarahw",
            avatar: require("@/assets/images/home/You.png"),
            isFollowing: false,
        },
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Video Player Placeholder */}
            <View style={styles.videoContainer}>
                <Image source={video.thumbnail} style={styles.video} resizeMode="cover" />
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={48} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Action Buttons (Right Side) */}
            <View style={styles.actionsContainer}>
                {/* User Avatar */}
                <TouchableOpacity style={styles.actionItem}>
                    <Image source={video.user.avatar} style={styles.actionAvatar} />
                    <View style={styles.followBadge}>
                        <Ionicons name="add" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>

                {/* Like */}
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => setIsLiked(!isLiked)}
                >
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={32}
                        color={isLiked ? "#FF3B5C" : "#fff"}
                    />
                    <Text style={styles.actionText}>{video.likes}</Text>
                </TouchableOpacity>

                {/* Comment */}
                <TouchableOpacity
                    style={styles.actionItem}
                    onPress={() => setShowComments(!showComments)}
                >
                    <Ionicons name="chatbubble-outline" size={32} color="#fff" />
                    <Text style={styles.actionText}>{video.comments}</Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity style={styles.actionItem}>
                    <Ionicons name="arrow-redo-outline" size={32} color="#fff" />
                    <Text style={styles.actionText}>{video.shares}</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>@{video.user.username}</Text>
                    <Text style={styles.description}>{video.description}</Text>
                </View>

                <View style={styles.statsBar}>
                    <View style={styles.stat}>
                        <Ionicons name="play" size={16} color="#fff" />
                        <Text style={styles.statText}>{video.views} views</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    moreButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    videoContainer: {
        flex: 1,
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    playButton: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255,59,92,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    actionsContainer: {
        position: "absolute",
        right: 16,
        bottom: 120,
        gap: 24,
    },
    actionItem: {
        alignItems: "center",
        gap: 4,
    },
    actionAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "#fff",
    },
    followBadge: {
        position: "absolute",
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FF3B5C",
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    bottomInfo: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 80,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    userInfo: {
        marginBottom: 12,
    },
    username: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    description: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
    },
    statsBar: {
        flexDirection: "row",
        gap: 16,
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },
});
