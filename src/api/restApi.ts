/**
 * API Service
 * Video Sharing App - Team 10
 * Complete API client with all endpoints per SDLC spec
 */

import type { Comment, Hashtag, User, Video } from "@/types/app.types";
import axios, { AxiosError, AxiosInstance } from "axios";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";
import type {
  AuthResponse,
  LoginRequest,
  PaginatedResponse,
  RegisterRequest,
  SearchResult,
  VideoUploadRequest,
} from "./types";

/**
 * API Service Class with Axios
 */
class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired - trigger logout
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  // ============ AUTH ENDPOINTS ============

  /**
   * POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  }

  /**
   * POST /api/auth/register
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  }

  /**
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    await this.client.post("/api/auth/logout");
  }

  // ============ USER ENDPOINTS ============

  /**
   * GET /api/users/:id
   */
  async getUser(userId: string): Promise<User> {
    const response = await this.client.get<User>(`/api/users/${userId}`);
    return response.data;
  }

  /**
   * PUT /api/users/:id
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await this.client.put<User>(
      `/api/users/${userId}`,
      userData
    );
    return response.data;
  }

  /**
   * POST /api/users/:id/follow
   */
  async followUser(userId: string): Promise<void> {
    await this.client.post(`/api/users/${userId}/follow`);
  }

  /**
   * DELETE /api/users/:id/follow
   */
  async unfollowUser(userId: string): Promise<void> {
    await this.client.delete(`/api/users/${userId}/follow`);
  }

  /**
   * GET /api/users/:id/followers
   */
  async getUserFollowers(
    userId: string,
    page: number = 1
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>(
      `/api/users/${userId}/followers`,
      { params: { page } }
    );
    return response.data;
  }

  /**
   * GET /api/users/:id/following
   */
  async getUserFollowing(
    userId: string,
    page: number = 1
  ): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>(
      `/api/users/${userId}/following`,
      { params: { page } }
    );
    return response.data;
  }

  // ============ VIDEO ENDPOINTS ============

  /**
   * GET /api/videos/feed
   */
  async getFeed(page: number = 1): Promise<PaginatedResponse<Video>> {
    const response = await this.client.get<PaginatedResponse<Video>>(
      "/api/videos/feed",
      {
        params: { page },
      }
    );
    return response.data;
  }

  /**
   * GET /api/videos/trending
   */
  async getTrendingVideos(page: number = 1): Promise<PaginatedResponse<Video>> {
    const response = await this.client.get<PaginatedResponse<Video>>(
      "/api/videos/trending",
      {
        params: { page },
      }
    );
    return response.data;
  }

  /**
   * GET /api/videos/:id
   */
  async getVideo(videoId: string): Promise<Video> {
    const response = await this.client.get<Video>(`/api/videos/${videoId}`);
    return response.data;
  }

  /**
   * POST /api/videos/upload
   */
  async uploadVideo(videoData: VideoUploadRequest): Promise<Video> {
    const formData = new FormData();
    formData.append("video", videoData.video as any);

    if (videoData.coverImage) {
      formData.append("coverImage", videoData.coverImage as any);
    }

    formData.append("title", videoData.title);
    formData.append("description", videoData.description);

    if (videoData.hashtags?.length) {
      formData.append("hashtags", JSON.stringify(videoData.hashtags));
    }

    if (videoData.products?.length) {
      formData.append("products", JSON.stringify(videoData.products));
    }

    const response = await this.client.post<Video>(
      "/api/videos/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60s for video upload
      }
    );
    return response.data;
  }

  /**
   * DELETE /api/videos/:id
   */
  async deleteVideo(videoId: string): Promise<void> {
    await this.client.delete(`/api/videos/${videoId}`);
  }

  /**
   * POST /api/videos/:id/view
   */
  async incrementVideoView(videoId: string): Promise<void> {
    await this.client.post(`/api/videos/${videoId}/view`);
  }

  /**
   * GET /api/users/:id/videos
   */
  async getUserVideos(
    userId: string,
    page: number = 1
  ): Promise<PaginatedResponse<Video>> {
    const response = await this.client.get<PaginatedResponse<Video>>(
      `/api/users/${userId}/videos`,
      { params: { page } }
    );
    return response.data;
  }

  // ============ LIKE ENDPOINTS ============

  /**
   * POST /api/videos/:id/like
   */
  async likeVideo(videoId: string): Promise<void> {
    await this.client.post(`/api/videos/${videoId}/like`);
  }

  /**
   * DELETE /api/videos/:id/like
   */
  async unlikeVideo(videoId: string): Promise<void> {
    await this.client.delete(`/api/videos/${videoId}/like`);
  }

  /**
   * GET /api/users/:id/liked-videos
   */
  async getUserLikedVideos(
    userId: string,
    page: number = 1
  ): Promise<PaginatedResponse<Video>> {
    const response = await this.client.get<PaginatedResponse<Video>>(
      `/api/users/${userId}/liked-videos`,
      { params: { page } }
    );
    return response.data;
  }

  // ============ COMMENT ENDPOINTS ============

  /**
   * GET /api/videos/:id/comments
   */
  async getVideoComments(
    videoId: string,
    page: number = 1
  ): Promise<PaginatedResponse<Comment>> {
    const response = await this.client.get<PaginatedResponse<Comment>>(
      `/api/videos/${videoId}/comments`,
      { params: { page } }
    );
    return response.data;
  }

  /**
   * POST /api/videos/:id/comment
   */
  async addComment(
    videoId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    const response = await this.client.post<Comment>(
      `/api/videos/${videoId}/comment`,
      {
        content,
        parentId,
      }
    );
    return response.data;
  }

  /**
   * DELETE /api/comments/:id
   */
  async deleteComment(commentId: string): Promise<void> {
    await this.client.delete(`/api/comments/${commentId}`);
  }

  /**
   * POST /api/comments/:id/like
   */
  async likeComment(commentId: string): Promise<void> {
    await this.client.post(`/api/comments/${commentId}/like`);
  }

  /**
   * DELETE /api/comments/:id/like
   */
  async unlikeComment(commentId: string): Promise<void> {
    await this.client.delete(`/api/comments/${commentId}/like`);
  }

  // ============ SEARCH ENDPOINTS ============

  /**
   * GET /api/search
   */
  async search(
    query: string,
    type: "all" | "users" | "videos" | "hashtags" = "all",
    page: number = 1
  ): Promise<SearchResult> {
    const response = await this.client.get<SearchResult>("/api/search", {
      params: { q: query, type, page },
    });
    return response.data;
  }

  /**
   * GET /api/hashtags/:name
   */
  async getHashtag(name: string): Promise<Hashtag> {
    const response = await this.client.get<Hashtag>(`/api/hashtags/${name}`);
    return response.data;
  }

  /**
   * GET /api/hashtags/:name/videos
   */
  async getHashtagVideos(
    name: string,
    page: number = 1
  ): Promise<PaginatedResponse<Video>> {
    const response = await this.client.get<PaginatedResponse<Video>>(
      `/api/hashtags/${name}/videos`,
      { params: { page } }
    );
    return response.data;
  }

  /**
   * GET /api/hashtags/trending
   */
  async getTrendingHashtags(limit: number = 10): Promise<Hashtag[]> {
    const response = await this.client.get<Hashtag[]>(
      "/api/hashtags/trending",
      {
        params: { limit },
      }
    );
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export default ApiService;
