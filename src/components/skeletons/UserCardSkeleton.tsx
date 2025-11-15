/**
 * UserCardSkeleton Component
 * Skeleton placeholder for user cards during loading
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShimmerBox from './ShimmerBox';

export default function UserCardSkeleton() {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <ShimmerBox width={56} height={56} borderRadius={28} />

            <View style={styles.info}>
                {/* Name */}
                <ShimmerBox width={120} height={16} borderRadius={4} />
                <View style={styles.spacer} />
                {/* Username/Bio */}
                <ShimmerBox width={90} height={12} borderRadius={4} />
            </View>

            {/* Follow Button */}
            <ShimmerBox width={80} height={32} borderRadius={16} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    spacer: {
        height: 6,
    },
});
