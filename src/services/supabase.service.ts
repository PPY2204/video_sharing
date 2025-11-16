/**
 * Supabase Service
 * Centralized service for all Supabase database operations
 */

import type { Audio, Comment, User, Video } from "@/types";
import { supabase } from "@/utils/subabase";

// ==================== HELPER FUNCTIONS ====================

/**
 * Helper: Convert database row to User type (snake_case -> camelCase)
 */
function mapToUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name || row.fullName,
    email: row.email,
    profileImage: row.profile_image || row.profileImage,
    bio: row.bio,
    followers: row.followers || 0,
    following: row.following || 0,
    likes: row.likes || 0,
    isFollowing: row.is_following || row.isFollowing,
    isVerified: row.is_verified || row.isVerified,
    isOnline: row.is_online || row.isOnline,
    createdAt: row.created_at || row.createdAt,
  };
}

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
    return (data || []).map(mapToUser);
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
    return mapToUser(data);
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
    return mapToUser(data);
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
    return mapToUser(data);
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

  /**
   * Search users by username or full name
   */
  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return (data || []).map(mapToUser);
  },
};

// ==================== VIDEO OPERATIONS ====================

/**
 * Helper: Convert database row to Video type (snake_case -> camelCase)
 */
function mapToVideo(row: any): Video {
  // Map user data properly - Supabase returns it as "users" when using foreign key syntax
  const userData = row.users || row.user;

  const mappedUser = userData
    ? {
        id: userData.id,
        username: userData.username,
        fullName: userData.full_name || userData.fullName,
        email: userData.email,
        profileImage:
          userData.profile_image ||
          userData.profileImage ||
          userData.avatar ||
          "https://via.placeholder.com/40",
        bio: userData.bio,
        followers: userData.followers || 0,
        following: userData.following || 0,
        likes: userData.likes || 0,
        isFollowing: userData.is_following || userData.isFollowing,
        isVerified: userData.is_verified || userData.isVerified,
        isOnline: userData.is_online || userData.isOnline,
        createdAt: userData.created_at || userData.createdAt,
      }
    : undefined;

  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    videoUrl: row.video_url, // Map snake_case to camelCase
    thumbnail: row.thumbnail_url || row.thumbnail || "",
    views: row.views || 0,
    likes: row.likes || 0,
    comments: row.comments?.count || row.comments || 0,
    shares: row.shares || 0,
    duration: row.duration || 0,
    user: mappedUser,
    hashtags: row.hashtags || [],
    audio: row.audio,
    products: row.products,
    isLiked: row.is_liked,
    createdAt: row.created_at,
  } as Video;
}

export const videoService = {
  /**
   * Fetch all videos with pagination
   */
  async getVideos(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("videos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Fetch users for these videos
    const userIds = [
      ...new Set((data || []).map((v) => v.user_id).filter(Boolean)),
    ];
    const { data: usersData } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds);

    const usersMap = new Map((usersData || []).map((u) => [u.id, u]));

    // Merge users into videos
    const videosWithUsers = (data || []).map((video) => ({
      ...video,
      users: usersMap.get(video.user_id),
    }));

    return {
      data: videosWithUsers.map(mapToVideo),
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
        users!user_id(*),
        comments(count)
      `
      )
      .eq("id", videoId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Video not found");
    return mapToVideo(data);
  },

  /**
   * Fetch trending videos
   */
  async getTrendingVideos(limit: number = 20) {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("views", { ascending: false })
      .order("likes", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Fetch users for these videos
    const userIds = [
      ...new Set((data || []).map((v) => v.user_id).filter(Boolean)),
    ];
    const { data: usersData } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds);

    const usersMap = new Map((usersData || []).map((u) => [u.id, u]));

    // Merge users into videos
    const videosWithUsers = (data || []).map((video) => ({
      ...video,
      users: usersMap.get(video.user_id),
    }));

    return videosWithUsers.map(mapToVideo);
  },

  /**
   * Search videos by title or hashtags
   */
  async searchVideos(query: string, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Fetch users for these videos
    const userIds = [
      ...new Set((data || []).map((v) => v.user_id).filter(Boolean)),
    ];
    const { data: usersData } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds);

    const usersMap = new Map((usersData || []).map((u) => [u.id, u]));

    // Merge users into videos
    const videosWithUsers = (data || []).map((video) => ({
      ...video,
      users: usersMap.get(video.user_id),
    }));

    return videosWithUsers.map(mapToVideo);
  },

  /**
   * Fetch videos by user ID
   */
  async getVideosByUserId(userId: string) {
    console.log("🔍 getVideosByUserId called with userId:", userId);

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("📦 Videos query result:", { count: data?.length || 0, error });

    if (error) {
      console.error("❌ Error fetching videos:", error);
      throw error;
    }

    // Fetch user data separately
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("👤 User data fetched:", userData?.username);

    // Merge user data into each video
    const videosWithUser = (data || []).map((video) => ({
      ...video,
      users: userData,
    }));

    console.log("✅ Returning videos:", videosWithUser.length);
    return videosWithUser.map(mapToVideo);
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

  /**
   * Create new video
   */
  async createVideo(videoData: {
    userId: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
    hashtags?: string[];
  }) {
    const { data, error } = await supabase
      .from("videos")
      .insert({
        user_id: videoData.userId,
        title: videoData.title,
        description: videoData.description || "",
        video_url: videoData.videoUrl,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        hashtags: videoData.hashtags || [],
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      })
      .select(
        `
        *,
        user:users(*)
      `
      )
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to upload video");
    return mapToVideo(data);
  },

  /**
   * Update video metadata
   */
  async updateVideo(
    videoId: string,
    updates: Partial<{
      title: string;
      description: string;
      visibility: string;
      hashtags: string[];
    }>
  ) {
    const { data, error } = await supabase
      .from("videos")
      .update(updates)
      .eq("id", videoId)
      .select()
      .single();

    if (error) throw error;
    return mapToVideo(data);
  },

  /**
   * Tag a user in a video
   */
  async tagUser(videoId: string, userId: string) {
    const { error } = await supabase.from("video_tags").insert({
      video_id: videoId,
      user_id: userId,
    });

    if (error) throw error;
    return true;
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

// ==================== STORAGE OPERATIONS ====================

interface UploadFileData {
  uri: string;
  name: string;
  type: string;
}

export const storageService = {
  /**
   * Upload video file to Supabase Storage with optimizations
   */
  async uploadVideo(
    fileOrUri: File | Blob | string,
    userId: string,
    fileName?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const finalFileName = fileName || `video_${timestamp}.mp4`;
    const filePath = `videos/${userId}/${finalFileName}`;

    // Handle React Native URI
    if (typeof fileOrUri === "string") {
      const uriParts = fileOrUri.split(".");
      const fileType = uriParts[uriParts.length - 1] || "mp4";

      const formData = new FormData();
      const fileData: UploadFileData = {
        uri: fileOrUri,
        name: finalFileName,
        type: `video/${fileType}`,
      };
      formData.append("file", fileData as unknown as Blob);

      const { data: sessionData } = await supabase.auth.getSession();
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration missing");
      }

      const token = sessionData?.session?.access_token || supabaseKey;

      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/videos/${filePath}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message || "Upload failed");
      }

      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } else {
      // Web browser - use blob directly
      const { data, error } = await supabase.storage
        .from("videos")
        .upload(filePath, fileOrUri, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    }
  },

  /**
   * Upload thumbnail image to Supabase Storage
   */
  async uploadThumbnail(
    file: File | Blob,
    userId: string,
    fileName?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const finalFileName = fileName || `thumb_${timestamp}.jpg`;
    const filePath = `thumbnails/${userId}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from("thumbnails")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  /**
   * Delete video file from storage
   */
  async deleteVideo(videoUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = videoUrl.split("/videos/");
    if (urlParts.length < 2) return;

    const filePath = `videos/${urlParts[1]}`;

    const { error } = await supabase.storage.from("videos").remove([filePath]);

    if (error) throw error;
  },

  /**
   * Delete thumbnail from storage
   */
  async deleteThumbnail(thumbnailUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = thumbnailUrl.split("/thumbnails/");
    if (urlParts.length < 2) return;

    const filePath = `thumbnails/${urlParts[1]}`;

    const { error } = await supabase.storage
      .from("thumbnails")
      .remove([filePath]);

    if (error) throw error;
  },

  /**
   * Upload avatar image to Supabase Storage
   */
  async uploadAvatar(
    file: File | Blob,
    userId: string,
    fileName?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const finalFileName = fileName || `avatar_${timestamp}.jpg`;
    const filePath = `avatars/${userId}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Overwrite existing avatar
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  /**
   * Delete avatar from storage
   */
  async deleteAvatar(avatarUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = avatarUrl.split("/avatars/");
    if (urlParts.length < 2) return;

    const filePath = `avatars/${urlParts[1]}`;

    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) throw error;
  },
};

// ==================== STORY OPERATIONS ====================

export const storyService = {
  /**
   * Fetch active stories from users you follow (not expired) grouped by user
   */
  async getActiveStories(currentUserId?: string) {
    // If no currentUserId provided, return all active stories
    if (!currentUserId) {
      const { data, error } = await supabase
        .from("stories")
        .select(
          `
          id,
          user_id,
          media_url,
          media_type,
          duration,
          caption,
          views,
          created_at,
          expires_at,
          user:users(
            id,
            username,
            full_name,
            email,
            profile_image,
            bio,
            followers,
            following,
            likes,
            is_verified,
            is_online
          )
        `
        )
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return this._groupStoriesByUser(data);
    }

    // Fetch stories from users that currentUser follows
    const { data, error } = await supabase
      .from("stories")
      .select(
        `
        id,
        user_id,
        media_url,
        media_type,
        duration,
        caption,
        views,
        created_at,
        expires_at,
        user:users(
          id,
          username,
          full_name,
          email,
          profile_image,
          bio,
          followers,
          following,
          likes,
          is_verified,
          is_online
        )
      `
      )
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Filter stories from users that currentUser follows
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    if (followsError) throw followsError;

    const followingIds = new Set(follows?.map((f) => f.following_id) || []);

    // Filter stories to only include users that currentUser follows
    const filteredStories =
      data?.filter((story: any) => followingIds.has(story.user_id)) || [];

    return this._groupStoriesByUser(filteredStories);
  },

  /**
   * Helper: Group stories by user
   */
  _groupStoriesByUser(data: any[]) {
    const storiesByUser = new Map();

    data?.forEach((story: any) => {
      const userId = story.user_id;
      if (!storiesByUser.has(userId)) {
        // Map database fields to TypeScript interface
        const user = story.user;
        storiesByUser.set(userId, {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.full_name,
            email: user.email,
            profileImage: user.profile_image,
            bio: user.bio,
            followers: user.followers || 0,
            following: user.following || 0,
            likes: user.likes || 0,
            isVerified: user.is_verified || false,
            isOnline: user.is_online || false,
          },
          stories: [],
        });
      }
      storiesByUser.get(userId).stories.push(story);
    });

    return Array.from(storiesByUser.values());
  },

  /**
   * Fetch stories by user ID
   */
  async getUserStories(userId: string) {
    const { data, error } = await supabase
      .from("stories")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq("user_id", userId)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Create a new story
   */
  async createStory(storyData: {
    userId: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    duration?: number;
    caption?: string;
  }) {
    const { data, error } = await supabase
      .from("stories")
      .insert({
        user_id: storyData.userId,
        media_url: storyData.mediaUrl,
        media_type: storyData.mediaType,
        duration: storyData.duration,
        caption: storyData.caption,
      })
      .select(
        `
        *,
        user:users(*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark story as viewed
   */
  async viewStory(storyId: string, viewerId: string) {
    const { error } = await supabase.from("story_views").insert({
      story_id: storyId,
      viewer_id: viewerId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate key error
      throw error;
    }

    // Increment view count
    await supabase.rpc("increment_story_views", { story_id: storyId });
  },

  /**
   * Delete story
   */
  async deleteStory(storyId: string) {
    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) throw error;
  },
};

// ==================== TOPIC OPERATIONS ====================

export const topicService = {
  /**
   * Get all topics
   */
  async getTopics() {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("video_count", { ascending: false });

    if (error) throw error;

    // Map database fields to app types
    return data.map((topic) => ({
      id: topic.id,
      title: topic.title,
      icon: topic.icon_url || null, // Will need to handle local icons separately
      color: topic.color,
      videoCount: topic.video_count,
    }));
  },
};

// ==================== STREAM OPERATIONS ====================

export const streamService = {
  /**
   * Get all live streams
   */
  async getLiveStreams() {
    const { data, error } = await supabase
      .from("streams")
      .select(
        `
        *,
        users:user_id (
          id,
          username,
          profile_image
        )
      `
      )
      .eq("is_live", true)
      .order("viewers", { ascending: false });

    if (error) throw error;

    // Map database fields to app types
    return data.map((stream) => ({
      id: stream.id,
      title: stream.title,
      views: `${(stream.viewers / 1000).toFixed(1)}K`,
      image: stream.thumbnail || "",
      avatar: stream.users?.profile_image || "",
      isLive: stream.is_live,
      user: stream.users
        ? {
            id: stream.users.id,
            username: stream.users.username,
            profileImage: stream.users.profile_image,
          }
        : null,
    }));
  },

  /**
   * Get stream by ID
   */
  async getStreamById(streamId: string) {
    const { data, error } = await supabase
      .from("streams")
      .select(
        `
        *,
        users:user_id (*)
      `
      )
      .eq("id", streamId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create new stream
   */
  async createStream(userId: string, title: string, thumbnail?: string) {
    const { data, error } = await supabase
      .from("streams")
      .insert({
        user_id: userId,
        title,
        thumbnail,
        is_live: true,
        viewers: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * End stream
   */
  async endStream(streamId: string) {
    const { error } = await supabase
      .from("streams")
      .update({
        is_live: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", streamId);

    if (error) throw error;
  },
};

// ==================== FILTER OPERATIONS ====================

export const filterService = {
  /**
   * Get all filters
   */
  async getFilters(category?: "for-you" | "trending" | "saved") {
    let query = supabase
      .from("filters")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((filter: any) => ({
      id: filter.id,
      name: filter.name,
      thumbnail: filter.thumbnail,
      category: filter.category,
      isActive: filter.is_active,
      sortOrder: filter.sort_order,
      createdAt: filter.created_at,
    }));
  },

  /**
   * Get filter by ID
   */
  async getFilterById(filterId: string) {
    const { data, error } = await supabase
      .from("filters")
      .select("*")
      .eq("id", filterId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      thumbnail: data.thumbnail,
      category: data.category,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
    };
  },
};

// ==================== EXPORT ALL SERVICES ====================

export const supabaseService = {
  users: userService,
  videos: videoService,
  comments: commentService,
  audio: audioService,
  storage: storageService,
  stories: storyService,
  topics: topicService,
  streams: streamService,
  filters: filterService,
};
