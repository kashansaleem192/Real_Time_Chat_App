import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.Slice";
import chatReducer from "./chatSlice";

const store = configureStore({
    reducer: {
       auth: authReducer,
       chat : chatReducer,
    },
});

export default store;
