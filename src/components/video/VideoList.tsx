/**
 * VideoList Component
 * Displays videos from Supabase database
 * Example component showing real-time data integration
 */

import { useVideoFeed } from '@/hooks/useVideos';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VideoList() {
    const { videos, isLoading, error, hasMore, loadMore, refresh } = useVideoFeed(1, 10);

    const renderVideo = ({ item }: { item: typeof videos[0] }) => (
        <TouchableOpacity style={styles.videoCard}>
            {/* Thumbnail */}
            <View style={styles.thumbnailContainer}>
                <Image
                    source={typeof item.thumbnail === 'string' ? { uri: item.thumbnail } : item.thumbnail}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
                <View style={styles.durationBadge}>
                    <Text style={styles.duration}>
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
                <Ionicons
                    name="play-circle"
                    size={48}
                    color="rgba(255,255,255,0.9)"
                    style={styles.playIcon}
                />
            </View>

            {/* Video Info */}
            <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                    <Image
                        source={
                            typeof item.user.profileImage === 'string'
                                ? { uri: item.user.profileImage }
                                : item.user.profileImage
                        }
                        style={styles.avatar}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <Text style={styles.username}>@{item.user.username}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="heart" size={14} color="#FF3B5C" />
                        <Text style={styles.statText}>{formatCount(item.likes)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="chatbubble" size={14} color="#6B7280" />
                        <Text style={styles.statText}>{formatCount(item.comments)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="eye" size={14} color="#6B7280" />
                        <Text style={styles.statText}>{formatCount(item.views)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#FF3B5C" />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No videos found</Text>
            <Text style={styles.emptySubtext}>Videos will appear here once uploaded</Text>
        </View>
    );

    if (isLoading && videos.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3B5C" />
                <Text style={styles.loadingText}>Loading videos from Supabase...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                <Text style={styles.errorText}>Failed to load videos</Text>
                <Text style={styles.errorSubtext}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            data={videos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} colors={['#FF3B5C']} />}
        />
    );
}

// Helper function to format large numbers
function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    videoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    thumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -24 }],
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    duration: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    infoContainer: {
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    username: {
        fontSize: 13,
        color: '#6B7280',
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    errorSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#FF3B5C',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 48,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});
