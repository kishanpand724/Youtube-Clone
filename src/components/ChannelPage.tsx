import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  Calendar, 
  Users, 
  Video as VideoIcon, 
  Flame,
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Channel, Video, UserProfile } from '../types';
import { VideoCard } from './VideoCard';
import { YouTubeVerifiedBadge } from './YouTubeIcons';

interface ChannelPageProps {
  channel: Channel;
  videos: Video[];
  userProfile: UserProfile;
  isSubscribed: boolean;
  onToggleSubscribe: (channelId: string) => void;
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleWatchLater: (videoId: string) => void;
  watchLaterVideoIds: string[];
  onOpenProfileSwitcher: () => void;
}

export const ChannelPage: React.FC<ChannelPageProps> = ({
  channel,
  videos,
  userProfile,
  isSubscribed,
  onToggleSubscribe,
  onSelectVideo,
  onSelectChannel,
  onToggleWatchLater,
  watchLaterVideoIds,
  onOpenProfileSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'playlists' | 'about'>('videos');

  const channelVideos = videos.filter((v) => v.channel.id === channel.id && !v.isShort);
  const channelShorts = videos.filter((v) => v.channel.id === channel.id && v.isShort);
  const isUserOwned = channel.id === userProfile.id || channel.isUserOwned;

  return (
    <div id="channel-page-container" className="flex-1 w-full pb-16 select-none bg-white">
      {/* Channel Banner */}
      <div className="relative w-full h-40 sm:h-52 md:h-64 bg-neutral-900 overflow-hidden">
        {channel.banner ? (
          <img
            src={channel.banner}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700" />
        )}
      </div>

      {/* Channel Header Information */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 pb-4">
          {/* Avatar (128x128) */}
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shrink-0"
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0f0f0f] leading-tight">
                {channel.name}
              </h1>
              {channel.verified && (
                <YouTubeVerifiedBadge className="w-4 h-4" />
              )}
            </div>

            <p className="text-[14px] text-[#606060] font-normal my-1">
              <span className="font-medium text-[#0f0f0f]">{channel.handle}</span> • {channel.subscribers} subscribers • {channelVideos.length} videos
            </p>

            <p className="text-[14px] text-[#606060] line-clamp-2 leading-relaxed max-w-2xl mb-3">
              {channel.description || 'Welcome to the official channel! Subscribe to stay updated with all our latest videos and premieres.'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              {isUserOwned ? (
                <>
                  <button
                    onClick={onOpenProfileSwitcher}
                    className="px-4 py-2 rounded-full text-[14px] font-medium bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f] transition-colors cursor-pointer"
                  >
                    Customize channel
                  </button>
                  <button
                    onClick={onOpenProfileSwitcher}
                    className="px-4 py-2 rounded-full text-[14px] font-medium bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f] transition-colors cursor-pointer"
                  >
                    Manage videos
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onToggleSubscribe(channel.id)}
                  className={`px-5 py-2 rounded-full text-[14px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                    isSubscribed
                      ? 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
                      : 'bg-[#0f0f0f] hover:bg-[#272727] text-white'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <Bell className="w-4 h-4 text-[#606060]" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#e5e5e5] mt-4 text-[14px] font-medium">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'videos' ? 'text-[#0f0f0f] font-semibold' : 'text-[#606060] hover:text-[#0f0f0f]'
            }`}
          >
            Videos
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shorts')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'shorts' ? 'text-[#0f0f0f] font-semibold' : 'text-[#606060] hover:text-[#0f0f0f]'
            }`}
          >
            Shorts
            {activeTab === 'shorts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'playlists' ? 'text-[#0f0f0f] font-semibold' : 'text-[#606060] hover:text-[#0f0f0f]'
            }`}
          >
            Playlists
            {activeTab === 'playlists' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3.5 relative transition-colors cursor-pointer ${
              activeTab === 'about' ? 'text-[#0f0f0f] font-semibold' : 'text-[#606060] hover:text-[#0f0f0f]'
            }`}
          >
            About
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f0f0f]" />
            )}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="pt-6">
          {activeTab === 'videos' && (
            channelVideos.length === 0 ? (
              <div className="text-center py-20 text-[#606060]">
                <VideoIcon className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                <p className="text-[16px] font-medium text-[#0f0f0f]">This channel has no videos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {channelVideos.map((video) => (
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
            )
          )}

          {activeTab === 'shorts' && (
            channelShorts.length === 0 ? (
              <div className="text-center py-20 text-[#606060]">
                <Flame className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                <p className="text-[16px] font-medium text-[#0f0f0f]">This channel has no Shorts.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {channelShorts.map((short) => (
                  <div
                    key={short.id}
                    onClick={() => onSelectVideo(short)}
                    className="group cursor-pointer relative aspect-[9/16] bg-neutral-900 rounded-xl overflow-hidden shadow-sm"
                  >
                    <img
                      src={short.thumbnailUrl}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                      <p className="text-[13px] font-medium text-white line-clamp-2 leading-snug mb-1">{short.title}</p>
                      <span className="text-[11px] text-neutral-300">{short.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-[#e5e5e5] space-y-6">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f0f0f] mb-2">Description</h3>
                <p className="text-[14px] text-[#0f0f0f] leading-relaxed whitespace-pre-line">
                  {channel.description || 'No description available for this channel.'}
                </p>
              </div>

              <div className="border-t border-[#e5e5e5] pt-4 space-y-3 text-[14px] text-[#606060]">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#606060]" />
                  <span>{channel.handle}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#606060]" />
                  <span>{channel.subscribers} subscribers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#606060]" />
                  <span>{channel.joinedDate || 'Joined Jan 2021'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
