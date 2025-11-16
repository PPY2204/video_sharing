import React, { memo } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    id: string;
    name: string;
    uri: ImageSourcePropType;
    isYou?: boolean;
    online?: boolean;
    onPress?: () => void;
};

const StoryAvatar = memo<Props>(({ name, uri, isYou = false, online = false, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.avatarWrapper}>
                {/* Story ring - only for users with stories (not "Your Story") */}
                {!isYou && <View style={styles.storyRing} />}
                
                <Image source={uri} style={styles.avatarImage} />

                {/* Overlay icon: + for "Your Story" */}
                {isYou && (
                    <View style={styles.overlayPlus}>
                        <Text style={styles.overlayIcon}>+</Text>
                    </View>
                )}

                {/* Online indicator - blue dot for online users */}
                {!isYou && online && (
                    <View style={styles.onlineIndicator} />
                )}
            </View>

            <Text numberOfLines={1} style={styles.name}>
                {name}
            </Text>
        </TouchableOpacity>
    );
});

StoryAvatar.displayName = 'StoryAvatar';

export default StoryAvatar;

const AVATAR_SIZE = 56;
const OVERLAY_SIZE = 22;

const styles = StyleSheet.create({
    container: {
        width: 72,
        alignItems: "center",
        marginRight: 12,
    },
    avatarWrapper: {
        width: AVATAR_SIZE + 6,
        height: AVATAR_SIZE + 6,
        borderRadius: (AVATAR_SIZE + 6) / 2,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    storyRing: {
        position: "absolute",
        width: AVATAR_SIZE + 6,
        height: AVATAR_SIZE + 6,
        borderRadius: (AVATAR_SIZE + 6) / 2,
        borderWidth: 3,
        borderColor: "#3b82f6",
    },
    avatarImage: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    overlayPlus: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: OVERLAY_SIZE,
        height: OVERLAY_SIZE,
        borderRadius: OVERLAY_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "#ef4444",
        elevation: 3,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    },
    overlayIcon: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginTop: -1,
    },
    onlineIndicator: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 14,
        height: 14,
        backgroundColor: "#3b82f6",
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#fff",
    },
    name: {
        marginTop: 6,
        fontSize: 12,
        textAlign: "center",
        color: "#000",
        fontWeight: "500",
    },
});
