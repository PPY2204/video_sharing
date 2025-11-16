import { Ionicons } from '@expo/vector-icons';
import * as ExpoCamera from 'expo-camera';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecordedVideo {
    uri: string;
    width?: number;
    height?: number;
    duration?: number;
}

type Props = {
    onOpenAudio: () => void;
    onOpenFilter: () => void;
    onClose: () => void;
    onRecorded?: (video: RecordedVideo) => void;
    selectedAudio?: { id: string; title: string; duration: string } | null;
    selectedFilter?: { id: string; name: string } | null;
};

export default function MediaPicker({ onOpenAudio, onOpenFilter, onClose, onRecorded, selectedAudio, selectedFilter }: Props) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    // CameraType from expo-camera can be a type-only import in some setups;
    // use a simple string union for runtime values to avoid TS 'type-only' issues.
    const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    // Use a loose ref type to avoid depending on the library's exported type shape.
    const cameraRef = useRef<any>(null);
    const recordingStartTime = useRef<number>(0);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        (async () => {
            const cameraPermission = await ExpoCamera.Camera.requestCameraPermissionsAsync();
            const microphonePermission = await ExpoCamera.Camera.requestMicrophonePermissionsAsync();
            setHasPermission(
                cameraPermission.status === 'granted' && 
                microphonePermission.status === 'granted'
            );
        })();
    }, []);

    async function handleStartRecording() {
        if (!cameraRef.current || isRecording) return;
        
        try {
            setIsRecording(true);
            recordingStartTime.current = Date.now();
            setRecordingTime(0);
            
            timerInterval.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTime.current) / 1000);
                setRecordingTime(elapsed);
            }, 1000);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const video = await cameraRef.current.recordAsync({
                maxDuration: 30,
            });
            
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }
            
            const recordingDuration = (Date.now() - recordingStartTime.current) / 1000;
            
            setIsRecording(false);
            recordingStartTime.current = 0;
            setRecordingTime(0);
            
            if (!video || !video.uri) {
                Alert.alert('Recording Failed', 'Failed to capture video. Please try again.');
                return;
            }
            
            if (recordingDuration < 0.5) {
                Alert.alert('Recording Too Short', 'Please hold the record button for at least 1 second.');
                return;
            }
            
            if (onRecorded) {
                onRecorded(video);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '';
            
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }
            
            const isStoppedEarly = errorMessage.includes('Recording was stopped') || 
                                  errorMessage.includes('before any data');
            
            if (!isStoppedEarly) {
                Alert.alert('Recording Error', 'Failed to record video. Please try again.');
            }
            
            setIsRecording(false);
            recordingStartTime.current = 0;
            setRecordingTime(0);
        }
    }

    function handleStopRecording() {
        if (!cameraRef.current || !isRecording) return;
        
        try {
            cameraRef.current.stopRecording();
        } catch {
            // Silent fail - error handled in recordAsync callback
        }
    }

    async function handleUploadVideo() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const video = result.assets[0];
                if (onRecorded) {
                    onRecorded({
                        uri: video.uri,
                        width: video.width,
                        height: video.height,
                        duration: video.duration || undefined,
                    });
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video from library');
            console.error('Video picker error:', error);
        }
    }

    if (hasPermission === null) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: '#fff' }}>Camera permission denied</Text>
            </View>
        );
    }

    return (
        <View style={styles.flexFill}>
            <CameraView
                ref={cameraRef}
                style={styles.cameraPreview}
                facing={cameraType}
                mode="video"
            />
            
            {/* Top header overlay */}
            <View style={styles.safeTop}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addAudioButton} onPress={onOpenAudio}>
                        <Ionicons name="musical-notes" size={16} color="#111" />
                        <Text style={styles.addAudioText}>
                            {selectedAudio ? selectedAudio.title : 'Add audio'}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ width: 24 }} />
                </View>
                
                {/* Recording timer */}
                {isRecording && (
                    <View style={styles.timerContainer}>
                        <View style={styles.recordingDot} />
                        <Text style={[styles.timerText, recordingTime >= 25 && styles.timerWarning]}>
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </Text>
                        {recordingTime >= 25 && (
                            <Text style={styles.timerWarningText}>
                                Max 30s
                            </Text>
                        )}
                    </View>
                )}
            </View>

            {/* Right side controls overlay */}
            <View style={[styles.rightControls, { pointerEvents: 'box-none' }]}>
                <TouchableOpacity
                    style={styles.rightControlItem}
                    onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
                >
                    <Ionicons name="camera-reverse" size={22} color="#fff" />
                    <Text style={styles.rightControlLabel}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightControlItem} onPress={onOpenFilter}>
                    <Ionicons name="filter" size={22} color="#fff" />
                    <Text style={styles.rightControlLabel}>
                        {selectedFilter ? selectedFilter.name : 'Filter'}
                    </Text>
                    {selectedFilter && selectedFilter.id !== 'none' && (
                        <View style={styles.filterBadge}>
                            <Ionicons name="checkmark" size={10} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightControlItem} onPress={() => { }}>
                    <Ionicons name="timer" size={22} color="#fff" />
                    <Text style={styles.rightControlLabel}>Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightControlItem} onPress={() => { }}>
                    <Ionicons name="flash" size={22} color="#fff" />
                    <Text style={styles.rightControlLabel}>Flash</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom controls overlay */}
            <View style={styles.bottomRow}>
                <TouchableOpacity style={styles.sideButton} onPress={() => { }}>
                    <Ionicons name="happy-outline" size={28} color="#fff" />
                    <Text style={styles.sideLabel}>Effect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recording]}
                    onPress={() => (isRecording ? handleStopRecording() : handleStartRecording())}
                    activeOpacity={0.8}
                >
                    {isRecording && (
                        <View style={styles.recordingIndicator} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sideButton} onPress={handleUploadVideo}>
                    <Ionicons name="image-outline" size={28} color="#fff" />
                    <Text style={styles.sideLabel}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flexFill: { flex: 1 },
    cameraPreview: { flex: 1, justifyContent: 'space-between' },
    safeTop: { position: 'absolute', top: 0, left: 0, right: 0 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
    iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
    addAudioButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff' },
    addAudioText: { marginLeft: 8, color: '#111', fontWeight: '600' },
    rightControls: { position: 'absolute', right: 12, top: 100, justifyContent: 'flex-start', alignItems: 'center' },
    rightControlItem: { marginBottom: 22, alignItems: 'center', position: 'relative' },
    rightControlLabel: { color: '#fff', fontSize: 11, marginTop: 6 },
    filterBadge: { 
        position: 'absolute', 
        top: -4, 
        right: -4, 
        width: 16, 
        height: 16, 
        borderRadius: 8, 
        backgroundColor: '#FF3B5C', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    bottomRow: { position: 'absolute', left: 0, right: 0, bottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24 },
    sideButton: { alignItems: 'center' },
    sideLabel: { color: '#fff', fontSize: 12, marginTop: 6 },
    recordButton: { 
        width: 72, 
        height: 72, 
        borderRadius: 36, 
        backgroundColor: '#FF5A66', 
        borderWidth: 8, 
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recording: { 
        backgroundColor: '#ff2d55', 
        borderColor: '#fff',
        borderWidth: 4,
    },
    recordingIndicator: {
        width: 24,
        height: 24,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        alignSelf: 'center',
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff2d55',
        marginRight: 8,
    },
    timerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    timerWarning: {
        color: '#ff2d55',
    },
    timerWarningText: {
        color: '#ff2d55',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
