import { CommentSkeleton } from '@/components/skeletons';
import { useComments } from '@/hooks';
import type { User } from '@/types/app.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    videoId: string;
    currentUser: User | null;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ videoId, currentUser }) => {
    const { comments, isLoading, hasMore, loadMore, addComment } = useComments(videoId);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitComment = useCallback(async () => {
        if (!newComment.trim() || !currentUser) return;
        try {
            setSubmitting(true);
            await addComment(newComment.trim(), replyingTo || undefined);
            setNewComment('');
            setReplyingTo(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    }, [newComment, currentUser, replyingTo, addComment]);

    const handleLikeComment = useCallback((commentId: string) => console.log('Like:', commentId), []);
    const handleReplyComment = useCallback((commentId: string) => setReplyingTo(commentId), []);
    const cancelReply = useCallback(() => setReplyingTo(null), []);

    const renderComment = useCallback(({ item }: { item: typeof comments[0] }) => (
        <CommentItem comment={item} onLike={handleLikeComment} onReply={handleReplyComment} />
    ), [handleLikeComment, handleReplyComment, comments]);

    const keyExtractor = useCallback((item: typeof comments[0]) => item.id, []);

    const ListEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyText}>No comments yet</Text>
            <Text style={styles.emptySubtext}>Be the first to comment!</Text>
        </View>
    ), []);

    const ListFooterComponent = useCallback(() => hasMore ? (
        <TouchableOpacity style={styles.loadMore} onPress={loadMore}><Text style={styles.loadMoreText}>Load more</Text></TouchableOpacity>
    ) : null, [hasMore, loadMore]);

    return (
        <View style={styles.container}>
            {isLoading && comments.length === 0 ? (
                <View style={styles.loadingContainer}>{[...Array(5)].map((_, i) => <CommentSkeleton key={i} />)}</View>
            ) : (
                <>
                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={keyExtractor}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={ListEmptyComponent}
                        ListFooterComponent={ListFooterComponent}
                    />
                    {replyingTo && (
                        <View style={styles.replyingBanner}>
                            <Text style={styles.replyingText}>Replying to comment</Text>
                            <TouchableOpacity onPress={cancelReply}><Ionicons name="close" size={20} color="#9CA3AF" /></TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputContainer}>
                        {!currentUser ? (<Text style={styles.loginText}>Log in to comment</Text>) : (
                            <View style={styles.inputRow}>
                                <View style={styles.avatar} />
                                <TextInput style={styles.input} placeholder="Add a comment..." placeholderTextColor="#9CA3AF" value={newComment} onChangeText={setNewComment} multiline maxLength={500} editable={!submitting} />
                                <TouchableOpacity onPress={handleSubmitComment} disabled={!newComment.trim() || submitting} style={[styles.sendButton, (!newComment.trim() || submitting) && styles.sendButtonDisabled]}>
                                    {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="send" size={20} color="#FFF" />}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loadingContainer: { padding: 16 },
    listContent: { paddingHorizontal: 16, paddingVertical: 8 },
    emptyContainer: { paddingVertical: 48, alignItems: 'center' },
    emptyText: { color: '#9CA3AF', marginTop: 12, fontSize: 16 },
    emptySubtext: { color: '#6B7280', fontSize: 14, marginTop: 4 },
    loadMore: { paddingVertical: 12, alignItems: 'center' },
    loadMoreText: { color: '#FF3B5C', fontSize: 14, fontWeight: '500' },
    replyingBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1F2937', borderBottomWidth: 1, borderBottomColor: '#374151' },
    replyingText: { color: '#9CA3AF', fontSize: 14 },
    inputContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#1F2937' },
    loginText: { color: '#9CA3AF', textAlign: 'center', paddingVertical: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#374151' },
    input: { flex: 1, backgroundColor: '#1F2937', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: '#FFF', fontSize: 14 },
    sendButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FF3B5C' },
    sendButtonDisabled: { backgroundColor: '#374151' },
});
