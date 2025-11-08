import { Ionicons } from '@expo/vector-icons';
import * as ExpoCamera from 'expo-camera';
import { CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onOpenAudio: () => void;
  onOpenFilter: () => void;
  onClose: () => void;
  onRecorded?: (video: any) => void;
};

export default function CameraScreen({ onOpenAudio, onOpenFilter, onClose, onRecorded }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // CameraType from expo-camera can be a type-only import in some setups;
  // use a simple string union for runtime values to avoid TS 'type-only' issues.
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isRecording, setIsRecording] = useState(false);
  // Use a loose ref type to avoid depending on the library's exported type shape.
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function handleStartRecording() {
    if (!cameraRef.current || isRecording) return;
    try {
  setIsRecording(true);
  // Avoid referencing Camera.Constants which may not exist in some versions/types.
  const video = await cameraRef.current.recordAsync();
      setIsRecording(false);
      if (onRecorded) onRecorded(video);
    } catch (err) {
      console.warn('record error', err);
      setIsRecording(false);
    }
  }

  function handleStopRecording() {
    if (!cameraRef.current || !isRecording) return;
    try {
      cameraRef.current.stopRecording();
    } catch (err) {
      console.warn('stop error', err);
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
        ref={(ref: any) => { cameraRef.current = ref; }}
        style={styles.cameraPreview}
        facing={cameraType}
        ratio="16:9"
      >
        <View style={styles.safeTop}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.addAudioButton} onPress={onOpenAudio}>
              <Ionicons name="musical-notes" size={16} color="#111" />
              <Text style={styles.addAudioText}>Add audio</Text>
            </TouchableOpacity>

            <View style={{ width: 24 }} />
          </View>
        </View>

        <View style={styles.rightControls} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.rightControlItem}
            onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse" size={22} color="#fff" />
            <Text style={styles.rightControlLabel}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightControlItem} onPress={onOpenFilter}>
            <Ionicons name="filter" size={22} color="#fff" />
            <Text style={styles.rightControlLabel}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightControlItem} onPress={() => {}}>
            <Ionicons name="timer" size={22} color="#fff" />
            <Text style={styles.rightControlLabel}>Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightControlItem} onPress={() => {}}>
            <Ionicons name="flash" size={22} color="#fff" />
            <Text style={styles.rightControlLabel}>Flash</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.sideButton} onPress={() => {}}>
            <Ionicons name="happy-outline" size={28} color="#fff" />
            <Text style={styles.sideLabel}>Effect</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recording]}
            onPress={() => (isRecording ? handleStopRecording() : handleStartRecording())}
          />

          <TouchableOpacity style={styles.sideButton} onPress={() => {}}>
            <Ionicons name="image-outline" size={28} color="#fff" />
            <Text style={styles.sideLabel}>Upload</Text>
          </TouchableOpacity>
        </View>
  </CameraView>
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
  rightControlItem: { marginBottom: 22, alignItems: 'center' },
  rightControlLabel: { color: '#fff', fontSize: 11, marginTop: 6 },
  bottomRow: { position: 'absolute', left: 0, right: 0, bottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24 },
  sideButton: { alignItems: 'center' },
  sideLabel: { color: '#fff', fontSize: 12, marginTop: 6 },
  recordButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FF5A66', borderWidth: 8, borderColor: 'rgba(255,255,255,0.12)' },
  recording: { backgroundColor: '#ff2d55', borderColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
