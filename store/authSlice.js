// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  loginWithFacebook,
} from "../src/services/authService";

// Async actions cho các chức năng đăng ký và đăng nhập
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await registerWithEmailAndPassword(email, password);
      console.log("registerUser Ok");
      return response.user;
    } catch (error) {
      return rejectWithValue(error.code); // Trả về mã lỗi từ Firebase nếu thất bại
    }
  }
);

// Async actions cho các chức năng đăng ký và đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginWithEmailAndPassword(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Async action đăng nhập bằng Google
export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  const response = await loginWithGoogle();
  return response;
});

// Async action đăng nhập bằng Facebook
export const facebookLogin = createAsyncThunk(
  "auth/facebookLogin",
  async () => {
    const response = await loginWithFacebook();
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null,
    isLoggedIn: false, // Trạng thái đăng nhập
  },
  reducers: {
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("authToken"); // Xóa token khỏi local storage
      localStorage.removeItem("user"); // Xóa thông tin user khỏi localStorage nếu có
      state.error = null;
    },
    // Action setAuth để thiết lập trạng thái đăng nhập
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng nhập bằng email/password thành công
      .addCase(loginUser.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1731338363/avata-null_s9l4wy.jpg",
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        localStorage.setItem("authToken", accessToken); // Lưu token vào localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Đăng nhập bằng Google thành công
      .addCase(googleLogin.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1731338363/avata-null_s9l4wy.jpg",
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        localStorage.setItem("authToken", accessToken); // Lưu token vào localStorage
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Đăng nhập bằng Facebook thành công
      .addCase(facebookLogin.fulfilled, (state, action) => {
        const { uid, email, displayName, photoURL, accessToken } =
          action.payload;
        state.user = {
          uid,
          email,
          displayName,
          imageUrl:
            photoURL ||
            "https://res.cloudinary.com/ddia5yfia/image/upload/v1731338363/avata-null_s9l4wy.jpg",
        };
        state.token = accessToken;
        state.isLoggedIn = true;
        state.error = null;
        localStorage.setItem("authToken", accessToken); // Lưu token vào localStorage
      })
      .addCase(facebookLogin.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Xử lý khi đăng ký thành công
      .addCase(registerUser.fulfilled, (state, action) => {
        const { email, displayName } = action.payload;
        state.user = { email, displayName };
        state.isLoggedIn = true;
        state.error = null; // Xóa lỗi nếu đăng ký thành công
      })
      .addCase(registerUser.rejected, (state, action) => {
        // Kiểm tra xem action.payload có tồn tại không
        state.error = action.payload || "Đã xảy ra lỗi khi đăng ký";
      });
  },
});

// Xuất action logout để có thể sử dụng trong các component
export const { logout, setAuth } = authSlice.actions;

// Xuất reducer để thêm vào store chính của ứng dụng
export default authSlice.reducer;
