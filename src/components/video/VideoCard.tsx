/**
 * VideoCard Component
 * Card display for video in feed/grid
 * Optimized with React.memo for list performance
 */

import type { Video } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoCardProps {
    video: Video;
    onPress?: (video: Video) => void;
    showStats?: boolean;
    compact?: boolean;
}

const VideoCard = memo<VideoCardProps>(({ video, onPress, showStats = true, compact = false }) => {
    const handlePress = useCallback(() => {
        onPress?.(video);
    }, [video, onPress]);

    return (
        <TouchableOpacity
            style={[styles.container, compact && styles.containerCompact]}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            {/* Thumbnail */}
            <View style={styles.thumbnailContainer}>
                <Image
                    source={video.thumbnail as any}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />

                {/* Duration badge */}
                {video.duration && (
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>
                            {formatDuration(video.duration)}
                        </Text>
                    </View>
                )}

                {/* Play overlay */}
                <View style={styles.playOverlay}>
                    <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
                </View>
            </View>

            {/* Info */}
            {!compact && (
                <View style={styles.info}>
                    {/* User info */}
                    <View style={styles.userRow}>
                        <Image
                            source={video.user.profileImage as any}
                            style={styles.userAvatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.username} numberOfLines={1}>
                                {video.user.username}
                            </Text>
                            {showStats && (
                                <Text style={styles.viewCount}>
                                    {formatCount(video.views)} views
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title} numberOfLines={2}>
                        {video.title}
                    </Text>

                    {/* Stats */}
                    {showStats && (
                        <View style={styles.stats}>
                            <View style={styles.statItem}>
                                <Ionicons name="heart" size={14} color="#FF3B5C" />
                                <Text style={styles.statText}>{formatCount(video.likes)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="chatbubble" size={14} color="#6B7280" />
                                <Text style={styles.statText}>{formatCount(video.comments)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="share-social" size={14} color="#6B7280" />
                                <Text style={styles.statText}>{formatCount(video.shares)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Compact mode stats */}
            {compact && showStats && (
                <View style={styles.compactStats}>
                    <Ionicons name="play" size={12} color="#fff" />
                    <Text style={styles.compactStatsText}>
                        {formatCount(video.views)}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;

// Helper functions
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatCount(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    containerCompact: {
        marginBottom: 8,
    },
    thumbnailContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#E5E7EB',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    info: {
        padding: 12,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
    },
    userInfo: {
        flex: 1,
        marginLeft: 8,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    viewCount: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    title: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 8,
    },
    stats: {
        flexDirection: 'row',
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
    compactStats: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    compactStatsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
