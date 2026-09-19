import React from 'react';
import { 
  Home, 
  Flame, 
  Tv, 
  Library, 
  History, 
  Video as VideoIcon, 
  ThumbsUp, 
  Clock, 
  Compass, 
  Sparkles, 
  UserCheck,
  ChevronRight,
  Settings
} from 'lucide-react';
import { ActiveTab, Channel } from '../types';

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
  const mainNav = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'shorts' as ActiveTab, label: 'Shorts', icon: Flame },
    { id: 'subscriptions' as ActiveTab, label: 'Subscriptions', icon: Tv },
  ];

  const libraryNav = [
    { id: 'library' as ActiveTab, label: 'You / Library', icon: Library },
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    { id: 'liked' as ActiveTab, label: 'Liked Videos', icon: ThumbsUp },
  ];

  if (isCollapsed) {
    return (
      <aside id="youtube-sidebar-collapsed" className="sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-18 bg-white border-r border-neutral-200 flex flex-col items-center py-2 z-30 shrink-0">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl my-0.5 transition-colors ${
                isActive ? 'bg-neutral-100 text-red-600 font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
        
        <div className="w-8 border-t border-neutral-200 my-2" />

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl my-0.5 transition-colors ${
            activeTab === 'library' || activeTab === 'history' || activeTab === 'liked'
              ? 'bg-neutral-100 text-red-600 font-semibold'
              : 'text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Library className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">You</span>
        </button>
      </aside>
    );
  }

  return (
    <aside id="youtube-sidebar-expanded" className="sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-white border-r border-neutral-200 overflow-y-auto p-2 z-30 shrink-0 text-neutral-800">
      {/* Primary Navigation */}
      <div className="space-y-1 mb-3">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              <Icon className={`w-5 h-5 mr-4 ${isActive ? 'text-red-600' : 'text-neutral-600'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-neutral-200 my-2" />

      {/* You / Library Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          <span className="text-sm font-bold text-neutral-900 flex items-center gap-1">
            You <ChevronRight className="w-4 h-4 text-neutral-400" />
          </span>
        </div>
        <div className="space-y-0.5">
          {libraryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-neutral-100 font-semibold text-neutral-900' : 'hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <Icon className={`w-5 h-5 mr-4 ${isActive ? 'text-red-600' : 'text-neutral-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-neutral-200 my-2" />

      {/* Subscriptions List */}
      <div className="mb-4">
        <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Subscriptions
        </h3>
        {subscribedChannels.length === 0 ? (
          <p className="px-3 text-xs text-neutral-400">No subscriptions yet.</p>
        ) : (
          <div className="space-y-0.5 max-h-60 overflow-y-auto">
            {subscribedChannels.map((channel) => {
              const isSelected = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected ? 'bg-red-50 text-red-700 font-semibold' : 'hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 my-2" />

      {/* Footer info */}
      <div className="px-3 py-2 text-[11px] text-neutral-400 leading-normal space-y-2">
        <p>About Press Copyright Creators Advertise Developers</p>
        <p className="font-semibold text-neutral-500">© 2026 YouTube Clone AI Studio</p>
      </div>
    </aside>
  );
};
