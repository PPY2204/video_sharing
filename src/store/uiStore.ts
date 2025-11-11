/**
 * UI Store
 * State management for UI elements and global app state
 */

import { create } from "zustand";

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;

  // Modal states
  isModalVisible: boolean;
  modalType: string | null;
  modalData: any | null;

  // Tab navigation
  activeTab: string;

  // Search
  searchQuery: string;
  isSearching: boolean;

  // Comments
  isCommentsVisible: boolean;
  activeVideoId: string | null;

  // Upload progress
  uploadProgress: number;
  isUploading: boolean;

  // Network status
  isConnected: boolean;

  // Theme (future feature)
  theme: "light" | "dark";

  // Actions
  setLoading: (isLoading: boolean, message?: string) => void;
  showModal: (type: string, data?: Record<string, unknown>) => void;
  hideModal: () => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSearching: (isSearching: boolean) => void;
  showComments: (videoId: string) => void;
  hideComments: () => void;
  setUploadProgress: (progress: number) => void;
  startUpload: () => void;
  finishUpload: () => void;
  setConnected: (isConnected: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isLoading: false,
  loadingMessage: null,
  isModalVisible: false,
  modalType: null,
  modalData: null,
  activeTab: "index",
  searchQuery: "",
  isSearching: false,
  isCommentsVisible: false,
  activeVideoId: null,
  uploadProgress: 0,
  isUploading: false,
  isConnected: true,
  theme: "light",

  // Actions
  setLoading: (isLoading, message) => {
    set({ isLoading, loadingMessage: message || null });
  },

  showModal: (type, data) => {
    set({
      isModalVisible: true,
      modalType: type,
      modalData: data || null,
    });
  },

  hideModal: () => {
    set({
      isModalVisible: false,
      modalType: null,
      modalData: null,
    });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSearching: (isSearching) => {
    set({ isSearching });
  },

  showComments: (videoId) => {
    set({
      isCommentsVisible: true,
      activeVideoId: videoId,
    });
  },

  hideComments: () => {
    set({
      isCommentsVisible: false,
      activeVideoId: null,
    });
  },

  setUploadProgress: (progress) => {
    set({ uploadProgress: Math.min(100, Math.max(0, progress)) });
  },

  startUpload: () => {
    set({ isUploading: true, uploadProgress: 0 });
  },

  finishUpload: () => {
    set({ isUploading: false, uploadProgress: 0 });
  },

  setConnected: (isConnected) => {
    set({ isConnected });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  reset: () => {
    set({
      isLoading: false,
      loadingMessage: null,
      isModalVisible: false,
      modalType: null,
      modalData: null,
      searchQuery: "",
      isSearching: false,
      isCommentsVisible: false,
      activeVideoId: null,
      uploadProgress: 0,
      isUploading: false,
      // Don't reset: activeTab, isConnected, theme
    });
  },
}));
