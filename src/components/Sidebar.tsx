import React from 'react';
import { 
  History, 
  Clock, 
  ThumbsUp, 
  ListVideo, 
  PlaySquare, 
  ChevronRight, 
  Flame, 
  Music2, 
  Gamepad2, 
  Newspaper, 
  Trophy, 
  Radio, 
  Settings, 
  Flag, 
  HelpCircle, 
  MessageSquare,
  Sparkles,
  Radio as LiveIcon
} from 'lucide-react';
import { ActiveTab, Channel } from '../types';
import { 
  YouTubeHomeIcon, 
  YouTubeShortsLogo, 
  YouTubeSubscriptionsIcon, 
  YouTubeYouIcon 
} from './YouTubeIcons';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  subscribedChannels: Channel[];
  onSelectChannel: (channelId: string) => void;
  activeChannelId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  subscribedChannels,
  onSelectChannel,
  activeChannelId
}) => {
  // Collapsed Mini Guide (72px)
  if (isCollapsed) {
    return (
      <aside 
        id="youtube-sidebar-mini" 
        className="sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-[72px] bg-white flex flex-col items-center py-1 z-30 shrink-0 select-none overflow-y-auto no-scrollbar"
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-16 h-[74px] rounded-xl my-0.5 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'font-medium text-[#0f0f0f]' : 'text-[#0f0f0f] hover:bg-[#f2f2f2]'
          }`}
          title="Home"
        >
          <YouTubeHomeIcon className="w-6 h-6 mb-1.5" filled={activeTab === 'home'} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('shorts')}
          className={`flex flex-col items-center justify-center w-16 h-[74px] rounded-xl my-0.5 transition-colors cursor-pointer ${
            activeTab === 'shorts' ? 'font-medium text-[#0f0f0f]' : 'text-[#0f0f0f] hover:bg-[#f2f2f2]'
          }`}
          title="Shorts"
        >
          <YouTubeShortsLogo className="w-6 h-6 mb-1.5" />
          <span className="text-[10px] tracking-tight">Shorts</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex flex-col items-center justify-center w-16 h-[74px] rounded-xl my-0.5 transition-colors cursor-pointer ${
            activeTab === 'subscriptions' ? 'font-medium text-[#0f0f0f]' : 'text-[#0f0f0f] hover:bg-[#f2f2f2]'
          }`}
          title="Subscriptions"
        >
          <YouTubeSubscriptionsIcon className="w-6 h-6 mb-1.5" filled={activeTab === 'subscriptions'} />
          <span className="text-[10px] tracking-tight">Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center w-16 h-[74px] rounded-xl my-0.5 transition-colors cursor-pointer ${
            activeTab === 'library' || activeTab === 'history' || activeTab === 'liked'
              ? 'font-medium text-[#0f0f0f]'
              : 'text-[#0f0f0f] hover:bg-[#f2f2f2]'
          }`}
          title="You"
        >
          <YouTubeYouIcon className="w-6 h-6 mb-1.5" filled={activeTab === 'library' || activeTab === 'history' || activeTab === 'liked'} />
          <span className="text-[10px] tracking-tight">You</span>
        </button>
      </aside>
    );
  }

  // Expanded Full Guide (240px)
  return (
    <aside 
      id="youtube-sidebar-expanded" 
      className="sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-white overflow-y-auto px-3 py-2 z-30 shrink-0 text-[#0f0f0f] select-none text-[14px]"
    >
      {/* Section 1: Main */}
      <div className="space-y-0.5 mb-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'home' ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
          }`}
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <YouTubeHomeIcon className="w-6 h-6" filled={activeTab === 'home'} />
          </div>
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('shorts')}
          className={`flex items-center w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'shorts' ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
          }`}
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <YouTubeShortsLogo className="w-6 h-6" />
          </div>
          <span>Shorts</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'subscriptions' ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
          }`}
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <YouTubeSubscriptionsIcon className="w-6 h-6" filled={activeTab === 'subscriptions'} />
          </div>
          <span>Subscriptions</span>
        </button>
      </div>

      <div className="border-t border-[#e5e5e5] my-3" />

      {/* Section 2: You */}
      <div className="space-y-0.5 mb-2">
        <button
          onClick={() => setActiveTab('library')}
          className="flex items-center justify-between w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-semibold transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            You <ChevronRight className="w-4 h-4 text-[#606060]" />
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'history' ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
          }`}
        >
          <div className="w-6 mr-6 flex items-center justify-center text-[#0f0f0f]">
            <History className="w-5 h-5" />
          </div>
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center text-[#0f0f0f]">
            <ListVideo className="w-5 h-5" />
          </div>
          <span>Playlists</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center text-[#0f0f0f]">
            <PlaySquare className="w-5 h-5" />
          </div>
          <span>Your videos</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center text-[#0f0f0f]">
            <Clock className="w-5 h-5" />
          </div>
          <span>Watch Later</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'liked' ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
          }`}
        >
          <div className="w-6 mr-6 flex items-center justify-center text-[#0f0f0f]">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <span>Liked videos</span>
        </button>
      </div>

      <div className="border-t border-[#e5e5e5] my-3" />

      {/* Section 3: Subscriptions */}
      <div className="mb-2">
        <h3 className="px-3 py-1 text-[14px] font-semibold text-[#0f0f0f]">
          Subscriptions
        </h3>
        {subscribedChannels.length === 0 ? (
          <p className="px-3 py-2 text-xs text-[#606060]">No subscriptions yet.</p>
        ) : (
          <div className="space-y-0.5">
            {subscribedChannels.map((channel) => {
              const isSelected = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`flex items-center justify-between w-full h-10 px-3 rounded-xl transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#f2f2f2] font-semibold' : 'hover:bg-[#f2f2f2] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate text-[14px]">{channel.name}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#065fd4] shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-[#e5e5e5] my-3" />

      {/* Section 4: Explore */}
      <div className="space-y-0.5 mb-2">
        <h3 className="px-3 py-1 text-[14px] font-semibold text-[#0f0f0f]">
          Explore
        </h3>
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Trending</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Music</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Gaming</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>News</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Sports</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer"
        >
          <div className="w-6 mr-6 flex items-center justify-center">
            <Radio className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Podcasts</span>
        </button>
      </div>

      <div className="border-t border-[#e5e5e5] my-3" />

      {/* Section 5: Settings & Help */}
      <div className="space-y-0.5 mb-4">
        <div className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer">
          <div className="w-6 mr-6 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Settings</span>
        </div>

        <div className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer">
          <div className="w-6 mr-6 flex items-center justify-center">
            <Flag className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Report history</span>
        </div>

        <div className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer">
          <div className="w-6 mr-6 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Help</span>
        </div>

        <div className="flex items-center w-full h-10 px-3 rounded-xl hover:bg-[#f2f2f2] font-normal transition-colors cursor-pointer">
          <div className="w-6 mr-6 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#0f0f0f]" />
          </div>
          <span>Send feedback</span>
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] my-3" />

      {/* Authentic YouTube Footer links */}
      <div className="px-3 py-2 text-[13px] text-[#606060] font-medium leading-relaxed space-y-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Press</span>
          <span className="hover:underline cursor-pointer">Copyright</span>
          <span className="hover:underline cursor-pointer">Contact us</span>
          <span className="hover:underline cursor-pointer">Creators</span>
          <span className="hover:underline cursor-pointer">Advertise</span>
          <span className="hover:underline cursor-pointer">Developers</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Policy & Safety</span>
          <span className="hover:underline cursor-pointer">How YouTube works</span>
        </div>
        <p className="text-[12px] text-[#909090] font-normal pt-1">
          © 2026 Google LLC
        </p>
      </div>
    </aside>
  );
};
