import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home";
import { ErrorPage } from "../Error/ErrorPage";
import { Layout } from "./Layout";
import { Movies } from "../Movies/Movies";
import { Cinemas } from "../Cinemas/Cinemas";

// Create react router dom
const routerPage = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as the main element
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/", // Home page
        element: <Home />,
      },
      {
        path: "/cinemas", // Trang Lịch chiếu theo rạp
        element: <Cinemas />,
      },
      {
        path: "/movies", // Movies page
        element: <Movies />,
      },
    ],
  },
]);

export const RouterPage = () => {
  return (
    <>
      <div>
        <RouterProvider router={routerPage} />
      </div>
    </>
  );
};
