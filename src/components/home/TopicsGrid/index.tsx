import { supabaseService } from "@/services/supabase.service";
import { TopicItem } from "@/types";
import {
    Atom,
    Bookmark,
    Briefcase,
    Camera,
    Car,
    ChefHat,
    CloudSun,
    Dog,
    Dumbbell,
    Film,
    Gamepad2,
    GraduationCap,
    Hammer,
    HeartPulse,
    Laptop,
    Laugh,
    Mic,
    Music,
    Music2,
    Newspaper,
    Palette,
    Plane,
    Shirt,
    Sparkles,
    Trees,
    Trophy,
    UtensilsCrossed,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32 - 36) / 4; // 4 columns with better spacing

export default function TopicsGrid() {
    const [topics, setTopics] = useState<TopicItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await supabaseService.topics.getTopics();
                setTopics(data);
            } catch (error) {
                setTopics([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTopics();
    }, []);

    // Map topic titles to Lucide icons with colors from database
    const getTopicIcon = (title: string) => {
        const size = 28;
        const strokeWidth = 2;
        
        switch (title) {
            case 'Art': return <Palette size={size} strokeWidth={strokeWidth} color="#438EFF" />;
            case 'Weather': return <CloudSun size={size} strokeWidth={strokeWidth} color="#F4AE83" />;
            case 'Sports': return <Trophy size={size} strokeWidth={strokeWidth} color="#F45E94" />;
            case 'News': return <Newspaper size={size} strokeWidth={strokeWidth} color="#FFC51A" />;
            case 'Podcasts': return <Mic size={size} strokeWidth={strokeWidth} color="#2E82FF" />;
            case 'Travel': return <Plane size={size} strokeWidth={strokeWidth} color="#2AD4FF" />;
            case 'Health': return <HeartPulse size={size} strokeWidth={strokeWidth} color="#8752F4" />;
            case 'Food': return <UtensilsCrossed size={size} strokeWidth={strokeWidth} color="#FDD14A" />;
            case 'Gaming': return <Gamepad2 size={size} strokeWidth={strokeWidth} color="#FF6B6B" />;
            case 'Music': return <Music size={size} strokeWidth={strokeWidth} color="#A855F7" />;
            case 'Fashion': return <Shirt size={size} strokeWidth={strokeWidth} color="#EC4899" />;
            case 'Tech': return <Laptop size={size} strokeWidth={strokeWidth} color="#3B82F6" />;
            case 'Comedy': return <Laugh size={size} strokeWidth={strokeWidth} color="#F59E0B" />;
            case 'Education': return <GraduationCap size={size} strokeWidth={strokeWidth} color="#10B981" />;
            case 'Beauty': return <Sparkles size={size} strokeWidth={strokeWidth} color="#F472B6" />;
            case 'DIY': return <Hammer size={size} strokeWidth={strokeWidth} color="#F97316" />;
            case 'Pets': return <Dog size={size} strokeWidth={strokeWidth} color="#84CC16" />;
            case 'Science': return <Atom size={size} strokeWidth={strokeWidth} color="#06B6D4" />;
            case 'Movies': return <Film size={size} strokeWidth={strokeWidth} color="#8B5CF6" />;
            case 'Dance': return <Music2 size={size} strokeWidth={strokeWidth} color="#EC4899" />;
            case 'Cooking': return <ChefHat size={size} strokeWidth={strokeWidth} color="#F59E0B" />;
            case 'Fitness': return <Dumbbell size={size} strokeWidth={strokeWidth} color="#EF4444" />;
            case 'Nature': return <Trees size={size} strokeWidth={strokeWidth} color="#22C55E" />;
            case 'Cars': return <Car size={size} strokeWidth={strokeWidth} color="#3B82F6" />;
            case 'Photography': return <Camera size={size} strokeWidth={strokeWidth} color="#8B5CF6" />;
            case 'Business': return <Briefcase size={size} strokeWidth={strokeWidth} color="#0EA5E9" />;
            case 'Lifestyle': return <Sparkles size={size} strokeWidth={strokeWidth} color="#A855F7" />;
            default: return <Bookmark size={size} strokeWidth={strokeWidth} color="#6B7280" />;
        }
    };

    const renderTopicItem = ({ item }: { item: TopicItem }) => {
        return (
            <TouchableOpacity style={styles.topicCard} activeOpacity={0.85}>
                <View style={[styles.iconContainer, { backgroundColor: "#f8f9fa" }]}>
                    {getTopicIcon(item.title)}
                </View>
                <Text style={styles.topicTitle} numberOfLines={1}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Browse Topic</Text>
                </View>
                <ActivityIndicator size="small" color="#888" style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Browse topic</Text>
            </View>
            <FlatList
                data={topics}
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
        paddingHorizontal: 14,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    listContent: {
        paddingHorizontal: 14,
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
        width: 32,
        height: 32,
    },
    placeholderIcon: {
        fontSize: 24,
        fontWeight: "700",
        color: "#666",
        textAlign: "center",
    },
    topicTitle: {
        fontSize: 11,
        color: "#000",
        textAlign: "center",
        fontWeight: "500",
    },
});
