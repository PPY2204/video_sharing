// src/components/SplashScreen.tsx
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white text-3xl font-bold mb-4">TIKTOK CLONE</Text>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
}
