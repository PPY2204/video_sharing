import { Audio, User, Video } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "lauracare",
    fullName: "Laura Chen",
    email: "laura@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    bio: "Pet lover | Sharing daily moments with my furry friends",
    followers: 15200,
    following: 324,
    likes: 1250000,
    isVerified: true,
  },
  {
    id: "2",
    username: "trendage",
    fullName: "Trendage Official",
    email: "contact@trendage.com",
    profileImage:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150",
    bio: "Official Trendage account - Trending videos daily",
    followers: 1560000,
    following: 245,
    likes: 28900000,
    isVerified: true,
  },
];

export const mockAudios: Audio[] = [
  {
    id: "1",
    name: "Beautiful Lady",
    duration: "00:30",
    url: "audio/beautiful-lady.mp3",
    isFavorite: true,
    creator: "MusicLab",
  },
  {
    id: "2",
    name: "Sunny Day",
    duration: "00:30",
    url: "audio/sunny-day.mp3",
    isFavorite: false,
    creator: "Beat Masters",
  },
];

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "She waits for me every day ",
    description:
      "My cat always waits for me at the door when I come home from work",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
    views: 19600,
    likes: 700,
    comments: 125,
    shares: 45,
    duration: 45,
    user: mockUsers[0],
    hashtags: ["lovepet", "cat", "waiting", "cute"],
    audio: mockAudios[0],
    createdAt: "2024-01-15T10:30:00Z",
    isLiked: true,
  },
];
