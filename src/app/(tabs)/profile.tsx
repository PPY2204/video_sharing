import { supabaseService } from "@/services/supabase.service";
import type { User, Video } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RenderVideoItemProps {
    item: Video;
}

export default function Profile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("videos");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [myVideos, setMyVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load current user profile (using first user as example - Ruth Sanders)
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setIsLoading(true);
                // Get first user (Ruth Sanders with id ending in ...001)
                const users = await supabaseService.users.getUsers();
                
                const user = users[0]; // Ruth Sanders
                setCurrentUser(user);

                // First check all videos to see what user_ids 
                const allVideos = await supabaseService.videos.getVideos();
                

                // Get user's videos
                if (user?.id) {
                    const videos = await supabaseService.videos.getVideosByUserId(user.id);
                    setMyVideos(videos);
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const renderVideoItem = ({ item }: RenderVideoItemProps) => {
        const imageUri = (item.thumbnail as string) || 'https://via.placeholder.com/160x220/EC4899/ffffff?text=Video';
        
        return (
            <TouchableOpacity 
                style={styles.videoItem}
                onPress={() => router.push(`/video/${item.id}`)}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: imageUri }}
                    style={styles.videoImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', imageUri, e.nativeEvent.error)}
                />
                <View style={styles.videoStats}>
                    <Ionicons name="play" size={12} color="white" />
                    <Text style={styles.videoViews}> {formatNumber(item.views)} views</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#EC4899" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="menu" size={28} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="person-add-outline" size={24} color="#374151" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={18} color="#EC4899" />
                    <Text style={styles.editButtonText}> Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ 
                                uri: (currentUser?.profileImage as string) || 'https://via.placeholder.com/112/EC4899/ffffff?text=User' 
                            }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.userName}>{currentUser?.fullName || currentUser?.username || 'User'}</Text>
                    {currentUser?.bio && (
                        <Text style={styles.userBio}>{currentUser.bio}</Text>
                    )}

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => router.push({
                                pathname: "/user/following",
                                params: {
                                    name: currentUser?.fullName || currentUser?.username || 'User',
                                    followers: formatNumber(currentUser?.followers || 0),
                                    following: formatNumber(currentUser?.following || 0),
                                    tab: "following",
                                },
                            })}
                        >
                            <Text style={styles.statNumber}>{formatNumber(currentUser?.following || 0)}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => router.push({
                                pathname: "/user/following",
                                params: {
                                    name: currentUser?.fullName || currentUser?.username || 'User',
                                    followers: formatNumber(currentUser?.followers || 0),
                                    following: formatNumber(currentUser?.following || 0),
                                    tab: "followers",
                                },
                            })}
                        >
                            <Text style={styles.statNumber}>{formatNumber(currentUser?.followers || 0)}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{formatNumber(currentUser?.likes || 0)}</Text>
                            <Text style={styles.statLabel}>Like</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        onPress={() => setActiveTab("videos")}
                        style={[styles.tab, activeTab === "videos" && styles.tabActive]}
                    >
                        <Ionicons
                            name="play"
                            size={18}
                            color={activeTab === "videos" ? "#EC4899" : "#9CA3AF"}
                        />
                        <Text style={[styles.tabText, activeTab === "videos" && styles.tabTextActive]}>
                            {" "}My Videos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("images")}
                        style={[styles.tab, activeTab === "images" && styles.tabActive]}
                    >
                        <Ionicons
                            name="images-outline"
                            size={18}
                            color={activeTab === "images" ? "#EC4899" : "#9CA3AF"}
                        />
                        <Text style={[styles.tabText, activeTab === "images" && styles.tabTextActive]}>
                            {" "}My Images
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("liked")}
                        style={[styles.tab, activeTab === "liked" && styles.tabActive]}
                    >
                        <Ionicons
                            name="heart-outline"
                            size={18}
                            color={activeTab === "liked" ? "#EC4899" : "#9CA3AF"}
                        />
                        <Text style={[styles.tabText, activeTab === "liked" && styles.tabTextActive]}>
                            {" "}Liked
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Videos Grid */}
                <View style={styles.gridContainer}>
                    {myVideos.length > 0 ? (
                        <FlatList
                            data={myVideos}
                            renderItem={renderVideoItem}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            columnWrapperStyle={styles.gridRow}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="videocam-outline" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No videos yet</Text>
                            <Text style={styles.emptySubtext}>Start creating and sharing your videos!</Text>
                        </View>
                    )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#EC4899',
        fontWeight: '600',
        fontSize: 15,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 4,
        borderColor: '#EC4899',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#111827',
    },
    userBio: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 40,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#EC4899',
    },
    tabText: {
        fontWeight: '600',
        fontSize: 15,
        color: '#9CA3AF',
    },
    tabTextActive: {
        color: '#EC4899',
    },
    gridContainer: {
        paddingHorizontal: 2,
        paddingTop: 2,
    },
    gridRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    videoItem: {
        width: '32%',
        marginBottom: 4,
        position: 'relative',
    },
    videoImage: {
        width: '100%',
        height: 160,
        borderRadius: 8,
    },
    videoStats: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    videoViews: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
