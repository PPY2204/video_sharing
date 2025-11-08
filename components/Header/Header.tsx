import React from "react";
import { Text, View } from "react-native";
import NotificationLogo from "../../assets/icons/notification.svg";

export default function Header() {
    return (
        <View className="px-4 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-xl bg-pink-500 items-center justify-center mr-2">
                    <Text className="text-white font-bold">VV</Text>
                </View>
                <Text className="font-bold text-base">Video Sharing App</Text>
            </View>
            <NotificationLogo width={24} height={24} />
        </View>
    );
}
