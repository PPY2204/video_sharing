/**
 * Component Props Types
 * Reusable prop types for components
 */

import type { Audio, Comment, Product, User, Video } from "@/types/app.types";
import type { AVPlaybackStatus } from "expo-av";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

// ==================== VIDEO COMPONENTS ====================

export interface VideoPlayerProps {
  video: Video;
  isActive?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export interface VideoCardProps {
  video: Video;
  onPress?: () => void;
}

export interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onSeek: (time: number) => void;
}

// ==================== COMMENT COMPONENTS ====================

export interface CommentSectionProps {
  videoId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  onReply: (commentId: string, text: string) => void;
}

export interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
  onReply: () => void;
}

export interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// ==================== SOCIAL COMPONENTS ====================

export interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

export interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle: () => void;
}

export interface UserSuggestionsProps {
  users: User[];
  onFollowUser: (userId: string) => void;
}

// ==================== COMMERCE COMPONENTS ====================

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export interface BuyButtonProps {
  productId: string;
  price: number;
  onPress?: () => void;
}

// ==================== CREATION COMPONENTS ====================

export interface MediaPickerProps {
  onMediaSelected: (uri: string, type: "video" | "image") => void;
  onCancel?: () => void;
}

export interface AudioPickerProps {
  onAudioSelected: (audio: Audio) => void;
  onCancel?: () => void;
}

export interface UploadProgressProps {
  progress: number;
  fileName?: string;
  onCancel?: () => void;
}

// ==================== HOME COMPONENTS ====================

import type {
  AudioItem,
  StreamItem,
  TopicItem,
  TrendingItem,
} from "@/types/app.types";

export interface StoryAvatarProps {
  id: string;
  name: string;
  image: ImageSourcePropType;
  isYou?: boolean;
  online?: boolean;
  onPress?: () => void;
}

export interface TrendingSectionProps {
  items: TrendingItem[];
  onItemPress?: (itemId: string) => void;
}

export interface TopicsGridProps {
  topics: TopicItem[];
  onTopicPress?: (topicId: string) => void;
}

export interface StreamSectionProps {
  streams: StreamItem[];
  onStreamPress?: (streamId: string) => void;
}

export interface AudioSectionProps {
  audios: AudioItem[];
  onAudioPress?: (audioId: string) => void;
}

// ==================== COMMON COMPONENTS ====================

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// ==================== GENERIC PROPS ====================

export interface BaseProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
  testID?: string;
}

export interface ListProps<T> extends BaseProps {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}
