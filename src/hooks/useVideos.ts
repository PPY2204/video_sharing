/**
 * useVideos Hook
 * Custom hook for video-related operations
 * Handles video feed, trending, search with loading states and error handling
 * NOW USES: Supabase for real-time data
 */

import { supabaseService } from "@/services/supabase.service";
import type { Video } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoFeedResult {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseVideoDetailResult {
  video: Video | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseSearchVideosResult {
  results: Video[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

/**
 * Hook for video feed with pagination
 */
export function useVideoFeed(
  initialPage: number = 1,
  limit: number = 10
): UseVideoFeedResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadVideos = useCallback(
    async (pageNum: number, append: boolean = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await supabaseService.videos.getVideos(pageNum, limit);

        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (append) {
          setVideos((prev) => [...prev, ...response.data]);
        } else {
          setVideos(response.data);
        }

        setHasMore(response.hasMore);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore abort errors
        }
        setError(err instanceof Error ? err.message : "Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadVideos(nextPage, true);
    }
  }, [isLoading, hasMore, page, loadVideos]);

  const refresh = useCallback(async () => {
    setPage(1);
    await loadVideos(1, false);
  }, [loadVideos]);

  // Initial load
  useEffect(() => {
    loadVideos(initialPage);

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { videos, isLoading, error, hasMore, loadMore, refresh };
}

/**
 * Hook for single video details
 */
export function useVideoDetail(videoId: string): UseVideoDetailResult {
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadVideo = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await supabaseService.videos.getVideoById(videoId);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setVideo(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load video");
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  const refresh = useCallback(async () => {
    await loadVideo();
  }, [loadVideo]);

  useEffect(() => {
    loadVideo();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadVideo]);

  return { video, isLoading, error, refresh };
}

/**
 * Hook for trending videos
 */
export function useTrendingVideos(limit: number = 10): UseVideoFeedResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadTrending = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await supabaseService.videos.getTrendingVideos(limit);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setVideos(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(
        err instanceof Error ? err.message : "Failed to load trending videos"
      );
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await loadTrending();
  }, [loadTrending]);

  useEffect(() => {
    loadTrending();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadTrending]);

  return {
    videos,
    isLoading,
    error,
    hasMore: false,
    loadMore: async () => {},
    refresh,
  };
}

/**
 * Hook for video search
 */
export function useSearchVideos(): UseSearchVideosResult {
  const [results, setResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await supabaseService.videos.searchVideos(query);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setResults(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { results, isLoading, error, search };
}
