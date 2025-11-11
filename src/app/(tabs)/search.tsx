import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const searchVideos = [
    {
        id: "1",
        image: require("@/assets/images/search/container-40.png"),
        title: "Eiusmod Lorem aliquip exercitation",
        views: "1.5M",
        likes: "12.1K",
        tag: "1 min ago",
        user: { name: "Laura", avatar: require("@/assets/images/search/Laura.png") },
    },
    {
        id: "2",
        image: require("@/assets/images/search/container-41.png"),
        title: "Reprehenderit ad fugiat nulla mollit",
        views: "12.4K",
        likes: "19.6K",
        tag: "1 min ago",
        user: { name: "Liz", avatar: require("@/assets/images/search/Liz.png") },
    },
    {
        id: "3",
        image: require("@/assets/images/search/container-43.png"),
        title: "Consectetur est aliquip adipisicing",
        views: "1.5M",
        likes: "24.3K",
        user: { name: "Cris", avatar: require("@/assets/images/search/Cris.png") },
    },
    {
        id: "4",
        image: require("@/assets/images/search/container-44.png"),
        title: "Aute adipisicing ea in nostrud sunt",
        views: "1.5M",
        likes: "29.7K",
        user: { name: "Lina", avatar: require("@/assets/images/search/Lina.png") },
    },
];

const suggestedTags = [
    "Funny moments of pet",
    "Cats",
    "Dogs",
    "Foods for pet",
    "Vet center",
];

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("Pet");
    const [activeTab, setActiveTab] = useState("trending");

    const renderVideoItem = ({ item }: { item: typeof searchVideos[0] }) => (
        <View style={styles.videoCard}>
            <TouchableOpacity activeOpacity={0.85}>
                <View style={styles.videoImageContainer}>
                    <Image
                        source={item.image}
                        style={styles.videoImage}
                        resizeMode="cover"
                    />

                    {/* Tag "1 min ago" with fire icon */}
                    {item.tag && (
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>🔥 {item.tag}</Text>
                        </View>
                    )}

                    {/* Views and Likes */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={styles.statBadge}>
                                <Ionicons name="play" size={12} color="white" />
                                <Text style={styles.statText}>{item.views} views</Text>
                            </View>
                            <View style={styles.statBadge}>
                                <Ionicons name="heart" size={12} color="white" />
                                <Text style={styles.statText}>{item.likes}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
            </Text>

            {/* User info */}
            <View style={styles.userInfo}>
                <Image source={item.user.avatar} style={styles.avatar} />
                <Text style={styles.username}>{item.user.name}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                        <Ionicons name="options-outline" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsContainer}
                contentContainerStyle={styles.tabsContent}
            >
                <TouchableOpacity
                    onPress={() => setActiveTab("trending")}
                    activeOpacity={0.8}
                    style={[styles.tab, activeTab === "trending" && styles.tabActive]}
                >
                    <Text style={[styles.tabText, activeTab === "trending" && styles.tabTextActive]}>
                        Trending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("accounts")}
                    activeOpacity={0.8}
                    style={[styles.tab, activeTab === "accounts" && styles.tabActive]}
                >
                    <Text style={[styles.tabText, activeTab === "accounts" && styles.tabTextActive]}>
                        Accounts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("streaming")}
                    activeOpacity={0.8}
                    style={[styles.tab, activeTab === "streaming" && styles.tabActive]}
                >
                    <Text style={[styles.tabText, activeTab === "streaming" && styles.tabTextActive]}>
                        Streaming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("audio")}
                    activeOpacity={0.8}
                    style={[styles.tab, activeTab === "audio" && styles.tabActive]}
                >
                    <Text style={[styles.tabText, activeTab === "audio" && styles.tabTextActive]}>
                        Audio
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Videos Grid */}
                <View style={styles.gridContainer}>
                    <FlatList
                        data={searchVideos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.gridRow}
                        scrollEnabled={false}
                    />
                </View>

                <TouchableOpacity style={styles.showMoreButton} activeOpacity={0.7}>
                    <View style={styles.showMoreContent}>
                        <Text style={styles.showMoreText}>Show more</Text>
                        <Ionicons name="chevron-down" size={18} color="#EC4899" />
                    </View>
                </TouchableOpacity>

                {/* Maybe You're Interested */}
                <View style={styles.suggestedSection}>
                    <Text style={styles.suggestedTitle}>Maybe you're interested</Text>
                    <View style={styles.tagsContainer}>
                        {suggestedTags.map((tag, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.tag}
                                activeOpacity={0.75}
                            >
                                <Text style={styles.tagText2}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
        color: '#000',
    },
    filterButton: {
        marginLeft: 12,
        padding: 4,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tabsContent: {
        gap: 10,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 15,
        backgroundColor: '#F3F4F6',
    },
    tabActive: {
        backgroundColor: '#EC4899',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#374151',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    content: {
        paddingTop: 8,
    },
    gridContainer: {
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    gridRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    videoCard: {
        width: '48%',
        marginBottom: 20,
    },
    videoImageContainer: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
    },
    videoImage: {
        width: '100%',
        height: 224,
    },
    tagBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 9999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statText: {
        color: '#FFFFFF',
        fontSize: 10,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    videoTitle: {
        fontSize: 13,
        marginTop: 10,
        fontWeight: 'bold',
        color: '#111827',
        lineHeight: 18,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    username: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    showMoreButton: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    showMoreContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showMoreText: {
        color: '#EC4899',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 6,
    },
    suggestedSection: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    suggestedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#111827',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tag: {
        backgroundColor: '#EFF6FF',
        borderRadius: 9999,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    tagText2: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
    },
});
