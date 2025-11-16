/**
 * Create Video Screen
 * Multi-step video creation flow: Camera → Audio → Filter → Post
 * 
 * Flow:
 * 1. Camera - Record/Upload video
 * 2. Audio - Select background music (optional)
 * 3. Filter - Apply video filters (optional)
 * 4. Post - Add title, description, hashtags, and publish
 */

import AudioPicker from '@/components/creation/AudioPicker';
import FilterPicker from '@/components/creation/FilterPicker';
import MediaPicker from '@/components/creation/MediaPicker';
import { PostFormData, PostVideoForm } from '@/components/creation/PostVideoForm';
import { cacheService } from '@/services/cache.service';
import { supabaseService } from '@/services/supabase.service';
import { videoCompressionService } from '@/services/videoCompression.service';
import { useAuthStore } from '@/store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
type ScreenType = "camera" | "post" | "filter" | "audio";

interface AudioTrack {
    id: string;
    title: string;
    duration: string;
}

interface VideoData {
    uri?: string;
    duration?: number;
    thumbnail?: string;
}

// Initial form state
const INITIAL_FORM_DATA: PostFormData = {
    title: "",
    description: "",
    hashtag: "Happy moments",
    taggedPeople: 0,
    taggedUsers: [],
    commentsEnabled: true,
    privacy: 'public',
    postToFacebook: true,
    postToTwitter: false,
    postToInstagram: true,
};

export default function CreateVideo() {
    const router = useRouter();
    const currentUser = useAuthStore((state) => state.currentUser);
    const [currentScreen, setCurrentScreen] = useState<ScreenType>("camera");
    const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [videoData, setVideoData] = useState<VideoData>({});
    const [selectedAudio, setSelectedAudio] = useState<AudioTrack | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');

    // Handlers with useCallback for performance
    const handleOpenAudio = useCallback(() => setCurrentScreen('audio'), []);
    const handleOpenFilter = useCallback(() => setCurrentScreen('filter'), []);

    const handleCloseCamera = useCallback((videoUri?: string) => {
        if (videoUri) {
            setVideoData({ uri: videoUri });
            setCurrentScreen('post');
        } else {
            // User cancelled, go back to home
            router.back();
        }
    }, [router]);

    const handleVideoRecorded = useCallback((video: any) => {
        setVideoData({
            uri: video.uri,
            duration: video.duration,
            thumbnail: video.uri // Use first frame as thumbnail
        });
        setCurrentScreen('post');
    }, []);

    const handleBackFromPost = useCallback(() => {
        setCurrentScreen('camera');
    }, []);

    const handleCloseAudio = useCallback(() => setCurrentScreen('camera'), []);

    const handleSelectAudio = useCallback((track: AudioTrack) => {
        setSelectedAudio(track);
        setCurrentScreen('camera');
    }, []);

    const handleCloseFilter = useCallback(() => setCurrentScreen('camera'), []);

    const handleSelectFilter = useCallback((filter: any) => {
        setSelectedFilter(filter);
        setCurrentScreen('camera');
    }, []);

    const handleChangeCoverPhoto = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setVideoData(prev => ({
                    ...prev,
                    thumbnail: result.assets[0].uri
                }));
            }
        } catch {
            Alert.alert('Error', 'Failed to select cover photo');
        }
    }, []);

    const handleUpdateFormField = useCallback((field: keyof PostFormData, value: string | number | boolean | any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSaveDraft = useCallback(async () => {
        try {
            const draft = {
                videoData,
                formData,
                selectedAudio,
                selectedFilter,
                timestamp: Date.now(),
            };
            
            await cacheService.set('video_draft', draft);
            
            Alert.alert('Draft Saved', 'Your video draft has been saved successfully!', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
            ]);
        } catch {
            Alert.alert('Error', 'Failed to save draft');
        }
    }, [videoData, formData, selectedAudio, selectedFilter, router]);

    const handleSubmitPost = useCallback(async () => {
        if (isUploading) return;

        try {
            setIsUploading(true);

            if (!videoData.uri) {
                Alert.alert('Error', 'No video selected');
                return;
            }

            if (!formData.title.trim()) {
                Alert.alert('Title Required', 'Please enter a title for your video');
                return;
            }

            setUploadProgress('Validating video...');
            
            const validation = await videoCompressionService.validateVideo(videoData.uri);
            if (!validation.valid) {
                Alert.alert('Video Error', validation.message || 'Invalid video file');
                setIsUploading(false);
                setUploadProgress('');
                return;
            }

            const userId = currentUser?.id || `guest-user-${Date.now()}`;

            setUploadProgress('Uploading video...');
            
            const videoUrl = await supabaseService.storage.uploadVideo(
                videoData.uri,
                userId,
                `video_${Date.now()}.mp4`
            );

            setUploadProgress('Saving...');

            const thumbnailUrl = videoUrl;

            const hashtags = formData.hashtag
                ? formData.hashtag
                    .split(/[,\s]+/)
                    .filter(tag => tag.trim())
                    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
                : [];

            if (currentUser) {
                const newVideo = await supabaseService.videos.createVideo({
                    userId: currentUser.id,
                    title: formData.title,
                    description: formData.description || '',
                    videoUrl,
                    thumbnail: thumbnailUrl,
                    duration: videoData.duration || 0,
                    hashtags,
                });

                // Save privacy setting
                if (formData.privacy && newVideo?.id) {
                    await supabaseService.videos.updateVideo(newVideo.id, {
                        visibility: formData.privacy,
                    });
                }

                // Save tagged users
                if (formData.taggedUsers?.length > 0 && newVideo?.id) {
                    await Promise.all(
                        formData.taggedUsers.map(user =>
                            supabaseService.videos.tagUser(newVideo.id, user.id)
                        )
                    );
                }
            }

            setUploadProgress('');
            setIsUploading(false);
            Alert.alert('Success', 'Your video has been uploaded!', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
            ]);
        } catch (error) {
            setUploadProgress('');
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload video. Please try again.';
            Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
        }
    }, [currentUser, formData, videoData, router]);

    // Render different screens based on state
    const renderScreen = () => {
        switch (currentScreen) {
            case 'camera':
                return (
                    <MediaPicker
                        onOpenAudio={handleOpenAudio}
                        onOpenFilter={handleOpenFilter}
                        onClose={handleCloseCamera}
                        onRecorded={handleVideoRecorded}
                        selectedAudio={selectedAudio}
                        selectedFilter={selectedFilter}
                    />
                );
            case 'audio':
                return (
                    <AudioPicker
                        onClose={handleCloseAudio}
                        onUse={handleSelectAudio}
                    />
                );
            case 'filter':
                return (
                    <FilterPicker
                        onClose={handleCloseFilter}
                        onSelectFilter={handleSelectFilter}
                    />
                );
            case 'post':
                return (
                    <PostVideoForm
                        formData={formData}
                        onUpdateField={handleUpdateFormField}
                        onChangeCoverPhoto={handleChangeCoverPhoto}
                        onSubmit={handleSubmitPost}
                        onSaveDraft={handleSaveDraft}
                        onBack={handleBackFromPost}
                        selectedAudio={selectedAudio}
                        selectedFilter={selectedFilter}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderScreen()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
