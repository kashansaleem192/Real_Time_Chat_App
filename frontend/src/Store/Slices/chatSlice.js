import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import { User } from 'lucide-react'
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';




export const getUsers = createAsyncThunk('chat/getUsers', async (_,thunkAPI) => {
    try{
        const response = await axiosInstance.get('/message/users');
        return response.data.users;
    }catch(error){
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const getMessages = createAsyncThunk('chat/getMessages', async (userId, thunkAPI) => {
    try{
        const response = await axiosInstance.get(`/message/${userId}`);             
        return response.data;
    }catch(error){
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const { chat } = thunkAPI.getState();   // 🔥 FIX
      const res = await axiosInstance.post(
        `/message/send/${chat.selectedUser._id}`,
        messageData
      );
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const ChatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isSendingMessage: false, // ✅ New state for sending status
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        pushNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearMessages: (state) => { // ✅ Optional: messages clear karne ke liye
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // getUsers cases
            .addCase(getUsers.pending, (state) => {
                state.isUsersLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isUsersLoading = false;
            })
            .addCase(getUsers.rejected, (state) => {
                state.isUsersLoading = false;
            })
            
            // getMessages cases
            .addCase(getMessages.pending, (state) => {
                state.isMessagesLoading = true;
                state.messages = []; // ✅ Optional: pehle messages clear karein
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messages = action.payload.message; // ✅ Server se "message" key mein aata hai
                state.isMessagesLoading = false;
            })
            .addCase(getMessages.rejected, (state) => {
                state.isMessagesLoading = false;
            })
            
            // sendMessage cases
            .addCase(sendMessage.pending, (state) => {
                state.isSendingMessage = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSendingMessage = false;
                
                // ✅ Server se direct message object aa raha hai
                if (action.payload) {
                    state.messages.push(action.payload);
                }
            })
            .addCase(sendMessage.rejected, (state) => {
                state.isSendingMessage = false;
            });
    }
});

export const {setSelectedUser , pushNewMessage} = ChatSlice.actions
export default ChatSlice.reducer