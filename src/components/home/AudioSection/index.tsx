import { supabaseService } from "@/services/supabase.service";
import type { Audio } from "@/types";
import React, { useEffect, useState } from "react";
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

const { width: screenWidth } = Dimensions.get('window');

export default function AudioSection() {
    const [audioTracks, setAudioTracks] = useState<Audio[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const data = await supabaseService.audio.getAudioTracks();
                setAudioTracks(data.slice(0, 8)); // Take first 8 tracks for better mobile fit
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        loadAudio();
    }, []);

    const renderAudioItem = ({ item }: { item: Audio }) => {
        const coverSource = typeof item.cover === 'string'
            ? { uri: item.cover }
            : item.cover;

        return (
            <TouchableOpacity style={styles.audioCard} activeOpacity={0.7}>
                <View style={styles.audioCoverContainer}>
                    <Image 
                        source={coverSource} 
                        style={styles.audioCover}
                        resizeMode="cover"
                    />
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>
                <View style={styles.audioInfo}>
                    <Text style={styles.audioTitle} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <Text style={styles.audioArtist} numberOfLines={1}>
                        {item.creator}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>Trending Sounds</Text>
                    <Text style={styles.sectionSubtitle}>Popular audio tracks</Text>
                </View>
                <TouchableOpacity >
                    <Text style={styles.viewMoreText}>View more</Text>
                </TouchableOpacity>
            </View>
            
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FF3B5C" />
                    <Text style={styles.loadingText}>Loading sounds...</Text>
                </View>
            ) : (
                <FlatList
                    data={audioTracks}
                    renderItem={renderAudioItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    snapToInterval={140} // Smooth scrolling
                    decelerationRate="fast"
                />
            )}
        </View>
    );
}

const CARD_WIDTH = (screenWidth - 60) / 2.5; // Responsive card width
const CARD_HEIGHT = CARD_WIDTH + 50; // Height based on width

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionHeader: {
        paddingHorizontal: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
        fontWeight: "400",
    },
    viewMoreButton: {
        backgroundColor: "rgba(255, 59, 92, 0.1)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 59, 92, 0.2)",
    },
    viewMoreText: {
        color: "#FF3B5C",
        fontWeight: "500",
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 14,
        paddingRight: 10,
    },
    separator: {
        width: 12,
    },
    audioCard: {
        width: CARD_WIDTH,
        marginBottom: 8,
    },
    audioCoverContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    audioCover: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        borderRadius: 16,
        backgroundColor: "#f8f9fa",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    durationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    audioInfo: {
        flex: 1,
    },
    audioTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1a1a1a",
        lineHeight: 18,
        marginBottom: 2,
    },
    audioArtist: {
        fontSize: 12,
        color: "#666",
        fontWeight: "400",
    },
    loadingContainer: {
        height: CARD_HEIGHT + 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
});