import { useDebounce } from "@/hooks/useDebounce";
import { useUsers } from "@/hooks/useUsers";
import { useSearchVideos } from "@/hooks/useVideos";
import { supabaseService } from "@/services/supabase.service";
import { User, Video } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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



export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"trending" | "accounts" | "streaming" | "audio">("trending");
    const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
    const [streamingVideos, setStreamingVideos] = useState<Video[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isLoadingTrending, setIsLoadingTrending] = useState(true);
    const [isLoadingStreaming, setIsLoadingStreaming] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(10);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        sortBy: 'recent' as 'recent' | 'popular' | 'views',
        duration: 'all' as 'all' | 'short' | 'medium' | 'long'
    });
    
    const { results: searchResults, isLoading: isSearching, search } = useSearchVideos();
    const { users, isLoading: isLoadingUsers, fetchUsers } = useUsers();
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Load trending videos on mount
    useEffect(() => {
        loadTrendingVideos();
        loadSuggestedTags();
    }, []);

    // Load videos when tab changes
    useEffect(() => {
        if (activeTab === "streaming" && streamingVideos.length === 0) {
            loadStreamingVideos();
        }
    }, [activeTab]);

    // Search when debounced query changes
    useEffect(() => {
        if (debouncedSearch.trim()) {
            if (activeTab === "accounts") {
                fetchUsers();
            } else if (activeTab === "trending" || activeTab === "streaming") {
                search(debouncedSearch);
            }
        }
    }, [debouncedSearch, activeTab]);

    const loadTrendingVideos = async () => {
        try {
            setIsLoadingTrending(true);
            const videos = await supabaseService.videos.getTrendingVideos();
            setTrendingVideos(videos);
        } catch (error) {
            console.error("Error loading trending videos:", error);
        } finally {
            setIsLoadingTrending(false);
        }
    };

    const loadStreamingVideos = async () => {
        try {
            setIsLoadingStreaming(true);
            const videos = await supabaseService.videos.getVideos(1, 20);
            setStreamingVideos(videos.data);
        } catch (error) {
            console.error("Error loading streaming videos:", error);
        } finally {
            setIsLoadingStreaming(false);
        }
    };

    const loadSuggestedTags = async () => {
        try {
            const topics = await supabaseService.topics.getTopics();
            setSuggestedTags(topics.slice(0, 8).map(t => t.title));
        } catch (error) {
            setSuggestedTags(["Gaming", "Music", "Sports", "Food", "Travel", "Fashion", "Tech", "Art"]);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getDisplayVideos = (): Video[] => {
        let videos: Video[] = [];
        
        if (searchQuery.trim() && searchResults.length > 0) {
            videos = searchResults;
        } else if (activeTab === "streaming") {
            videos = streamingVideos;
        } else {
            videos = trendingVideos;
        }

        // Apply sorting based on filter
        if (filterOptions.sortBy === 'popular') {
            videos = [...videos].sort((a, b) => b.likes - a.likes);
        } else if (filterOptions.sortBy === 'views') {
            videos = [...videos].sort((a, b) => b.views - a.views);
        }

        // Apply duration filter
        if (filterOptions.duration !== 'all') {
            videos = videos.filter(v => {
                if (filterOptions.duration === 'short') return v.duration < 60;
                if (filterOptions.duration === 'medium') return v.duration >= 60 && v.duration < 300;
                if (filterOptions.duration === 'long') return v.duration >= 300;
                return true;
            });
        }

        return videos.slice(0, displayLimit);
    };

    const renderVideoItem = ({ item }: { item: Video }) => {

        return (
            <View style={styles.videoCard}>
                <TouchableOpacity 
                    activeOpacity={0.85}
                    onPress={() => router.push(`/video/${item.id}`)}
                >
                    <View style={styles.videoImageContainer}>
                        <Image
                            source={{ uri: typeof item.thumbnail === 'string' ? item.thumbnail : '' }}
                            style={styles.videoImage}
                            resizeMode="cover"
                        />

                    {/* Views and Likes */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={styles.statBadge}>
                                <Ionicons name="play" size={12} color="white" />
                                <Text style={styles.statText}>{formatNumber(item.views)} views</Text>
                            </View>
                            <View style={styles.statBadge}>
                                <Ionicons name="heart" size={12} color="white" />
                                <Text style={styles.statText}>{formatNumber(item.likes)}</Text>
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
            {item.user && (
                <TouchableOpacity 
                    style={styles.userInfo}
                    onPress={() => item.user?.id && router.push(`/user/${item.user.id}`)}
                    activeOpacity={0.7}
                >
                    <Image 
                        source={{ 
                            uri: typeof item.user.profileImage === 'string' 
                                ? item.user.profileImage 
                                : 'https://via.placeholder.com/40' 
                        }} 
                        style={styles.avatar}
                        defaultSource={{ uri: 'https://via.placeholder.com/40' }}
                    />
                    <Text style={styles.username} numberOfLines={1}>
                        {item.user.username || item.user.fullName || 'Unknown User'}
                    </Text>
                </TouchableOpacity>
            )}
            </View>
        );
    };

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
                    <TouchableOpacity 
                        style={styles.filterButton} 
                        activeOpacity={0.7}
                        onPress={() => setShowFilterModal(!showFilterModal)}
                    >
                        <Ionicons name="options-outline" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Filter Options */}
                {showFilterModal && (
                    <View style={styles.filterModal}>
                        <Text style={styles.filterTitle}>Sort by</Text>
                        <View style={styles.filterRow}>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.sortBy === 'recent' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, sortBy: 'recent'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.sortBy === 'recent' && styles.filterOptionTextActive]}>Recent</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.sortBy === 'popular' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, sortBy: 'popular'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.sortBy === 'popular' && styles.filterOptionTextActive]}>Popular</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.sortBy === 'views' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, sortBy: 'views'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.sortBy === 'views' && styles.filterOptionTextActive]}>Views</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.filterTitle}>Duration</Text>
                        <View style={styles.filterRow}>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.duration === 'all' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, duration: 'all'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.duration === 'all' && styles.filterOptionTextActive]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.duration === 'short' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, duration: 'short'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.duration === 'short' && styles.filterOptionTextActive]}>{'<1 min'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.duration === 'medium' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, duration: 'medium'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.duration === 'medium' && styles.filterOptionTextActive]}>1-5 min</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterOption, filterOptions.duration === 'long' && styles.filterOptionActive]}
                                onPress={() => setFilterOptions({...filterOptions, duration: 'long'})}
                            >
                                <Text style={[styles.filterOptionText, filterOptions.duration === 'long' && styles.filterOptionTextActive]}>{'5+ min'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
                {(activeTab === "trending" || activeTab === "streaming") && (
                    <View style={styles.gridContainer}>
                        {((activeTab === "trending" ? isLoadingTrending : isLoadingStreaming) || isSearching) ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#EC4899" />
                            </View>
                        ) : getDisplayVideos().length > 0 ? (
                            <FlatList
                                data={getDisplayVideos()}
                                renderItem={renderVideoItem}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.gridRow}
                                scrollEnabled={false}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No videos found</Text>
                            </View>
                        )}

                        {/* Show More Button */}
                        {!isSearching && !((activeTab === "trending" ? isLoadingTrending : isLoadingStreaming)) && 
                         getDisplayVideos().length >= displayLimit && 
                         displayLimit < (activeTab === "streaming" ? streamingVideos.length : trendingVideos.length) && (
                            <TouchableOpacity 
                                style={styles.showMoreButton} 
                                activeOpacity={0.7}
                                onPress={() => setDisplayLimit(prev => prev + 10)}
                            >
                                <View style={styles.showMoreContent}>
                                    <Text style={styles.showMoreText}>Show more +</Text>
                                    <Ionicons name="chevron-down" size={18} color="#EC4899" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Accounts Tab */}
                {activeTab === "accounts" && (
                    <View style={styles.accountsContainer}>
                        {isLoadingUsers ? (
                            <ActivityIndicator size="large" color="#EC4899" />
                        ) : searchQuery.trim() && users.length > 0 ? (
                            users.filter((user: User) => 
                                user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((user: User) => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={styles.accountCard}
                                    onPress={() => router.push(`/user/${user.id}`)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: typeof user.profileImage === 'string' ? user.profileImage : 'https://via.placeholder.com/50' }}
                                        style={styles.accountAvatar}
                                    />
                                    <View style={styles.accountInfo}>
                                        <Text style={styles.accountName}>{user.fullName}</Text>
                                        <Text style={styles.accountUsername}>@{user.username}</Text>
                                        {user.bio && (
                                            <Text style={styles.accountBio} numberOfLines={2}>{user.bio}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Search for users...</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Audio tab placeholder */}
                {activeTab === "audio" && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Coming soon...</Text>
                    </View>
                )}

                {/* Maybe You're Interested */}
                {(activeTab === "trending" || activeTab === "streaming") && suggestedTags.length > 0 && (
                    <View style={styles.suggestedSection}>
                        <Text style={styles.suggestedTitle}>Maybe you're interested</Text>
                        <View style={styles.tagsContainer}>
                            {suggestedTags.map((tag, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.tag}
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        setSearchQuery(tag);
                                        search(tag);
                                    }}
                                >
                                    <Text style={styles.tagText2}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
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
    filterModal: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 8,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
        marginTop: 8,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterOptionActive: {
        backgroundColor: '#EC4899',
        borderColor: '#EC4899',
    },
    filterOptionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterOptionTextActive: {
        color: '#FFFFFF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 2,
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
        maxHeight: 80,
        paddingBottom: 28,
        paddingTop: 4,
    },
    tabsContent: {
        gap: 12,
        paddingRight: 16,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
    },
    tabActive: {
        backgroundColor: '#EC4899',
    },
    tabText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
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
        paddingVertical: 4,
        zIndex: 10,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    username: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
        flex: 1,
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
        paddingBottom: 100,
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
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    accountsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 12,
    },
    accountAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    accountUsername: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    accountBio: {
        fontSize: 13,
        color: '#9CA3AF',
        lineHeight: 18,
    },
});
