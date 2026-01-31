import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages, pushNewMessage } from '../../Store/Slices/chatSlice';
import { getSocket } from "../../lib/socket.io";
import ChatHeader from '../../ChatHeader';
import MessageSkeletons from '../../Skeletons/MessageSkeletons';
import MessageInput from '../../MessageInput';

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    dispatch(getMessages(selectedUser._id));
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    if (newSocket && selectedUser?._id) {
      newSocket.emit("joinRoom", selectedUser._id);
      
      newSocket.on("newMessage", (message) => {
        if (
          message.senderId === selectedUser._id || 
          message.recevierId === selectedUser._id  // typo fix: receiverId
        ) {
          dispatch(pushNewMessage(message));
        }
      });

      newSocket.on("messageRead", (data) => {
        console.log("Message read:", data);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.off("newMessage");
        newSocket.off("messageRead");
        // newSocket.disconnect(); // Comment if you want persistent socket
      }
    };
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  }

  function formatDate(date) {
    const d = new Date(date);
    const today = new Date().toDateString();
    if (d.toDateString() === today) return "Today";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  const groupMessagesByDate = () => {
    const groups = {};
    messages?.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 to-emerald-950">
        <ChatHeader />
        <div className="flex-1 overflow-auto p-4">
          <MessageSkeletons />
        </div>
        <MessageInput />
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-emerald-700/50 scrollbar-track-transparent">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <div className="text-6xl mb-6 opacity-80">💬</div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Start chatting with {selectedUser?.name || 'this user'}
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              Send a message and begin your conversation. Premium connections await!
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator - Glass pill */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-5 py-2 rounded-full text-xs font-medium text-emerald-300 shadow-lg">
                  {formatDate(date)}
                </div>
              </div>
              
              {msgs.map((message, index) => {
                const isSender = message.senderId === authUser._id;
                const isLastMessage = index === msgs.length - 1;
                
                return (
                  <div 
                    key={message._id} 
                    className={`flex items-end gap-3 mb-5 animate-fadeIn ${isSender ? 'justify-end' : 'justify-start'}`}
                    ref={isLastMessage ? messageEndRef : null}
                  >
                    {/* Receiver Avatar */}
                    {!isSender && (
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg shrink-0">
                        <img 
                          src={selectedUser?.avatar?.url || './avatar.png'} 
                          alt="avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Message Bubble - Glassmorphism */}
                    <div 
                      className={`max-w-[75%] md:max-w-[60%] px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-200 hover:shadow-2xl ${
                        isSender 
                          ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/40 text-white rounded-br-none'
                          : 'bg-white/8 border-white/10 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {/* Media */}
                      {message.media && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-md">
                          {message.media.match(/\.(mp4|mov|webm)$/i) ? (
                            <video 
                              src={message.media} 
                              controls 
                              className="w-full max-h-80 object-cover"
                            />
                          ) : (
                            <img 
                              src={message.media} 
                              alt="Attachment" 
                              className="w-full max-h-80 object-cover"
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Text */}
                      {message.text && (
                        <p className={`text-[15px] leading-relaxed ${message.media ? 'mt-1' : ''}`}>
                          {message.text}
                        </p>
                      )}
                      
                      {/* Time + Read Receipt */}
                      <div className={`flex items-center gap-2 text-xs mt-2 opacity-80 ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatMessageTime(message.createdAt)}</span>
                        {isSender && message.read && (
                          <span className="text-emerald-300">✓✓</span>
                        )}
                        {isSender && !message.read && (
                          <span className="text-slate-400">✓</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sender Avatar */}
                    {isSender && (
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg shrink-0">
                        <img 
                          src={authUser?.avatar?.url || './avatar.png'} 
                          alt="avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      
      <MessageInput />
    </div>
  );
};

export default ChatContainer;