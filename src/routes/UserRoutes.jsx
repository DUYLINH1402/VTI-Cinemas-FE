//ROUTES DÀNH CHO USER
import { Home } from "../pages/Home/Home";
import { UserErrorPage } from "../pages/Error/ErrorPage";
import { Layout } from "./../components/Layout/Layout";
import { Movies } from "../pages/Movies/Movies";
import { MovieInf } from "../pages/Movies/MovieInf/MovieInf";
import Members from "../pages/Members/Members";
import { Booking_Seat } from "../pages/Booking_Seat/Booking_Seat";
import { Payment } from "../pages/Payment/Payment";
import ContactPage from "../pages/Contact/ContactPage";
import { Events } from "../pages/Events/Events";

export const UserRoutes = [
  {
    path: "/",
    element: <Layout />, // Use Layout as the main element
    errorElement: <UserErrorPage />,
    children: [
      {
        path: "/", // Home page
        element: <Home />,
      },
      {
        path: "/movies", // Movies page
        element: <Movies />,
      },
      {
        path: "/movieinf/:movie_id", // Trang thông tin phim
        element: <MovieInf />,
      },
      {
        path: "/Members", // Trang thông tin phim
        element: <Members />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/booking_seat/:movie_id",
        element: <Booking_Seat />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/payment/:movie_id",
        element: <Payment />,
      },
    ],
  },
];
