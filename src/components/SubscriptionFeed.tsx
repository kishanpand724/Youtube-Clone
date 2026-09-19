import React, { useState } from 'react';
import { Tv, Sparkles, CheckCircle2 } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <Tv className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2">Don't miss new videos</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Subscribe to your favorite channels to get their latest uploads right here.
        </p>
      </div>
    );
  }

  return (
    <div id="subscription-feed-container" className="flex-1 px-4 py-4 max-w-[1800px] mx-auto w-full">
      {/* Subscribed Creators Horizontal Story Row */}
      <div className="mb-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <span>Latest From Subscriptions</span>
          </h2>
          {selectedChannelIdFilter && (
            <button
              onClick={() => setSelectedChannelIdFilter(null)}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Show All Channels
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedChannelIdFilter(null)}
            className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-none ${
              selectedChannelIdFilter === null ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ${
              selectedChannelIdFilter === null ? 'bg-red-600 text-white ring-2 ring-red-600' : 'bg-neutral-200 text-neutral-700'
            }`}>
              ALL
            </div>
            <span className="text-[10px] font-semibold text-neutral-800">All</span>
          </button>

          {subscribedChannels.map((channel) => {
            const isSelected = selectedChannelIdFilter === channel.id;
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelIdFilter(channel.id)}
                className={`flex flex-col items-center gap-1.5 shrink-0 focus:outline-none transition-all ${
                  isSelected ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className={`w-12 h-12 rounded-full object-cover border-2 ${
                    isSelected ? 'border-red-600 ring-2 ring-red-600' : 'border-neutral-200'
                  }`}
                />
                <span className="text-[10px] font-semibold text-neutral-800 truncate max-w-[64px]">
                  {channel.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Grid */}
      {subVideos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm font-semibold text-neutral-700">No videos from this channel yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
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
