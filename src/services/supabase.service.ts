/**
 * Supabase Service
 * Centralized service for all Supabase database operations
 */

import type { Audio, Comment, User, Video } from "@/types";
import { supabase } from "@/utils/subabase";

// ==================== USER OPERATIONS ====================

export const userService = {
  /**
   * Fetch all users
   */
  async getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  /**
   * Fetch user by ID
   */
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  /**
   * Fetch user by username
   */
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    return data as User;
  },

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  /**
   * Follow/Unfollow user
   */
  async toggleFollow(
    userId: string,
    targetUserId: string,
    isFollowing: boolean
  ) {
    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", targetUserId);

      if (error) throw error;
    } else {
      // Follow
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: userId, following_id: targetUserId });

      if (error) throw error;
    }

    return !isFollowing;
  },
};

// ==================== VIDEO OPERATIONS ====================

export const videoService = {
  /**
   * Fetch all videos with pagination
   */
  async getVideos(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("videos")
      .select(
        `
        *,
        user:users(*)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as Video[],
      total: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  },

  /**
   * Fetch video by ID
   */
  async getVideoById(videoId: string) {
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        *,
        user:users(*),
        comments(count)
      `
      )
      .eq("id", videoId)
      .single();

    if (error) throw error;
    return data as Video;
  },

  /**
   * Fetch trending videos
   */
  async getTrendingVideos(limit: number = 20) {
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .order("views", { ascending: false })
      .order("likes", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Video[];
  },

  /**
   * Search videos by title or hashtags
   */
  async searchVideos(query: string, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data as Video[];
  },

  /**
   * Fetch videos by user ID
   */
  async getVideosByUserId(userId: string) {
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Video[];
  },

  /**
   * Like/Unlike video
   */
  async toggleLike(videoId: string, userId: string, isLiked: boolean) {
    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from("video_likes")
        .delete()
        .eq("video_id", videoId)
        .eq("user_id", userId);

      if (error) throw error;

      // Decrement likes count
      await supabase.rpc("decrement_video_likes", { video_id: videoId });
    } else {
      // Like
      const { error } = await supabase
        .from("video_likes")
        .insert({ video_id: videoId, user_id: userId });

      if (error) throw error;

      // Increment likes count
      await supabase.rpc("increment_video_likes", { video_id: videoId });
    }

    return !isLiked;
  },

  /**
   * Increment video views
   */
  async incrementViews(videoId: string) {
    const { error } = await supabase.rpc("increment_video_views", {
      video_id: videoId,
    });

    if (error) throw error;
  },
};

// ==================== COMMENT OPERATIONS ====================

export const commentService = {
  /**
   * Fetch comments for a video
   */
  async getComments(videoId: string, page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("comments")
      .select(
        `
        *,
        user:users(*)
      `,
        { count: "exact" }
      )
      .eq("video_id", videoId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data as Comment[],
      total: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  },

  /**
   * Add a comment
   */
  async addComment(
    videoId: string,
    userId: string,
    text: string,
    parentId?: string
  ) {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        video_id: videoId,
        user_id: userId,
        text,
        parent_id: parentId || null,
      })
      .select(
        `
        *,
        user:users(*)
      `
      )
      .single();

    if (error) throw error;

    // Increment comment count on video
    await supabase.rpc("increment_video_comments", { video_id: videoId });

    return data as Comment;
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string, videoId: string) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;

    // Decrement comment count on video
    await supabase.rpc("decrement_video_comments", { video_id: videoId });
  },

  /**
   * Like/Unlike comment
   */
  async toggleCommentLike(commentId: string, userId: string, isLiked: boolean) {
    if (isLiked) {
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("comment_likes")
        .insert({ comment_id: commentId, user_id: userId });

      if (error) throw error;
    }

    return !isLiked;
  },
};

// ==================== AUDIO OPERATIONS ====================

export const audioService = {
  /**
   * Fetch all audio tracks
   */
  async getAudioTracks(limit: number = 50) {
    const { data, error } = await supabase
      .from("audio_tracks")
      .select("*")
      .order("plays", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Audio[];
  },

  /**
   * Search audio tracks
   */
  async searchAudio(query: string) {
    const { data, error } = await supabase
      .from("audio_tracks")
      .select("*")
      .or(`name.ilike.%${query}%,creator.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data as Audio[];
  },
};

// ==================== EXPORT ALL SERVICES ====================

export const supabaseService = {
  users: userService,
  videos: videoService,
  comments: commentService,
  audio: audioService,
};
