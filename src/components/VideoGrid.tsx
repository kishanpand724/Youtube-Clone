import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { VideoCard } from './VideoCard';
import { Video } from '../types';
import { CATEGORIES, INITIAL_SHORTS } from '../data/mockData';
import { YouTubeShortsLogo } from './YouTubeIcons';

interface VideoGridProps {
  videos: Video[];
  shorts?: Video[];
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleWatchLater: (videoId: string) => void;
  watchLaterVideoIds: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectShort?: (short: Video) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  shorts = INITIAL_SHORTS,
  onSelectVideo,
  onSelectChannel,
  onToggleWatchLater,
  watchLaterVideoIds,
  selectedCategory,
  setSelectedCategory,
  onSelectShort
}) => {
  const chipsScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (chipsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsScrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      chipsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter((v) => 
        v.category.toLowerCase() === selectedCategory.toLowerCase() || 
        v.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
      );

  // Divide videos into first batch (e.g. 4) and rest for the authentic YouTube Shorts shelf insertion
  const firstBatch = selectedCategory === 'All' ? filteredVideos.slice(0, 4) : filteredVideos;
  const remainingBatch = selectedCategory === 'All' ? filteredVideos.slice(4) : [];

  return (
    <div id="video-grid-container" className="flex-1 w-full bg-white select-none">
      {/* Sticky Topic Chips Bar with Left/Right Navigation */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md pt-2.5 pb-3 px-4 sm:px-6 flex items-center relative border-b border-transparent">
        {/* Left Arrow Button with Fade Gradient Mask */}
        {showLeftArrow && (
          <div className="absolute left-4 top-2.5 bottom-3 flex items-center z-10 bg-gradient-to-r from-white via-white/90 to-transparent pr-4">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] shadow-xs border border-[#e5e5e5] bg-white cursor-pointer transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Horizontal Chips Scrollable Container */}
        <div
          ref={chipsScrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth w-full py-0.5"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-8 px-3 rounded-lg text-[14px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0f0f0f] text-white'
                    : 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button with Fade Gradient Mask */}
        {showRightArrow && (
          <div className="absolute right-4 top-2.5 bottom-3 flex items-center z-10 bg-gradient-to-l from-white via-white/90 to-transparent pl-4">
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] shadow-xs border border-[#e5e5e5] bg-white cursor-pointer transition-colors"
              title="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 pt-3 pb-16">
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#f2f2f2] flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-[17px] font-semibold text-[#0f0f0f] mb-1">
              No results found in "{selectedCategory}"
            </p>
            <p className="text-[14px] text-[#606060] mb-6">
              Try searching with different keywords or browse other categories.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-5 py-2.5 bg-[#0f0f0f] text-white rounded-full text-[14px] font-medium hover:bg-[#272727] transition-colors cursor-pointer shadow-xs"
            >
              Explore all videos
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Top Video Grid Row(s) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-10">
              {firstBatch.map((video) => (
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

            {/* Authentic YouTube Shorts Shelf (Displayed on "All" feed) */}
            {selectedCategory === 'All' && shorts.length > 0 && (
              <div className="pt-2 pb-2 border-t border-b border-[#e5e5e5]">
                {/* Shorts Shelf Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <YouTubeShortsLogo className="w-6 h-6 text-[#ff0000]" />
                    <h2 className="text-[20px] font-bold text-[#0f0f0f] tracking-tight">
                      Shorts
                    </h2>
                  </div>
                </div>

                {/* Shorts Cards 9:16 Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                  {shorts.slice(0, 5).map((short) => (
                    <div
                      key={short.id}
                      onClick={() => onSelectShort ? onSelectShort(short) : onSelectVideo(short)}
                      className="group cursor-pointer relative aspect-[9/16] bg-[#0f0f0f] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={short.thumbnailUrl}
                        alt={short.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Top Right 3 dots */}
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Bottom Gradient Overlay & Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-end">
                        <h3 className="text-[14px] font-semibold text-white line-clamp-2 leading-snug mb-1">
                          {short.title}
                        </h3>
                        <p className="text-[12px] text-neutral-300 font-medium">
                          {short.views}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remaining Video Grid Row(s) */}
            {remainingBatch.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-10">
                {remainingBatch.map((video) => (
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
        )}
      </div>
    </div>
  );
};
