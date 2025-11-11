import { MOCK_AUDIO_ITEMS } from "@/data";
import type { AudioItem } from "@/types";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AudioSection() {
    const renderAudioItem = ({ item }: { item: AudioItem }) => (
        <TouchableOpacity style={styles.audioCard} activeOpacity={0.8}>
            <Image source={item.cover} style={styles.audioCover} />
            <Text style={styles.audioTitle} numberOfLines={1}>
                {item.title}
            </Text>
            <Text style={styles.audioArtist} numberOfLines={1}>
                {item.artist}
            </Text>
            <Text style={styles.audioDuration}>{item.duration}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Audio</Text>
                <TouchableOpacity>
                    <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={MOCK_AUDIO_ITEMS}
                renderItem={renderAudioItem}
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
        paddingHorizontal: 16,
    },
    separator: {
        width: 14,
    },
    audioCard: {
        width: 115,
    },
    audioCover: {
        width: 115,
        height: 115,
        borderRadius: 14,
        backgroundColor: "#f5f5f5",
    },
    audioTitle: {
        marginTop: 8,
        fontWeight: "700",
        fontSize: 13,
        color: "#000",
    },
    audioArtist: {
        fontSize: 11,
        color: "#666",
        marginTop: 3,
        fontWeight: "500",
    },
    audioDuration: {
        fontSize: 10,
        color: "#999",
        marginTop: 2,
    },
});
