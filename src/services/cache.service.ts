import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEYS = {
  TRENDING: "trending_data",
  VIDEOS: "videos_data",
  USER_PROFILE: "user_profile",
  AUDIOS: "audios_data",
  COMMENTS: "comments_data",
} as const;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: any;
  timestamp: number;
}

export const cacheService = {
  // Set cache với timestamp để quản lý expiration
  set: async (key: string, data: any): Promise<void> => {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      if (__DEV__) {
        console.error("Cache set error:", error);
      }
    }
  },

  // Get cache và tự động xóa nếu hết hạn
  get: async (key: string): Promise<any> => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      if (__DEV__) {
        console.error("Cache get error:", error);
      }
      return null;
    }
  },

  // Xóa cache cụ thể khi có data thay đổi
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (__DEV__) {
        console.error("Cache remove error:", error);
      }
    }
  },

  // Clear all cache khi user logout
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      if (__DEV__) {
        console.error("Cache clear error:", error);
      }
    }
  },
};
