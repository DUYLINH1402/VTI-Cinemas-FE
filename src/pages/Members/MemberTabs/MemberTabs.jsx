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

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        className="custom-tabs"
        centered
      >
        <TabPane tab="Trang cá nhân" key="user-profile">
          <UserProfile />
        </TabPane>
        <TabPane tab="Thẻ thành viên" key="membership-card">
          <MembershipCard />
        </TabPane>
        <TabPane tab="Lịch sử đặt vé" key="booking-history">
          <BookingHistory />
        </TabPane>
        <TabPane tab="Voucher" key="vouchers">
          <div>Voucher nội dung</div>
        </TabPane>
        <TabPane tab="Điểm VTI" key="vti-points">
          <div>Điểm VTI nội dung</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MemberTabs;
