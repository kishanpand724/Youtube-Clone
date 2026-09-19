import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Music, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  X,
  Send
} from 'lucide-react';
import { Video, Comment, UserProfile } from '../types';

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
    <div id="shorts-container" className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative">
      {/* Up / Down Navigation Buttons */}
      <div className="hidden sm:flex flex-col gap-3 mr-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 transition-colors shadow-xs"
          title="Previous Short"
        >
          <ChevronUp className="w-5 h-5 text-neutral-800" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === shorts.length - 1}
          className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 transition-colors shadow-xs"
          title="Next Short"
        >
          <ChevronDown className="w-5 h-5 text-neutral-800" />
        </button>
      </div>

      {/* Main Shorts Player Card */}
      <div className="relative w-full max-w-[380px] h-[680px] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        <video
          key={currentShort.id}
          src={currentShort.videoUrl}
          autoPlay
          loop
          playsInline
          poster={currentShort.thumbnailUrl}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlays for legibility */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Top Header info */}
        <div className="relative z-10 p-4 flex justify-between items-center text-white">
          <span className="font-bold text-sm tracking-widest uppercase">Shorts</span>
          <span className="text-xs bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {currentIndex + 1} / {shorts.length}
          </span>
        </div>

        {/* Bottom Details & Channel Overlay */}
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onSelectChannel(currentShort.channel.id)}
              className="flex items-center gap-2 text-left"
            >
              <img
                src={currentShort.channel.avatar}
                alt={currentShort.channel.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white"
              />
              <div>
                <div className="flex items-center gap-1 font-semibold text-xs text-white">
                  <span>{currentShort.channel.name}</span>
                  {currentShort.channel.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-300">{currentShort.channel.handle}</span>
              </div>
            </button>

            <button
              onClick={() => onToggleSubscribe(currentShort.channel.id)}
              className={`ml-auto px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                isSubscribed(currentShort.channel.id)
                  ? 'bg-white/20 text-white backdrop-blur-xs'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubscribed(currentShort.channel.id) ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <p className="text-xs font-medium text-neutral-100 line-clamp-2 leading-snug mb-3">
            {currentShort.title}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-neutral-300">
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate">Original audio - {currentShort.channel.name}</span>
          </div>
        </div>

        {/* Right Floating Actions (Like, Dislike, Comments, Share) */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col gap-4 items-center text-white">
          {/* Like */}
          <button
            onClick={toggleLike}
            className="flex flex-col items-center group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isLiked ? 'bg-red-600 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
            }`}>
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">{currentLikes.toLocaleString()}</span>
          </button>

          {/* Dislike */}
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Dislike</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center"
          >
            <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">{activeComments.length}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Share</span>
          </button>
        </div>
      </div>

      {/* Slide-over Comments Drawer for Shorts */}
      {showComments && (
        <div className="absolute right-0 sm:right-auto sm:ml-4 w-80 h-[680px] bg-white rounded-3xl shadow-2xl z-30 p-4 flex flex-col border border-neutral-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="font-bold text-sm text-neutral-900">Comments ({activeComments.length})</h3>
            <button onClick={() => setShowComments(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {activeComments.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-10">No comments yet. Be the first!</p>
            ) : (
              activeComments.map((c) => (
                <div key={c.id} className="flex gap-2.5 text-xs">
                  <img src={c.authorAvatar} alt={c.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900 block">{c.authorName}</span>
                    <p className="text-neutral-700 leading-snug">{c.text}</p>
                    <span className="text-[10px] text-neutral-400">{c.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-neutral-200">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 text-xs border border-neutral-300 rounded-full px-3 py-1.5 focus:outline-none focus:border-red-600"
            />
            <button type="submit" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
