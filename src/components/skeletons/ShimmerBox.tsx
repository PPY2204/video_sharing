/**
 * ShimmerBox Component
 * Reusable shimmer/skeleton box with animation
 * Used across all skeleton components
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ShimmerBoxProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export default function ShimmerBox({
    width,
    height,
    borderRadius = 4,
    style
}: ShimmerBoxProps) {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    // Create dynamic style object
    const boxStyle: ViewStyle = {
        width: width as any,
        height,
        borderRadius,
        backgroundColor: '#E1E9EE',
    };

    return (
        <Animated.View
            style={[
                boxStyle,
                style,
                { opacity },
            ]}
        />
    );
}
