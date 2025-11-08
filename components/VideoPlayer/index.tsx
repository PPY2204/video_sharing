/**
 * VideoPlayer Component
 * Video Sharing App - Team 10
 * Full-featured video player with controls, like/comment/share actions
 */

import type { Video as VideoType } from '@/types/app.types';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

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
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isLiked, setIsLiked] = useState(video.isLiked || false);
    const [likeCount, setLikeCount] = useState(video.likes);
    const [hasTrackedView, setHasTrackedView] = useState(false);

    // Auto-play when active
    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.playAsync();
            setIsPlaying(true);
        } else if (!isActive && videoRef.current) {
            videoRef.current.pauseAsync();
            setIsPlaying(false);
        }
    }, [isActive]);

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
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);

            // Loop video when finished
            if (status.didJustFinish) {
                videoRef.current?.replayAsync();
            }
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

    return (
        <View className="flex-1 bg-black">
            {/* Video Player */}
            <Video
                ref={videoRef}
                source={{ uri: video.videoUrl }}
                className="flex-1"
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={isActive}
                isLooping
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />

            {/* Loading Indicator */}
            {isLoading && (
                <View className="absolute inset-0 items-center justify-center">
                    <ActivityIndicator size="large" color="#FF3B5C" />
                </View>
            )}

            {/* Play/Pause Overlay */}
            <TouchableOpacity
                className="absolute inset-0 items-center justify-center"
                onPress={togglePlayPause}
                activeOpacity={1}
            >
                {!isPlaying && !isLoading && (
                    <View className="bg-black/50 rounded-full p-6">
                        <Ionicons name="play" size={48} color="white" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Progress Bar */}
            <View className="absolute bottom-0 left-0 right-0 px-4 pb-20">
                <View className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-primary"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </View>
                <View className="flex-row justify-between mt-1">
                    <Text className="text-white text-xs">
                        {formatDuration(position)}
                    </Text>
                    <Text className="text-white text-xs">
                        {formatDuration(duration)}
                    </Text>
                </View>
            </View>

            {/* Video Info & Actions */}
            <View className="absolute bottom-0 left-0 right-0 p-4 pb-8">
                {/* User Info */}
                <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
                    <Text className="text-white font-semibold">{video.user.username}</Text>
                </View>

                {/* Description */}
                <Text className="text-white mb-2" numberOfLines={2}>
                    {video.title}
                </Text>

                {/* Hashtags */}
                <View className="flex-row flex-wrap mb-4">
                    {video.hashtags?.slice(0, 3).map((tag, index) => (
                        <Text key={index} className="text-primary mr-2">
                            #{tag}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Action Buttons (Right Side) */}
            <View className="absolute right-4 bottom-24 items-center space-y-6">
                {/* Like Button */}
                <TouchableOpacity onPress={handleLike} className="items-center">
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={36}
                        color={isLiked ? '#FF3B5C' : 'white'}
                    />
                    <Text className="text-white text-xs mt-1">
                        {likeCount >= 1000
                            ? `${(likeCount / 1000).toFixed(1)}K`
                            : likeCount}
                    </Text>
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity onPress={handleComment} className="items-center">
                    <Ionicons name="chatbubble-outline" size={32} color="white" />
                    <Text className="text-white text-xs mt-1">
                        {video.comments >= 1000
                            ? `${(video.comments / 1000).toFixed(1)}K`
                            : video.comments}
                    </Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity onPress={handleShare} className="items-center">
                    <Ionicons name="share-outline" size={32} color="white" />
                    <Text className="text-white text-xs mt-1">Share</Text>
                </TouchableOpacity>

                {/* View Count */}
                <View className="items-center mt-2">
                    <Ionicons name="eye-outline" size={28} color="white" />
                    <Text className="text-white text-xs mt-1">
                        {video.views >= 1000
                            ? `${(video.views / 1000).toFixed(1)}K`
                            : video.views}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default VideoPlayer;
