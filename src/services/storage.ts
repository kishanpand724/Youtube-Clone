import { UserProfile, Video, Comment, Channel } from '../types';
import { INITIAL_CHANNELS, INITIAL_VIDEOS, INITIAL_COMMENTS, INITIAL_SHORTS } from '../data/mockData';

const USER_PROFILE_KEY = 'yt_clone_user_profile';
const USER_VIDEOS_KEY = 'yt_clone_user_videos';
const USER_COMMENTS_KEY = 'yt_clone_user_comments';
const USER_ACCOUNTS_KEY = 'yt_clone_user_accounts';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Alex Developer',
  handle: '@alexdev',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  email: 'alex.developer@example.com',
  subscribers: '12.4K',
  subscriberCount: 12400,
  subscribedChannelIds: ['ch_tech', 'ch_code'],
  likedVideoIds: ['vid_1'],
  dislikedVideoIds: [],
  watchLaterVideoIds: ['vid_3'],
  historyVideoIds: ['vid_1', 'vid_2']
};

export function getStoredUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse stored user profile', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getStoredVideos(): Video[] {
  try {
    const data = localStorage.getItem(USER_VIDEOS_KEY);
    if (data) {
      const customVideos: Video[] = JSON.parse(data);
      return [...customVideos, ...INITIAL_VIDEOS];
    }
  } catch (e) {
    console.error('Failed to parse stored custom videos', e);
  }
  return INITIAL_VIDEOS;
}

export function saveCustomVideo(newVideo: Video): Video[] {
  try {
    const data = localStorage.getItem(USER_VIDEOS_KEY);
    const customVideos: Video[] = data ? JSON.parse(data) : [];
    const updated = [newVideo, ...customVideos];
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
    return [...updated, ...INITIAL_VIDEOS];
  } catch (e) {
    console.error('Failed to save custom video', e);
  }
  return [newVideo, ...getStoredVideos()];
}

export function getStoredComments(): Record<string, Comment[]> {
  try {
    const data = localStorage.getItem(USER_COMMENTS_KEY);
    if (data) {
      const customComments: Record<string, Comment[]> = JSON.parse(data);
      return { ...INITIAL_COMMENTS, ...customComments };
    }
  } catch (e) {
    console.error('Failed to parse stored comments', e);
  }
  return INITIAL_COMMENTS;
}

export function saveStoredComments(comments: Record<string, Comment[]>): void {
  try {
    localStorage.setItem(USER_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
}

export function getStoredAccounts(): Channel[] {
  try {
    const data = localStorage.getItem(USER_ACCOUNTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load accounts', e);
  }
  const defaultAccount: Channel = {
    id: DEFAULT_USER_PROFILE.id,
    name: DEFAULT_USER_PROFILE.name,
    handle: DEFAULT_USER_PROFILE.handle,
    avatar: DEFAULT_USER_PROFILE.avatar,
    banner: DEFAULT_USER_PROFILE.banner,
    subscribers: DEFAULT_USER_PROFILE.subscribers,
    subscriberCount: DEFAULT_USER_PROFILE.subscriberCount,
    description: 'Welcome to my YouTube channel! I build creative tech and web apps.',
    joinedDate: 'Joined Oct 2023',
    isUserOwned: true
  };
  return [defaultAccount];
}

export function saveStoredAccounts(accounts: Channel[]): void {
  try {
    localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts', e);
  }
}
