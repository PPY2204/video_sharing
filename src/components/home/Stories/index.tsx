import { supabaseService } from "@/services/supabase.service";
import type { User } from "@/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StoryItem extends User {
    isAdd?: boolean;
    hasStory?: boolean;
}

export default function Stories() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await supabaseService.users.getUsers();
                setUsers(data.slice(0, 10)); // Take first 10 users
            } catch (error) {
                console.error('Failed to load users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Add "Your Story" as first item
    const storiesData: StoryItem[] = [
        {
            id: 'add-story',
            username: 'Your Story',
            fullName: 'Add Story',
            email: '',
            profileImage: 'https://via.placeholder.com/60',
            followers: 0,
            following: 0,
            likes: 0,
            isVerified: false,
            isOnline: false,
            isAdd: true,
            hasStory: false,
        },
        ...users.map((user: User) => ({
            ...user,
            isAdd: false,
            hasStory: Math.random() > 0.5, // Random for demo
        })),
    ];

    const renderStory = ({ item }: { item: StoryItem }) => {
        const avatarSource = typeof item.profileImage === 'string'
            ? { uri: item.profileImage }
            : item.profileImage;

        return (
            <TouchableOpacity style={styles.storyContainer}>
                <View
                    style={[
                        styles.storyAvatarWrapper,
                        item.hasStory
                            ? styles.storyAvatarWithBorder
                            : styles.storyAvatarNoBorder,
                    ]}
                >
                    <Image
                        source={avatarSource}
                        style={styles.storyAvatar}
                        resizeMode="cover"
                    />
                    {item.isAdd && (
                        <View style={styles.addStoryButton}>
                            <Text style={styles.addStoryIcon}>+</Text>
                        </View>
                    )}
                    {item.hasStory && !item.isAdd && (
                        <View style={styles.onlineIndicator} />
                    )}
                </View>
                <Text style={styles.storyUsername} numberOfLines={1}>
                    {item.username}
                </Text>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FF3B5C" />
            </View>
        );
    }

    return (
        <FlatList
            data={storiesData}
            renderItem={renderStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
        />
    );
}


export const styles = StyleSheet.create({
    storyContainer: {
        width: 72,
        alignItems: "center",
        marginRight: 12,
    },
    storyAvatarWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
    },
    storyAvatarWithBorder: {
        borderWidth: 3,
        borderColor: "#3B82F6",
    },
    storyAvatarNoBorder: {
        borderWidth: 0,
        borderColor: "transparent",
    },
    storyAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    addStoryButton: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 22,
        height: 22,
        backgroundColor: "#EF4444",
        borderRadius: 11,
        borderWidth: 2.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    addStoryIcon: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginTop: -1,
    },
    onlineIndicator: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        backgroundColor: "#3B82F6",
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#fff",
    },
    storyUsername: {
        marginTop: 6,
        fontSize: 12,
        textAlign: "center",
        color: "#000",
        fontWeight: "500",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    loadingContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
});
