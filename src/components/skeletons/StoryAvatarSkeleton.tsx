/**
 * StoryAvatarSkeleton Component
 * Skeleton placeholder for story avatars
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShimmerBox from './ShimmerBox';

export default function StoryAvatarSkeleton() {
    return (
        <View style={styles.container}>
            {/* Avatar Circle */}
            <ShimmerBox width={64} height={64} borderRadius={32} />
            <View style={styles.spacer} />
            {/* Name */}
            <ShimmerBox width={50} height={12} borderRadius={4} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
    },
    spacer: {
        height: 8,
    },
});
