import { logout } from "../../store/authSlice";

export const handleLogout = (dispatch) => {
  // Xóa token khỏi LocalStorage
  localStorage.removeItem("authToken");

  // Cập nhật Redux state
  dispatch(logout());
};
