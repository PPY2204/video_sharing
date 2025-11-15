/**
 * CommentSkeleton Component
 * Skeleton placeholder for comments during loading
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShimmerBox from './ShimmerBox';

export default function CommentSkeleton() {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <ShimmerBox width={36} height={36} borderRadius={18} />

            <View style={styles.content}>
                {/* Username + Time */}
                <View style={styles.header}>
                    <ShimmerBox width={100} height={14} borderRadius={4} />
                    <ShimmerBox width={60} height={12} borderRadius={4} />
                </View>

                {/* Comment Text */}
                <View style={styles.textSection}>
                    <ShimmerBox width="100%" height={14} borderRadius={4} />
                    <View style={styles.spacer} />
                    <ShimmerBox width="80%" height={14} borderRadius={4} />
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <ShimmerBox width={50} height={12} borderRadius={4} />
                    <ShimmerBox width={50} height={12} borderRadius={4} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    textSection: {
        marginBottom: 8,
    },
    spacer: {
        height: 6,
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
});
