import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface VideoItem {
    id: string;
    image: ImageSourcePropType;
    views: string;
}

interface RenderVideoItemProps {
    item: VideoItem;
}

const myVideos: VideoItem[] = [
    { id: "1", image: require("@/assets/images/search/container-43.png"), views: "1.5M" },
    { id: "2", image: require("@/assets/images/search/container-44.png"), views: "1.6M" },
    { id: "3", image: require("@/assets/images/search/container-40.png"), views: "1.6M" },
    { id: "4", image: require("@/assets/images/search/container-38.png"), views: "1.5M" },
    { id: "5", image: require("@/assets/images/search/container-41.png"), views: "1.5M" },
    { id: "6", image: require("@/assets/images/search/container-45.png"), views: "1.6M" },
    { id: "7", image: require("@/assets/images/search/container-43.png"), views: "1.5M" },
    { id: "8", image: require("@/assets/images/search/container-40.png"), views: "1.5M" },
    { id: "9", image: require("@/assets/images/search/container-44.png"), views: "1.6M" },
];

export default function Profile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("videos");

    const renderVideoItem = ({ item }: RenderVideoItemProps) => (
        <View style={styles.videoItem}>
            <Image
                source={item.image}
                style={styles.videoImage}
                resizeMode="cover"
            />
            <View style={styles.videoStats}>
                <Ionicons name="play" size={12} color="white" />
                <Text style={styles.videoViews}> {item.views} views</Text>
            </View>
        </View>
    );

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
                            source={require("@/assets/images/search/avatar-13.png")}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.userName}>Ruth Sanders</Text>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => router.push({
                                pathname: "/user/following",
                                params: {
                                    name: "Ruth Sanders",
                                    followers: "628",
                                    following: "203",
                                    tab: "following",
                                },
                            })}
                        >
                            <Text style={styles.statNumber}>203</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => router.push({
                                pathname: "/user/following",
                                params: {
                                    name: "Ruth Sanders",
                                    followers: "628",
                                    following: "203",
                                    tab: "followers",
                                },
                            })}
                        >
                            <Text style={styles.statNumber}>628</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2634</Text>
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
                    <FlatList
                        data={myVideos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        columnWrapperStyle={styles.gridRow}
                        scrollEnabled={false}
                    />
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
