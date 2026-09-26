import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Music, 
  ChevronUp, 
  ChevronDown, 
  X,
  Send,
  MoreVertical,
  Repeat
} from 'lucide-react';
import { Video, Comment, UserProfile } from '../types';
import { YouTubeVerifiedBadge } from './YouTubeIcons';

interface ShortsViewProps {
  shorts: Video[];
  userProfile: UserProfile;
  onToggleSubscribe: (channelId: string) => void;
  isSubscribed: (channelId: string) => boolean;
  onSelectChannel: (channelId: string) => void;
}

export const ShortsView: React.FC<ShortsViewProps> = ({
  shorts,
  userProfile,
  onToggleSubscribe,
  isSubscribed,
  onSelectChannel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState(false);
  const [shortComments, setShortComments] = useState<Record<string, Comment[]>>({
    short_1: [
      {
        id: 'sc_1',
        videoId: 'short_1',
        channelId: 'ch_code',
        authorName: 'Sarah Developer',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'That flexbox trick saved my day! 🔥',
        timestamp: '2h ago',
        likes: 42
      }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Keyboard navigation for Up/Down arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shorts.length]);

  if (shorts.length === 0) return null;

  const currentShort = shorts[currentIndex];
  const isLiked = likedShorts[currentShort.id] || false;
  const currentLikes = (likesCount[currentShort.id] ?? currentShort.likes) + (isLiked ? 1 : 0);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowComments(false);
    }
  };

  const toggleLike = () => {
    setLikedShorts((prev) => ({ ...prev, [currentShort.id]: !prev[currentShort.id] }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `sc_user_${Date.now()}`,
      videoId: currentShort.id,
      channelId: userProfile.id,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      text: newCommentText,
      timestamp: 'Just now',
      likes: 0
    };

    setShortComments((prev) => ({
      ...prev,
      [currentShort.id]: [newComment, ...(prev[currentShort.id] || [])]
    }));
    setNewCommentText('');
  };

  const activeComments = shortComments[currentShort.id] || [];

  return (
    <div id="shorts-container" className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-4 select-none relative">
      <div className="flex items-center gap-4">
        {/* Main 9:16 Shorts Video Container */}
        <div className="relative w-[380px] sm:w-[410px] h-[calc(100vh-130px)] max-h-[760px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <video
            key={currentShort.id}
            src={currentShort.videoUrl}
            autoPlay
            loop
            playsInline
            poster={currentShort.thumbnailUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradients */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Top Bar Header */}
          <div className="relative z-10 p-4 flex justify-between items-center text-white">
            <span className="font-bold text-[14px] tracking-wider uppercase">Shorts</span>
            <span className="text-[12px] bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full font-medium">
              {currentIndex + 1} / {shorts.length}
            </span>
          </div>

          {/* Bottom Details & Channel Overlay */}
          <div className="relative z-10 p-4 text-white">
            {/* Channel Info & Subscribe */}
            <div className="flex items-center gap-3 mb-2.5">
              <button
                onClick={() => onSelectChannel(currentShort.channel.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={currentShort.channel.avatar}
                  alt={currentShort.channel.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1 font-medium text-[14px] text-white">
                    <span>{currentShort.channel.name}</span>
                    {currentShort.channel.verified && (
                      <YouTubeVerifiedBadge className="w-3.5 h-3.5 fill-white text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => onToggleSubscribe(currentShort.channel.id)}
                className={`ml-auto px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                  isSubscribed(currentShort.channel.id)
                    ? 'bg-white/20 text-white backdrop-blur-xs'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {isSubscribed(currentShort.channel.id) ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Title */}
            <p className="text-[14px] font-normal text-white line-clamp-2 leading-snug mb-2.5">
              {currentShort.title}
            </p>

            {/* Sound bite track */}
            <div className="flex items-center gap-2 text-[12px] text-neutral-300">
              <Music className="w-3.5 h-3.5" />
              <span className="truncate">Original sound - {currentShort.channel.name}</span>
            </div>
          </div>
        </div>

        {/* Right Floating Actions (YouTube Desktop Shorts style) */}
        <div className="flex flex-col items-center gap-4 text-[#0f0f0f]">
          {/* Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleLike}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isLiked ? 'bg-[#ff0000] text-white' : 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
              }`}
              title="Like"
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[12px] font-medium text-[#0f0f0f] mt-1">{currentLikes.toLocaleString()}</span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-[12px] font-medium text-[#0f0f0f] mt-1">Dislike</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowComments(!showComments)}
              className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Comments"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[12px] font-medium text-[#0f0f0f] mt-1">{activeComments.length}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[12px] font-medium text-[#0f0f0f] mt-1">Share</span>
          </div>

          {/* Remix */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Remix"
            >
              <Repeat className="w-5 h-5" />
            </button>
            <span className="text-[12px] font-medium text-[#0f0f0f] mt-1">Remix</span>
          </div>

          {/* More */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="More actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Up & Down Navigation Controls */}
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[#e5e5e5]">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] disabled:opacity-30 flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Previous video"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === shorts.length - 1}
              className="w-10 h-10 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] disabled:opacity-30 flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
              title="Next video"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Comments Drawer for Shorts */}
      {showComments && (
        <div className="absolute right-4 w-96 h-[calc(100vh-130px)] max-h-[760px] bg-white rounded-2xl shadow-2xl z-30 p-4 flex flex-col border border-[#e5e5e5] animate-scaleIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
            <h3 className="font-bold text-[16px] text-[#0f0f0f]">Comments ({activeComments.length})</h3>
            <button onClick={() => setShowComments(false)} className="p-1 text-[#606060] hover:text-[#0f0f0f] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {activeComments.length === 0 ? (
              <p className="text-[13px] text-[#606060] text-center py-12">No comments yet. Be the first to comment!</p>
            ) : (
              activeComments.map((c) => (
                <div key={c.id} className="flex gap-3 text-[13px]">
                  <img src={c.authorAvatar} alt={c.authorName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div>
                    <span className="font-medium text-[#0f0f0f] block">@{c.authorName.toLowerCase().replace(/\s+/g, '')}</span>
                    <p className="text-[#0f0f0f] leading-snug">{c.text}</p>
                    <span className="text-[11px] text-[#606060]">{c.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-[#e5e5e5]">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 text-[13px] border border-[#ccc] rounded-full px-4 py-2 focus:outline-none focus:border-[#065fd4]"
            />
            <button type="submit" className="w-9 h-9 bg-[#065fd4] text-white rounded-full flex items-center justify-center hover:bg-[#004fc4] shrink-0 cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
