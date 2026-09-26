import React, { useState } from 'react';
import { LayoutGrid, List, Tv } from 'lucide-react';
import { Video, Channel } from '../types';
import { VideoCard } from './VideoCard';

interface SubscriptionFeedProps {
  subscribedChannels: Channel[];
  allVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleWatchLater: (videoId: string) => void;
  watchLaterVideoIds: string[];
}

export const SubscriptionFeed: React.FC<SubscriptionFeedProps> = ({
  subscribedChannels,
  allVideos,
  onSelectVideo,
  onSelectChannel,
  onToggleWatchLater,
  watchLaterVideoIds
}) => {
  const [selectedChannelIdFilter, setSelectedChannelIdFilter] = useState<string | null>(null);

  const subscribedChannelIds = new Set(subscribedChannels.map((c) => c.id));
  
  // Filter videos from subscribed channels
  let subVideos = allVideos.filter((v) => subscribedChannelIds.has(v.channel.id));

  if (selectedChannelIdFilter) {
    subVideos = subVideos.filter((v) => v.channel.id === selectedChannelIdFilter);
  }

  if (subscribedChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center max-w-md mx-auto select-none">
        <div className="w-20 h-20 bg-[#f2f2f2] text-[#0f0f0f] rounded-full flex items-center justify-center mb-6">
          <Tv className="w-10 h-10" />
        </div>
        <h2 className="text-[20px] font-bold text-[#0f0f0f] mb-2">Don't miss new videos</h2>
        <p className="text-[14px] text-[#606060] mb-6">
          Sign in or subscribe to see updates from your favorite YouTube channels.
        </p>
      </div>
    );
  }

  return (
    <div id="subscription-feed-container" className="flex-1 px-4 sm:px-6 py-4 w-full select-none bg-white">
      {/* Top Header: Subscriptions Title + Manage + View Toggle */}
      <div className="flex items-center justify-between pb-3 mb-2">
        <h1 className="text-[20px] font-bold text-[#0f0f0f]">Subscriptions</h1>
        <div className="flex items-center gap-3">
          <button className="text-[14px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            Manage
          </button>
          <div className="flex items-center bg-[#f2f2f2] rounded-lg p-0.5">
            <button className="p-1 rounded bg-white text-[#0f0f0f] shadow-xs cursor-pointer">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-[#606060] hover:text-[#0f0f0f] cursor-pointer">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subscribed Creators Avatar Row */}
      <div className="mb-6 pb-4 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedChannelIdFilter(null)}
            className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer transition-transform ${
              selectedChannelIdFilter === null ? 'scale-105' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-[13px] ${
              selectedChannelIdFilter === null ? 'bg-[#0f0f0f] text-white ring-2 ring-[#0f0f0f]' : 'bg-[#f2f2f2] text-[#0f0f0f]'
            }`}>
              All
            </div>
            <span className="text-[12px] font-medium text-[#0f0f0f]">All</span>
          </button>

          {subscribedChannels.map((channel) => {
            const isSelected = selectedChannelIdFilter === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelIdFilter(channel.id)}
                className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer transition-transform ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className={`w-14 h-14 rounded-full object-cover ${
                      isSelected ? 'ring-2 ring-blue-600' : ''
                    }`}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                </div>
                <span className="text-[12px] font-medium text-[#0f0f0f] truncate max-w-[70px]">
                  {channel.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Section Heading */}
      <div className="mb-4">
        <h2 className="text-[16px] font-bold text-[#0f0f0f]">Latest</h2>
      </div>

      {/* Subscribed Videos Grid */}
      {subVideos.length === 0 ? (
        <div className="text-center py-20 text-[#606060]">
          <p className="text-[15px] font-medium">No videos found for this channel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-10">
          {subVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelectVideo={onSelectVideo}
              onSelectChannel={onSelectChannel}
              onToggleWatchLater={onToggleWatchLater}
              isWatchLater={watchLaterVideoIds.includes(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
