import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoGrid } from './components/VideoGrid';
import { WatchPage } from './components/WatchPage';
import { ShortsView } from './components/ShortsView';
import { SubscriptionFeed } from './components/SubscriptionFeed';
import { ChannelPage } from './components/ChannelPage';
import { UploadModal } from './components/UploadModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ApiKeyModal } from './components/ApiKeyModal';

import { ActiveTab, Video, Channel, UserProfile, Comment } from './types';
import { INITIAL_CHANNELS, INITIAL_SHORTS } from './data/mockData';
import { 
  getStoredUserProfile, 
  saveStoredUserProfile, 
  getStoredVideos, 
  saveCustomVideo, 
  getStoredComments, 
  saveStoredComments,
  getStoredAccounts,
  saveStoredAccounts
} from './services/storage';
import { 
  checkYoutubeApiStatus, 
  fetchLivePopularVideos, 
  fetchLiveSearchVideos, 
  fetchLiveVideoComments,
  YoutubeApiStatus 
} from './services/youtubeApi';

export default function App() {
  // Persistence state
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile);
  const [videos, setVideos] = useState<Video[]>(getStoredVideos);
  const [comments, setComments] = useState<Record<string, Comment[]>>(getStoredComments);
  const [accounts, setAccounts] = useState<Channel[]>(getStoredAccounts);
  const [youtubeApiStatus, setYoutubeApiStatus] = useState<YoutubeApiStatus>({ hasKey: false, mode: 'demo_seed_data' });

  // Active view navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // UI Modals
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Function to initialize & sync YouTube API state
  const refreshYoutubeData = async () => {
    const status = await checkYoutubeApiStatus();
    setYoutubeApiStatus(status);
    if (status.hasKey) {
      const liveVideos = await fetchLivePopularVideos();
      if (liveVideos.length > 0) {
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v.id));
          const newLive = liveVideos.filter((v) => !existingIds.has(v.id));
          return [...newLive, ...prev];
        });
      }
    }
  };

  useEffect(() => {
    refreshYoutubeData();
  }, []);

  // Fetch comments when selecting video if YouTube API key is active
  useEffect(() => {
    if (selectedVideo && youtubeApiStatus.hasKey && (!comments[selectedVideo.id] || comments[selectedVideo.id].length === 0)) {
      fetchLiveVideoComments(selectedVideo.id).then((liveComments) => {
        if (liveComments.length > 0) {
          setComments((prev) => ({
            ...prev,
            [selectedVideo.id]: liveComments
          }));
        }
      });
    }
  }, [selectedVideo, youtubeApiStatus.hasKey]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStoredUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveStoredComments(comments);
  }, [comments]);

  useEffect(() => {
    saveStoredAccounts(accounts);
  }, [accounts]);

  // Derived subscribed channels
  const subscribedChannels = INITIAL_CHANNELS.filter((ch) =>
    userProfile.subscribedChannelIds.includes(ch.id)
  );

  // Navigation handlers
  const handleNavigateHome = () => {
    setActiveTab('home');
    setSelectedVideo(null);
    setSelectedChannelId(null);
    setSearchQuery('');
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    if (!userProfile.historyVideoIds.includes(video.id)) {
      setUserProfile((prev) => ({
        ...prev,
        historyVideoIds: [video.id, ...prev.historyVideoIds]
      }));
    }
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedVideo(null);
    setActiveTab('channel');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedVideo(null);
    setSelectedChannelId(null);
    setActiveTab('home');

    if (youtubeApiStatus.hasKey) {
      const liveResults = await fetchLiveSearchVideos(searchQuery);
      if (liveResults.length > 0) {
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v.id));
          const newLive = liveResults.filter((v) => !existingIds.has(v.id));
          return [...newLive, ...prev];
        });
      }
    }
  };

  // Subscriptions handler
  const handleToggleSubscribe = (channelId: string) => {
    setUserProfile((prev) => {
      const isSubbed = prev.subscribedChannelIds.includes(channelId);
      const updatedSubIds = isSubbed
        ? prev.subscribedChannelIds.filter((id) => id !== channelId)
        : [...prev.subscribedChannelIds, channelId];
      return { ...prev, subscribedChannelIds: updatedSubIds };
    });
  };

  // Like & Dislike handler
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLikedNow = !v.isLiked;
          return {
            ...v,
            isLiked: isLikedNow,
            isDisliked: false,
            likes: isLikedNow ? v.likes + 1 : Math.max(0, v.likes - 1)
          };
        }
        return v;
      })
    );
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo((prev) => prev ? { ...prev, isLiked: !prev.isLiked, isDisliked: false } : null);
    }
  };

  const handleToggleDislike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isDislikedNow = !v.isDisliked;
          return {
            ...v,
            isDisliked: isDislikedNow,
            isLiked: false
          };
        }
        return v;
      })
    );
  };

  // Save / Watch Later handler
  const handleToggleSave = (videoId: string) => {
    setUserProfile((prev) => {
      const isSaved = prev.watchLaterVideoIds.includes(videoId);
      const updated = isSaved
        ? prev.watchLaterVideoIds.filter((id) => id !== videoId)
        : [...prev.watchLaterVideoIds, videoId];
      return { ...prev, watchLaterVideoIds: updated };
    });
  };

  // Add Comment handler
  const handleAddComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      videoId,
      channelId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      text,
      timestamp: 'Just now',
      likes: 0
    };

    setComments((prev) => {
      const existing = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: [newComment, ...existing]
      };
    });
  };

  // Upload Video success callback
  const handleUploadSuccess = (newVideo: Video) => {
    const updated = saveCustomVideo(newVideo);
    setVideos(updated);
    handleSelectVideo(newVideo);
  };

  // Account switcher / creation callbacks
  const handleSelectAccount = (account: Channel) => {
    setUserProfile((prev) => ({
      ...prev,
      id: account.id,
      name: account.name,
      handle: account.handle,
      avatar: account.avatar,
      banner: account.banner || prev.banner,
      subscribers: account.subscribers
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === userProfile.id ? { ...acc, ...updated } : acc))
    );
  };

  const handleCreateAccount = (newAccount: Channel) => {
    setAccounts((prev) => [newAccount, ...prev]);
    handleSelectAccount(newAccount);
  };

  // Filter videos by search query if present
  const searchedVideos = videos.filter((v) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      v.title.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query) ||
      v.channel.name.toLowerCase().includes(query) ||
      v.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  // Target Channel object for Channel View
  const activeChannelObj = selectedChannelId
    ? INITIAL_CHANNELS.find((c) => c.id === selectedChannelId) ||
      accounts.find((c) => c.id === selectedChannelId) || {
        id: userProfile.id,
        name: userProfile.name,
        handle: userProfile.handle,
        avatar: userProfile.avatar,
        banner: userProfile.banner,
        subscribers: userProfile.subscribers,
        subscriberCount: userProfile.subscriberCount,
        isUserOwned: true
      }
    : null;

  return (
    <div id="youtube-app-root" className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col antialiased">
      {/* Top Header Navigation */}
      <Header
        userProfile={userProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenProfileSwitcher={() => setIsProfileSwitcherOpen(true)}
        onNavigateHome={handleNavigateHome}
        onSelectChannel={handleSelectChannel}
        youtubeApiStatus={youtubeApiStatus}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 relative min-h-[calc(100vh-3.5rem)]">
        {/* Left Drawer Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedVideo(null);
            setSelectedChannelId(null);
          }}
          isCollapsed={isSidebarCollapsed}
          subscribedChannels={subscribedChannels}
          onSelectChannel={handleSelectChannel}
          activeChannelId={selectedChannelId || undefined}
        />

        {/* Dynamic Main View Area */}
        <main id="main-content-area" className="flex-1 overflow-x-hidden">
          {/* 1. Watch Page View */}
          {selectedVideo ? (
            <WatchPage
              video={selectedVideo}
              allVideos={videos}
              userProfile={userProfile}
              comments={comments[selectedVideo.id] || []}
              onAddComment={handleAddComment}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onToggleSubscribe={handleToggleSubscribe}
              isSubscribed={userProfile.subscribedChannelIds.includes(selectedVideo.channel.id)}
              onToggleLike={handleToggleLike}
              onToggleDislike={handleToggleDislike}
              onToggleSave={handleToggleSave}
            />
          ) : activeTab === 'shorts' ? (
            /* 2. Shorts View */
            <ShortsView
              shorts={INITIAL_SHORTS}
              userProfile={userProfile}
              onToggleSubscribe={handleToggleSubscribe}
              isSubscribed={(id) => userProfile.subscribedChannelIds.includes(id)}
              onSelectChannel={handleSelectChannel}
            />
          ) : activeTab === 'subscriptions' ? (
            /* 3. Subscription Feed View */
            <SubscriptionFeed
              subscribedChannels={subscribedChannels}
              allVideos={videos}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onToggleWatchLater={handleToggleSave}
              watchLaterVideoIds={userProfile.watchLaterVideoIds}
            />
          ) : activeTab === 'channel' && activeChannelObj ? (
            /* 4. Channel Profile View */
            <ChannelPage
              channel={activeChannelObj}
              videos={videos}
              userProfile={userProfile}
              isSubscribed={userProfile.subscribedChannelIds.includes(activeChannelObj.id)}
              onToggleSubscribe={handleToggleSubscribe}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onToggleWatchLater={handleToggleSave}
              watchLaterVideoIds={userProfile.watchLaterVideoIds}
              onOpenProfileSwitcher={() => setIsProfileSwitcherOpen(true)}
            />
          ) : activeTab === 'library' || activeTab === 'history' || activeTab === 'liked' ? (
            /* 5. Library / History / Liked View */
            <div className="p-6 max-w-[1800px] mx-auto w-full">
              <h1 className="text-xl font-bold mb-4 capitalize">
                {activeTab === 'liked' ? 'Liked Videos' : activeTab === 'history' ? 'Watch History' : 'Your Library'}
              </h1>
              <VideoGrid
                videos={
                  activeTab === 'liked'
                    ? videos.filter((v) => v.isLiked)
                    : activeTab === 'history'
                    ? videos.filter((v) => userProfile.historyVideoIds.includes(v.id))
                    : videos.filter((v) => userProfile.watchLaterVideoIds.includes(v.id) || v.isLiked)
                }
                onSelectVideo={handleSelectVideo}
                onSelectChannel={handleSelectChannel}
                onToggleWatchLater={handleToggleSave}
                watchLaterVideoIds={userProfile.watchLaterVideoIds}
                selectedCategory="All"
                setSelectedCategory={() => {}}
              />
            </div>
          ) : (
            /* 6. Default Home Video Grid */
            <VideoGrid
              videos={searchedVideos}
              shorts={INITIAL_SHORTS}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              onToggleWatchLater={handleToggleSave}
              watchLaterVideoIds={userProfile.watchLaterVideoIds}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelectShort={(short) => {
                handleSelectVideo(short);
              }}
            />
          )}
        </main>
      </div>

      {/* Upload Video Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userProfile={userProfile}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* User Profile & Account Switcher Modal */}
      <UserProfileModal
        isOpen={isProfileSwitcherOpen}
        onClose={() => setIsProfileSwitcherOpen(false)}
        userProfile={userProfile}
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
        onUpdateProfile={handleUpdateProfile}
        onCreateAccount={handleCreateAccount}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={refreshYoutubeData}
        hasKey={youtubeApiStatus.hasKey}
      />
    </div>
  );
}
