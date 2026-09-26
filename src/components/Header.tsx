import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Bell, 
  X, 
  Plus, 
  Key, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Globe, 
  ShieldAlert, 
  HelpCircle,
  Video,
  DollarSign,
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { YoutubeApiStatus } from '../services/youtubeApi';
import { YouTubeLogo } from './YouTubeIcons';

interface HeaderProps {
  userProfile: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  toggleSidebar: () => void;
  onOpenUpload: () => void;
  onOpenProfileSwitcher: () => void;
  onNavigateHome: () => void;
  onSelectChannel: (channelId: string) => void;
  youtubeApiStatus: YoutubeApiStatus;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  toggleSidebar,
  onOpenUpload,
  onOpenProfileSwitcher,
  onNavigateHome,
  onSelectChannel,
  youtubeApiStatus,
  onOpenApiKeyModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('Full-stack AI development');
      setIsListening(false);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-white border-b border-transparent select-none">
      {/* Left: Hamburger & Official YouTube Logo */}
      <div className="flex items-center gap-4 shrink-0">
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-[#0f0f0f] focus:outline-none"
          title="Guide"
        >
          {/* Official YouTube Hamburger 3-line SVG */}
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"/>
          </svg>
        </button>

        <button 
          onClick={onNavigateHome}
          className="flex items-center focus:outline-none cursor-pointer py-1"
          title="YouTube Home"
        >
          <YouTubeLogo className="h-5" region="US" />
        </button>
      </div>

      {/* Middle: Search Box & Voice Search */}
      <div className="flex items-center justify-center flex-1 max-w-[732px] px-4">
        <form onSubmit={onSearchSubmit} className="flex items-center w-full max-w-[640px]">
          <div className="relative flex items-center flex-1 group">
            {/* Magnifying glass shown inside input when focused, just like YouTube */}
            {isSearchFocused && (
              <div className="absolute left-3.5 text-[#0f0f0f]">
                <Search className="w-4 h-4 text-[#606060]" />
              </div>
            )}
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 ${
                isSearchFocused ? 'pl-10' : 'pl-4'
              } pr-9 text-[16px] bg-white border border-[#ccc] rounded-l-full focus:outline-none focus:border-[#1c62b9] focus:ring-1 focus:ring-[#1c62b9] shadow-inner text-[#0f0f0f] placeholder:text-[#888]`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-[#606060] hover:text-[#0f0f0f]"
                title="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-16 h-10 bg-[#f8f8f8] hover:bg-[#f0f0f0] border border-l-0 border-[#ccc] rounded-r-full transition-colors text-[#0f0f0f]"
            title="Search"
          >
            <Search className="w-5 h-5 text-[#303030]" />
          </button>
        </form>

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`ml-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]'
          }`}
          title={isListening ? 'Listening...' : 'Search with your voice'}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Create Button, Notifications, API Key, Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* + Create Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 h-9 px-3.5 bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f] rounded-full text-[14px] font-medium transition-colors cursor-pointer"
          title="Create"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#0f0f0f] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 bg-[#cc0000] text-white text-[10px] font-bold px-1 rounded-full leading-none min-w-[16px] h-4 flex items-center justify-center border border-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl z-50 overflow-hidden text-[#0f0f0f]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
                <h3 className="font-medium text-[16px]">Notifications</h3>
                <button className="text-[14px] text-blue-600 hover:text-blue-700 font-medium">Settings</button>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-[#f2f2f2]">
                <div className="p-3.5 hover:bg-[#f9f9f9] transition-colors flex gap-3 items-start cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-[#0f0f0f] leading-snug">
                      <span className="font-semibold">CodeCraft Master</span> uploaded: Building a Full-Stack AI App with Gemini.
                    </p>
                    <span className="text-[11px] text-[#606060] mt-1 block">2 hours ago</span>
                  </div>
                  <div className="w-14 h-9 bg-neutral-900 rounded shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="p-3.5 hover:bg-[#f9f9f9] transition-colors flex gap-3 items-start cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-[#0f0f0f] leading-snug">
                      Your video was successfully uploaded and published to your channel.
                    </p>
                    <span className="text-[11px] text-[#606060] mt-1 block">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with YouTube Account Dropdown */}
        <div className="relative ml-1" ref={accountMenuRef}>
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-neutral-300 transition-all focus:outline-none cursor-pointer"
            title="Account"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </button>

          {/* Authentic YouTube Account Menu Dropdown */}
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-[300px] bg-white border border-[#e5e5e5] rounded-xl shadow-2xl z-50 overflow-hidden text-[#0f0f0f] py-2">
              {/* Account Header */}
              <div className="px-4 py-3 flex gap-3 border-b border-[#e5e5e5]">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[15px] truncate">{userProfile.name}</p>
                  <p className="text-[13px] text-[#606060] truncate">{userProfile.handle}</p>
                  <button
                    onClick={() => {
                      onSelectChannel(userProfile.id);
                      setShowAccountMenu(false);
                    }}
                    className="text-[13px] text-blue-600 hover:text-blue-700 font-medium mt-1 block"
                  >
                    View your channel
                  </button>
                </div>
              </div>

              {/* Section 1: Google Account & Switching */}
              <div className="py-1 border-b border-[#e5e5e5]">
                <button
                  onClick={() => {
                    onOpenProfileSwitcher();
                    setShowAccountMenu(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-[14px] hover:bg-[#f2f2f2] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#606060]" />
                    <span>Switch account</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#606060]" />
                </button>

                <button
                  onClick={() => {
                    onOpenProfileSwitcher();
                    setShowAccountMenu(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] hover:bg-[#f2f2f2] transition-colors"
                >
                  <LogOut className="w-5 h-5 text-[#606060]" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Section 2: Studio & API Key */}
              <div className="py-1 border-b border-[#e5e5e5]">
                <button
                  onClick={() => {
                    onOpenUpload();
                    setShowAccountMenu(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] hover:bg-[#f2f2f2] transition-colors"
                >
                  <Video className="w-5 h-5 text-[#606060]" />
                  <span>YouTube Studio</span>
                </button>

                <button
                  onClick={() => {
                    onOpenApiKeyModal();
                    setShowAccountMenu(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-[14px] hover:bg-[#f2f2f2] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Key className={`w-5 h-5 ${youtubeApiStatus.hasKey ? 'text-emerald-600' : 'text-[#606060]'}`} />
                    <span>YouTube Data API Key</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    youtubeApiStatus.hasKey ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {youtubeApiStatus.hasKey ? 'Connected' : 'Configure'}
                  </span>
                </button>

                <div className="px-4 py-2 flex items-center gap-3 text-[14px] text-neutral-400">
                  <DollarSign className="w-5 h-5 text-[#606060]" />
                  <span>Purchases and memberships</span>
                </div>
              </div>

              {/* Section 3: Settings */}
              <div className="py-1">
                <button
                  onClick={() => {
                    onOpenProfileSwitcher();
                    setShowAccountMenu(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] hover:bg-[#f2f2f2] transition-colors"
                >
                  <Settings className="w-5 h-5 text-[#606060]" />
                  <span>Settings</span>
                </button>
                <div className="px-4 py-2 flex items-center gap-3 text-[14px] text-neutral-600">
                  <HelpCircle className="w-5 h-5 text-[#606060]" />
                  <span>Help & feedback</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
