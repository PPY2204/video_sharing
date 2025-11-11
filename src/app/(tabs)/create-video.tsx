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
import MediaPicker from '@/components/creation/MediaPicker';
import { PostFormData, PostVideoForm } from '@/components/creation/PostVideoForm';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
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
    taggedPeople: 3,
    commentsEnabled: true,
    postToFacebook: true,
    postToTwitter: false,
    postToInstagram: true,
};

export default function CreateVideo() {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState<ScreenType>("camera");
    const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [videoData, setVideoData] = useState<VideoData>({});

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

    const handleCloseAudio = useCallback(() => setCurrentScreen('camera'), []);

    const handleSelectAudio = useCallback((track: AudioTrack) => {
        // TODO: Apply audio to video
        setCurrentScreen('camera');
    }, []);

    const handleChangeCoverPhoto = useCallback(() => {
        // TODO: Implement cover photo picker from video frames
    }, []);

    const handleUpdateFormField = useCallback((field: keyof PostFormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmitPost = useCallback(async () => {
        try {
            // TODO: Upload video to server
            // TODO: Show success message
            router.push('/(tabs)');
        } catch (error) {
            if (__DEV__) {
                console.error('Failed to post video:', error);
            }
            // TODO: Show error message
        }
    }, [formData, videoData, router]);

    // Render different screens based on state
    const renderScreen = () => {
        switch (currentScreen) {
            case 'camera':
                return (
                    <MediaPicker
                        onOpenAudio={handleOpenAudio}
                        onOpenFilter={handleOpenFilter}
                        onClose={handleCloseCamera}
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
                // TODO: Implement filter screen
                return (
                    <PostVideoForm
                        formData={formData}
                        onUpdateField={handleUpdateFormField}
                        onChangeCoverPhoto={handleChangeCoverPhoto}
                        onSubmit={handleSubmitPost}
                    />
                );
            case 'post':
                return (
                    <PostVideoForm
                        formData={formData}
                        onUpdateField={handleUpdateFormField}
                        onChangeCoverPhoto={handleChangeCoverPhoto}
                        onSubmit={handleSubmitPost}
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
        backgroundColor: '#000'
    },
});
