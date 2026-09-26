import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, Sparkles } from 'lucide-react';
import { getStoredYoutubeApiKey, setStoredYoutubeApiKey } from '../services/youtubeApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
  hasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
  hasKey
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredYoutubeApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredYoutubeApiKey(apiKeyInput);
    setSavedSuccess(true);
    onKeySaved();
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setStoredYoutubeApiKey('');
    setApiKeyInput('');
    setSavedSuccess(false);
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e5e5e5]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[#0f0f0f]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[16px] text-[#0f0f0f]">YouTube Data API Key</h2>
              <p className="text-[12px] text-[#606060]">Connect live YouTube Data API v3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#606060] hover:text-[#0f0f0f] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-[13px]">
          <div className="p-3.5 bg-[#f8f5ff] border border-purple-200 rounded-xl text-[#0f0f0f] flex gap-2.5 items-start">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[13px] text-purple-900 mb-0.5">Live YouTube API Integration</p>
              <p className="text-[12px] text-[#606060] leading-relaxed">
                Enter your YouTube Data API v3 key below to stream live trending videos, real-time search queries, and authentic video comment threads.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0f0f0f] mb-1">
              API Key
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-[13px] font-mono bg-[#f9f9f9] border border-[#ccc] rounded-xl focus:outline-none focus:border-[#065fd4] focus:bg-white transition-all text-[#0f0f0f]"
            />
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="text-[#065fd4] font-medium hover:underline flex items-center gap-1"
            >
              <span>Get API key from Google Cloud Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {apiKeyInput && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[#606060] hover:text-red-600 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-medium rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Key saved! Syncing live YouTube data...</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e5e5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-[#0f0f0f] hover:bg-[#f2f2f2] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-medium text-white bg-[#065fd4] hover:bg-[#004fc4] rounded-full transition-colors cursor-pointer shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
