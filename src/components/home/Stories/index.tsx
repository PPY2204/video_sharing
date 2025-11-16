import { supabaseService } from "@/services/supabase.service";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import StoryAvatar from "../StoryAvatar";

interface StoryItem extends User {
    isAdd?: boolean;
    hasStory?: boolean;
    storyCount?: number;
}

interface UserWithStories {
    user: User;
    stories: any[];
}

export default function Stories() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const [usersWithStories, setUsersWithStories] = useState<UserWithStories[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStories = async () => {
            if (!currentUser) return;
            
            try {
                // Load stories from users you follow (pass current user ID)
                const storiesData = await supabaseService.stories.getActiveStories(currentUser.id);
                setUsersWithStories(storiesData);
            } catch (error) {
                console.error('Failed to load stories:', error);
                // If stories table doesn't exist or is empty, show nothing
                setUsersWithStories([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadStories();
    }, [currentUser]);

    // Add "Your Story" as first item, then users with active stories
    const storiesData: StoryItem[] = [
        {
            id: 'add-story',
            username: 'Your Story',
            fullName: 'Add Story',
            email: '',
            profileImage: currentUser?.profileImage || '',
            followers: 0,
            following: 0,
            likes: 0,
            isVerified: false,
            isOnline: false,
            isAdd: true,
            hasStory: false,
        },
        ...usersWithStories.map((item: UserWithStories) => ({
            ...item.user,
            isAdd: false,
            hasStory: true, // They have real stories
            storyCount: item.stories.length,
        })),
    ];

    const renderStory = ({ item }: { item: StoryItem }) => {
        const avatarSource = typeof item.profileImage === 'string'
            ? { uri: item.profileImage }
            : item.profileImage;

        return (
            <StoryAvatar
                id={item.id}
                name={item.isAdd ? 'Your Story' : item.username}
                uri={avatarSource}
                isYou={item.isAdd || false}
                online={item.isOnline || false}
                onPress={() => {
                    // TODO: Navigate to story viewer
                }}
            />
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
    listContainer: {
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    loadingContainer: {
        paddingVertical: 20,
        paddingHorizontal: 14,
        alignItems: 'center',
    },
});
