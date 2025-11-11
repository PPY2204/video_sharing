import { MOCK_STREAMS } from "@/data";
import type { StreamItem } from "@/types";
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = Math.round(width * 0.56);

export default function StreamSection() {
    const renderStreamItem = ({ item }: { item: StreamItem }) => (
        <TouchableOpacity style={styles.streamCard} activeOpacity={0.9}>
            <ImageBackground
                source={item.image}
                style={styles.streamImage}
                imageStyle={styles.imageStyle}
            >
                {item.isLive && (
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                )}
                <View style={styles.streamOverlay}>
                    <View style={styles.streamInfo}>
                        <Text style={styles.streamTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.streamViews}>{item.views} viewers</Text>
                    </View>
                    <Image source={item.avatar} style={styles.streamAvatar} />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Streaming</Text>
                <TouchableOpacity>
                    <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={MOCK_STREAMS}
                renderItem={renderStreamItem}
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
    sectionHeader: {
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    viewMore: {
        color: "#FF3B5C",
        fontWeight: "500",
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 8,
    },
    separator: {
        width: 12,
    },
    streamCard: {
        width: cardWidth,
        borderRadius: 16,
        overflow: "hidden",
    },
    streamImage: {
        width: "100%",
        height: 220,
        justifyContent: "space-between",
    },
    imageStyle: {
        borderRadius: 16,
    },
    liveBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#EF4444",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    streamOverlay: {
        padding: 14,
        backgroundColor: "rgba(0,0,0,0.5)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    streamInfo: {
        flex: 1,
        marginRight: 10,
    },
    streamTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 4,
    },
    streamViews: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.95,
    },
    streamAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        borderColor: "#fff",
    },
});
