import { Users } from 'lucide-react';
import React from 'react';

const SideBarSkeletons = () => {
  const SkeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/10 flex flex-col transition-all duration-300 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/80 backdrop-blur-xl">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 w-full p-4 lg:p-5">
        <div className="flex items-center gap-3">
          {/* Icon skeleton with premium pulse */}
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-700/40 to-teal-700/40 rounded-lg animate-pulse shadow-sm"></div>

          {/* Text skeleton - hidden on mobile */}
          <div className="hidden lg:block flex-1">
            <div className="h-5 w-28 bg-white/10 rounded animate-pulse"></div>
          </div>

          {/* Search icon skeleton */}
          <div className="hidden lg:block ml-auto">
            <div className="w-9 h-9 bg-white/5 rounded-full animate-pulse border border-white/10"></div>
          </div>
        </div>
      </div>

      {/* Users List - Scrollable */}
      <div className="flex-1 overflow-y-auto py-4 px-3 lg:px-5 space-y-4 scrollbar-thin scrollbar-thumb-emerald-800/40 scrollbar-track-transparent">
        {SkeletonContacts.map((_, index) => {
          const isOnline = index % 3 === 0;
          const hasUnread = index % 4 === 0;

          return (
            <div
              key={index}
              className="w-full flex items-center gap-3 lg:gap-4 animate-pulse transition-all duration-200 hover:bg-white/5 rounded-xl p-2 lg:p-3"
            >
              {/* Avatar + Status */}
              <div className="relative mx-auto lg:mx-0">
                <div className="w-11 h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-slate-700/60 to-slate-600/60 rounded-full border border-white/10 shadow-lg animate-pulse"></div>

                {/* Online status glow */}
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg shadow-emerald-900/40 animate-pulse"></div>
                )}
              </div>

              {/* User info - visible only on desktop */}
              <div className="hidden lg:flex flex-col gap-2 flex-1">
                {/* Name + Last seen */}
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-white/15 rounded animate-pulse"></div>
                  <div className="h-3 w-14 bg-white/10 rounded animate-pulse"></div>
                </div>

                {/* Last message preview */}
                <div className="h-3.5 w-40 bg-white/10 rounded animate-pulse"></div>

                {/* Unread badge */}
                {hasUnread && (
                  <div className="h-5 w-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full self-end mt-1 shadow-md animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-white/10 p-4 lg:p-5">
        {/* Desktop - New Chat / Action Button Skeleton */}
        <div className="hidden lg:block">
          <div className="h-11 w-full bg-gradient-to-r from-emerald-700/30 to-teal-700/30 rounded-xl animate-pulse border border-emerald-500/20 shadow-lg"></div>
        </div>

        {/* Mobile - Bottom Icons */}
        <div className="flex lg:hidden justify-around items-center pt-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-10 h-10 bg-white/5 rounded-full animate-pulse border border-white/10 shadow-sm"
            ></div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBarSkeletons;