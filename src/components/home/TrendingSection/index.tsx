import { useTrendingVideos } from "@/hooks/useVideos";
import type { Video } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2.3;

export default function TrendingSection() {
    const router = useRouter();
    const { videos, isLoading } = useTrendingVideos(5);

    const formatViews = (views: number) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    const renderTrendingItem = ({ item }: { item: Video }) => {
        const thumbnailSource = typeof item.thumbnail === 'string'
            ? { uri: item.thumbnail }
            : item.thumbnail;

        const avatarSource = item.user?.profileImage
            ? typeof item.user.profileImage === 'string'
                ? { uri: item.user.profileImage }
                : item.user.profileImage
            : require('@/assets/images/home/You.png');

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => router.push(`/video/${item.id}`)}
            >
                <View style={styles.cardContainer}>
                    <Image
                        source={thumbnailSource}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={styles.statsRow}>
                            {item.user && (
                                <Image
                                    source={avatarSource}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                />
                            )}
                            <Text style={styles.views}>{formatViews(item.views)} views</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Top Trending</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/trending")}>
                    <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FF3B5C" />
                </View>
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderTrendingItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    viewMore: {
        fontSize: 14,
        color: "#FF3B5C",
        fontWeight: "500",
    },
    listContent: {
        paddingHorizontal: 14,
    },
    separator: {
        width: 12,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        overflow: "hidden",
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.35,
        position: 'relative',
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        paddingTop: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: "400",
        color: "#fff",
        marginBottom: 6,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 16,
        height: 16,
        borderRadius: 11,
        marginRight: 6,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    views: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "300",
    },
    loadingContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
    },
});
