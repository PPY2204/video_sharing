/**
 * VideoCardSkeleton Component
 * Skeleton placeholder for video cards during loading
 * Uses React Native Animated for smooth shimmer effect
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShimmerBox from './ShimmerBox';

export default function VideoCardSkeleton() {
    return (
        <View style={styles.container}>
            {/* Video Thumbnail */}
            <ShimmerBox width="100%" height={200} borderRadius={12} />

            <View style={styles.content}>
                {/* User Avatar + Name */}
                <View style={styles.userRow}>
                    <ShimmerBox width={40} height={40} borderRadius={20} />
                    <View style={styles.userInfo}>
                        <ShimmerBox width={120} height={16} borderRadius={4} />
                        <View style={styles.spacer} />
                        <ShimmerBox width={80} height={12} borderRadius={4} />
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <ShimmerBox width="90%" height={18} borderRadius={4} />
                    <View style={styles.spacer} />
                    <ShimmerBox width="70%" height={18} borderRadius={4} />
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <ShimmerBox width={60} height={14} borderRadius={4} />
                    <ShimmerBox width={60} height={14} borderRadius={4} />
                    <ShimmerBox width={60} height={14} borderRadius={4} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInfo: {
        marginLeft: 12,
        flex: 1,
    },
    spacer: {
        height: 8,
    },
    titleSection: {
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
});
