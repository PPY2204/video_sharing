export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage: string;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  user: User;
  hashtags: string[];
  audio: Audio;
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
