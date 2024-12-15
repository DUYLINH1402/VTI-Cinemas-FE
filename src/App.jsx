import "./App.scss";
import { RouterPage } from "./routes/AppRoutes";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import { setAuth } from "../store/authSlice"; // Import setAuth để thiết lập auth từ token
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "./utils/authStorage";

function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
      <RouterPage />
      {/* <ToastContainer /> */}
    </Provider>
  );
}

function AppInitializer() {
  const dispatch = useDispatch();
  const token = getAuthToken();

  useEffect(() => {
    // Kiểm tra authToken từ localStorage khi ứng dụng tải lên
    if (token) {
      // console.log("Token đã được lấy khi khởi động:", token);
      // Có thể lấy lại user từ token hoặc localStorage
      const user = JSON.parse(localStorage.getItem("user")) || null;
      dispatch(setAuth({ user, token })); // Gọi setAuth để cập nhật Redux state
    } else {
      // console.warn("Không tìm thấy token khi khởi động ứng dụng");
    }
  }, [dispatch]);

  return null;
}

export default App;
