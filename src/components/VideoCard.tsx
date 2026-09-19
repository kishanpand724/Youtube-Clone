import React, { useState } from 'react';
import { CheckCircle2, MoreVertical, Clock, Share2, Sparkles, ThumbsUp } from 'lucide-react';
import { Video } from '../types';

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
  isWatchLater
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group flex flex-col cursor-pointer transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail container */}
      <div 
        onClick={() => onSelectVideo(video)}
        className="relative w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-3 shadow-xs group-hover:shadow-md transition-all"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
          }`}
        />

        {/* Video preview simulation on hover if available */}
        {isHovered && video.videoUrl && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium rounded-md flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Hover Preview
            </span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs font-semibold rounded-md backdrop-blur-xs">
          {video.duration}
        </div>

        {/* Category tag */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900/80 text-white text-[10px] font-medium rounded-md backdrop-blur-xs uppercase tracking-wider">
          {video.category}
        </div>
      </div>

      {/* Video Details */}
      <div className="flex gap-3 px-0.5">
        {/* Channel Avatar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectChannel(video.channel.id);
          }}
          className="shrink-0 focus:outline-none"
          title={`View ${video.channel.name}'s channel`}
        >
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            className="w-9 h-9 rounded-full object-cover border border-neutral-200 hover:ring-2 hover:ring-red-500 transition-all"
          />
        </button>

        {/* Title, Channel Name, Views & Upload Time */}
        <div className="flex-1 min-w-0">
          <h3 
            onClick={() => onSelectVideo(video)}
            className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-1"
          >
            {video.title}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectChannel(video.channel.id);
            }}
            className="flex items-center text-xs text-neutral-600 hover:text-neutral-900 transition-colors mb-0.5"
          >
            <span className="truncate">{video.channel.name}</span>
            {video.channel.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-neutral-500 fill-neutral-500 shrink-0" />
            )}
          </button>

          <div className="flex items-center text-[12px] text-neutral-500 gap-1">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>

        {/* Action Menu button */}
        {onToggleWatchLater && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchLater(video.id);
            }}
            className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors shrink-0 text-neutral-500 ${
              isWatchLater ? 'text-red-600' : 'opacity-0 group-hover:opacity-100'
            }`}
            title={isWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
          >
            <Clock className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
