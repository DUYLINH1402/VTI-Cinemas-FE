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
import PaymentResult from "../pages/Payment/PaymentResult";
import Promotions from "../pages/Promotions/Promotions";
import PromotionDetail from "../pages/Promotions/PromotionDetail";
import PromotionsLayout from "../pages/Promotions/PromotionsLayout";

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
        path: "/members", // Trang thông tin phim
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
        path: "/promotions",
        element: <PromotionsLayout />, // Đặt layout chứa cả danh sách sự kiện và chi tiết sự kiện
        children: [
          {
            path: "", // Mặc định hiển thị danh sách sự kiện
            element: <Promotions />,
          },
          {
            path: ":slug", // Khi vào một sự kiện cụ thể
            element: <PromotionDetail />,
          },
        ],
      },

      {
        path: "/payment/:movie_id",
        element: <Payment />,
      },
      {
        path: "/payment-result",
        element: <PaymentResult />,
      },
    ],
  },
];
