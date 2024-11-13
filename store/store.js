// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";

// Tạo store chính cho ứng dụng, kết hợp các reducer
const store = configureStore({
  // Khai báo reducer của auth (xử lý trạng thái authentication)
  reducer: {
    auth: authReducer, // Sử dụng authReducer từ authSlice để quản lý auth state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tuần tự hóa
    }),
});

// Xuất store để sử dụng trong toàn bộ ứng dụng
export default store;
