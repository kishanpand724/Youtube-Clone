import React, { useState } from 'react';
import { 
  X, 
  User, 
  Check, 
  Plus, 
  Edit2
} from 'lucide-react';
import { UserProfile, Channel } from '../types';
import { YouTubeVerifiedBadge } from './YouTubeIcons';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  accounts: Channel[];
  onSelectAccount: (account: Channel) => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onCreateAccount: (newAccount: Channel) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  accounts,
  onSelectAccount,
  onUpdateProfile,
  onCreateAccount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [handle, setHandle] = useState(userProfile.handle);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [banner, setBanner] = useState(userProfile.banner);

  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccHandle, setNewAccHandle] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, handle, avatar, banner });
    setIsEditing(false);
  };

  const handleCreateNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const newAcc: Channel = {
      id: `acc_${Date.now()}`,
      name: newAccName,
      handle: newAccHandle.startsWith('@') ? newAccHandle : `@${newAccHandle || newAccName.toLowerCase().replace(/\s+/g, '')}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      subscribers: '0',
      subscriberCount: 0,
      verified: true,
      description: `Welcome to ${newAccName}! Subscribe for awesome content.`,
      joinedDate: 'Joined Today',
      isUserOwned: true
    };

    onCreateAccount(newAcc);
    setNewAccName('');
    setNewAccHandle('');
    setShowCreateAccount(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e5e5e5] animate-scaleIn my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#0f0f0f]" />
            <h2 className="text-[18px] font-bold text-[#0f0f0f]">Switch account</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#606060] hover:text-[#0f0f0f] rounded-full hover:bg-[#f2f2f2] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Channel Card */}
        <div className="mt-4 p-4 bg-[#f9f9f9] rounded-xl border border-[#e5e5e5] flex items-center gap-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-[#0f0f0f] text-[15px] truncate">{userProfile.name}</h3>
              <YouTubeVerifiedBadge className="w-3.5 h-3.5" />
            </div>
            <p className="text-[13px] text-[#606060] truncate">{userProfile.handle}</p>
            <span className="text-[12px] text-[#606060]">{userProfile.subscribers} subscribers</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-[#f2f2f2] text-[#606060] hover:text-[#0f0f0f] cursor-pointer"
            title="Edit Channel Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-[#f2f2f2] rounded-xl space-y-3 text-[13px]">
            <h4 className="font-semibold text-[#0f0f0f]">Edit Channel Info</h4>
            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc] rounded-lg bg-white focus:outline-none focus:border-[#065fd4]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc] rounded-lg bg-white focus:outline-none focus:border-[#065fd4]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#0f0f0f] mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc] rounded-lg bg-white focus:outline-none focus:border-[#065fd4]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-full text-[#606060] hover:bg-neutral-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full text-white bg-[#065fd4] hover:bg-[#004fc4] font-medium cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Account Switcher Section */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-medium text-[#606060]">
              Other accounts
            </h4>
            <button
              onClick={() => setShowCreateAccount(!showCreateAccount)}
              className="text-[13px] font-medium text-[#065fd4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add account</span>
            </button>
          </div>

          {/* Create New Channel Form */}
          {showCreateAccount && (
            <form onSubmit={handleCreateNewAccount} className="mb-4 p-4 bg-[#f8f5ff] border border-purple-200 rounded-xl space-y-3 text-[13px]">
              <h5 className="font-semibold text-purple-900">Create New YouTube Channel</h5>
              <input
                type="text"
                placeholder="Channel Name"
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc] rounded-lg bg-white text-[#0f0f0f] focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                placeholder="Handle (e.g. @studio)"
                value={newAccHandle}
                onChange={(e) => setNewAccHandle(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc] rounded-lg bg-white text-[#0f0f0f] focus:outline-none focus:border-purple-600"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="px-3 py-1 text-[#606060] hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Account List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {accounts.map((acc) => {
              const isActive = acc.id === userProfile.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#f2f2f2] font-semibold'
                      : 'hover:bg-[#f9f9f9]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-[14px] text-[#0f0f0f] truncate">{acc.name}</p>
                      <p className="text-[12px] text-[#606060] truncate">{acc.handle}</p>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[#065fd4] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5 pt-3 border-t border-[#e5e5e5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0f0f0f] hover:bg-[#272727] text-white text-[14px] font-medium rounded-full transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
