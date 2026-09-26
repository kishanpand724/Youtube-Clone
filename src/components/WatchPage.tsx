import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Download, 
  MoreHorizontal, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  X,
  Bell,
  ArrowUpDown
} from 'lucide-react';
import { Video, Comment, UserProfile } from '../types';
import { YouTubeVerifiedBadge } from './YouTubeIcons';

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
  const [isCommentInputFocused, setIsCommentInputFocused] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary?: string; keyHighlights?: string[]; takeaway?: string } | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [aiCommentSuggestions, setAiCommentSuggestions] = useState<string[]>([]);
  const [loadingAiComments, setLoadingAiComments] = useState(false);
  const [activeRelatedFilter, setActiveRelatedFilter] = useState('All');

  // Check if video is a YouTube video (vs uploaded local MP4)
  const isYoutubeVideo = video.id && 
    !video.id.startsWith('upload_') && 
    !video.id.startsWith('local_') && 
    !video.videoUrl.startsWith('data:') && 
    !video.videoUrl.startsWith('blob:') &&
    !video.videoUrl.endsWith('.mp4');

  // Filter recommendations
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
      setAiSummary({
        summary: `"${video.title}" provides deep practical takeaways and breakdowns in modern technology and creative workflows.`,
        keyHighlights: ['0:00 - Introduction & Concept', '2:40 - Core Implementation', '6:15 - Practical Examples', '9:30 - Key Takeaways'],
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
        'Super clear breakdown! Thanks for sharing 🙌',
        'Loved the explanation at 3:15, extremely helpful!',
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
    setIsCommentInputFocused(false);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="youtube-watch-page" className="flex flex-col xl:flex-row gap-6 max-w-[1800px] mx-auto p-4 sm:p-6 w-full select-none">
      {/* Left Column: Video Player, Title, Channel Info, Description & Comments */}
      <div className="flex-1 min-w-0">
        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
          {isYoutubeVideo ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              controlsList="nodownload"
              poster={video.thumbnailUrl}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Video Title */}
        <h1 className="text-[20px] font-bold text-[#0f0f0f] mt-3 mb-2 leading-tight">
          {video.title}
        </h1>

        {/* Channel Row & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3">
          {/* Channel Avatar & Subscribe Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectChannel(video.channel.id)}
              className="flex items-center gap-3 focus:outline-none cursor-pointer text-left"
            >
              <img
                src={video.channel.avatar}
                alt={video.channel.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1 font-medium text-[#0f0f0f] text-[16px] leading-tight">
                  <span>{video.channel.name}</span>
                  {video.channel.verified && (
                    <YouTubeVerifiedBadge className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[12px] text-[#606060] leading-tight">{video.channel.subscribers} subscribers</span>
              </div>
            </button>

            {/* Authentic YouTube Subscribe Pill Button */}
            <button
              id="btn-channel-subscribe"
              onClick={() => onToggleSubscribe(video.channel.id)}
              className={`ml-3 px-4 h-9 rounded-full text-[14px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
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
          </div>

          {/* Action Pills Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Joined Like & Dislike Pill */}
            <div className="flex items-center bg-[#f2f2f2] rounded-full h-9 overflow-hidden">
              <button
                onClick={() => onToggleLike(video.id)}
                className={`flex items-center gap-2 px-3.5 h-full text-[14px] font-medium transition-colors hover:bg-[#e5e5e5] cursor-pointer ${
                  video.isLiked ? 'text-[#0f0f0f] font-semibold' : 'text-[#0f0f0f]'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-[#0f0f0f]' : ''}`} />
                <span>{(video.likes + (video.isLiked ? 1 : 0)).toLocaleString()}</span>
              </button>
              <div className="w-px h-5 bg-[#d9d9d9]" />
              <button
                onClick={() => onToggleDislike(video.id)}
                className={`px-3 h-full flex items-center justify-center transition-colors hover:bg-[#e5e5e5] cursor-pointer ${
                  video.isDisliked ? 'text-[#0f0f0f]' : 'text-[#0f0f0f]'
                }`}
                title="I dislike this"
              >
                <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? 'fill-[#0f0f0f]' : ''}`} />
              </button>
            </div>

            {/* Share Pill */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 h-9 rounded-full text-[14px] font-medium bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            {/* Download Pill */}
            <button
              onClick={() => {}}
              className="hidden sm:flex items-center gap-2 px-4 h-9 rounded-full text-[14px] font-medium bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            {/* Save / Watch Later Pill */}
            <button
              onClick={() => onToggleSave(video.id)}
              className={`flex items-center gap-2 px-4 h-9 rounded-full text-[14px] font-medium transition-colors cursor-pointer ${
                video.isSaved
                  ? 'bg-neutral-900 text-white'
                  : 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${video.isSaved ? 'fill-white' : ''}`} />
              <span>{video.isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* AI Highlights Pill */}
            <button
              onClick={handleGenerateAiSummary}
              disabled={loadingAiSummary}
              className={`flex items-center gap-1.5 px-3.5 h-9 rounded-full text-[14px] font-medium transition-colors cursor-pointer ${
                aiSummary
                  ? 'bg-purple-900 text-white'
                  : 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
              }`}
              title="AI Executive Summary"
            >
              <Sparkles className={`w-4 h-4 ${loadingAiSummary ? 'animate-spin text-purple-600' : 'text-purple-600'}`} />
              <span>{loadingAiSummary ? 'Analyzing...' : aiSummary ? 'Hide AI' : 'AI Highlights'}</span>
            </button>

            {/* 3 dots */}
            <button
              onClick={() => {}}
              className="w-9 h-9 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Key Highlights Banner (If activated) */}
        {aiSummary && (
          <div className="mb-4 p-4 bg-[#f8f5ff] border border-purple-200 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-[13px] font-semibold text-purple-900">
                Gemini AI Video Summary & Key Moments
              </h3>
            </div>
            <p className="text-[14px] text-[#0f0f0f] mb-3 leading-relaxed">
              {aiSummary.summary}
            </p>
            {aiSummary.keyHighlights && aiSummary.keyHighlights.length > 0 && (
              <div className="space-y-1 bg-white/90 p-3 rounded-lg border border-purple-100 text-[13px]">
                <span className="font-medium text-[#0f0f0f] block mb-1">Key Chapters:</span>
                {aiSummary.keyHighlights.map((hl, idx) => (
                  <div key={idx} className="text-[#606060] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Authentic YouTube Description Box */}
        <div 
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="p-3 bg-[#f2f2f2] hover:bg-[#e8e8e8] rounded-xl text-[14px] text-[#0f0f0f] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 font-medium mb-1 flex-wrap">
            <span>{video.views}</span>
            <span aria-hidden="true">•</span>
            <span>{video.uploadedAt}</span>
            <div className="flex gap-1.5 ml-2 flex-wrap">
              {video.tags.map((tag) => (
                <span key={tag} className="text-[#065fd4] font-medium">#{tag}</span>
              ))}
            </div>
          </div>

          <p className={`whitespace-pre-line leading-relaxed text-[#0f0f0f] ${showFullDescription ? '' : 'line-clamp-3'}`}>
            {video.description}
          </p>

          <span className="mt-2 font-medium text-[#0f0f0f] inline-block hover:underline">
            {showFullDescription ? 'Show less' : '...more'}
          </span>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <div className="flex items-center gap-8 mb-6">
            <h2 className="text-[20px] font-bold text-[#0f0f0f]">
              {comments.length.toLocaleString()} Comments
            </h2>

            <button className="flex items-center gap-2 text-[14px] font-medium text-[#0f0f0f] hover:text-[#000000] cursor-pointer">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort by</span>
            </button>

            {/* AI Comment Ideas trigger */}
            <button
              onClick={handleFetchAiComments}
              disabled={loadingAiComments}
              className="ml-auto text-[13px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{loadingAiComments ? 'Generating AI...' : 'Suggest AI Comments'}</span>
            </button>
          </div>

          {/* AI Comment Ideas Pills */}
          {aiCommentSuggestions.length > 0 && (
            <div className="mb-6 p-3 bg-purple-50/50 border border-purple-200 rounded-xl">
              <span className="text-[12px] font-medium text-purple-900 block mb-2">Click to insert AI comment idea:</span>
              <div className="flex flex-wrap gap-2">
                {aiCommentSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCommentText(sug);
                      setIsCommentInputFocused(true);
                    }}
                    className="text-[13px] bg-white hover:bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-[#0f0f0f] text-left transition-colors cursor-pointer shadow-2xs"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add a Comment Input (YouTube Authentic) */}
          <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onFocus={() => setIsCommentInputFocused(true)}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full pb-1 text-[14px] border-b border-[#e5e5e5] focus:border-[#0f0f0f] focus:outline-none bg-transparent transition-colors text-[#0f0f0f] placeholder:text-[#606060]"
              />
              {(isCommentInputFocused || commentText.trim()) && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCommentText('');
                      setIsCommentInputFocused(false);
                    }}
                    className="px-4 py-2 text-[14px] font-medium text-[#0f0f0f] hover:bg-[#f2f2f2] rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`px-4 py-2 text-[14px] font-medium rounded-full cursor-pointer transition-colors ${
                      commentText.trim()
                        ? 'bg-[#065fd4] text-white hover:bg-[#004fc4]'
                        : 'bg-[#0000000d] text-[#909090] cursor-not-allowed'
                    }`}
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 text-[14px]">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[13px] text-[#0f0f0f]">@{comment.authorName.toLowerCase().replace(/\s+/g, '')}</span>
                    <span className="text-[#606060] text-[12px]">{comment.timestamp}</span>
                  </div>
                  <p className="text-[#0f0f0f] leading-relaxed mb-2 whitespace-pre-wrap">{comment.text}</p>
                  
                  {/* Actions line */}
                  <div className="flex items-center gap-4 text-[#0f0f0f]">
                    <button className="flex items-center gap-1.5 hover:text-[#000000] cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-[12px] text-[#606060]">{comment.likes > 0 ? comment.likes : ''}</span>
                    </button>
                    <button className="hover:text-[#000000] cursor-pointer">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-[12px] font-medium hover:underline cursor-pointer">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Up Next Recommended Videos */}
      <div className="w-full xl:w-[400px] shrink-0">
        {/* Related Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4">
          {['All', `From ${video.channel.name}`, 'Related', 'Recently uploaded'].map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveRelatedFilter(chip)}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeRelatedFilter === chip
                  ? 'bg-[#0f0f0f] text-white'
                  : 'bg-[#0000000d] hover:bg-[#0000001a] text-[#0f0f0f]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Compact Horizontal Cards List */}
        <div className="space-y-3">
          {recommendedVideos.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectVideo(rec)}
              className="group flex gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded-xl transition-colors"
            >
              {/* 168x94 Compact Thumbnail */}
              <div className="relative w-[168px] aspect-video bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                <img
                  src={rec.thumbnailUrl}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-[12px] font-medium rounded-[4px] leading-none">
                  {rec.duration}
                </span>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 pr-1">
                <h3 className="text-[14px] font-medium text-[#0f0f0f] line-clamp-2 leading-tight mb-1 group-hover:text-[#0f0f0f]">
                  {rec.title}
                </h3>
                <p className="text-[12px] text-[#606060] truncate mb-0.5 hover:text-[#0f0f0f]">{rec.channel.name}</p>
                <p className="text-[12px] text-[#606060]">{rec.views} • {rec.uploadedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3 mb-4">
              <h3 className="font-bold text-[#0f0f0f] text-[16px]">Share</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-[#606060] hover:text-[#0f0f0f] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] text-[#606060] mb-3">Share link:</p>

            <div className="flex items-center gap-2 bg-[#f2f2f2] p-2 rounded-xl border border-[#e5e5e5]">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full text-[13px] bg-transparent text-[#0f0f0f] focus:outline-none px-2"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 bg-[#065fd4] text-white rounded-full text-[13px] font-medium hover:bg-[#004fc4] shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
