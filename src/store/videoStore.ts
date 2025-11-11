/**
 * Video Store
 * State management for video playback and feed
 */

import type { Video } from "@/types/app.types";
import { create } from "zustand";

interface VideoState {
  // Current playing video
  currentVideo: Video | null;
  currentIndex: number;

  // Feed data
  feedVideos: Video[];
  isLoadingFeed: boolean;
  hasMoreVideos: boolean;

  // Playback state
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;

  // Actions
  setCurrentVideo: (video: Video | null, index: number) => void;
  setFeedVideos: (videos: Video[]) => void;
  appendFeedVideos: (videos: Video[]) => void;
  setLoadingFeed: (isLoading: boolean) => void;
  setHasMoreVideos: (hasMore: boolean) => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  // Video interactions
  likeVideo: (videoId: string) => void;
  unlikeVideo: (videoId: string) => void;
  incrementViews: (videoId: string) => void;

  // Reset
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  // Initial state
  currentVideo: null,
  currentIndex: 0,
  feedVideos: [],
  isLoadingFeed: false,
  hasMoreVideos: true,
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,

  // Actions
  setCurrentVideo: (video, index) => {
    set({ currentVideo: video, currentIndex: index, currentTime: 0 });
  },

  setFeedVideos: (videos) => {
    set({ feedVideos: videos });
  },

  appendFeedVideos: (videos) => {
    set((state) => ({
      feedVideos: [...state.feedVideos, ...videos],
    }));
  },

  setLoadingFeed: (isLoading) => {
    set({ isLoadingFeed: isLoading });
  },

  setHasMoreVideos: (hasMore) => {
    set({ hasMoreVideos: hasMore });
  },

  // Playback controls
  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  setCurrentTime: (time) => {
    set({ currentTime: time });
  },

  setDuration: (duration) => {
    set({ duration });
  },

  // Video interactions
  likeVideo: (videoId) => {
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId
          ? { ...video, isLiked: true, likes: video.likes + 1 }
          : video
      ),
      currentVideo:
        state.currentVideo?.id === videoId
          ? {
              ...state.currentVideo,
              isLiked: true,
              likes: state.currentVideo.likes + 1,
            }
          : state.currentVideo,
    }));
  },

  unlikeVideo: (videoId) => {
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId
          ? { ...video, isLiked: false, likes: Math.max(0, video.likes - 1) }
          : video
      ),
      currentVideo:
        state.currentVideo?.id === videoId
          ? {
              ...state.currentVideo,
              isLiked: false,
              likes: Math.max(0, state.currentVideo.likes - 1),
            }
          : state.currentVideo,
    }));
  },

  incrementViews: (videoId) => {
    set((state) => ({
      feedVideos: state.feedVideos.map((video) =>
        video.id === videoId ? { ...video, views: video.views + 1 } : video
      ),
      currentVideo:
        state.currentVideo?.id === videoId
          ? { ...state.currentVideo, views: state.currentVideo.views + 1 }
          : state.currentVideo,
    }));
  },

  // Reset
  reset: () => {
    set({
      currentVideo: null,
      currentIndex: 0,
      feedVideos: [],
      isLoadingFeed: false,
      hasMoreVideos: true,
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 0,
    });
  },
}));
