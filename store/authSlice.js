// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginWithGoogle } from "../src/services/authService";

// Async actions cho các chức năng đăng ký và đăng nhập
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }) => {
    const response = await register(email, password);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    const response = await login(email, password);
    return response.user;
  }
);

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  const response = await loginWithGoogle();
  return response.user;
});

export const facebookLogin = createAsyncThunk(
  "auth/facebookLogin",
  async () => {
    const response = await loginWithFacebook();
    return response.user;
  }
);

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, status: "idle", error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log("User data after Google login:", action.payload);
      })
      .addCase(facebookLogin.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
