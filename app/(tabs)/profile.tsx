import React, { useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const myVideos = [
    { id: "1", image: require("@/assets/images/home/Perfect-lady.png"), views: "1.5M" },
    { id: "2", image: require("@/assets/images/home/Rose.png"), views: "1.6M" },
    { id: "3", image: require("@/assets/images/home/Experience.png"), views: "1.6M" },
    { id: "4", image: require("@/assets/images/home/Yourself.png"), views: "1.5M" },
    { id: "5", image: require("@/assets/images/home/Lifestyle.png"), views: "1.5M" },
    { id: "6", image: require("@/assets/images/home/Bookcase.png"), views: "1.6M" },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("videos");

    const renderVideoItem = ({ item }: any) => (
        <View className="w-[32%] mb-2">
            <Image
                source={item.image}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
            />
            <View className="absolute bottom-2 left-2 flex-row items-center">
                <Text className="text-white text-xs">▶ {item.views} views</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity>
                    <Text className="text-gray-700 text-2xl">☰</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-gray-700 text-2xl">👤+</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-pink-500 font-medium">✏ Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Profile Header */}
                <View className="items-center py-6">
                    <View className="w-28 h-28 rounded-full border-4 border-pink-500 overflow-hidden">
                        <Image
                            source={require("@/assets/images/home/You.png")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-xl font-bold mt-4">Ruth Sanders</Text>

                    {/* Stats */}
                    <View className="flex-row items-center mt-4 gap-8">
                        <View className="items-center">
                            <Text className="text-xl font-bold">203</Text>
                            <Text className="text-gray-500">Following</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-xl font-bold">628</Text>
                            <Text className="text-gray-500">Followers</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-xl font-bold">2634</Text>
                            <Text className="text-gray-500">Like</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row border-b border-gray-200">
                    <TouchableOpacity
                        onPress={() => setActiveTab("videos")}
                        className={`flex-1 items-center py-4 border-b-2 ${activeTab === "videos" ? "border-pink-500" : "border-transparent"
                            }`}
                    >
                        <Text
                            className={`font-medium ${activeTab === "videos" ? "text-pink-500" : "text-gray-500"
                                }`}
                        >
                            ▶ My Videos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("images")}
                        className={`flex-1 items-center py-4 border-b-2 ${activeTab === "images" ? "border-pink-500" : "border-transparent"
                            }`}
                    >
                        <Text
                            className={`font-medium ${activeTab === "images" ? "text-pink-500" : "text-gray-500"
                                }`}
                        >
                            🖼 My Images
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("liked")}
                        className={`flex-1 items-center py-4 border-b-2 ${activeTab === "liked" ? "border-pink-500" : "border-transparent"
                            }`}
                    >
                        <Text
                            className={`font-medium ${activeTab === "liked" ? "text-pink-500" : "text-gray-500"
                                }`}
                        >
                            ♡ Liked
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Videos Grid */}
                <View className="px-2 pt-2">
                    <FlatList
                        data={myVideos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
