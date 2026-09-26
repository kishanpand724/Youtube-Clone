import { Video, Channel, Comment } from '../types';

export interface YoutubeApiStatus {
  hasKey: boolean;
  mode: 'live_youtube_api' | 'demo_seed_data';
  keySource?: 'client' | 'server' | 'none';
}

export function getStoredYoutubeApiKey(): string {
  try {
    return localStorage.getItem('youtube_api_key') || '';
  } catch (e) {
    return '';
  }
}

export function setStoredYoutubeApiKey(key: string) {
  try {
    if (key.trim()) {
      localStorage.setItem('youtube_api_key', key.trim());
    } else {
      localStorage.removeItem('youtube_api_key');
    }
  } catch (e) {
    console.error('Failed to save YouTube API key', e);
  }
}

function getApiHeaders(): Record<string, string> {
  const key = getStoredYoutubeApiKey();
  const headers: Record<string, string> = {};
  if (key) {
    headers['x-youtube-api-key'] = key;
  }
  return headers;
}

export async function checkYoutubeApiStatus(): Promise<YoutubeApiStatus> {
  try {
    const res = await fetch('/api/youtube/status', {
      headers: getApiHeaders()
    });
    const data = await res.json();
    return data;
  } catch (e) {
    const clientKey = getStoredYoutubeApiKey();
    if (clientKey) {
      return { hasKey: true, mode: 'live_youtube_api', keySource: 'client' };
    }
    return { hasKey: false, mode: 'demo_seed_data', keySource: 'none' };
  }
}

// Convert YouTube Data API item to app Video model
export function transformYoutubeVideo(item: any): Video {
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId || `yt_${Math.random()}`;
  const snippet = item.snippet || {};
  const stats = item.statistics || {};

  const viewsCount = stats.viewCount ? parseInt(stats.viewCount, 10) : Math.floor(Math.random() * 500000) + 10000;
  const formattedViews = viewsCount >= 1000000 
    ? `${(viewsCount / 1000000).toFixed(1)}M views`
    : `${(viewsCount / 1000).toFixed(0)}K views`;

  const channelObj: Channel = {
    id: snippet.channelId || `ch_${snippet.channelTitle || 'youtube'}`,
    name: snippet.channelTitle || 'YouTube Creator',
    handle: `@${(snippet.channelTitle || 'creator').toLowerCase().replace(/\s+/g, '')}`,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    subscribers: '1.2M',
    subscriberCount: 1200000,
    verified: true
  };

  return {
    id: videoId,
    title: snippet.title || 'Untitled YouTube Video',
    description: snippet.description || 'Watch on YouTube',
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    duration: '10:15',
    views: formattedViews,
    viewCount: viewsCount,
    uploadedAt: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : 'Recently',
    category: 'YouTube',
    tags: ['youtube', 'trending', 'video'],
    channel: channelObj,
    likes: stats.likeCount ? parseInt(stats.likeCount, 10) : Math.floor(viewsCount * 0.05),
    dislikes: 12
  };
}

export async function fetchLivePopularVideos(): Promise<Video[]> {
  try {
    const res = await fetch('/api/youtube/popular', {
      headers: getApiHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.items && Array.isArray(data.items)) {
      return data.items.map(transformYoutubeVideo);
    }
  } catch (e) {
    console.error('Failed to fetch live YouTube popular videos:', e);
  }
  return [];
}

export async function fetchLiveSearchVideos(query: string): Promise<Video[]> {
  try {
    const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`, {
      headers: getApiHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.items && Array.isArray(data.items)) {
      return data.items.map(transformYoutubeVideo);
    }
  } catch (e) {
    console.error('Failed to search YouTube videos:', e);
  }
  return [];
}

export async function fetchLiveVideoComments(videoId: string): Promise<Comment[]> {
  try {
    const res = await fetch(`/api/youtube/comments?videoId=${videoId}`, {
      headers: getApiHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.items && Array.isArray(data.items)) {
      return data.items.map((item: any) => {
        const top = item.snippet?.topLevelComment?.snippet || {};
        return {
          id: item.id || `comment_${Math.random()}`,
          videoId,
          channelId: top.authorChannelId?.value || 'yt_user',
          authorName: top.authorDisplayName || 'YouTube Viewer',
          authorAvatar: top.authorProfileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          text: top.textDisplay || top.textOriginal || '',
          timestamp: top.publishedAt ? new Date(top.publishedAt).toLocaleDateString() : 'Recently',
          likes: top.likeCount || 0
        };
      });
    }
  } catch (e) {
    console.error('Failed to fetch live comments:', e);
  }
  return [];
}
