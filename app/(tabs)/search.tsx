import React, { useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const searchVideos = [
    {
        id: "1",
        image: require("@/assets/images/home/Perfect-lady.png"),
        title: "Eiusmod Lorem aliquip exercitation",
        views: "1.5M",
        likes: "12.1K",
        user: { name: "Laura", avatar: require("@/assets/images/home/Adam.png") },
    },
    {
        id: "2",
        image: require("@/assets/images/home/Rose.png"),
        title: "Reprehenderit ad fugiat nulla mollit",
        views: "12.4K",
        likes: "19.6K",
        user: { name: "Liz", avatar: require("@/assets/images/home/Julia.png") },
    },
    {
        id: "3",
        image: require("@/assets/images/home/Experience.png"),
        title: "Consectetur est aliquip adipisicing",
        views: "1.5M",
        likes: "24.3K",
        user: { name: "Cris", avatar: require("@/assets/images/home/Peter.png") },
    },
    {
        id: "4",
        image: require("@/assets/images/home/Yourself.png"),
        title: "Aute adipisicing ea in nostrud sunt",
        views: "1.5M",
        likes: "29.7K",
        user: { name: "Lina", avatar: require("@/assets/images/home/William.png") },
    },
];

const suggestedTags = [
    "Funny momments of pet",
    "Cats",
    "Dogs",
    "Foods for pet",
    "Vet center",
];

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("Pet");
    const [activeTab, setActiveTab] = useState("trending");

    const renderVideoItem = ({ item }: any) => (
        <View className="w-[48%] mb-4">
            <TouchableOpacity>
                <Image
                    source={item.image}
                    className="w-full h-56 rounded-lg"
                    resizeMode="cover"
                />
                <View className="absolute bottom-2 left-2 flex-row items-center">
                    <Text className="text-white text-xs">▶ {item.views} views</Text>
                    <Text className="text-white text-xs ml-3">♡ {item.likes}</Text>
                </View>
            </TouchableOpacity>
            <Text className="text-sm mt-2 font-medium" numberOfLines={2}>
                {item.title}
            </Text>
            <View className="flex-row items-center mt-1">
                <Image source={item.user.avatar} className="w-5 h-5 rounded-full mr-2" />
                <Text className="text-xs text-gray-600">{item.user.name}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Search Header */}
            <View className="px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Text className="text-gray-400 mr-2">🔍</Text>
                    <TextInput
                        className="flex-1 text-base"
                        placeholder="Search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Text className="text-gray-400 ml-2">×</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="ml-2">
                        <Text className="text-gray-600">☰</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row px-4 py-3 gap-2">
                <TouchableOpacity
                    onPress={() => setActiveTab("trending")}
                    className={`px-4 py-2 rounded-full ${activeTab === "trending" ? "bg-pink-500" : "bg-gray-100"
                        }`}
                >
                    <Text
                        className={`font-medium ${activeTab === "trending" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Trending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("accounts")}
                    className={`px-4 py-2 rounded-full ${activeTab === "accounts" ? "bg-pink-500" : "bg-gray-100"
                        }`}
                >
                    <Text
                        className={`font-medium ${activeTab === "accounts" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Accounts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("streaming")}
                    className={`px-4 py-2 rounded-full ${activeTab === "streaming" ? "bg-pink-500" : "bg-gray-100"
                        }`}
                >
                    <Text
                        className={`font-medium ${activeTab === "streaming" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Streaming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("audio")}
                    className={`px-4 py-2 rounded-full ${activeTab === "audio" ? "bg-pink-500" : "bg-gray-100"
                        }`}
                >
                    <Text
                        className={`font-medium ${activeTab === "audio" ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Audio
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Videos Grid */}
                <View className="px-2">
                    <FlatList
                        data={searchVideos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
                        scrollEnabled={false}
                    />
                </View>

                <TouchableOpacity className="items-center py-4">
                    <Text className="text-pink-500 font-medium">Show more ∨</Text>
                </TouchableOpacity>

                {/* Maybe You're Interested */}
                <View className="px-4 mb-6">
                    <Text className="text-lg font-bold mb-3">Maybe you're interested</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {suggestedTags.map((tag, index) => (
                            <TouchableOpacity
                                key={index}
                                className="bg-gray-100 rounded-full px-4 py-2"
                            >
                                <Text className="text-gray-700">{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
