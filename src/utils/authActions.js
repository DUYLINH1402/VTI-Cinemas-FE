import { logout } from "../../store/authSlice";
import { toast } from "react-toastify";
import { getDatabase, ref, set } from "firebase/database";
import { Navigate, useNavigate } from "react-router-dom";

export const handleLogout = (dispatch) => {
  // Xóa token khỏi LocalStorage
  localStorage.removeItem("authToken");

  // Cập nhật Redux state
  dispatch(logout());
  toast.warning("Bạn đã đăng xuất tài khoản!");
  Navigate("/");
};

export const saveUserToDatabase = (user) => {
  const db = getDatabase();
  const userRef = ref(db, `Account/${user.uid}`);

  set(userRef, {
    uid: user.uid,
    email: user.email,
    fullname: user.displayName,
    avatar_url: user.photoURL,
    lastLoginAt: new Date().toISOString(),
  })
    .then(() => {
      console.log("Dữ liệu người dùng đã được lưu thành công!");
    })
    .catch((error) => {
      console.error("Lỗi khi lưu dữ liệu người dùng:", error);
    });
};
