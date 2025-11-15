/**
 * CommentItem Component
 * Individual comment display with like/reply actions
 * Optimized with React.memo for list performance
 */

import type { Comment } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentItemProps {
    comment: Comment;
    onLike?: (commentId: string) => void;
    onReply?: (commentId: string) => void;
    onPressUser?: (userId: string) => void;
}

const CommentItem = memo<CommentItemProps>(({ comment, onLike, onReply, onPressUser }) => {
    const handleLike = useCallback(() => {
        onLike?.(comment.id);
    }, [comment.id, onLike]);

    const handleReply = useCallback(() => {
        onReply?.(comment.id);
    }, [comment.id, onReply]);

    const handlePressUser = useCallback(() => {
        onPressUser?.(comment.user.id);
    }, [comment.user.id, onPressUser]);

    // Format time ago
    const timeAgo = formatTimeAgo(comment.createdAt);

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <TouchableOpacity onPress={handlePressUser} activeOpacity={0.7}>
                <Image
                    source={comment.user.profileImage as any}
                    style={styles.avatar}
                />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlePressUser} activeOpacity={0.7}>
                        <Text style={styles.username}>{comment.user.username}</Text>
                    </TouchableOpacity>
                    <Text style={styles.time}>{timeAgo}</Text>
                </View>

                {/* Comment Text */}
                <Text style={styles.text}>{comment.text}</Text>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={comment.isLiked ? "heart" : "heart-outline"}
                            size={16}
                            color={comment.isLiked ? "#FF3B5C" : "#6B7280"}
                        />
                        {comment.likes > 0 && (
                            <Text style={[styles.actionText, comment.isLiked && styles.actionTextLiked]}>
                                {formatCount(comment.likes)}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleReply}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>
                </View>

                {/* Replies indicator */}
                {comment.replies && comment.replies.length > 0 && (
                    <TouchableOpacity
                        style={styles.repliesIndicator}
                        onPress={handleReply}
                        activeOpacity={0.7}
                    >
                        <View style={styles.replyLine} />
                        <Text style={styles.repliesText}>
                            View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;

// Helper functions
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
}

function formatCount(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E5E7EB',
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    text: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    actionTextLiked: {
        color: '#FF3B5C',
    },
    repliesIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    replyLine: {
        width: 24,
        height: 2,
        backgroundColor: '#E5E7EB',
    },
    repliesText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
});
