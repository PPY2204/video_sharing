import { MOCK_STORIES } from "@/data";
import type { StoryItem } from "@/types";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Stories() {
    const renderStory = ({ item }: { item: StoryItem }) => (
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
                    source={item.profileImage}
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

    return (
        <FlatList
            data={MOCK_STORIES}
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
});
