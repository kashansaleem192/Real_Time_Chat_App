import React from 'react';
import { LogOut, MessageSquare, User } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../Store/Slices/auth.Slice';
import { disconnectSocket } from '../../lib/socket.io';

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    disconnectSocket();   // 🔥 important
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-emerald-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Premium gradient */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:shadow-emerald-700/60 transition-shadow duration-300">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
              WhyApp
            </h1>
          </Link>

          {/* User Actions - Only when logged in */}
          {authUser && (
            <div className="flex items-center gap-4 sm:gap-6">

              {/* Online indicator - Glow effect */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping"></span>
                  <span className="relative w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-900/40"></span>
                </div>
                <span className="text-sm font-medium text-emerald-300/90 hidden sm:block">
                  Online
                </span>
              </div>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 hover:border-red-700/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;