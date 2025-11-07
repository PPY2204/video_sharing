import { Card, Story } from "@/types";
import React, { FC } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");



const stories: Story[] = [
    { id: "you", name: "You", uri: "https://placeimg.com/100/100/people" },
    { id: "adam", name: "Adam", uri: "https://placeimg.com/101/100/people", online: true },
    { id: "will", name: "William", uri: "https://placeimg.com/102/100/people", online: true },
    { id: "peter", name: "Peter", uri: "https://placeimg.com/103/100/people" },
    { id: "julia", name: "Julia", uri: "https://placeimg.com/104/100/people", online: true },
];

const trending: Card[] = [
    {
        id: "dog",
        title: "Lovely",
        views: "1.5M views",
        image: "https://placeimg.com/640/480/animals",
        avatar: "https://placeimg.com/50/50/people",
    },
    {
        id: "donut",
        title: "Sweet",
        views: "1.2M views",
        image: "https://placeimg.com/640/480/food",
        avatar: "https://placeimg.com/51/50/people",
    },
    {
        id: "travel",
        title: "Explore",
        views: "1.8M views",
        image: "https://placeimg.com/640/480/nature",
        avatar: "https://placeimg.com/52/50/people",
    },
];

const streaming: Card[] = [
    {
        id: "life",
        title: "Lifestyle",
        views: "1.5M views",
        image: "https://placeimg.com/640/480/people",
        avatar: "https://placeimg.com/53/50/people",
        badge: "1 min ago",
    },
    {
        id: "cook",
        title: "Cooking",
        views: "1.3M views",
        image: "https://placeimg.com/641/480/food",
        avatar: "https://placeimg.com/54/50/people",
        badge: "45 min ago",
    },
    {
        id: "dance",
        title: "Dancing",
        views: "2M views",
        image: "https://placeimg.com/642/480/people",
        avatar: "https://placeimg.com/55/50/people",
        badge: "45 min ago",
    },
];

const audio: Card[] = [
    { id: "a1", title: "Perfect lady", views: "Bookcase", image: "https://placeimg.com/200/200/people" },
    { id: "a2", title: "Experience", views: "Lifestyle", image: "https://placeimg.com/201/200/nature" },
    { id: "a3", title: "Yourself", views: "Bookcase", image: "https://placeimg.com/202/200/abstract" },
    { id: "a4", title: "Experience", views: "Lifestyle", image: "https://placeimg.com/203/200/nature" },
];

const topics = [
    { id: "sports", title: "Sports", icon: "🚲" },
    { id: "podcast", title: "Podcasts", icon: "🎙️" },
    { id: "news", title: "News", icon: "📄" },
    { id: "travel", title: "Travel", icon: "🌐" },
    { id: "health", title: "Health", icon: "💜" },
    { id: "weather", title: "Weather", icon: "🔆" },
    { id: "art", title: "Art", icon: "🖼️" },
    { id: "more", title: "+20 Topics", icon: "➕" },
];

const Home: FC = () => {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <View style={styles.brand}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>VV</Text>
                    </View>
                    <Text style={styles.title}>Video Sharing App</Text>
                </View>
                <TouchableOpacity style={styles.bell}>
                    <Text style={styles.bellText}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Stories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stories}>
                    {stories.map((s) => (
                        <View key={s.id} style={styles.storyItem}>
                            <View style={[styles.storyAvatarWrapper, s.online ? styles.onlineRing : null]}>
                                <Image source={{ uri: s.uri }} style={styles.storyAvatar} />
                            </View>
                            <Text style={styles.storyName} numberOfLines={1}>
                                {s.name}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Top trending */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top trending</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View more</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {trending.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.trendingCard}>
                            <ImageBackground source={{ uri: item.image }} style={styles.trendingImage} imageStyle={styles.cardImage}>
                                <View style={styles.trendingOverlay}>
                                    <View>
                                        <Text style={styles.cardTitle}>{item.title}</Text>
                                        <Text style={styles.cardViews}>{item.views}</Text>
                                    </View>
                                    <Image source={{ uri: item.avatar }} style={styles.cardAvatar} />
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Browse topic */}
                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Browse topic</Text>
                <View style={styles.topicsGrid}>
                    {topics.map((t) => (
                        <TouchableOpacity key={t.id} style={styles.topicCard}>
                            <Text style={styles.topicIcon}>{t.icon}</Text>
                            <Text style={styles.topicTitle}>{t.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Streaming */}
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                    <Text style={styles.sectionTitle}>Streaming</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View more</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {streaming.map((s) => (
                        <TouchableOpacity key={s.id} style={styles.streamCard}>
                            <ImageBackground source={{ uri: s.image }} style={styles.streamImage} imageStyle={styles.cardImage}>
                                {s.badge ? (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{s.badge}</Text>
                                    </View>
                                ) : null}
                                <View style={styles.streamOverlay}>
                                    <View>
                                        <Text style={styles.cardTitle}>{s.title}</Text>
                                        <Text style={styles.cardViews}>{s.views}</Text>
                                    </View>
                                    {s.avatar ? <Image source={{ uri: s.avatar }} style={styles.cardAvatar} /> : null}
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Audio */}
                <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                    <Text style={styles.sectionTitle}>Audio</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View more</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {audio.map((a) => (
                        <TouchableOpacity key={a.id} style={styles.audioCard}>
                            <Image source={{ uri: a.image }} style={styles.audioImage} />
                            <Text style={styles.audioTitle} numberOfLines={1}>
                                {a.title}
                            </Text>
                            <Text style={styles.audioSubtitle}>{a.views}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const cardWidth = Math.round(width * 0.6);
const streamCardWidth = Math.round(width * 0.56);

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    brand: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#ff6b9e",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    logoText: {
        color: "white",
        fontWeight: "700",
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
    },
    bell: {
        padding: 8,
    },
    bellText: {
        fontSize: 20,
    },
    container: {
        paddingBottom: 24,
    },
    stories: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    storyItem: {
        width: 64,
        alignItems: "center",
        marginRight: 12,
    },
    storyAvatarWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        padding: 2,
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    onlineRing: {
        borderWidth: 3,
        borderColor: "#6ee7b7",
    },
    storyAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    storyName: {
        marginTop: 6,
        fontSize: 12,
        textAlign: "center",
    },
    sectionHeader: {
        marginTop: 6,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    viewMore: {
        color: "#ff6b9e",
        fontWeight: "600",
    },
    horizontalList: {
        paddingLeft: 16,
        paddingTop: 12,
        paddingBottom: 6,
    },
    trendingCard: {
        width: cardWidth,
        marginRight: 14,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        backgroundColor: "#ddd",
    },
    trendingImage: {
        width: "100%",
        height: 180,
        justifyContent: "flex-end",
    },
    cardImage: {
        resizeMode: "cover",
    },
    trendingOverlay: {
        padding: 12,
        backgroundColor: "rgba(0,0,0,0.35)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    cardViews: {
        color: "#fff",
        marginTop: 4,
        fontSize: 12,
    },
    cardAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#fff",
    },
    topicsGrid: {
        paddingHorizontal: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    topicCard: {
        width: (width - 16 * 2 - 12) / 4,
        height: 80,
        backgroundColor: "#f7f7fb",
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    topicIcon: {
        fontSize: 20,
        marginBottom: 6,
    },
    topicTitle: {
        fontSize: 12,
        color: "#111827",
        textAlign: "center",
    },
    streamCard: {
        width: streamCardWidth,
        marginRight: 14,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#ddd",
    },
    streamImage: {
        width: "100%",
        height: 200,
        justifyContent: "space-between",
    },
    badge: {
        backgroundColor: "#ff4d6d",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        margin: 10,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    streamOverlay: {
        padding: 12,
        backgroundColor: "rgba(0,0,0,0.28)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    audioCard: {
        width: 120,
        marginRight: 12,
        alignItems: "flex-start",
    },
    audioImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: "#eee",
    },
    audioTitle: {
        marginTop: 8,
        fontWeight: "700",
        fontSize: 14,
    },
    audioSubtitle: {
        fontSize: 12,
        color: "#6b7280",
    },
});