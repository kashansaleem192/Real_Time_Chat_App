import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../../Skeletons/AuthImagePattern';
import { login } from '../../Store/Slices/auth.Slice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoggingIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">

      {/* LEFT SIDE - FORM (Glassmorphism card) */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Glassmorphism container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-500 hover:shadow-emerald-900/30">

            {/* LOGO & HEADING */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-xl shadow-lg mb-6">
                <MessageSquare className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
              <p className="text-slate-300 mt-3 text-sm md:text-base">Sign in to access your premium experience</p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    name="email"
                    type="email"
                    className="w-full bg-white/10 border border-slate-600/50 rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 hover:border-emerald-600/60"
                    placeholder="you@premium.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/10 border border-slate-600/50 rounded-lg py-3.5 pl-11 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 hover:border-emerald-600/60"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON - Premium gradient */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/50 hover:scale-[1.02] active:scale-95 ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            {/* FOOTER */}
            <div className="text-center mt-8">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link 
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200 underline underline-offset-4" 
                  to="/register"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE PATTERN - Thoda dark premium feel ke liye */}
      <AuthImagePattern 
        title="Premium Access Awaits"
        subtitle="Sign in to unlock exclusive conversations & features"
      />

    </div>
  );
}

export default Login;