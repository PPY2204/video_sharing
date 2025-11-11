/**
 * Centralized Mock Data - All Dummy Data in One Place
 * Sử dụng file này thay vì call API backend
 */

import type { Audio, Comment, StoryItem, User, Video } from "@/types";

// ==================== USERS DATA ====================

export const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "you",
    fullName: "Ruth Sanders",
    email: "ruth@example.com",
    profileImage: require("@/assets/images/home/You.png"),
    bio: "Content creator 🎥",
    followers: 628,
    following: 203,
    likes: 2634,
    isVerified: false,
    isOnline: true,
  },
  {
    id: "2",
    username: "adam_photo",
    fullName: "Adam Johnson",
    email: "adam@example.com",
    profileImage: require("@/assets/images/home/Adam.png"),
    bio: "Photographer & Videographer 📸",
    followers: 15200,
    following: 324,
    likes: 1250000,
    isVerified: true,
    isOnline: true,
  },
  {
    id: "3",
    username: "william_dev",
    fullName: "William Smith",
    email: "william@example.com",
    profileImage: require("@/assets/images/home/William.png"),
    bio: "Tech content creator 💻",
    followers: 28400,
    following: 512,
    likes: 2100000,
    isVerified: true,
    isOnline: true,
  },
  {
    id: "4",
    username: "peter_music",
    fullName: "Peter Garcia",
    email: "peter@example.com",
    profileImage: require("@/assets/images/home/Peter.png"),
    bio: "Music producer 🎵",
    followers: 42100,
    following: 198,
    likes: 3400000,
    isVerified: true,
    isOnline: false,
  },
  {
    id: "5",
    username: "julia_fashion",
    fullName: "Julia Martinez",
    email: "julia@example.com",
    profileImage: require("@/assets/images/home/Julia.png"),
    bio: "Fashion & Lifestyle 👗",
    followers: 89200,
    following: 445,
    likes: 5600000,
    isVerified: true,
    isOnline: false,
  },
];

// Current logged in user
export const CURRENT_USER = MOCK_USERS[0];

// ==================== VIDEOS DATA ====================

export const MOCK_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Amazing sunset timelapse",
    description:
      "Captured this beautiful sunset over the ocean 🌅 #nature #sunset",
    videoUrl: "https://example.com/videos/sunset.mp4",
    thumbnail: require("@/assets/images/search/container-43.png"),
    views: 152000,
    likes: 12300,
    comments: 456,
    shares: 234,
    duration: 45,
    user: MOCK_USERS[1],
    hashtags: ["#nature", "#sunset", "#timelapse"],
    createdAt: "2025-11-10T10:00:00Z",
    isLiked: false,
  },
  {
    id: "v2",
    title: "Coding tutorial: React Native",
    description: "Learn React Native in 10 minutes! 💻 #coding #tutorial",
    videoUrl: "https://example.com/videos/coding.mp4",
    thumbnail: require("@/assets/images/search/container-44.png"),
    views: 284000,
    likes: 18900,
    comments: 892,
    shares: 456,
    duration: 600,
    user: MOCK_USERS[2],
    hashtags: ["#coding", "#tutorial", "#reactnative"],
    createdAt: "2025-11-09T15:30:00Z",
    isLiked: true,
  },
  {
    id: "v3",
    title: "New music preview",
    description: "Working on something special 🎵 #music #preview",
    videoUrl: "https://example.com/videos/music.mp4",
    thumbnail: require("@/assets/images/search/container-40.png"),
    views: 456000,
    likes: 34200,
    comments: 1234,
    shares: 789,
    duration: 120,
    user: MOCK_USERS[3],
    hashtags: ["#music", "#preview", "#newrelease"],
    createdAt: "2025-11-08T18:45:00Z",
    isLiked: true,
  },
  {
    id: "v4",
    title: "Fashion lookbook Fall 2025",
    description: "Check out the latest fall fashion trends! 👗 #fashion",
    videoUrl: "https://example.com/videos/fashion.mp4",
    thumbnail: require("@/assets/images/search/container-38.png"),
    views: 892000,
    likes: 67800,
    comments: 2341,
    shares: 1234,
    duration: 180,
    user: MOCK_USERS[4],
    hashtags: ["#fashion", "#lookbook", "#fall2025"],
    createdAt: "2025-11-07T12:00:00Z",
    isLiked: false,
  },
];

// ==================== COMMENTS DATA ====================

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    videoId: "v1",
    user: MOCK_USERS[1],
    text: "Amazing video! 🔥",
    likes: 45,
    isLiked: false,
    replies: [],
    createdAt: "2025-11-10T11:30:00Z",
  },
  {
    id: "c2",
    videoId: "v1",
    user: MOCK_USERS[2],
    text: "Love the colors!",
    likes: 23,
    isLiked: true,
    replies: [],
    createdAt: "2025-11-10T12:15:00Z",
  },
  {
    id: "c3",
    videoId: "v2",
    user: MOCK_USERS[0],
    text: "Great tutorial! Very helpful 👍",
    likes: 89,
    isLiked: false,
    replies: [],
    createdAt: "2025-11-09T16:00:00Z",
  },
];

// ==================== STORIES DATA ====================

export const MOCK_STORIES: StoryItem[] = [
  {
    id: "s1",
    username: "You",
    profileImage: require("@/assets/images/home/You.png"),
    hasStory: false,
    isAdd: true,
  },
  {
    id: "s2",
    username: "Adam",
    profileImage: require("@/assets/images/home/Adam.png"),
    hasStory: true,
    isAdd: false,
  },
  {
    id: "s3",
    username: "William",
    profileImage: require("@/assets/images/home/William.png"),
    hasStory: true,
    isAdd: false,
  },
  {
    id: "s4",
    username: "Peter",
    profileImage: require("@/assets/images/home/Peter.png"),
    hasStory: true,
    isAdd: false,
  },
  {
    id: "s5",
    username: "Julia",
    profileImage: require("@/assets/images/home/Julia.png"),
    hasStory: false,
    isAdd: false,
  },
];

// ==================== TRENDING DATA ====================

export const MOCK_TRENDING = [
  {
    id: "t1",
    title: "Lovely",
    views: "1.5M",
    image: require("@/assets/images/search/container-43.png"),
    user: {
      profileImage: require("@/assets/images/home/You.png"),
    },
  },
  {
    id: "t2",
    title: "Sweet",
    views: "1.2M",
    image: require("@/assets/images/search/container-44.png"),
    user: {
      profileImage: require("@/assets/images/home/Julia.png"),
    },
  },
  {
    id: "t3",
    title: "Explore",
    views: "1.8M",
    image: require("@/assets/images/search/container-40.png"),
    user: {
      profileImage: require("@/assets/images/home/William.png"),
    },
  },
];

// ==================== TOPICS DATA ====================

export const MOCK_TOPICS = [
  {
    id: "topic1",
    title: "Sports",
    icon: require("@/assets/images/home/Container-4.png"),
    color: "#FEE2E2",
  },
  {
    id: "topic2",
    title: "Podcasts",
    icon: require("@/assets/images/home/Container-5.png"),
    color: "#DBEAFE",
  },
  {
    id: "topic3",
    title: "News",
    icon: require("@/assets/images/home/Container-6.png"),
    color: "#FEF3C7",
  },
  {
    id: "topic4",
    title: "Travel",
    icon: require("@/assets/images/home/Container-7.png"),
    color: "#D1FAE5",
  },
  {
    id: "topic5",
    title: "Health",
    icon: require("@/assets/images/home/Container-8.png"),
    color: "#FCE7F3",
  },
  {
    id: "topic6",
    title: "Weather",
    icon: require("@/assets/images/home/Container-9.png"),
    color: "#FEF3C7",
  },
  {
    id: "topic7",
    title: "Art",
    icon: require("@/assets/images/home/Container-10.png"),
    color: "#E0E7FF",
  },
  {
    id: "topic8",
    title: "+20 Topics",
    icon: require("@/assets/images/home/Streaming.png"),
    color: "#F3E8FF",
  },
];

// ==================== STREAMS DATA ====================

export const MOCK_STREAMS = [
  {
    id: "stream1",
    title: "Perfect lady",
    views: "1.2K",
    avatar: require("@/assets/images/home/You.png"),
    image: require("@/assets/images/home/Container-11.png"),
    isLive: true,
  },
  {
    id: "stream2",
    title: "Rose Garden",
    views: "856",
    avatar: require("@/assets/images/home/Adam.png"),
    image: require("@/assets/images/home/Container-32.png"),
    isLive: true,
  },
  {
    id: "stream3",
    title: "Sweet Moments",
    views: "2.1K",
    avatar: require("@/assets/images/home/Julia.png"),
    image: require("@/assets/images/home/Container-34.png"),
    isLive: true,
  },
];

// ==================== AUDIO/MUSIC DATA ====================

export const MOCK_AUDIO: Audio[] = [
  {
    id: "a1",
    name: "Perfect lady",
    creator: "Various Artists",
    duration: "03:00",
    url: "https://example.com/audio/perfect-lady.mp3",
    cover: require("@/assets/images/search/Laura.png"),
    plays: 1250000,
    isFavorite: true,
  },
  {
    id: "a2",
    name: "Experience",
    creator: "Nature Sounds",
    duration: "04:00",
    url: "https://example.com/audio/experience.mp3",
    cover: require("@/assets/images/search/container-43.png"),
    plays: 856000,
    isFavorite: false,
  },
  {
    id: "a3",
    name: "Yourself",
    creator: "Meditation",
    duration: "05:00",
    url: "https://example.com/audio/yourself.mp3",
    cover: require("@/assets/images/search/container-44.png"),
    plays: 2100000,
    isFavorite: true,
  },
];

// Audio items for home screen (AudioItem type)
export const MOCK_AUDIO_ITEMS = [
  {
    id: "a1",
    title: "Beautiful Lady",
    artist: "MusicLab",
    duration: "00:30",
    cover: require("@/assets/images/home/Image-7.png"),
    genre: "Podcast",
    plays: 1250000,
    isFavorite: true,
  },
  {
    id: "a2",
    title: "Yourself",
    artist: "Beat Masters",
    duration: "00:30",
    cover: require("@/assets/images/home/Image-8.png"),
    genre: "Lifestyle",
    plays: 856000,
    isFavorite: false,
  },
  {
    id: "a3",
    title: "Sweet Rose",
    artist: "Audio Mix",
    duration: "00:30",
    cover: require("@/assets/images/home/Image-9.png"),
    genre: "Bookcase",
    plays: 2100000,
    isFavorite: true,
  },
  {
    id: "a4",
    title: "Experience",
    artist: "Sound Wave",
    duration: "00:30",
    cover: require("@/assets/images/home/Image-10.png"),
    genre: "Lifestyle",
    plays: 1420000,
    isFavorite: false,
  },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Simulate API delay
 */
export const delay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  await delay(500);
  return MOCK_USERS.find((u) => u.id === userId) || null;
};

/**
 * Get video by ID
 */
export const getVideoById = async (videoId: string): Promise<Video | null> => {
  await delay(500);
  return MOCK_VIDEOS.find((v) => v.id === videoId) || null;
};

/**
 * Get paginated videos
 */
export const getVideosFeed = async (page: number = 1, limit: number = 20) => {
  await delay(800);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: MOCK_VIDEOS.slice(start, end),
    page,
    limit,
    total: MOCK_VIDEOS.length,
    totalPages: Math.ceil(MOCK_VIDEOS.length / limit),
  };
};

/**
 * Get comments for video
 */
export const getCommentsByVideoId = async (videoId: string) => {
  await delay(600);
  return MOCK_COMMENTS.filter((c) => c.videoId === videoId);
};

/**
 * Search videos
 */
export const searchVideos = async (query: string) => {
  await delay(700);
  return MOCK_VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.description.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Toggle like video
 */
export const toggleLikeVideo = async (videoId: string): Promise<boolean> => {
  await delay(300);
  const video = MOCK_VIDEOS.find((v) => v.id === videoId);
  if (video) {
    video.isLiked = !video.isLiked;
    video.likes += video.isLiked ? 1 : -1;
    return video.isLiked;
  }
  return false;
};

/**
 * Toggle follow user
 */
export const toggleFollowUser = async (userId: string): Promise<boolean> => {
  await delay(300);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
    user.followers += user.isFollowing ? 1 : -1;
    return user.isFollowing!;
  }
  return false;
};
