/**
 * FollowButton Component
 * Reusable follow/unfollow button with optimistic updates
 * Uses custom hook for follow logic
 */

import { useFollowUser } from '@/hooks';
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FollowButtonProps {
    userId: string;
    initialFollowing?: boolean;
    variant?: 'primary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    onToggle?: (isFollowing: boolean) => void;
}

const FollowButton = memo<FollowButtonProps>(({
    userId,
    initialFollowing = false,
    variant = 'primary',
    size = 'medium',
    onToggle
}) => {
    const { isFollowing, isLoading, toggle } = useFollowUser(userId, initialFollowing);

    const handlePress = async () => {
        await toggle();
        onToggle?.(isFollowing);
    };

    const buttonStyle = [
        styles.button,
        styles[`button_${size}`],
        variant === 'outline' ? styles.buttonOutline : styles.buttonPrimary,
        isFollowing && variant === 'primary' && styles.buttonFollowing,
    ];

    const textStyle = [
        styles.text,
        styles[`text_${size}`],
        variant === 'outline' ? styles.textOutline : styles.textPrimary,
        isFollowing && variant === 'primary' && styles.textFollowing,
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={handlePress}
            disabled={isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? '#FF3B5C' : '#fff'}
                />
            ) : (
                <Text style={textStyle}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Text>
            )}
        </TouchableOpacity>
    );
});

FollowButton.displayName = 'FollowButton';

export default FollowButton;

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        minWidth: 80,
    },
    button_small: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    button_medium: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    button_large: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonPrimary: {
        backgroundColor: '#FF3B5C',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FF3B5C',
    },
    buttonFollowing: {
        backgroundColor: '#E5E7EB',
    },
    text: {
        fontWeight: '600',
    },
    text_small: {
        fontSize: 13,
    },
    text_medium: {
        fontSize: 14,
    },
    text_large: {
        fontSize: 15,
    },
    textPrimary: {
        color: '#fff',
    },
    textOutline: {
        color: '#FF3B5C',
    },
    textFollowing: {
        color: '#6B7280',
    },
});
