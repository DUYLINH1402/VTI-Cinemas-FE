import "./MemberTabs.modul.scss";
import React from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css"; // Nếu dùng phiên bản Ant Design >= v5
import { UserProfile } from "./ProfileTab/UserProfile";
import MembershipCard from "./MembershipCardTab/MembershipCard";
import BookingHistory from "./BookingHistory/BookingHistory";
import { useNavigate, useLocation } from "react-router-dom";

const { TabPane } = Tabs;

const MemberTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy giá trị activeKey từ query string
  const params = new URLSearchParams(location.search);
  const activeKey = params.get("tab") || "user-profile"; // Mặc định là "user-profile"

  // Xử lý chuyển tab và cập nhật URL
  const handleTabChange = (key) => {
    navigate(`/members?tab=${key}`); // Điều hướng tới URL với tab mới
  };

  const tabItems = [
    {
      key: "user-profile",
      label: "Trang cá nhân",
      children: <UserProfile />,
    },
    {
      key: "membership-card",
      label: "Thẻ thành viên",
      children: <MembershipCard />,
    },
    {
      key: "booking-history",
      label: "Lịch sử đặt vé",
      children: <BookingHistory />,
    },
    {
      key: "vouchers",
      label: "Voucher",
      children: <div>Voucher nội dung</div>,
    },
    {
      key: "vti-points",
      label: "Điểm VTI",
      children: <div>Điểm VTI nội dung</div>,
    },
  ];
  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        className="custom-tabs"
        centered
        items={tabItems}
      />
    </div>
  );
};

export default MemberTabs;
