// ROUTES DÀNH CHO ADMIN
// Đây là định nghĩa các route dành riêng cho phần quản trị (admin)

import React from "react";
import ProtectedRoute from "./ProtectedRoute"; // Component dùng để bảo vệ các route
import AdminApp from "../admin/AdminApp"; // Component layout chính cho phần admin
import AdminDashboard from "../admin/pages/AdminDashboard"; // Trang tổng quan cho admin
import TheaterManagement from "../admin/pages/CinemaManangenment/TheaterManagement"; // Trang quản lý rạp
import { AdminErrorPage } from "../pages/Error/ErrorPage"; // Trang hiển thị khi gặp lỗi
import MovieManagement from "../admin/pages/MovieManagement/MovieManagement";

// Định nghĩa các route cho phần admin
export const AdminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute
        allowedRoles={["admin", "manager"]}
        redirectPath="/error-admin" // Điều hướng đến trang lỗi admin
      >
        <AdminApp />
      </ProtectedRoute>
    ),
    errorElement: <AdminErrorPage />, // Trang lỗi dành riêng cho admin
    children: [
      {
        path: "dashboard", // Route cho trang Dashboard
        element: <AdminDashboard />, // Component hiển thị
        label: "Trang chủ", // Label hiển thị trong Breadcrumbs hoặc menu
      },
      {
        path: "theaters", // Route menu cha cho "Quản lý rạp phim"
        label: "Quản lý rạp phim", // Label menu
        parent: "/admin/dashboard", // Breadcrumbs parent của route này
        // Không có `element` vì đây chỉ là menu cha, không hiển thị nội dung
      },
      {
        path: "theaters/list", // Route con của "Quản lý rạp phim"
        element: <TheaterManagement />, // Component hiển thị cho "Danh sách rạp"
        label: "Danh sách rạp", // Label hiển thị
        parent: "/admin/theaters", // Breadcrumbs parent là "Quản lý rạp phim"
      },
      {
        path: "movies", // Route menu cha cho "Quản lý rạp phim"
        label: "Quản lý phim", // Label menu
        parent: "/admin/dashboard", // Breadcrumbs parent của route này
        // Không có `element` vì đây chỉ là menu cha, không hiển thị nội dung
      },
      {
        path: "movies/list",
        element: <MovieManagement />,
        label: "Danh sách phim",
        parent: "/admin/movies",
      },
    ],
  },
];
