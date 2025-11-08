/**
 * CommentSection Component
 * Video Sharing App - Team 10
 * Display and manage comments with replies, likes, delete functionality
 */

import type { Comment, User } from '@/types/app.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CommentSectionProps {
    videoId: string;
    comments: Comment[];
    currentUser: User | null;
    isLoading?: boolean;
    onAddComment: (content: string, parentId?: string) => Promise<void>;
    onDeleteComment: (commentId: string) => Promise<void>;
    onLikeComment: (commentId: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    videoId,
    comments,
    currentUser,
    isLoading = false,
    onAddComment,
    onDeleteComment,
    onLikeComment,
    onLoadMore,
    hasMore = false,
}) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !currentUser) return;

        try {
            setSubmitting(true);
            await onAddComment(newComment.trim(), replyingTo || undefined);
            setNewComment('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Submit comment error:', error);
            Alert.alert('Error', 'Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDeleteComment(commentId),
                },
            ]
        );
    };

    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 604800)}w ago`;
    };

    const renderComment = ({ item }: { item: Comment }) => {
        const isOwner = currentUser?.id === item.user.id;

        return (
            <View className="py-3 border-b border-gray-800">
                {/* Comment Header */}
                <View className="flex-row items-start">
                    {/* Avatar */}
                    <View className="w-9 h-9 rounded-full bg-gray-700 mr-3" />

                    {/* Comment Content */}
                    <View className="flex-1">
                        {/* Username & Time */}
                        <View className="flex-row items-center mb-1">
                            <Text className="text-white font-semibold mr-2">
                                {item.user.username}
                            </Text>
                            <Text className="text-gray-400 text-xs">
                                {formatTimeAgo(item.createdAt)}
                            </Text>
                        </View>

                        {/* Comment Text */}
                        <Text className="text-white mb-2">{item.text}</Text>

                        {/* Action Buttons */}
                        <View className="flex-row items-center space-x-4">
                            {/* Like */}
                            <TouchableOpacity
                                onPress={() => onLikeComment(item.id)}
                                className="flex-row items-center mr-4"
                            >
                                <Ionicons
                                    name={item.isLiked ? 'heart' : 'heart-outline'}
                                    size={16}
                                    color={item.isLiked ? '#FF3B5C' : '#9CA3AF'}
                                />
                                <Text
                                    className={`ml-1 text-xs ${item.isLiked ? 'text-primary' : 'text-gray-400'
                                        }`}
                                >
                                    {item.likes > 0 ? item.likes : ''}
                                </Text>
                            </TouchableOpacity>

                            {/* Reply */}
                            <TouchableOpacity
                                onPress={() => setReplyingTo(item.id)}
                                className="mr-4"
                            >
                                <Text className="text-gray-400 text-xs">Reply</Text>
                            </TouchableOpacity>

                            {/* Delete (only for comment owner) */}
                            {isOwner && (
                                <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                    <Text className="text-red-500 text-xs">Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Replies */}
                        {item.replies && item.replies.length > 0 && (
                            <View className="mt-3 pl-4 border-l-2 border-gray-700">
                                {item.replies.map((reply) => (
                                    <View key={reply.id} className="mb-2">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-white font-semibold text-sm mr-2">
                                                {reply.user.username}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {formatTimeAgo(reply.createdAt)}
                                            </Text>
                                        </View>
                                        <Text className="text-white text-sm">{reply.text}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Replying Indicator */}
                {replyingTo === item.id && (
                    <View className="mt-2 bg-gray-800 p-2 rounded">
                        <Text className="text-gray-400 text-xs">
                            Replying to @{item.user.username}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-800">
                <Text className="text-white font-bold text-lg">
                    Comments {comments.length > 0 && `(${comments.length})`}
                </Text>
            </View>

            {/* Comments List */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#FF3B5C" />
                </View>
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderComment}
                    contentContainerClassName="px-4"
                    ListEmptyComponent={
                        <View className="items-center justify-center py-12">
                            <Ionicons name="chatbubble-outline" size={48} color="#6B7280" />
                            <Text className="text-gray-400 mt-4">No comments yet</Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Be the first to comment!
                            </Text>
                        </View>
                    }
                    onEndReached={hasMore ? onLoadMore : undefined}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        hasMore ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color="#FF3B5C" />
                            </View>
                        ) : null
                    }
                />
            )}

            {/* Comment Input */}
            {currentUser ? (
                <View className="px-4 py-3 border-t border-gray-800 flex-row items-center">
                    {/* Avatar */}
                    <View className="w-8 h-8 rounded-full bg-gray-700 mr-3" />

                    {/* Input */}
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder={
                            replyingTo ? 'Write a reply...' : 'Add a comment...'
                        }
                        placeholderTextColor="#6B7280"
                        className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-full"
                        multiline
                        maxLength={500}
                    />

                    {/* Cancel Reply Button */}
                    {replyingTo && (
                        <TouchableOpacity
                            onPress={() => setReplyingTo(null)}
                            className="ml-2"
                        >
                            <Ionicons name="close-circle" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmitComment}
                        disabled={!newComment.trim() || submitting}
                        className="ml-2"
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#FF3B5C" />
                        ) : (
                            <Ionicons
                                name="send"
                                size={24}
                                color={newComment.trim() ? '#FF3B5C' : '#6B7280'}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="px-4 py-4 border-t border-gray-800">
                    <Text className="text-gray-400 text-center">
                        Sign in to leave a comment
                    </Text>
                </View>
            )}
        </View>
    );
};

export default CommentSection;
