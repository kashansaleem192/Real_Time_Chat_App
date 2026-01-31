import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setOnlineUsers } from './Store/Slices/auth.Slice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";

import { connectSocket, disconnectSocket } from './lib/socket.io';
import { Loader2 } from 'lucide-react';

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth } = useSelector(state => state.auth);

  // 🔹 Get logged-in user
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // 🔹 Socket connection (ONLY online users here)
  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);
    if (!socket) return;

    // 🟢 Online users tracking
    socket.on('getOnlineUsers', (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.off("getOnlineUsers");
      disconnectSocket();
    };
  }, [authUser?._id, dispatch]);

  // 🔄 Loading screen
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
