import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Bell, 
  Settings, 
  Edit3, 
  Calendar, 
  Users, 
  Video as VideoIcon, 
  Flame,
  Globe
} from 'lucide-react';
import { Channel, Video, UserProfile } from '../types';
import { VideoCard } from './VideoCard';

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
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'about'>('videos');

  const channelVideos = videos.filter((v) => v.channel.id === channel.id && !v.isShort);
  const channelShorts = videos.filter((v) => v.channel.id === channel.id && v.isShort);

  const isUserOwned = channel.id === userProfile.id || channel.isUserOwned;

  return (
    <div id="channel-page-container" className="flex-1 max-w-[1800px] mx-auto w-full pb-10">
      {/* Banner */}
      <div className="relative w-full h-40 sm:h-56 md:h-64 bg-neutral-900 overflow-hidden">
        {channel.banner ? (
          <img
            src={channel.banner}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 opacity-80" />
        )}
      </div>

      {/* Header Info */}
      <div className="px-4 sm:px-8 py-6 border-b border-neutral-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md -mt-10 sm:-mt-14 relative z-10 bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                  {channel.name}
                </h1>
                {channel.verified && (
                  <CheckCircle2 className="w-5 h-5 text-neutral-500 fill-neutral-500" />
                )}
              </div>
              <p className="text-xs text-neutral-500 font-medium my-1">
                {channel.handle} • {channel.subscribers} subscribers • {channelVideos.length} videos
              </p>
              <p className="text-xs text-neutral-700 line-clamp-2 max-w-2xl leading-relaxed">
                {channel.description || 'Welcome to my official YouTube channel! Watch my latest videos and shorts below.'}
              </p>
            </div>
          </div>

          {/* Subscribe or Customize Channel */}
          <div className="flex items-center gap-3">
            {isUserOwned ? (
              <button
                onClick={onOpenProfileSwitcher}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Settings className="w-4 h-4" />
                <span>Customize Profile / Channel</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleSubscribe(channel.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2 shadow-xs ${
                  isSubscribed
                    ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex items-center gap-8 mt-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'videos' ? 'border-red-600 text-red-600' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Videos ({channelVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'shorts' ? 'border-red-600 text-red-600' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Shorts ({channelShorts.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'about' ? 'border-red-600 text-red-600' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="px-4 sm:px-8 py-6">
        {activeTab === 'videos' && (
          channelVideos.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <VideoIcon className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-semibold">No videos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
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
            <div className="text-center py-16 text-neutral-500">
              <Flame className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-semibold">No Shorts uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {channelShorts.map((short) => (
                <div
                  key={short.id}
                  onClick={() => onSelectVideo(short)}
                  className="group cursor-pointer relative aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden shadow-md"
                >
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-snug mb-1">{short.title}</p>
                    <span className="text-[10px] text-neutral-300 font-medium">{short.views}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl bg-white p-6 rounded-2xl border border-neutral-200 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                {channel.description || 'No channel description provided.'}
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-neutral-400" />
                <span>{channel.handle}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-neutral-400" />
                <span>{channel.subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{channel.joinedDate || 'Joined Oct 2023'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
