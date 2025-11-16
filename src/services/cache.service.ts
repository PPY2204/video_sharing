import AsyncStorage from "@react-native-async-storage/async-storage";

export const CACHE_KEYS = {
  TRENDING: "trending_data",
  VIDEOS: "videos_data",
  USER_PROFILE: "user_profile",
  AUDIOS: "audios_data",
  COMMENTS: "comments_data",
  FILTERS: "filters_data",
  VIDEO_LIST: "video_list",
} as const;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const cacheService = {
  set: async <T>(key: string, data: T): Promise<void> => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch {
      // Silent fail - cache is not critical
    }
  },

  get: async <T>(key: string): Promise<T | null> => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch {
      return null;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch {
      // Silent fail
    }
  },

  // Cache multiple items at once
  setMultiple: async <T>(
    items: Array<{ key: string; data: T }>
  ): Promise<void> => {
    try {
      const pairs = items.map(({ key, data }) => {
        const cacheItem: CacheItem<T> = {
          data,
          timestamp: Date.now(),
        };
        return [key, JSON.stringify(cacheItem)] as [string, string];
      });
      await AsyncStorage.multiSet(pairs);
    } catch {
      // Silent fail
    }
  },

  // Get multiple items at once
  getMultiple: async <T>(keys: string[]): Promise<Map<string, T | null>> => {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result = new Map<string, T | null>();

      for (const [key, value] of pairs) {
        if (!value) {
          result.set(key, null);
          continue;
        }

        const cacheItem: CacheItem<T> = JSON.parse(value);
        const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

        result.set(key, isExpired ? null : cacheItem.data);
      }

      return result;
    } catch {
      return new Map();
    }
  },
};
