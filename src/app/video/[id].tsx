/**
 * Video Detail Screen
 * Full-screen video player with comments and interactions
 */

import { CommentSection } from '@/components/comments/CommentSection';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useVideoDetail } from '@/hooks/useVideos';
import { useAuthStore } from '@/store/authStore';
import { getVideoSource } from '@/utils/videoAssets';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Modal,
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
    const videoId = (params.id as string) || "1";
    const { video, isLoading } = useVideoDetail(videoId);
    const { currentUser } = useAuthStore();
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF3B5C" />
                    <Text style={styles.loadingText}>Loading video...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!video) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={styles.loadingContainer}>
                    <Ionicons name="videocam-off-outline" size={64} color="#666" />
                    <Text style={styles.errorText}>Video not found</Text>
                    <Text style={styles.errorSubtext}>Video ID: {videoId}</Text>
                    <TouchableOpacity style={styles.backButtonError} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Video source handles both local assets and remote URLs
    const videoSource = getVideoSource(video.videoUrl);
    
    const thumbnailSource = typeof video.thumbnail === 'string'
        ? { uri: video.thumbnail }
        : video.thumbnail;

    const avatarSource = video.user?.profileImage
        ? typeof video.user.profileImage === 'string'
            ? { uri: video.user.profileImage }
            : video.user.profileImage
        : null;

    const formatCount = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
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
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {video.user?.username || 'Video'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Video Player - Full screen with built-in controls */}
            <VideoPlayer 
                video={video} 
                isActive={true}
                onLike={(videoId) => {
                    // Handle like
                }}
                onComment={(videoId) => {
                    setShowComments(true);
                }}
                onShare={(videoId) => {
                    // Handle share
                }}
            />

            {/* Comments Modal */}
            <Modal
                visible={showComments}
                animationType="slide"
                transparent
                onRequestClose={() => setShowComments(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setShowComments(false)}
                    />
                    <View style={styles.commentModalContainer}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {video.comments || 0} Comments
                            </Text>
                            <TouchableOpacity onPress={() => setShowComments(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        <CommentSection videoId={video.id} currentUser={currentUser} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 16,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        marginBottom: 20,
    },
    backButtonError: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#FF3B5C',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        zIndex: 10,
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 12,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        flex: 1,
    },
    commentModalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.8,
        paddingTop: 12,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#D1D5DB",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 12,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111",
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
