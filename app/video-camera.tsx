import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoCamera() {
    return (
        <View className="flex-1 bg-black">
            {/* Background Image/Camera View */}
            <Image
                source={require("@/assets/images/create-video-upload-video/image-31.png")}
                className="absolute w-full h-full"
                resizeMode="cover"
            />

            <SafeAreaView className="flex-1">
                {/* Top Bar */}
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <Text className="text-white text-2xl font-light">×</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-gray-700/70 rounded-full px-4 py-2 flex-row items-center">
                        <Text className="text-white mr-2">🎵</Text>
                        <Text className="text-white text-sm font-medium">Add audio</Text>
                    </TouchableOpacity>

                    <View className="w-10" />
                </View>

                {/* Right Side Tools */}
                <View className="absolute right-4 top-32 items-center">
                    <TouchableOpacity className="items-center mb-6">
                        <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center mb-1">
                            <Text className="text-white text-lg">🔄</Text>
                        </View>
                        <Text className="text-white text-xs">Flip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center mb-6">
                        <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center mb-1">
                            <Text className="text-white text-lg">⚡</Text>
                        </View>
                        <Text className="text-white text-xs">Filter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center mb-6">
                        <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center mb-1">
                            <Text className="text-white text-lg">⏱</Text>
                        </View>
                        <Text className="text-white text-xs">Timer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center">
                        <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center mb-1">
                            <Text className="text-white text-lg">⚡</Text>
                        </View>
                        <Text className="text-white text-xs">Flash</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View className="absolute bottom-8 w-full items-center">
                    <View className="flex-row items-center justify-around w-full px-8">
                        <TouchableOpacity className="items-center">
                            <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center">
                                <Text className="text-white text-2xl">😊</Text>
                            </View>
                            <Text className="text-white text-xs mt-1">Effect</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="w-20 h-20 rounded-full border-4 border-pink-500 bg-pink-500">
                            <View className="flex-1 items-center justify-center">
                                <View className="w-16 h-16 rounded-full bg-white" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center">
                            <View className="w-12 h-12 bg-gray-800/50 rounded-full items-center justify-center">
                                <Text className="text-white text-2xl">🖼</Text>
                            </View>
                            <Text className="text-white text-xs mt-1">Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
