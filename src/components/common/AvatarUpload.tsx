/**
 * Avatar Upload Component
 * Component để user upload/thay đổi ảnh đại diện
 */

import { supabaseService } from '@/services/supabase.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AvatarUploadProps {
  currentAvatar?: string;
  userId: string;
  onUploadSuccess?: (newAvatarUrl: string) => void;
  size?: number;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userId,
  onUploadSuccess,
  size = 120,
}) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);

  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload avatar.'
      );
      return false;
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);

      // Convert URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const fileName = `avatar_${userId}_${Date.now()}.jpg`;
      const avatarUrl = await supabaseService.storage.uploadAvatar(
        blob,
        userId,
        fileName
      );

      // Update user profile in database
      await supabaseService.users.updateUser(userId, {
        profileImage: avatarUrl,
      });

      setAvatarUrl(avatarUrl);
      onUploadSuccess?.(avatarUrl);

      Alert.alert('Success', 'Avatar updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Show options
  const showOptions = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const avatarSource = avatarUrl
    ? { uri: avatarUrl }
    : require('@/assets/images/home/You.png');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showOptions}
        disabled={uploading}
        style={[styles.avatarWrapper, { width: size, height: size }]}
      >
        <Image
          source={avatarSource}
          style={[styles.avatar, { width: size, height: size }]}
          resizeMode="cover"
        />

        {/* Upload Icon */}
        <View style={styles.uploadButton}>
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={20} color="#fff" />
          )}
        </View>

        {/* Border */}
        <View
          style={[
            styles.border,
            { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 },
          ]}
        />
      </TouchableOpacity>

      <Text style={styles.hint}>Tap to change avatar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    borderRadius: 999,
    overflow: 'visible',
  },
  avatar: {
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B5C',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    position: 'absolute',
    top: -4,
    left: -4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    pointerEvents: 'none',
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});
