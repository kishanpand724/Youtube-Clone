import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Clock, ListPlus, Check, Share2, Ban } from 'lucide-react';
import { Video } from '../types';
import { YouTubeVerifiedBadge } from './YouTubeIcons';

interface VideoCardProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleWatchLater?: (videoId: string) => void;
  isWatchLater?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelectVideo,
  onSelectChannel,
  onToggleWatchLater,
  isWatchLater = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showMenu]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // After 650ms of hover, show live muted preview if available
    hoverTimeoutRef.current = setTimeout(() => {
      if (video.videoUrl && !video.videoUrl.startsWith('https://www.youtube.com')) {
        setIsPlayingPreview(true);
      }
    }, 650);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlayingPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  return (
    <div 
      className="group flex flex-col cursor-pointer select-none relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 16:9 Thumbnail Container */}
      <div 
        onClick={() => onSelectVideo(video)}
        className="relative w-full aspect-video bg-[#0f0f0f] rounded-2xl overflow-hidden mb-3 shadow-2xs group-hover:shadow-md transition-all duration-300"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-[1.03]' : 'scale-100'
          }`}
          loading="lazy"
        />

        {/* Hover Muted Video Preview */}
        {isPlayingPreview && (
          <div className="absolute inset-0 z-10 bg-black animate-fadeIn">
            <video
              src={video.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Subtle red timeline preview bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#ff0000] animate-pulse" />
          </div>
        )}

        {/* Duration timestamp badge */}
        {!isPlayingPreview && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-white text-[12px] font-semibold rounded-[4px] leading-none tracking-tight">
            {video.duration}
          </div>
        )}

        {/* Hover Quick Actions (Watch Later, Add to Queue) */}
        {isHovered && !showMenu && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 animate-fadeIn">
            {onToggleWatchLater && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchLater(video.id);
                }}
                className={`w-8 h-8 rounded-[4px] bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  isWatchLater ? 'text-emerald-400 bg-black' : ''
                }`}
                title={isWatchLater ? "Added to Watch Later" : "Watch later"}
              >
                {isWatchLater ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleWatchLater) onToggleWatchLater(video.id);
              }}
              className="w-8 h-8 rounded-[4px] bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Add to queue"
            >
              <ListPlus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Video Metadata Row */}
      <div className="flex gap-3 px-0.5">
        {/* Channel Avatar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectChannel(video.channel.id);
          }}
          className="shrink-0 focus:outline-none cursor-pointer mt-0.5"
          title={video.channel.name}
        >
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-black/5 hover:opacity-90 transition-opacity"
          />
        </button>

        {/* Details Column */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Video Title */}
          <h3 
            onClick={() => onSelectVideo(video)}
            className="text-[15px] sm:text-[16px] font-semibold leading-[22px] text-[#0f0f0f] line-clamp-2 mb-1 cursor-pointer transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Channel Name */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectChannel(video.channel.id);
            }}
            className="flex items-center text-[13px] sm:text-[14px] text-[#606060] hover:text-[#0f0f0f] transition-colors leading-[18px] mb-0.5 cursor-pointer max-w-full"
          >
            <span className="truncate">{video.channel.name}</span>
            {video.channel.verified && (
              <span className="ml-1 shrink-0" title="Verified">
                <YouTubeVerifiedBadge className="w-3.5 h-3.5 text-[#606060]" />
              </span>
            )}
          </button>

          {/* View Count & Upload Time */}
          <div className="text-[13px] sm:text-[14px] text-[#606060] leading-[18px] flex items-center gap-1">
            <span>{video.views}</span>
            <span aria-hidden="true" className="text-[10px]">•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>

        {/* 3-dots Context Menu Button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-[#0f0f0f] hover:bg-[#0000001a] transition-all cursor-pointer ${
              isHovered || showMenu ? 'opacity-100' : 'opacity-0'
            }`}
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Authentic YouTube Context Menu Popover */}
          {showMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 w-56 bg-white border border-[#e5e5e5] rounded-xl shadow-2xl z-40 py-2 text-[14px] text-[#0f0f0f] animate-scaleIn select-none"
            >
              <button
                onClick={() => {
                  if (onToggleWatchLater) onToggleWatchLater(video.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3.5 hover:bg-[#f2f2f2] text-left transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#606060]" />
                <span>{isWatchLater ? 'Remove from Watch Later' : 'Save to Watch later'}</span>
              </button>

              <button
                onClick={() => {
                  onSelectChannel(video.channel.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3.5 hover:bg-[#f2f2f2] text-left transition-colors cursor-pointer"
              >
                <ListPlus className="w-4 h-4 text-[#606060]" />
                <span>Save to playlist</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `?v=${video.id}`);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3.5 hover:bg-[#f2f2f2] text-left transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#606060]" />
                <span>Share</span>
              </button>

              <div className="my-1 border-t border-[#f2f2f2]" />

              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-4 py-2.5 flex items-center gap-3.5 hover:bg-[#f2f2f2] text-left transition-colors cursor-pointer text-[#606060]"
              >
                <Ban className="w-4 h-4 text-[#606060]" />
                <span>Not interested</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
