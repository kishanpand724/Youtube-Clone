import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Copy, 
  X,
  Bell,
  Play,
  Volume2
} from 'lucide-react';
import { Video, Comment, UserProfile, Channel } from '../types';
import { VideoCard } from './VideoCard';

interface WatchPageProps {
  video: Video;
  allVideos: Video[];
  userProfile: UserProfile;
  comments: Comment[];
  onAddComment: (videoId: string, text: string) => void;
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (channelId: string) => void;
  onToggleSubscribe: (channelId: string) => void;
  isSubscribed: boolean;
  onToggleLike: (videoId: string) => void;
  onToggleDislike: (videoId: string) => void;
  onToggleSave: (videoId: string) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  video,
  allVideos,
  userProfile,
  comments,
  onAddComment,
  onSelectVideo,
  onSelectChannel,
  onToggleSubscribe,
  isSubscribed,
  onToggleLike,
  onToggleDislike,
  onToggleSave
}) => {
  const [commentText, setCommentText] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary?: string; keyHighlights?: string[]; takeaway?: string } | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [aiCommentSuggestions, setAiCommentSuggestions] = useState<string[]>([]);
  const [loadingAiComments, setLoadingAiComments] = useState(false);

  // Recommended videos excluding current video
  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  // Trigger AI Video Summary
  const handleGenerateAiSummary = async () => {
    if (aiSummary) {
      setAiSummary(null);
      return;
    }
    setLoadingAiSummary(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: video.title, description: video.description })
      });
      const data = await res.json();
      setAiSummary(data);
    } catch (e) {
      console.error(e);
      setAiSummary({
        summary: `"${video.title}" gives key insights into modern content creation and technology trends.`,
        keyHighlights: ['0:00 - Introduction', '2:30 - Main Concepts', '6:15 - Practical Examples', '9:00 - Conclusion'],
        takeaway: 'Highly recommended viewing for actionable knowledge.'
      });
    } finally {
      setLoadingAiSummary(false);
    }
  };

  // Trigger AI Comment Suggestions
  const handleFetchAiComments = async () => {
    setLoadingAiComments(true);
    try {
      const res = await fetch('/api/ai/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: video.title, description: video.description })
      });
      const data = await res.json();
      if (data.suggestions) {
        setAiCommentSuggestions(data.suggestions);
      }
    } catch (e) {
      setAiCommentSuggestions([
        'Super clear breakdown! Thanks for sharing 🔥',
        'Loved the key point at 3:15, very practical!',
        'Awesome quality video, subscribed for more!'
      ]);
    } finally {
      setLoadingAiComments(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(video.id, commentText);
    setCommentText('');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="youtube-watch-page" className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto p-4 w-full">
      {/* Left Column: Video Player, Details & Comments */}
      <div className="flex-1 min-w-0">
        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-4 group">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            controlsList="nodownload"
            poster={video.thumbnailUrl}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Title */}
        <h1 className="text-xl font-bold text-neutral-900 mb-3 leading-snug">
          {video.title}
        </h1>

        {/* Channel Info & Video Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          {/* Channel Avatar & Subscribe Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectChannel(video.channel.id)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <img
                src={video.channel.avatar}
                alt={video.channel.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 group-hover:ring-2 group-hover:ring-red-500 transition-all"
              />
              <div className="text-left">
                <div className="flex items-center gap-1 font-semibold text-neutral-900 text-sm group-hover:text-red-600 transition-colors">
                  <span>{video.channel.name}</span>
                  {video.channel.verified && (
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 fill-neutral-500" />
                  )}
                </div>
                <span className="text-xs text-neutral-500">{video.channel.subscribers} subscribers</span>
              </div>
            </button>

            <button
              id="btn-channel-subscribe"
              onClick={() => onToggleSubscribe(video.channel.id)}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                isSubscribed
                  ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                  : 'bg-neutral-900 hover:bg-red-600 text-white'
              }`}
            >
              {isSubscribed ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          {/* Action Bar (Like/Dislike, Share, Save, AI Summary) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* AI Summary Button */}
            <button
              onClick={handleGenerateAiSummary}
              disabled={loadingAiSummary}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                aiSummary
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900 hover:border-amber-300'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${loadingAiSummary ? 'animate-spin' : 'text-amber-500'}`} />
              <span>{loadingAiSummary ? 'Analyzing AI...' : aiSummary ? 'Hide AI Key Takeaways' : 'AI Highlights'}</span>
            </button>

            {/* Like & Dislike Pills */}
            <div className="flex items-center bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <button
                onClick={() => onToggleLike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-neutral-200 ${
                  video.isLiked ? 'text-red-600' : 'text-neutral-800'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-red-600' : ''}`} />
                <span>{(video.likes + (video.isLiked ? 1 : 0)).toLocaleString()}</span>
              </button>
              <div className="w-px h-5 bg-neutral-300" />
              <button
                onClick={() => onToggleDislike(video.id)}
                className={`px-3 py-2 text-xs font-semibold transition-colors hover:bg-neutral-200 ${
                  video.isDisliked ? 'text-neutral-900' : 'text-neutral-600'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? 'fill-neutral-900' : ''}`} />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            {/* Save / Watch Later */}
            <button
              onClick={() => onToggleSave(video.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                video.isSaved
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${video.isSaved ? 'fill-red-600' : ''}`} />
              <span>{video.isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* AI Key Highlights Banner (If activated) */}
        {aiSummary && (
          <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Gemini AI Executive Summary & Highlights
              </h3>
            </div>
            <p className="text-xs text-neutral-800 mb-3 font-medium leading-relaxed">
              {aiSummary.summary}
            </p>
            {aiSummary.keyHighlights && aiSummary.keyHighlights.length > 0 && (
              <div className="space-y-1 bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs">
                <span className="font-semibold text-neutral-900 block mb-1">Key Chapters:</span>
                {aiSummary.keyHighlights.map((hl, idx) => (
                  <div key={idx} className="text-neutral-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Description Box */}
        <div className="mt-4 p-4 bg-neutral-100 hover:bg-neutral-150 rounded-2xl transition-colors text-xs text-neutral-800">
          <div className="flex items-center gap-3 font-bold text-neutral-900 mb-2">
            <span>{video.views}</span>
            <span>{video.uploadedAt}</span>
            <div className="flex gap-1">
              {video.tags.map((tag) => (
                <span key={tag} className="text-blue-600 font-semibold">#{tag}</span>
              ))}
            </div>
          </div>

          <p className={`whitespace-pre-line leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'}`}>
            {video.description}
          </p>

          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 font-bold text-neutral-900 hover:underline flex items-center gap-1"
          >
            {showFullDescription ? (
              <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Show more <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>{comments.length} Comments</span>
            </h2>

            {/* AI Comment Suggestions trigger */}
            <button
              onClick={handleFetchAiComments}
              disabled={loadingAiComments}
              className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{loadingAiComments ? 'Generating AI...' : 'Suggest AI Comments'}</span>
            </button>
          </div>

          {/* AI Comment Ideas Pills */}
          {aiCommentSuggestions.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-900 block mb-2">Click to insert AI comment idea:</span>
              <div className="flex flex-wrap gap-2">
                {aiCommentSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setCommentText(sug)}
                    className="text-xs bg-white hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg text-neutral-800 text-left transition-colors shadow-2xs"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-8">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full pb-2 text-sm border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent transition-colors"
              />
              {commentText.trim() && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setCommentText('')}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-xs">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">{comment.authorName}</span>
                    <span className="text-neutral-500 text-[11px]">{comment.timestamp}</span>
                  </div>
                  <p className="text-neutral-800 leading-relaxed mb-2">{comment.text}</p>
                  
                  <div className="flex items-center gap-4 text-neutral-600">
                    <button className="flex items-center gap-1 hover:text-neutral-900">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="hover:text-neutral-900">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="font-semibold text-neutral-800 hover:underline">
                      Reply
                    </button>
                  </div>

                  {/* Replies if available */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-neutral-200 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2.5">
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-semibold text-neutral-900">{reply.authorName}</span>
                              <span className="text-[10px] text-neutral-400">{reply.timestamp}</span>
                            </div>
                            <p className="text-neutral-800">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Up Next / Recommended Videos */}
      <div className="w-full lg:w-96 shrink-0">
        <h2 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Up Next</h2>
        <div className="space-y-4">
          {recommendedVideos.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectVideo(rec)}
              className="group flex gap-3 cursor-pointer hover:bg-neutral-50 p-1.5 rounded-xl transition-colors"
            >
              <div className="relative w-40 aspect-video bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                <img
                  src={rec.thumbnailUrl}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-[10px] font-semibold rounded">
                  {rec.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-1">
                  {rec.title}
                </h3>
                <p className="text-[11px] text-neutral-500 truncate mb-0.5">{rec.channel.name}</p>
                <p className="text-[11px] text-neutral-400">{rec.views} • {rec.uploadedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <h3 className="font-bold text-neutral-900 text-base">Share Video</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-3">Copy link to share with friends or embed on your website:</p>

            <div className="flex items-center gap-2 bg-neutral-100 p-2 rounded-xl border border-neutral-200">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full text-xs bg-transparent text-neutral-800 focus:outline-none px-1"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 shrink-0 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
