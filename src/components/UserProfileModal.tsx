import React, { useState } from 'react';
import { 
  X, 
  User, 
  Check, 
  Plus, 
  Edit2, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, Channel } from '../types';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-scaleIn my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-neutral-900">Account & Channels</h2>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Channel Card */}
        <div className="mt-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-red-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-neutral-900 text-sm truncate">{userProfile.name}</h3>
              <CheckCircle2 className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />
            </div>
            <p className="text-xs text-neutral-500 truncate">{userProfile.handle}</p>
            <span className="text-[11px] text-neutral-400">{userProfile.subscribers} subscribers</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 shrink-0 shadow-2xs"
            title="Edit Channel Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-neutral-100 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Edit Active Channel Profile</h4>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Channel Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Channel Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Account Switcher Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Switch Account / Channel
            </h4>
            <button
              onClick={() => setShowCreateAccount(!showCreateAccount)}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Channel</span>
            </button>
          </div>

          {/* Create New Channel Form */}
          {showCreateAccount && (
            <form onSubmit={handleCreateNewAccount} className="mb-4 p-4 bg-red-50/60 border border-red-200 rounded-2xl space-y-3 text-xs">
              <h5 className="font-bold text-red-900">Create New YouTube Channel</h5>
              <input
                type="text"
                placeholder="Channel Name (e.g. Gaming Studio)"
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                className="w-full px-3 py-1.5 border border-red-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                placeholder="Handle (e.g. @gamingstudio)"
                value={newAccHandle}
                onChange={(e) => setNewAccHandle(e.target.value)}
                className="w-full px-3 py-1.5 border border-red-200 rounded-lg bg-white text-neutral-900 focus:outline-none focus:border-red-600"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Account List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {accounts.map((acc) => {
              const isActive = acc.id === userProfile.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-xl text-left border transition-all ${
                    isActive
                      ? 'bg-red-50 border-red-500 font-semibold'
                      : 'bg-white hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-neutral-900 truncate">{acc.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{acc.handle}</p>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-red-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
