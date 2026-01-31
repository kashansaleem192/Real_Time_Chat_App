import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getSocket } from './lib/socket.io'; 
import { Image, Send, X } from 'lucide-react';
import { sendMessage, pushNewMessage } from './Store/Slices/chatSlice'; 

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(state => state.chat);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type;
    setMedia(file);

    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    } else {
      toast.error("Only videos and photos");
      setMedia(null);
      setMediaPreview(null);
      setMediaType(null);
    }
  };

  const removeMedia = () => {
    if (mediaType === "video" && mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media) return;

    const data = new FormData();
    data.append("text", text.trim());
    if (media) {
      data.append("media", media);
    }
   
    dispatch(sendMessage(data));

    setText("");
    removeMedia();
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        console.log("🔥 SOCKET MESSAGE RECEIVED:", newMessage);
        
       
        dispatch(pushNewMessage(newMessage));
      }
    };

    socket.on("newMessage", handleNewMessage);

 
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser?._id, dispatch]);

  return (
    <div className='p-4 w-full'>
      {mediaPreview && (
        <div className='relative mb-2'>
          {mediaType === "image" ? (
            <img 
              src={mediaPreview} 
              alt="preview" 
              className='w-20 h-20 object-cover rounded-lg border' 
            />
          ) : (
            <video 
              src={mediaPreview} 
              controls 
              className='w-32 h-20 object-cover rounded-lg border' 
            />
          )}
          <button 
            type='button' 
            onClick={removeMedia} 
            className='absolute -top-2 right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder='Type a message...'
            className='w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500'
          />
          <input 
            type="file" 
            accept='image/*,video/*' 
            ref={fileInputRef} 
            className='hidden' 
            onChange={handleMediaChange} 
          />

          <button 
            type='button' 
            onClick={() => fileInputRef.current?.click()} 
            className='hidden sm:flex items-center justify-center w-10 h-10 border rounded-lg'
          >
            <Image size={20} />
          </button>
        </div>

        <button 
          disabled={!text.trim() && !media} 
          type='submit' 
          className='w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50'
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;