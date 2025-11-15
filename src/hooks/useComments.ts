/**
 * useComments Hook
 * Custom hook for comments operations
 * Handles fetching, posting, and pagination of comments
 * NOW USES: Supabase for real-time data
 */

import { supabaseService } from "@/services/supabase.service";
import type { Comment } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseCommentsResult {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  addComment: (text: string, parentId?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for comments with pagination and posting
 */
export function useComments(
  videoId: string,
  pageSize: number = 20
): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const allCommentsRef = useRef<Comment[]>([]);

  const loadComments = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await supabaseService.comments.getComments(
          videoId,
          pageNum,
          pageSize
        );

        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (append) {
          setComments((prev) => [...prev, ...response.data]);
        } else {
          setComments(response.data);
        }

        setHasMore(response.hasMore);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load comments"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [videoId, pageSize]
  );

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadComments(nextPage, true);
    }
  }, [isLoading, hasMore, page, loadComments]);

  const addComment = useCallback(
    async (text: string, parentId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Get current user ID from auth
        const userId = "current-user-id";

        const newComment = await supabaseService.comments.addComment(
          videoId,
          userId,
          text,
          parentId
        );

        // Update displayed comments
        setComments((prev) => [newComment, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to post comment");
      } finally {
        setIsLoading(false);
      }
    },
    [videoId]
  );

  const refresh = useCallback(async () => {
    setPage(1);
    await loadComments(1, false);
  }, [loadComments]);

  useEffect(() => {
    loadComments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadComments]);

  return { comments, isLoading, error, hasMore, loadMore, addComment, refresh };
}
