/**
 * VideoPlayer Component
 * Video Sharing App - Team 10
 * Full-featured video player with controls, like/comment/share actions
 */

import type { Video as VideoType } from '@/types/app.types';
import { getVideoSource } from '@/utils/videoAssets';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
    video: VideoType;
    isActive?: boolean; // Auto-play when active
    onLike?: (videoId: string) => void;
    onComment?: (videoId: string) => void;
    onShare?: (videoId: string) => void;
    onViewCountUpdate?: (videoId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    video,
    isActive = true,
    onLike,
    onComment,
    onShare,
    onViewCountUpdate,
}) => {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isLiked, setIsLiked] = useState(video.isLiked || false);
    const [likeCount, setLikeCount] = useState(video.likes);
    const [hasTrackedView, setHasTrackedView] = useState(false);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-play when active
    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.playAsync().catch(() => setLoadError(true));
            setIsPlaying(true);
        } else if (!isActive && videoRef.current) {
            videoRef.current.pauseAsync();
            setIsPlaying(false);
        }

        // Timeout after 10 seconds if still loading
        loadTimeoutRef.current = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
                setLoadError(true);
            }
        }, 10000);

        return () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
    }, [isActive, isLoading]);

    // Track view count after 3 seconds
    useEffect(() => {
        if (isPlaying && !hasTrackedView && position >= 3000) {
            setHasTrackedView(true);
            onViewCountUpdate?.(video.id);
        }
    }, [isPlaying, position, hasTrackedView]);

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsLoading(false);
            setLoadError(false);
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);

            // Loop video when finished
            if (status.didJustFinish) {
                videoRef.current?.replayAsync();
            }
        } else if ('error' in status) {
            setIsLoading(false);
            setLoadError(true);
        }
    };

    const togglePlayPause = async () => {
        if (videoRef.current) {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();
            }
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        onLike?.(video.id);
    };

    const handleComment = () => {
        onComment?.(video.id);
    };

    const handleShare = () => {
        onShare?.(video.id);
    };

    const formatDuration = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

    // Show message on web platform
    if (Platform.OS === 'web') {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Ionicons name="phone-portrait-outline" size={64} color="white" />
                <Text className="text-white text-lg mt-4">Video playback is only available on mobile</Text>
                <Text className="text-gray-400 text-sm mt-2">Please use Expo Go app on your phone</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Video Player */}
            <Video
                ref={videoRef}
                source={getVideoSource(video.videoUrl)}
                style={{ 
                    width: '100%', 
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={isActive}
                isLooping
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                useNativeControls={false}
            />

            {/* Loading Indicator */}
            {isLoading && !loadError && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 10
                }}>
                    <ActivityIndicator size="large" color="#FF3B5C" />
                    <Text style={{ color: 'white', marginTop: 16 }}>Loading video...</Text>
                </View>
            )}

            {/* Error Message */}
            {loadError && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    zIndex: 10
                }}>
                    <Ionicons name="alert-circle-outline" size={64} color="#FF3B5C" />
                    <Text style={{ color: 'white', fontSize: 18, marginTop: 16 }}>Failed to load video</Text>
                    <Text style={{ color: '#999', fontSize: 14, marginTop: 8 }}>Video URL: {video.videoUrl}</Text>
                    <TouchableOpacity 
                        style={{
                            marginTop: 24,
                            backgroundColor: '#FF3B5C',
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 24
                        }}
                        onPress={() => {
                            setLoadError(false);
                            setIsLoading(true);
                            videoRef.current?.replayAsync().catch(() => setLoadError(true));
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Play/Pause Overlay */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5
                }}
                onPress={togglePlayPause}
                activeOpacity={1}
            >
                {!isPlaying && !isLoading && !loadError && (
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 50,
                        padding: 24
                    }}>
                        <Ionicons name="play" size={48} color="white" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                    />
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {formatDuration(position)}
                    </Text>
                    <Text style={styles.timeText}>
                        {formatDuration(duration)}
                    </Text>
                </View>
            </View>

            {/* Bottom Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: SCREEN_HEIGHT * 0.4,
                    zIndex: 6
                }}
            />

            {/* Video Info & Actions */}
            <View style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 80,
                padding: 16,
                paddingBottom: 32,
                zIndex: 7
            }}>
                {/* User Info */}
                {video.user && (
                    <View style={styles.userInfoContainer}>
                        {video.user.profileImage ? (
                            <Image
                                source={{ uri: typeof video.user.profileImage === 'string' ? video.user.profileImage : '' }}
                                style={styles.userAvatar}
                            />
                        ) : (
                            <View style={[styles.userAvatar, { backgroundColor: '#444' }]} />
                        )}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={styles.username}>{video.user.username}</Text>
                                {video.user.isVerified && (
                                    <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                                )}
                            </View>
                            {video.user.followers && video.user.followers > 0 && (
                                <Text style={styles.followerCount}>
                                    {video.user.followers >= 1000 
                                        ? `${(video.user.followers / 1000).toFixed(1)}K followers` 
                                        : `${video.user.followers} followers`}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Description */}
                <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title || video.description || 'Untitled Video'}
                </Text>

                {/* Hashtags */}
                {video.hashtags && video.hashtags.length > 0 && (
                    <View style={styles.hashtagContainer}>
                        {video.hashtags.slice(0, 3).map((tag, index) => (
                            <TouchableOpacity key={index} style={styles.hashtagChip}>
                                <Text style={styles.hashtagText}>#{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Action Buttons (Right Side) */}
            <View style={styles.actionButtonsContainer}>
                {/* Like Button */}
                <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                    <View style={[styles.actionIconContainer, isLiked && styles.actionIconActive]}>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={32}
                            color={isLiked ? '#FF3B5C' : 'white'}
                        />
                    </View>
                    <Text style={styles.actionText}>
                        {likeCount >= 1000000
                            ? `${(likeCount / 1000000).toFixed(1)}M`
                            : likeCount >= 1000
                            ? `${(likeCount / 1000).toFixed(1)}K`
                            : String(likeCount)}
                    </Text>
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="chatbubble-outline" size={30} color="white" />
                    </View>
                    <Text style={styles.actionText}>
                        {(video.comments || 0) >= 1000000
                            ? `${((video.comments || 0) / 1000000).toFixed(1)}M`
                            : (video.comments || 0) >= 1000
                            ? `${((video.comments || 0) / 1000).toFixed(1)}K`
                            : String(video.comments || 0)}
                    </Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="arrow-redo-outline" size={30} color="white" />
                    </View>
                    <Text style={styles.actionText}>
                        {(video.shares || 0) >= 1000
                            ? `${((video.shares || 0) / 1000).toFixed(1)}K`
                            : video.shares || 'Share'}
                    </Text>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="bookmark-outline" size={28} color="white" />
                    </View>
                </TouchableOpacity>

                {/* View Count */}
                <View style={[styles.actionButton, { marginTop: 12 }]}>
                    <Ionicons name="eye-outline" size={26} color="white" />
                    <Text style={[styles.actionText, { fontSize: 11 }]}>
                        {(video.views || 0) >= 1000000
                            ? `${((video.views || 0) / 1000000).toFixed(1)}M`
                            : (video.views || 0) >= 1000
                            ? `${((video.views || 0) / 1000).toFixed(1)}K`
                            : String(video.views || 0)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'white',
    },
    username: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
    followerCount: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 2,
    },
    followButton: {
        backgroundColor: '#FF3B5C',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 4,
    },
    followButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    videoTitle: {
        color: 'white',
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 8,
    },
    hashtagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    hashtagChip: {
        backgroundColor: 'rgba(255,59,92,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B5C',
    },
    hashtagText: {
        color: '#FF3B5C',
        fontSize: 13,
        fontWeight: '600',
    },
    actionButtonsContainer: {
        position: 'absolute',
        right: 12,
        bottom: 100,
        alignItems: 'center',
        gap: 20,
        zIndex: 8,
    },
    actionButton: {
        alignItems: 'center',
        gap: 4,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    actionIconActive: {
        backgroundColor: 'rgba(255,59,92,0.3)',
        borderColor: '#FF3B5C',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 80,
        zIndex: 6,
    },
    progressBar: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF3B5C',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    timeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default VideoPlayer;
