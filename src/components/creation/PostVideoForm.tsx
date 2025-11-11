/**
 * Post Video Form Component
 * Form to add video details, hashtags, and social sharing options
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export interface PostFormData {
    title: string;
    description: string;
    hashtag: string;
    taggedPeople: number;
    commentsEnabled: boolean;
    postToFacebook: boolean;
    postToTwitter: boolean;
    postToInstagram: boolean;
}

export interface PostVideoFormProps {
    formData: PostFormData;
    coverImage?: ImageSourcePropType;
    onUpdateField: (field: keyof PostFormData, value: string | number | boolean) => void;
    onChangeCoverPhoto: () => void;
    onSubmit?: () => void;
}

export const PostVideoForm: React.FC<PostVideoFormProps> = ({
    formData,
    coverImage,
    onUpdateField,
    onChangeCoverPhoto,
    onSubmit,
}) => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.inner}>
                {/* Cover Photo */}
                <View style={styles.coverSection}>
                    <Image
                        source={coverImage || require("@/assets/images/home/Perfect-lady.png")}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.changeCoverButton} onPress={onChangeCoverPhoto}>
                        <Text style={styles.changeCoverText}>Change cover photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Give your video a catchy title..."
                        value={formData.title}
                        onChangeText={(value) => onUpdateField("title", value)}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Description */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell viewers about your video..."
                        value={formData.description}
                        onChangeText={(value) => onUpdateField("description", value)}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                    />
                </View>

                {/* Hashtag */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Hashtag</Text>
                    <View style={styles.hashtagInput}>
                        <Text style={styles.hashtagSymbol}>#</Text>
                        <TextInput
                            style={styles.hashtagText}
                            placeholder="Add hashtags..."
                            value={formData.hashtag}
                            onChangeText={(value) => onUpdateField("hashtag", value)}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Tagged People */}
                <View style={styles.fieldContainer}>
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Tagged people</Text>
                        <Text style={styles.tagCount}>{formData.taggedPeople}</Text>
                    </View>
                    <TouchableOpacity style={styles.tagButton}>
                        <Ionicons name="person-add-outline" size={20} color="#6B7280" />
                        <Text style={styles.tagButtonText}>Add people</Text>
                    </TouchableOpacity>
                </View>

                {/* Comments Toggle */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>Enable comments</Text>
                    <Switch
                        value={formData.commentsEnabled}
                        onValueChange={(value) => onUpdateField("commentsEnabled", value)}
                        trackColor={{ false: "#D1D5DB", true: "#FFC0CB" }}
                        thumbColor={formData.commentsEnabled ? "#FF3B5C" : "#F3F4F6"}
                    />
                </View>

                {/* Social Media Sharing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Share to social media</Text>

                    <View style={styles.socialOption}>
                        <View style={styles.socialInfo}>
                            <View style={[styles.socialIcon, { backgroundColor: "#1877F2" }]}>
                                <Ionicons name="logo-facebook" size={20} color="#fff" />
                            </View>
                            <Text style={styles.socialName}>Facebook</Text>
                        </View>
                        <Switch
                            value={formData.postToFacebook}
                            onValueChange={(value) => onUpdateField("postToFacebook", value)}
                            trackColor={{ false: "#D1D5DB", true: "#FFC0CB" }}
                            thumbColor={formData.postToFacebook ? "#FF3B5C" : "#F3F4F6"}
                        />
                    </View>

                    <View style={styles.socialOption}>
                        <View style={styles.socialInfo}>
                            <View style={[styles.socialIcon, { backgroundColor: "#1DA1F2" }]}>
                                <Ionicons name="logo-twitter" size={20} color="#fff" />
                            </View>
                            <Text style={styles.socialName}>Twitter</Text>
                        </View>
                        <Switch
                            value={formData.postToTwitter}
                            onValueChange={(value) => onUpdateField("postToTwitter", value)}
                            trackColor={{ false: "#D1D5DB", true: "#FFC0CB" }}
                            thumbColor={formData.postToTwitter ? "#FF3B5C" : "#F3F4F6"}
                        />
                    </View>

                    <View style={styles.socialOption}>
                        <View style={styles.socialInfo}>
                            <View style={[styles.socialIcon, { backgroundColor: "#E4405F" }]}>
                                <Ionicons name="logo-instagram" size={20} color="#fff" />
                            </View>
                            <Text style={styles.socialName}>Instagram</Text>
                        </View>
                        <Switch
                            value={formData.postToInstagram}
                            onValueChange={(value) => onUpdateField("postToInstagram", value)}
                            trackColor={{ false: "#D1D5DB", true: "#FFC0CB" }}
                            thumbColor={formData.postToInstagram ? "#FF3B5C" : "#F3F4F6"}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                    <Text style={styles.submitButtonText}>Post Video</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner: {
        padding: 16,
        paddingBottom: 32,
    },
    coverSection: {
        alignItems: "center",
        marginBottom: 24,
    },
    coverImage: {
        width: 192,
        height: 256,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
    },
    changeCoverButton: {
        marginTop: 12,
        paddingVertical: 8,
    },
    changeCoverText: {
        color: "#FF3B5C",
        fontWeight: "600",
        fontSize: 15,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        color: "#374151",
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 8,
    },
    fieldRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    tagCount: {
        color: "#FF3B5C",
        fontWeight: "600",
        fontSize: 14,
    },
    input: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: "#111",
        fontSize: 15,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    hashtagInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    hashtagSymbol: {
        color: "#FF3B5C",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 4,
    },
    hashtagText: {
        flex: 1,
        color: "#111",
        fontSize: 15,
    },
    tagButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    tagButtonText: {
        color: "#6B7280",
        fontSize: 15,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 8,
    },
    toggleLabel: {
        color: "#374151",
        fontWeight: "600",
        fontSize: 15,
    },
    section: {
        marginTop: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#374151",
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 16,
    },
    socialOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    socialInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    socialName: {
        color: "#374151",
        fontSize: 15,
        fontWeight: "500",
    },
    submitButton: {
        backgroundColor: "#FF3B5C",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 16,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
