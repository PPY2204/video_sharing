/**
 * Application Constants
 * Central place for all constant values
 */

// ==================== APP CONFIG ====================

export const APP_NAME = "Video Sharing";
export const APP_VERSION = "1.0.0";

// ==================== API CONFIG ====================

export const API_TIMEOUT = 30000; // 30 seconds
export const UPLOAD_TIMEOUT = 300000; // 5 minutes for uploads

// ==================== PAGINATION ====================

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
export const VIDEO_FEED_PAGE_SIZE = 20;

// ==================== VALIDATION ====================

// User
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_BIO_LENGTH = 150;

// Video
export const MAX_VIDEO_DURATION = 180; // 3 minutes in seconds
export const MIN_VIDEO_DURATION = 3; // 3 seconds
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_HASHTAGS = 10;

// Comment
export const MAX_COMMENT_LENGTH = 500;
export const MAX_REPLY_DEPTH = 3;

// ==================== MEDIA ====================

export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
];

export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const SUPPORTED_AUDIO_FORMATS = ["audio/mpeg", "audio/mp3", "audio/wav"];

export const THUMBNAIL_SIZE = {
  width: 720,
  height: 1280,
};

// ==================== CAMERA CONFIG ====================

export const CAMERA_ASPECT_RATIO = 9 / 16; // Vertical video
export const VIDEO_QUALITY = 0.7; // 0-1 scale

// ==================== CACHE ====================

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

export const CACHE_KEYS = {
  USER_PROFILE: "user_profile",
  VIDEO_FEED: "video_feed",
  TRENDING_VIDEOS: "trending_videos",
  TRENDING_HASHTAGS: "trending_hashtags",
  TRENDING_SOUNDS: "trending_sounds",
  USER_VIDEOS: "user_videos",
  SEARCH_RESULTS: "search_results",
} as const;

// ==================== STORAGE KEYS ====================

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  SETTINGS: "settings",
  DRAFT_VIDEOS: "draft_videos",
  VIEWED_STORIES: "viewed_stories",
} as const;

// ==================== ROUTES ====================

export const ROUTES = {
  HOME: "/",
  TRENDING: "/trending",
  FRIENDS: "/friends",
  PROFILE: "/profile",
  SEARCH: "/search",
  CREATE: "/create-video",
  UPLOAD: "/upload",
  CAMERA: "/upload/camera",
  AUDIO_SELECTION: "/upload/audio-selection",
  VIDEO_DETAIL: "/video/[id]",
  PRODUCT_DETAIL: "/shop/[productId]",
} as const;

// ==================== COLORS ====================

export const COLORS = {
  PRIMARY: "#FE2C55",
  SECONDARY: "#25F4EE",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  GRAY: {
    100: "#F1F1F2",
    200: "#D1D1D3",
    300: "#ACACB0",
    400: "#86868B",
    500: "#636366",
  },
  SUCCESS: "#00D856",
  ERROR: "#FF0000",
  WARNING: "#FFB800",
} as const;

// ==================== ANIMATION ====================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// ==================== REGEX PATTERNS ====================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  HASHTAG: /#[\w]+/g,
  MENTION: /@[\w]+/g,
  URL: /(https?:\/\/[^\s]+)/g,
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_FAILED: "Authentication failed. Please login again.",
  UPLOAD_FAILED: "Upload failed. Please try again.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_USERNAME: "Username must be 3-30 characters and alphanumeric.",
  WEAK_PASSWORD: "Password must be at least 8 characters.",
  VIDEO_TOO_LARGE: "Video size must be less than 100MB.",
  VIDEO_TOO_SHORT: "Video must be at least 3 seconds.",
  VIDEO_TOO_LONG: "Video must be less than 3 minutes.",
} as const;

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTER_SUCCESS: "Account created successfully!",
  UPLOAD_SUCCESS: "Video uploaded successfully!",
  COMMENT_POSTED: "Comment posted!",
  PROFILE_UPDATED: "Profile updated!",
  VIDEO_LIKED: "Video liked!",
  FOLLOW_SUCCESS: "Following!",
} as const;

// ==================== FEED FILTERS ====================

export const FEED_FILTERS = {
  FOR_YOU: "foryou",
  FOLLOWING: "following",
  TRENDING: "trending",
} as const;

// ==================== NOTIFICATION TYPES ====================

export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  MENTION: "mention",
} as const;

// ==================== VIDEO PRIVACY ====================

export const VIDEO_PRIVACY = {
  PUBLIC: "public",
  PRIVATE: "private",
  FOLLOWERS: "followers",
} as const;
