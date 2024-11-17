import MemberTabs from "./MemberTabs/MemberTabs";
import "./Members.modul.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Members = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập hoặc trang chủ
      // Nên sử dụng Token hơn là Trạng thái isLoggedIn trong Redux
      navigate("/");
    }
  }, [token]);
  return (
    <div className="content">
      <div> {token ? <MemberTabs /> : navigate("/")}</div>
    </div>
  );
};

export default Members;
