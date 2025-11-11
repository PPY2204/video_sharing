import { MOCK_TRENDING } from "@/data";
import type { TrendingItem } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
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

    const renderTrendingItem = ({ item }: { item: TrendingItem }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/video/${item.id}`)}
        >
            <View style={styles.cardContainer}>
                <Image
                    source={item.image}
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
                                source={
                                    typeof item.user.profileImage === "string"
                                        ? { uri: item.user.profileImage }
                                        : item.user.profileImage
                                }
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        )}
                        <Text style={styles.views}>{item.views} views</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Top trending</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/trending")}>
                    <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_TRENDING}
                renderItem={renderTrendingItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
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
        paddingHorizontal: 16,
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
        paddingHorizontal: 16,
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
        fontWeight: "700",
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
        fontWeight: "500",
    },
});
