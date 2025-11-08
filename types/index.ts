import { ImageSourcePropType } from "react-native";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage: string | ImageSourcePropType;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  isOnline?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string | ImageSourcePropType;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  user: User;
  hashtags: string[];
  audio?: Audio;
  createdAt: string;
  isLiked?: boolean;
  products?: Product[];
}

export interface Audio {
  id: string;
  name: string;
  duration: string;
  url: string;
  isFavorite: boolean;
  creator: string;
  cover?: string | ImageSourcePropType;
  plays?: number;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: User;
  videoId: string;
  soldCount: number;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  user: User;
  targetId: string;
  isRead: boolean;
  createdAt: string;
}

// Home Screen Section Types
export interface StoryItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  isYou: boolean;
  online: boolean;
}

export interface TrendingItem {
  id: string;
  title: string;
  views: string;
  image: ImageSourcePropType;
  user?: User;
}

export interface TopicItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  color?: string;
}

export interface StreamItem {
  id: string;
  title: string;
  views: string;
  avatar: ImageSourcePropType;
  image: ImageSourcePropType;
  isLive: boolean;
  user?: User;
}

export interface AudioItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: ImageSourcePropType;
  plays?: number;
  isFavorite?: boolean;
}

// Legacy types (deprecated - use new interfaces above)
export type Story = {
  id: string;
  name: string;
  uri: string;
  online?: boolean;
};

export type Card = {
  id: string;
  title: string;
  views: string;
  image: string;
  avatar?: string;
  badge?: string;
  subtitle?: string;
};
