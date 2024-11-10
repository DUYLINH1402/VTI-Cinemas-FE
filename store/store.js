// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
