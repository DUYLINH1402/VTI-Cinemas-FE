import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { ErrorPage } from "../pages/Error/ErrorPage";
import { Layout } from "./../components/Layout/Layout";
import { Movies } from "../pages/Movies/Movies";
import { Cinemas } from "../pages/Cinemas/Cinemas";
import { MovieInf } from "../pages/Movies/MovieInf/MovieInf";

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
      {
        path: "/movieinf", // Trang thông tin phim
        element: <MovieInf />,
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
