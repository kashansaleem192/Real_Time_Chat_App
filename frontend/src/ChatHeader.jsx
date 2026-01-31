import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from './Store/Slices/chatSlice';
import { X, Phone, Video, Info, MoreVertical, Volume2, VolumeX, Shield, Bell } from 'lucide-react';

const ChatHeader = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOnline = onlineUsers?.includes(selectedUser?._id);

  const formatLastSeen = () => {
    if (isOnline) return "Online";

    if (selectedUser?.lastSeen) {
      const lastSeen = new Date(selectedUser.lastSeen);
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `Last seen ${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `Last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return "Last seen yesterday";
      return `Last seen ${lastSeen.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    return "Offline";
  };

  const handleCall = (type) => {
    console.log(`Initiating ${type} call with ${selectedUser?.fullName}`);
    // Real call logic yahan add karna (e.g. WebRTC / third-party)
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'mute':
        setIsMuted(!isMuted);
        break;
      case 'block':
        setIsBlocked(!isBlocked);
        break;
      case 'profile':
        setShowProfile(true);
        break;
      case 'clear':
        if (window.confirm("Clear all messages with this user? This cannot be undone.")) {
          console.log("Clearing chat history...");
          // Dispatch clear chat action yahan
        }
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  if (!selectedUser) return null;

  return (
    <>
      <header className="sticky top-0 z-20 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-emerald-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          {/* User Info */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
            onClick={() => setShowProfile(true)}
          >
            <div className="relative shrink-0">
              <img
                src={selectedUser?.avatar?.url || "./avatar.png"}
                alt={selectedUser?.fullName}
                className="w-11 h-11 md:w-12 md:h-12 object-cover rounded-full ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-slate-950 transition-all duration-300 group-hover:ring-emerald-400/60 shadow-lg"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-950 shadow-md transition-all duration-300 ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                }`}
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-lg text-white truncate group-hover:text-emerald-300 transition-colors">
                {selectedUser?.fullName}
                {isBlocked && (
                  <span className="ml-2.5 text-xs bg-red-900/60 text-red-300 px-2.5 py-0.5 rounded-full font-medium">
                    Blocked
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className={`text-sm font-medium ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {formatLastSeen()}
                </p>
                {isMuted && <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => handleCall('audio')}
              className="p-2.5 text-slate-300 hover:text-emerald-400 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
              title="Voice Call"
            >
              <Phone className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleCall('video')}
              className="p-2.5 text-slate-300 hover:text-emerald-400 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
            </button>

            {/* Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-40 py-1.5 text-slate-200">
                    <button
                      onClick={() => handleMenuAction('profile')}
                      className="w-full px-5 py-3 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      <Info className="w-5 h-5 text-emerald-400" />
                      View Profile
                    </button>

                    <button
                      onClick={() => handleMenuAction('mute')}
                      className="w-full px-5 py-3 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      {isMuted ? (
                        <Volume2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-slate-400" />
                      )}
                      {isMuted ? 'Unmute' : 'Mute'} Notifications
                    </button>

                    <button
                      onClick={() => handleMenuAction('block')}
                      className="w-full px-5 py-3 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      <Shield className="w-5 h-5 text-red-400" />
                      {isBlocked ? 'Unblock User' : 'Block User'}
                    </button>

                    <div className="border-t border-white/10 my-2 mx-2"></div>

                    <button
                      onClick={() => handleMenuAction('clear')}
                      className="w-full px-5 py-3 text-left text-sm text-red-400 hover:bg-red-950/30 flex items-center gap-3 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Clear Chat
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Close Chat (mobile) */}
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className="p-2.5 text-slate-300 hover:text-red-400 hover:bg-red-950/30 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 lg:hidden"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Typing Indicator */}
        {selectedUser?.isTyping && (
          <div className="px-6 py-2.5 flex items-center gap-3 bg-gradient-to-r from-emerald-950/30 to-transparent border-t border-emerald-900/30">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
            </div>
            <span className="text-sm font-medium text-emerald-300">
              {selectedUser.fullName} is typing...
            </span>
          </div>
        )}
      </header>

      {/* Profile Modal (tumhara alag component) */}
      {showProfile && (
        <UserProfileModal
          user={selectedUser}
          isOnline={isOnline}
          onClose={() => setShowProfile(false)}
          isBlocked={isBlocked}
          onToggleBlock={() => setIsBlocked(!isBlocked)}
        />
      )}
    </>
  );
};

export default ChatHeader;