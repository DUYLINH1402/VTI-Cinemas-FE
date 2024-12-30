import { useEffect, useState } from "react";
// import { CardPayment } from "../../components/Cards/Cards";
import "./Payment.scss";
import { fetchAccountByEmail } from "../../services/dataService";
import { CardPayment } from "./CardPayment";

export const Payment = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  // const email = user?.email || ""; // Lấy email từ user hoặc trả về chuỗi rỗng nếu không có
  // const [userDetail, setUserDetail] = useState({
  //   name: user.fullname || user.displayName,
  //   email: user.email,
  //   phone: user.phone_number,
  // });
  // useEffect(() => {
  //   const fetchDataAccount = async () => {
  //     try {
  //       const data = await fetchAccountByEmail(email);
  //       setUserDetail(data);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy thông tin người dùng:", error); // Log lỗi nếu có
  //     }
  //   };
  //   fetchDataAccount();
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <>
      <div className="content">
        <CardPayment />
      </div>
    </>
  );
};
