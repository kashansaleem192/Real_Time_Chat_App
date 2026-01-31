import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket.io";
import { toast } from "react-toastify";

// ----------------- GET CURRENT USER -----------------
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/users/me");
      // Connect socket with userId
      connectSocket(res.data.user._id);
      return res.data.user;
    } catch (err) {
      console.log("Error in fetching auth user:", err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ----------------- LOGIN -----------------
export const login = createAsyncThunk(
  "user/sign-in",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/users/sign-in", data);
      // Connect socket after successful login
      connectSocket(res.data);
      toast.success("Logged in successfully");
      return res.data; // store logged-in user
    } catch (err) {
      toast.error(err.response?.data?.message || "Error in logging in");
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

// ----------------- LOGOUT -----------------
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/users/sign-out");
      disconnectSocket();
      toast.success("Logged out successfully");
      return null;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error in logging out");
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const signup  = createAsyncThunk(
  "auth/sign-up",
  async (data, thunkAPI) => {
    try{
      const res = await axiosInstance.post("/users/sign-up" , data);
      connectSocket(res.data._id);
      toast.success("Account created successfully");
      return res.data;
    }catch(err){
      
      toast.error(err.response?.data?.message || "Error in signing up");
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
)

// ----------------- AUTH SLICE -----------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUP: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],
  },
  reducers: {
    // For realtime online users
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET USER
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
        state.onlineUsers = [];
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = null;
        state.onlineUsers = [];
      }).addCase(signup.pending, (state) => {
        state.isSigningUP = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUP = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUP = false;
      });
  },
});

// ----------------- EXPORTS -----------------
export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
