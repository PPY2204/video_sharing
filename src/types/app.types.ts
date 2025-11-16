/**
 * Video Sharing App - Type Definitions
 * Based on SDLC Document v1.0
 * Team 10 - November 2025
 */

import type { ImageSourcePropType } from "react-native";

// ==================== USER TYPES ====================

/**
 * User Entity
 * Represents a user in the system (as per ERD & UML Class Diagram)
 */
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage: string | ImageSourcePropType;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  isOnline?: boolean;
  createdAt?: string;
}

// ==================== VIDEO TYPES ====================

/**
 * Video Entity
 * Core content type (as per ERD)
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string | ImageSourcePropType;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  user: User;
  hashtags: string[];
  audio?: Audio;
  products?: Product[];
  isLiked?: boolean;
  createdAt: string;
}

// ==================== COMMENT TYPES ====================

/**
 * Comment Entity
 * User comments on videos (as per ERD)
 */
export interface Comment {
  id: string;
  videoId?: string;
  user: User;
  text: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  createdAt: string;
}

// ==================== AUDIO TYPES ====================

/**
 * Audio/Sound Entity
 * Audio tracks used in videos
 */
export interface Audio {
  id: string;
  name: string;
  duration: string;
  url: string;
  creator: string;
  cover?: ImageSourcePropType | string;
  plays?: number;
  isFavorite?: boolean;
}

// ==================== HASHTAG TYPES ====================

/**
 * Hashtag Entity (as per ERD)
 */
export interface Hashtag {
  id: string;
  name: string;
  videoCount: number;
  views: number;
}

// ==================== PRODUCT TYPES ====================

/**
 * Product Entity
 * For commerce features (Joy Shop use case)
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | ImageSourcePropType;
  videoId: string;
  sellerId: string;
  seller?: User;
  stock: number;
  description?: string;
}

// ==================== FOLLOW TYPES ====================

/**
 * Follow relationship (as per ERD)
 */
export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

// ==================== STORY TYPES ====================

/**
 * Story Entity - Real story from database
 */
export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: "image" | "video";
  duration?: number;
  caption?: string;
  views: number;
  createdAt: string;
  expiresAt: string;
  isViewed?: boolean;
}

// ==================== FILTER TYPES ====================

/**
 * Filter Entity
 * Video filters for creation
 */
export interface Filter {
  id: string;
  name: string;
  thumbnail?: string | ImageSourcePropType;
  category?: "for-you" | "trending" | "saved";
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

// ==================== HOME SCREEN TYPES ====================

/**
 * Story Item for Stories section
 */
export interface StoryItem {
  id: string;
  username: string;
  profileImage: ImageSourcePropType;
  hasStory?: boolean;
  isAdd?: boolean;
}

/**
 * Trending Item for Trending section
 */
export interface TrendingItem {
  id: string;
  title: string;
  views: string;
  image: ImageSourcePropType;
  user: {
    profileImage: ImageSourcePropType;
  };
}

/**
 * Topic Item for Browse Topics
 */
export interface TopicItem {
  id: string;
  title: string;
  icon: string | ImageSourcePropType | null;
  color: string;
  videoCount?: number;
}

/**
 * Stream Item for Live Streaming
 */
export interface StreamItem {
  id: string;
  title: string;
  views: string;
  avatar: ImageSourcePropType;
  image: ImageSourcePropType;
  isLive: boolean;
}

/**
 * Audio Item for Audio section
 */
export interface AudioItem {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  cover: ImageSourcePropType;
  genre: string;
  plays?: number;
  isFavorite?: boolean;
}

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ==================== FORM TYPES ====================

/**
 * Login Form Data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Register Form Data
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

/**
 * Video Upload Form Data
 */
export interface VideoUploadFormData {
  video: File | Blob | any; // Video file to upload
  coverImage?: File | Blob | any; // Optional cover image
  title: string;
  description: string;
  hashtags?: string[];
  products?: string[]; // Product IDs for commerce integration
  audioId?: string;
  privacy?: "public" | "private" | "followers";
  allowComments?: boolean;
  allowDuet?: boolean;
}

// ==================== FEED TYPES ====================

/**
 * Feed Item Type
 */
export type FeedItem = Video;

/**
 * Feed Filter
 */
export type FeedFilter = "foryou" | "following" | "trending";

// ==================== NOTIFICATION TYPES ====================

/**
 * Notification Entity
 */
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  user: User;
  video?: Video;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ==================== SEARCH TYPES ====================

/**
 * Search Result
 */
export interface SearchResult {
  users: User[];
  videos: Video[];
  hashtags: Hashtag[];
  sounds: Audio[];
}

// ==================== ANALYTICS TYPES ====================

/**
 * Video Analytics
 */
export interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  watchTime: number;
  completionRate: number;
  engagement: number;
}

/**
 * User Analytics
 */
export interface UserAnalytics {
  userId: string;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  followerGrowth: number;
  engagementRate: number;
}
