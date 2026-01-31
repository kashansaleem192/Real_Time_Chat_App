import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SideBarSkeletons from "../../Skeletons/SideBarSkeletons";
import { getUsers, setSelectedUser } from "../../Store/Slices/chatSlice";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { users, selectedUser, isUsersLoading } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) =>
        onlineUsers?.some((id) => id.toString() === user._id.toString())
      )
    : users;

  if (isUsersLoading) return <SideBarSkeletons />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/10 flex flex-col transition-all duration-300 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/80 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 w-full p-4 lg:p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600/40 to-teal-600/40 flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="font-semibold text-lg text-white hidden lg:block tracking-tight">
            Contacts
          </span>
        </div>

        {/* Online Only Filter */}
        <div className="mt-4 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-slate-950 transition-all"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span>Show Online Only</span>
          </label>

          {onlineUsers?.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 bg-emerald-900/40 text-emerald-300 rounded-full border border-emerald-500/20">
              {onlineUsers.length - 1} online
            </span>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 lg:px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-800/40 scrollbar-track-transparent">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers?.some(
              (id) => id.toString() === user._id.toString()
            );
            const isSelected = selectedUser?._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`w-full flex items-center gap-3 lg:gap-4 p-3 rounded-xl transition-all duration-300 group
                  ${isSelected 
                    ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 shadow-lg shadow-emerald-900/30" 
                    : "hover:bg-white/5 border border-transparent hover:border-white/10"
                  }`}
              >
                {/* Avatar with status */}
                <div className="relative shrink-0">
                  <div className={`rounded-full overflow-hidden transition-all duration-300 shadow-md
                    ${isSelected || isOnline ? 'ring-2 ring-emerald-500/60 ring-offset-2 ring-offset-slate-950' : 'ring-1 ring-white/10'}
                  `}>
                    <img
                      src={user?.avatar?.url || "/avatar.png"}
                      alt={user.fullname}
                      className="w-11 h-11 lg:w-12 lg:h-12 object-cover"
                    />
                  </div>

                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg shadow-emerald-900/40 animate-pulse" />
                  )}
                </div>

                {/* User Info - visible on desktop */}
                <div className="hidden lg:block min-w-0 flex-1">
                  <div className={`font-medium text-base truncate transition-colors
                    ${isSelected ? 'text-emerald-300' : 'text-white group-hover:text-emerald-200'}`}
                  >
                    {user.fullname}
                  </div>
                  <div className={`text-xs mt-0.5 font-medium
                    ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm p-6 text-center">
            <Users className="w-10 h-10 mb-3 opacity-50" />
            <p>No users found</p>
            <p className="mt-1 opacity-70">Try turning off "Online Only" filter</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;