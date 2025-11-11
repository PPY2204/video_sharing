/**
 * API Types
 * Type definitions specifically for API requests/responses
 */

import type { Audio, Hashtag, User, Video } from "@/types/app.types";

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Paginated Response for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

/**
 * Auth Response (login/register)
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ==================== API REQUEST TYPES ====================

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

/**
 * Video Upload Request
 */
export interface VideoUploadRequest {
  video: File | Blob | any; // Video file
  coverImage?: File | Blob | any; // Cover image
  title: string;
  description: string;
  hashtags?: string[];
  products?: string[]; // Product IDs
  audioId?: string;
  privacy?: "public" | "private" | "followers";
  allowComments?: boolean;
  allowDuet?: boolean;
}

/**
 * Comment Create Request
 */
export interface CommentCreateRequest {
  videoId: string;
  text: string;
  parentId?: string; // For replies
}

/**
 * User Update Request
 */
export interface UserUpdateRequest {
  fullName?: string;
  bio?: string;
  profileImage?: string;
}

// ==================== SEARCH TYPES ====================

/**
 * Search Result aggregated response
 */
export interface SearchResult {
  users: User[];
  videos: Video[];
  hashtags: Hashtag[];
  sounds: Audio[];
}

/**
 * Search Query Parameters
 */
export interface SearchParams {
  query: string;
  type?: "all" | "users" | "videos" | "hashtags" | "sounds";
  page?: number;
  limit?: number;
}

// ==================== FEED TYPES ====================

/**
 * Feed Query Parameters
 */
export interface FeedParams {
  filter?: "foryou" | "following" | "trending";
  page?: number;
  limit?: number;
}

// ==================== ERROR TYPES ====================

/**
 * API Error Response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
