import React, { useState } from 'react';
import { VideoCard } from './VideoCard';
import { Video } from '../types';
import { CATEGORIES } from '../data/mockData';

interface VideoGridProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleWatchLater: (videoId: string) => void;
  watchLaterVideoIds: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  onSelectVideo,
  onSelectChannel,
  onToggleWatchLater,
  watchLaterVideoIds,
  selectedCategory,
  setSelectedCategory
}) => {
  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase() || v.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase()));

  return (
    <div id="video-grid-container" className="flex-1 px-4 py-4 max-w-[1800px] mx-auto w-full">
      {/* Category Filter Pills */}
      <div id="category-pills-bar" className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Videos Responsive Grid */}
      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-semibold text-neutral-700 mb-1">No videos found in "{selectedCategory}"</p>
          <p className="text-xs text-neutral-500 mb-4">Try selecting another category or clear your search filters.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Show All Videos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {filteredVideos.map((video) => (
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
