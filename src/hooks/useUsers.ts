/**
 * useUsers Hook
 * Custom hook for user-related operations
 * Handles user profiles, follow/unfollow, user videos
 * NOW USES: Supabase for real-time data
 */

import { supabaseService } from "@/services/supabase.service";
import type { User } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseUserProfileResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseFollowUserResult {
  isFollowing: boolean;
  isLoading: boolean;
  error: string | null;
  toggle: () => Promise<void>;
}

/**
 * Hook for user profile data
 */
export function useUserProfile(userId: string): UseUserProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadUser = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await supabaseService.users.getUserById(userId);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setUser(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  useEffect(() => {
    loadUser();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadUser]);

  return { user, isLoading, error, refresh };
}

/**
 * Hook for follow/unfollow functionality
 */
export function useFollowUser(
  userId: string,
  initialFollowing: boolean = false
): UseFollowUserResult {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    // Optimistic update
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Get current user ID from auth
      const currentUserId = "current-user-id";
      const newState = await supabaseService.users.toggleFollow(
        currentUserId,
        userId,
        previousState
      );
      setIsFollowing(newState);
    } catch (err) {
      // Rollback on error
      setIsFollowing(previousState);
      setError(
        err instanceof Error ? err.message : "Failed to update follow status"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing]);

  return { isFollowing, isLoading, error, toggle };
}

/**
 * Hook for fetching all users
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await supabaseService.users.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, fetchUsers };
}
