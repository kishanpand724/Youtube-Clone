import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Film
} from 'lucide-react';
import { Video, UserProfile } from '../types';
import { CATEGORIES } from '../data/mockData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUploadSuccess: (newVideo: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUploadSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [tagsInput, setTagsInput] = useState('');
  const [isShort, setIsShort] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  // Call Express Backend API for Gemini Title & SEO Description
  const handleGenerateAiMetadata = async () => {
    const concept = aiPrompt || title || 'Full-Stack Modern App Development';
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: concept, category })
      });
      const data = await res.json();
      if (data.selectedTitle) {
        setTitle(data.selectedTitle);
      }
      if (data.titles) {
        setAiSuggestions(data.titles);
      }
      if (data.description) {
        setDescription(data.description);
      }
      if (data.tags) {
        setTagsInput(data.tags.join(', '));
      }
    } catch (e) {
      setTitle(`Mastering ${concept}: Complete Guide`);
      setDescription(`In this video, we explore ${concept} with real world examples, code walkthroughs, and practical best practices.`);
      setTagsInput(`${concept.toLowerCase().replace(/\s+/g, '')}, tech, tutorial, youtube`);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalVideoUrl = videoPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const finalThumbnail = thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const newVideo: Video = {
      id: `custom_vid_${Date.now()}`,
      title,
      description: description || `Uploaded by ${userProfile.name}`,
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnail,
      duration: isShort ? '0:45' : '8:24',
      views: '0 views',
      viewCount: 0,
      uploadedAt: 'Just now',
      category: category || 'Coding',
      tags: tagsArray.length > 0 ? tagsArray : ['new', 'youtube'],
      channel: {
        id: userProfile.id,
        name: userProfile.name,
        handle: userProfile.handle,
        avatar: userProfile.avatar,
        subscribers: userProfile.subscribers,
        subscriberCount: userProfile.subscriberCount,
        verified: true,
        isUserOwned: true
      },
      likes: 0,
      dislikes: 0,
      isShort
    };

    onUploadSuccess(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e5e5e5] animate-scaleIn my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#ff0000]" />
            <h2 className="text-[18px] font-bold text-[#0f0f0f]">Upload video</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#606060] hover:text-[#0f0f0f] rounded-full hover:bg-[#f2f2f2] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Helper Banner */}
        <div className="mt-4 p-3.5 bg-[#f8f5ff] rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-[12px] font-semibold text-purple-900">
                Gemini AI Title & Description Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiMetadata}
              disabled={generatingAi}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[12px] font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className={`w-3 h-3 ${generatingAi ? 'animate-spin' : ''}`} />
              <span>{generatingAi ? 'Generating...' : 'Auto-Generate'}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Type video concept or topic (e.g. 'Build a React AI Dashboard')..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full text-[13px] bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-[#0f0f0f] focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* AI Title Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            <span className="text-[11px] font-medium text-[#606060]">Suggested Titles:</span>
            <div className="flex flex-col gap-1">
              {aiSuggestions.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`text-[12px] text-left px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    title === t ? 'bg-red-50 border-red-500 font-semibold text-red-700' : 'bg-neutral-50 hover:bg-neutral-100 border-[#e5e5e5] text-[#0f0f0f]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          {/* File Upload Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Video File (MP4/WebM)</label>
              <div className="border-2 border-dashed border-[#ccc] hover:border-[#065fd4] rounded-xl p-4 text-center cursor-pointer bg-[#fafafa] transition-colors relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <VideoIcon className="w-7 h-7 text-[#606060] mx-auto mb-1.5" />
                <span className="font-medium text-[#0f0f0f] block text-[13px]">
                  {videoFile ? videoFile.name : 'Select or drag video'}
                </span>
                <span className="text-[11px] text-[#606060]">Pre-loaded demo video included</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Thumbnail Cover</label>
              <div className="border-2 border-dashed border-[#ccc] hover:border-[#065fd4] rounded-xl p-4 text-center cursor-pointer bg-[#fafafa] transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-7 h-7 text-[#606060] mx-auto mb-1.5" />
                <span className="font-medium text-[#0f0f0f] block text-[13px]">
                  {thumbnailUrl ? 'Custom Image Selected' : 'Upload Thumbnail Image'}
                </span>
                <span className="text-[11px] text-[#606060]">16:9 ratio recommended</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-[#0f0f0f] mb-1">Title (required)</label>
            <input
              type="text"
              required
              placeholder="Add a title that describes your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded-lg focus:border-[#065fd4] focus:outline-none text-[#0f0f0f]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-[#0f0f0f] mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Tell viewers about your video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded-lg focus:border-[#065fd4] focus:outline-none text-[#0f0f0f]"
            />
          </div>

          {/* Category & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#ccc] rounded-lg focus:border-[#065fd4] focus:outline-none text-[#0f0f0f] bg-white cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Format Type</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="videoFormat"
                    checked={!isShort}
                    onChange={() => setIsShort(false)}
                    className="accent-[#065fd4]"
                  />
                  <span className="font-medium text-[#0f0f0f]">Standard Video</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="videoFormat"
                    checked={isShort}
                    onChange={() => setIsShort(true)}
                    className="accent-[#065fd4]"
                  />
                  <span className="font-medium text-[#0f0f0f]">YouTube Short</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-[#0f0f0f] mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. react, ai, coding, tutorial"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-[#ccc] rounded-lg focus:border-[#065fd4] focus:outline-none text-[#0f0f0f]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e5e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full font-medium text-[#0f0f0f] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full font-medium text-white bg-[#065fd4] hover:bg-[#004fc4] transition-colors cursor-pointer shadow-xs"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
