/**
 * Post Video Form Component
 * Form to add video details, hashtags, and social sharing options
 */

import type { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import PrivacySettingsModal, { PrivacyOption } from "./PrivacySettingsModal";
import TagPeopleModal from "./TagPeopleModal";

export interface PostFormData {
    title: string;
    description: string;
    hashtag: string;
    taggedPeople: number;
    taggedUsers: User[];
    commentsEnabled: boolean;
    privacy: PrivacyOption | string;
    postToFacebook: boolean;
    postToTwitter: boolean;
    postToInstagram: boolean;
}

export interface PostVideoFormProps {
    formData: PostFormData;
    coverImage?: ImageSourcePropType;
    onUpdateField: (field: keyof PostFormData, value: string | number | boolean | User[] | PrivacyOption) => void;
    onChangeCoverPhoto: () => void;
    onSubmit?: () => void;
    onSaveDraft?: () => void;
    onBack?: () => void;
    selectedAudio?: { id: string; title: string; duration: string } | null;
    selectedFilter?: { id: string; name: string } | null;
    isUploading?: boolean;
    uploadProgress?: string;
}

export const PostVideoForm: React.FC<PostVideoFormProps> = ({
    formData,
    coverImage,
    onUpdateField,
    onChangeCoverPhoto,
    onSubmit,
    onSaveDraft,
    onBack,
    selectedAudio,
    selectedFilter,
    isUploading = false,
    uploadProgress = '',
}) => {
    const router = useRouter();
    const [showTagModal, setShowTagModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const privacyLabels: Record<PrivacyOption, string> = {
        public: 'All',
        friends: 'Friends',
        private: 'Only me',
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post on social</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.reviewButton}>Review</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                        placeholder="Input title"
                        value={formData.title}
                        onChangeText={(value) => onUpdateField("title", value)}
                        placeholderTextColor="#D1D5DB"
                    />
                </View>

                {/* Description */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Input description"
                        value={formData.description}
                        onChangeText={(value) => onUpdateField("description", value)}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#D1D5DB"
                        textAlignVertical="top"
                    />
                </View>

                {/* Add hashtag */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Add hashtag</Text>
                    <View style={styles.hashtagContainer}>
                        <View style={styles.hashtagTag}>
                            <Text style={styles.hashtagTagText}>{formData.hashtag}</Text>
                            <TouchableOpacity onPress={() => onUpdateField("hashtag", "")}>
                                <Ionicons name="close" size={14} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Tag someone */}
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowTagModal(true)}>
                    <Text style={styles.menuLabel}>Tag someone</Text>
                    <View style={styles.menuRight}>
                        <Text style={styles.tagCount}>
                            {formData.taggedUsers?.length || 0} {formData.taggedUsers?.length === 1 ? 'person' : 'people'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>

                {/* Comments */}
                <View style={styles.menuItem}>
                    <Text style={styles.menuLabel}>Comments</Text>
                    <Switch
                        value={formData.commentsEnabled}
                        onValueChange={(value) => onUpdateField("commentsEnabled", value)}
                        trackColor={{ false: "#E5E7EB", true: "#FFC0CB" }}
                        thumbColor={formData.commentsEnabled ? "#FF3B5C" : "#fff"}
                        ios_backgroundColor="#E5E7EB"
                    />
                </View>

                {/* Who can watch */}
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowPrivacyModal(true)}>
                    <Text style={styles.menuLabel}>Who can watch</Text>
                    <View style={styles.menuRight}>
                        <Text style={styles.whoCanWatchValue}>
                            {privacyLabels[formData.privacy as PrivacyOption] || 'All'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>

                {/* Also post on */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Also post on</Text>

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

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.draftButton, isUploading && styles.buttonDisabled]} 
                        onPress={onSaveDraft}
                        disabled={isUploading}
                    >
                        <Ionicons name="arrow-down" size={20} color="#FF3B5C" />
                        <Text style={styles.draftButtonText}>Save draft</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.submitButton, isUploading && styles.buttonDisabled]} 
                        onPress={onSubmit}
                        disabled={isUploading}
                    >
                        <Ionicons name={isUploading ? "hourglass" : "send"} size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isUploading ? (uploadProgress || 'Uploading...') : 'Post on social'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

        {/* Modals */}
        <TagPeopleModal
            visible={showTagModal}
            onClose={() => setShowTagModal(false)}
            selectedUsers={formData.taggedUsers || []}
            onUpdateSelected={(users) => onUpdateField('taggedUsers', users)}
        />

        <PrivacySettingsModal
            visible={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
            selectedPrivacy={formData.privacy as PrivacyOption}
            onSelect={(privacy) => onUpdateField('privacy', privacy)}
        />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111",
    },
    reviewButton: {
        fontSize: 15,
        color: "#FF3B5C",
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
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
    hashtagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    hashtagTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF6FF",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    hashtagTagText: {
        color: "#3B82F6",
        fontSize: 14,
        fontWeight: "500",
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    menuLabel: {
        color: "#111",
        fontSize: 15,
        fontWeight: "500",
    },
    menuRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    whoCanWatchValue: {
        color: "#111",
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
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    draftButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#FF3B5C",
        borderRadius: 8,
        paddingVertical: 14,
    },
    draftButtonText: {
        color: "#FF3B5C",
        fontSize: 15,
        fontWeight: "600",
    },
    submitButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FF3B5C",
        borderRadius: 8,
        paddingVertical: 14,
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: "#999",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
