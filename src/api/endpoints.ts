/**
 * API Endpoints Configuration
 * Central place for all API endpoint definitions
 */

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.videosharing.com";

/**
 * API Endpoints organized by feature
 */
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VERIFY_EMAIL: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },

  // Users
  USERS: {
    ME: "/api/users/me",
    PROFILE: (userId: string) => `/api/users/${userId}`,
    UPDATE: (userId: string) => `/api/users/${userId}`,
    FOLLOWERS: (userId: string) => `/api/users/${userId}/followers`,
    FOLLOWING: (userId: string) => `/api/users/${userId}/following`,
    VIDEOS: (userId: string) => `/api/users/${userId}/videos`,
    LIKED_VIDEOS: (userId: string) => `/api/users/${userId}/liked-videos`,
  },

  // Videos
  VIDEOS: {
    FEED: "/api/videos/feed",
    TRENDING: "/api/videos/trending",
    FOLLOWING: "/api/videos/following",
    DETAIL: (videoId: string) => `/api/videos/${videoId}`,
    UPLOAD: "/api/videos/upload",
    UPDATE: (videoId: string) => `/api/videos/${videoId}`,
    DELETE: (videoId: string) => `/api/videos/${videoId}`,
    LIKE: (videoId: string) => `/api/videos/${videoId}/like`,
    UNLIKE: (videoId: string) => `/api/videos/${videoId}/unlike`,
    VIEW: (videoId: string) => `/api/videos/${videoId}/view`,
    SHARE: (videoId: string) => `/api/videos/${videoId}/share`,
  },

  // Comments
  COMMENTS: {
    LIST: (videoId: string) => `/api/videos/${videoId}/comments`,
    CREATE: "/api/comments",
    UPDATE: (commentId: string) => `/api/comments/${commentId}`,
    DELETE: (commentId: string) => `/api/comments/${commentId}`,
    LIKE: (commentId: string) => `/api/comments/${commentId}/like`,
    UNLIKE: (commentId: string) => `/api/comments/${commentId}/unlike`,
    REPLIES: (commentId: string) => `/api/comments/${commentId}/replies`,
  },

  // Follow
  FOLLOW: {
    FOLLOW: (userId: string) => `/api/users/${userId}/follow`,
    UNFOLLOW: (userId: string) => `/api/users/${userId}/unfollow`,
    CHECK: (userId: string) => `/api/users/${userId}/is-following`,
  },

  // Search
  SEARCH: {
    ALL: "/api/search",
    USERS: "/api/search/users",
    VIDEOS: "/api/search/videos",
    HASHTAGS: "/api/search/hashtags",
    SOUNDS: "/api/search/sounds",
    SUGGESTIONS: "/api/search/suggestions",
  },

  // Hashtags
  HASHTAGS: {
    TRENDING: "/api/hashtags/trending",
    DETAIL: (hashtag: string) => `/api/hashtags/${hashtag}`,
    VIDEOS: (hashtag: string) => `/api/hashtags/${hashtag}/videos`,
  },

  // Sounds/Audio
  SOUNDS: {
    LIST: "/api/sounds",
    TRENDING: "/api/sounds/trending",
    DETAIL: (soundId: string) => `/api/sounds/${soundId}`,
    VIDEOS: (soundId: string) => `/api/sounds/${soundId}/videos`,
    FAVORITE: (soundId: string) => `/api/sounds/${soundId}/favorite`,
    UNFAVORITE: (soundId: string) => `/api/sounds/${soundId}/unfavorite`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/api/notifications",
    MARK_READ: (notificationId: string) =>
      `/api/notifications/${notificationId}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
    DELETE: (notificationId: string) => `/api/notifications/${notificationId}`,
  },

  // Products (Commerce)
  PRODUCTS: {
    LIST: "/api/products",
    DETAIL: (productId: string) => `/api/products/${productId}`,
    BY_VIDEO: (videoId: string) => `/api/videos/${videoId}/products`,
    BY_SELLER: (sellerId: string) => `/api/users/${sellerId}/products`,
  },

  // Analytics
  ANALYTICS: {
    VIDEO: (videoId: string) => `/api/analytics/videos/${videoId}`,
    USER: (userId: string) => `/api/analytics/users/${userId}`,
    DASHBOARD: "/api/analytics/dashboard",
  },

  // Upload
  UPLOAD: {
    VIDEO: "/api/upload/video",
    IMAGE: "/api/upload/image",
    AUDIO: "/api/upload/audio",
  },
} as const;

/**
 * Helper to build full URL
 */
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Export base URL
 */
export { API_BASE_URL };
