import { createBrowserRouter, RouterProvider } from "react-router-dom";
// `createBrowserRouter` dùng để tạo router với cấu hình route cụ thể.
// `RouterProvider` cung cấp context cho ứng dụng để sử dụng routing.

import { UserRoutes } from "./UserRoutes"; // Import các route dành cho người dùng (User)
import { AdminRoutes } from "./AdminRoutes"; // Import các route dành cho quản trị viên (Admin)

// Kết hợp tất cả các routes (UserRoutes và AdminRoutes) vào một router duy nhất
const routerPage = createBrowserRouter([...UserRoutes, ...AdminRoutes]);

// Component RouterPage
export const RouterPage = () => {
  return (
    <>
      {/* Bao bọc RouterProvider để cung cấp router cho toàn bộ ứng dụng */}
      <div>
        <RouterProvider router={routerPage} />
      </div>
    </>
  );
};
