// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP

import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user từ localStorage

  // Nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Nếu vai trò không nằm trong danh sách được phép
  if (!allowedRoles.includes(user.role)) {
    toast.error("Bạn không có quyền truy cập vào trang này!"); // Hiển thị thông báo lỗi
    // console.log("Kiểm tra Role: ", user.role);
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ, render nội dung bên trong
  return children;
};

export default ProtectedRoute;
