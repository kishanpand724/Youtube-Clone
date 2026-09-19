export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  subscribers: string;
  subscriberCount: number;
  verified?: boolean;
  description?: string;
  joinedDate?: string;
  isUserOwned?: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  channelId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  viewCount: number;
  uploadedAt: string;
  category: string;
  tags: string[];
  channel: Channel;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  isShort?: boolean;
}

export type ActiveTab = 'home' | 'shorts' | 'subscriptions' | 'library' | 'history' | 'liked' | 'channel' | 'search';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  email: string;
  subscribers: string;
  subscriberCount: number;
  subscribedChannelIds: string[];
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  watchLaterVideoIds: string[];
  historyVideoIds: string[];
}
