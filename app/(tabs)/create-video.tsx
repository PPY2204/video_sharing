import React, { useState } from "react";
import {
    Image,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [hashtag, setHashtag] = useState("Happy momments");
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [postToFacebook, setPostToFacebook] = useState(true);
    const [postToTwitter, setPostToTwitter] = useState(false);
    const [postToInstagram, setPostToInstagram] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity>
                    <Text className="text-gray-700 text-base">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Post on social</Text>
                <TouchableOpacity>
                    <Text className="text-pink-500 font-medium">Review</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Cover Photo */}
                <View className="items-center py-6">
                    <Image
                        source={require("@/assets/images/home/Perfect-lady.png")}
                        className="w-48 h-64 rounded-2xl"
                        resizeMode="cover"
                    />
                    <TouchableOpacity className="mt-3">
                        <Text className="text-pink-500 font-medium">Change cover photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Title Input */}
                <View className="px-4 mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Title</Text>
                    <TextInput
                        className="bg-gray-50 rounded-xl px-4 py-3 text-gray-600"
                        placeholder="Input title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description Input */}
                <View className="px-4 mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Description</Text>
                    <TextInput
                        className="bg-gray-50 rounded-xl px-4 py-3 text-gray-600 h-24"
                        placeholder="Input description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Add Hashtag */}
                <View className="px-4 mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Add hashtag</Text>
                    <View className="flex-row items-center">
                        <View className="bg-blue-50 rounded-full px-3 py-1.5 flex-row items-center">
                            <Text className="text-blue-500 mr-2">{hashtag}</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-500">×</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Tag Someone */}
                <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
                    <Text className="text-gray-700 font-medium">Tag someone</Text>
                    <View className="flex-row items-center">
                        <Text className="text-blue-500 mr-2">3 people</Text>
                        <Text className="text-gray-400">›</Text>
                    </View>
                </TouchableOpacity>

                {/* Comments Toggle */}
                <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
                    <Text className="text-gray-700 font-medium">Comments</Text>
                    <Switch
                        value={commentsEnabled}
                        onValueChange={setCommentsEnabled}
                        trackColor={{ false: "#D1D5DB", true: "#FF3B5C" }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                {/* Who Can Watch */}
                <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
                    <Text className="text-gray-700 font-medium">Who can watch</Text>
                    <View className="flex-row items-center">
                        <Text className="text-gray-600 mr-2">All</Text>
                        <Text className="text-gray-400">∨</Text>
                    </View>
                </TouchableOpacity>

                {/* Also Post On */}
                <View className="px-4 pt-4 pb-2">
                    <Text className="text-gray-700 font-medium mb-3">Also post on</Text>

                    {/* Facebook */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center mr-3">
                                <Text className="text-white text-xs font-bold">f</Text>
                            </View>
                            <Text className="text-gray-700">Facebook</Text>
                        </View>
                        <Switch
                            value={postToFacebook}
                            onValueChange={setPostToFacebook}
                            trackColor={{ false: "#D1D5DB", true: "#FF3B5C" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Twitter */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <View className="w-6 h-6 bg-blue-400 rounded-full items-center justify-center mr-3">
                                <Text className="text-white text-xs font-bold">t</Text>
                            </View>
                            <Text className="text-gray-700">Twitter</Text>
                        </View>
                        <Switch
                            value={postToTwitter}
                            onValueChange={setPostToTwitter}
                            trackColor={{ false: "#D1D5DB", true: "#FF3B5C" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Instagram */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <View className="w-6 h-6 bg-pink-500 rounded-full items-center justify-center mr-3">
                                <Text className="text-white text-xs font-bold">ig</Text>
                            </View>
                            <Text className="text-gray-700">Instagram</Text>
                        </View>
                        <Switch
                            value={postToInstagram}
                            onValueChange={setPostToInstagram}
                            trackColor={{ false: "#D1D5DB", true: "#FF3B5C" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="px-4 py-4 flex-row gap-3 border-t border-gray-100">
                <TouchableOpacity className="flex-1 border border-pink-500 rounded-full py-3.5 items-center">
                    <Text className="text-pink-500 font-semibold">↓ Save draft</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-pink-500 rounded-full py-3.5 items-center">
                    <Text className="text-white font-semibold">✈ Post on social</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
