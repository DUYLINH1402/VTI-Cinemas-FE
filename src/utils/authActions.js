import { logout } from "../../store/authSlice";

export const handleLogout = (dispatch) => {
  dispatch(logout());
};
