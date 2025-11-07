import { Video as VideoType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface VideoPlayerProps {
  video: VideoType;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoPlay = false
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlayback = async () => {
    if (status?.isLoaded) {
      if (status.isPlaying) {
        await videoRef.current?.pauseAsync();
      } else {
        await videoRef.current?.playAsync();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View className="relative w-full h-full bg-black">
      {/* 👉 TẠI SAO: Expo AV cho video playback với hardware acceleration */}
      <Video
        ref={videoRef}
        className="w-full h-full"
        source={{ uri: video.videoUrl }}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        isMuted={isMuted}
        shouldPlay={autoPlay}
        useNativeControls={false}
        onPlaybackStatusUpdate={setStatus}
      />

      {/* Custom Controls */}
      <TouchableOpacity
        className="absolute inset-0"
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      >
        {showControls && (
          <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-center">
            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={togglePlayback}
              className="bg-black/50 p-3 rounded-full"
            >
              <Ionicons
                name={status?.isLoaded ? "pause" : "play"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            {/* Mute/Unmute Button */}
            <TouchableOpacity
              onPress={toggleMute}
              className="bg-black/50 p-3 rounded-full"
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Video Info Overlay */}
      <View className="absolute bottom-20 left-4 right-4">
        <Text className="text-white text-lg font-semibold">
          @{video.user.username}
        </Text>
        <Text className="text-white text-base mt-1">
          {video.title}
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {video.hashtags.map((tag, index) => (
            <Text key={index} className="text-blue-400 text-sm mr-2">
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};