// Type definitions for Home screen data

import { ImageSourcePropType } from "react-native";

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
  user?: {
    profileImage: ImageSourcePropType;
  };
}

export interface TopicItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  color: string;
}

export interface StreamItem {
  id: string;
  title: string;
  views: string;
  avatar: ImageSourcePropType;
  image: ImageSourcePropType;
  isLive: boolean;
}

export interface AudioItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: ImageSourcePropType;
}
