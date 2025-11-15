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
            <View style={[styles.avatarWrapper, online && styles.onlineRing]}>
                <Image source={uri} style={styles.avatarImage} />

                {/* Overlay icon: + for "You", camera emoji for others */}
                <View style={[styles.overlay, isYou ? styles.overlayPlus : styles.overlayVideo]}>
                    <Text style={styles.overlayIcon}>{isYou ? "+" : "📹"}</Text>
                </View>
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
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        position: "relative",
    },
    onlineRing: {
        borderWidth: 3,
        borderColor: "#3b82f6", // blue ring for online users
    },
    avatarImage: {
        width: AVATAR_SIZE - 6,
        height: AVATAR_SIZE - 6,
        borderRadius: (AVATAR_SIZE - 6) / 2,
    },
    overlay: {
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
        elevation: 3,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    },
    overlayPlus: {
        backgroundColor: "#ff2d55", // pink/red for "You"
    },
    overlayVideo: {
        backgroundColor: "#3b82f6", // blue for others
    },
    overlayIcon: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 14,
        fontWeight: "700",
    },
    name: {
        marginTop: 6,
        fontSize: 11,
        textAlign: "center",
        color: "#111827",
    },
});
