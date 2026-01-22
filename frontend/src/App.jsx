import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setOnlineUsers } from './Store/Slices/auth.Slice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css"
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import { connectSocket, disconnectSocket } from './lib/socket.io';

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth } = useSelector(state => state.auth);

  // Fetch authenticated user on mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Handle socket connection for online users
  useEffect(() => {
    if (!authUser) return;

    const socket = connectSocket(authUser._id);

    socket.on('getOnlineUsers', (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => disconnectSocket(); // disconnect on unmount or user logout
  }, [authUser, dispatch]);

  // Loading screen while checking auth
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
     
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={authUser ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path='/register' 
            element={authUser ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path='/login' 
            element={authUser ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path='/profile' 
            element={authUser ? <Profile /> : <Navigate to="/login" />} 
          />
        </Routes>
    
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
      />
    </>
  );
};

export default App;
