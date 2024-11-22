import "./App.scss";
import { RouterPage } from "./routes/AppRoutes";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import { setAuth } from "../store/authSlice"; // Import setAuth để thiết lập auth từ token
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
      <RouterPage />
      <ToastContainer />
    </Provider>
  );
}

function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra authToken từ localStorage khi ứng dụng tải lên
    const token = localStorage.getItem("authToken");
    if (token) {
      // Có thể lấy lại user từ token hoặc localStorage
      const user = JSON.parse(localStorage.getItem("user")) || null;
      dispatch(setAuth({ user, token })); // Gọi setAuth để cập nhật Redux state
    }
  }, [dispatch]);

  return null;
}

export default App;
