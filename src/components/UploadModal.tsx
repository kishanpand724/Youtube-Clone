import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  CheckCircle2, 
  Tag, 
  Layers 
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
    const concept = aiPrompt || title || 'Awesome Web App and AI Tech Guide';
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
      console.error(e);
      setTitle(`Mastering ${concept}: Complete 2026 Tutorial`);
      setDescription(`In this video, we dive deep into ${concept}. Learn modern tips, code walkthroughs, and practical examples.`);
      setTagsInput(`${concept.toLowerCase().replace(/\s+/g, '')}, tech, tutorial, 2026`);
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 animate-scaleIn my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-neutral-900">Upload Video to Channel</h2>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Helper Banner */}
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Gemini AI Title & Description Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiMetadata}
              disabled={generatingAi}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generatingAi ? 'animate-spin' : ''}`} />
              <span>{generatingAi ? 'Writing AI Magic...' : 'Generate Metadata'}</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Type video concept or topic (e.g. 'Build a React dashboard with AI')..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full text-xs bg-white border border-amber-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* AI Title Suggestions Pills */}
        {aiSuggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            <span className="text-[11px] font-semibold text-neutral-600">Suggested Viral Titles:</span>
            <div className="flex flex-col gap-1.5">
              {aiSuggestions.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`text-xs text-left px-3 py-1.5 rounded-lg border transition-all ${
                    title === t ? 'bg-red-50 border-red-500 font-semibold text-red-700' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* File Upload Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-900 mb-1">Video File (MP4/WebM)</label>
              <div className="border-2 border-dashed border-neutral-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-neutral-50 transition-colors relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <VideoIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="font-semibold text-neutral-700 block">
                  {videoFile ? videoFile.name : 'Click or drop video file'}
                </span>
                <span className="text-[10px] text-neutral-400">Default fallback sample provided if empty</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-900 mb-1">Thumbnail Cover</label>
              <div className="border-2 border-dashed border-neutral-300 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer bg-neutral-50 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="font-semibold text-neutral-700 block">
                  {thumbnailUrl ? 'Custom Image Loaded' : 'Upload Thumbnail Image'}
                </span>
                <span className="text-[10px] text-neutral-400">JPG or PNG image file</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-neutral-900 mb-1">Video Title *</label>
            <input
              type="text"
              required
              placeholder="Add a title that describes your video..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-red-600 focus:outline-none text-neutral-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-neutral-900 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Tell viewers about your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-red-600 focus:outline-none text-neutral-900"
            />
          </div>

          {/* Category & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-900 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-red-600 focus:outline-none text-neutral-900 bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-900 mb-1">Format Type</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="videoFormat"
                    checked={!isShort}
                    onChange={() => setIsShort(false)}
                    className="accent-red-600"
                  />
                  <span className="font-medium text-neutral-800">Standard Video</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="videoFormat"
                    checked={isShort}
                    onChange={() => setIsShort(true)}
                    className="accent-red-600"
                  />
                  <span className="font-medium text-neutral-800">YouTube Short</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-neutral-900 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. react, ai, tutorial, coding"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:border-red-600 focus:outline-none text-neutral-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
            >
              Publish Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
