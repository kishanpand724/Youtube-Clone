import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Mic, 
  Video as VideoIcon, 
  Bell, 
  Sparkles, 
  X, 
  PlusCircle, 
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  toggleSidebar: () => void;
  onOpenUpload: () => void;
  onOpenProfileSwitcher: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  toggleSidebar,
  onOpenUpload,
  onOpenProfileSwitcher,
  onNavigateHome
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('Full-stack AI development');
      setIsListening(false);
    }, 1800);
  };

  return (
    <header id="youtube-header" className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-200">
      {/* Left section: Hamburger & Logo */}
      <div id="header-left-section" className="flex items-center gap-4">
        <button 
          id="btn-sidebar-toggle"
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-700 focus:outline-none"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          id="btn-youtube-logo"
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 focus:outline-none group"
        >
          <div className="relative flex items-center justify-center w-8 h-6 bg-red-600 rounded-lg group-hover:bg-red-700 transition-colors shadow-xs">
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-7 border-l-white ml-0.5" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-neutral-900 font-sans">
            YouTube <span className="text-[10px] font-semibold tracking-normal text-neutral-500 uppercase align-top -ml-0.5">CLONE</span>
          </span>
        </button>
      </div>

      {/* Middle section: Search bar */}
      <div id="header-search-section" className="flex items-center justify-center flex-1 max-w-2xl px-4">
        <form onSubmit={onSearchSubmit} className="flex items-center w-full max-w-lg">
          <div className="relative flex items-center flex-1">
            <input
              id="input-youtube-search"
              type="text"
              placeholder="Search videos, creators, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-4 pr-9 text-sm bg-white border border-neutral-300 rounded-l-full focus:outline-none focus:border-blue-600 shadow-inner text-neutral-900 placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            id="btn-search-submit"
            type="submit"
            className="flex items-center justify-center w-16 h-10 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-full hover:bg-neutral-200 transition-colors text-neutral-700"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <button
          id="btn-voice-search"
          onClick={handleVoiceSearch}
          className={`ml-3 p-2.5 rounded-full transition-colors ${
            isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
          }`}
          title={isListening ? 'Listening...' : 'Search with voice'}
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right section: Action Buttons & User Profile */}
      <div id="header-actions-section" className="flex items-center gap-2">
        {/* Create / Upload Video Button */}
        <button
          id="btn-upload-video"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
          title="Upload Video"
        >
          <PlusCircle className="w-4 h-4 text-red-600" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div id="notifications-dropdown" className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-neutral-100">
                <h3 className="font-semibold text-neutral-900 text-sm">Notifications</h3>
                <span className="text-xs text-neutral-500">2 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                <div className="p-3 hover:bg-neutral-50 transition-colors flex gap-3 items-start cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-800 font-medium">
                      CodeCraft Master uploaded: <span className="font-semibold">React & AI Mastery</span>
                    </p>
                    <span className="text-[10px] text-neutral-400">2 hours ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-neutral-50 transition-colors flex gap-3 items-start cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-800 font-medium">
                      Your uploaded video is live!
                    </p>
                    <span className="text-[10px] text-neutral-400">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          id="btn-user-avatar"
          onClick={onOpenProfileSwitcher}
          className="ml-1 flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-red-500 transition-all focus:outline-none"
          title="Account & Channel Options"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full object-cover border border-neutral-200"
          />
        </button>
      </div>
    </header>
  );
};
