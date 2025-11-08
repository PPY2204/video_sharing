import { storiesData } from "@/data/homeData";
import type { StoryItem } from "@/types/homeTypes";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Stories() {

    const renderStory = ({ item }: { item: StoryItem }) => (
        <TouchableOpacity style={{ width: 72, alignItems: 'center', marginRight: 12 }}>
            <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: item.online ? 3 : 0,
                borderColor: item.online ? '#3B82F6' : 'transparent',
                padding: 3
            }}>
                <Image
                    source={item.image}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                    resizeMode="cover"
                />
                {item.isYou && (
                    <View style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 22,
                        height: 22,
                        backgroundColor: '#EF4444',
                        borderRadius: 11,
                        borderWidth: 2.5,
                        borderColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginTop: -1 }}>+</Text>
                    </View>
                )}
                {item.online && !item.isYou && (
                    <View style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        backgroundColor: '#3B82F6',
                        borderRadius: 7,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }} />
                )}
            </View>
            <Text style={{
                marginTop: 6,
                fontSize: 12,
                textAlign: 'center',
                color: '#000',
                fontWeight: '500'
            }} numberOfLines={1}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={storiesData}
            renderItem={renderStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        />
    );
}
