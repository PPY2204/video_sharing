/**
 * ListSkeleton Component
 * Generic skeleton for FlatList loading states
 * Renders multiple skeleton items in a list
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CommentSkeleton from './CommentSkeleton';
import UserCardSkeleton from './UserCardSkeleton';
import VideoCardSkeleton from './VideoCardSkeleton';

type SkeletonType = 'video' | 'user' | 'comment';

interface ListSkeletonProps {
    type: SkeletonType;
    count?: number;
}

export default function ListSkeleton({ type, count = 3 }: ListSkeletonProps) {
    const SkeletonComponent = {
        video: VideoCardSkeleton,
        user: UserCardSkeleton,
        comment: CommentSkeleton,
    }[type];

    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={`skeleton-${index}`} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
