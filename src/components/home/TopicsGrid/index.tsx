import { MOCK_TOPICS } from "@/data";
import { TopicItem } from "@/types";
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
const cardWidth = (width - 32 - 36) / 4; // 4 columns with better spacing

export default function TopicsGrid() {
    const renderTopicItem = ({ item }: { item: TopicItem }) => (
        <TouchableOpacity style={styles.topicCard} activeOpacity={0.85}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Image source={item.icon} style={styles.topicIcon} resizeMode="contain" />
            </View>
            <Text style={styles.topicTitle} numberOfLines={1}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Browse topic</Text>
            </View>
            <FlatList
                data={MOCK_TOPICS}
                renderItem={renderTopicItem}
                keyExtractor={(item) => item.id}
                numColumns={4}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
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
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    listContent: {
        paddingHorizontal: 16,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    topicCard: {
        width: cardWidth,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        width: cardWidth - 16,
        height: cardWidth - 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    topicIcon: {
        width: 28,
        height: 28,
    },
    topicTitle: {
        fontSize: 11,
        color: "#000",
        textAlign: "center",
        fontWeight: "500",
    },
});
