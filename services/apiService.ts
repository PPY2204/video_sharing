import { cacheService } from "./cacheService";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.videosharing.com";

class ApiService {
  private async fetchWithCache<T>(
    endpoint: string,
    cacheKey: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached data for:", cacheKey);
      return cachedData;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Cache response để giảm server load
      await cacheService.set(cacheKey, data);

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Video APIs
  async getFeed(): Promise<any[]> {
    return this.fetchWithCache("/videos/feed", "video_feed");
  }

  async getTrending(): Promise<any[]> {
    return this.fetchWithCache("/videos/trending", "trending_videos");
  }

  async getVideo(id: string): Promise<any> {
    return this.fetchWithCache(`/videos/${id}`, `video_${id}`);
  }

  async likeVideo(videoId: string): Promise<void> {
    // Clear cache khi có thay đổi data
    await cacheService.remove("video_feed");
    await cacheService.remove(`video_${videoId}`);

    await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
      method: "POST",
    });
  }

  async uploadVideo(formData: FormData): Promise<any> {
    // Clear relevant cache sau khi upload
    await cacheService.remove("video_feed");
    await cacheService.remove("trending_videos");

    const response = await fetch(`${API_BASE_URL}/videos/upload`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }
}

export const apiService = new ApiService();
