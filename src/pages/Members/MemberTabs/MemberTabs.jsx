import "./MemberTabs.modul.scss";
import React from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css"; // Nếu dùng phiên bản Ant Design >= v5
import { UserProfile } from "./ProfileTab/UserProfile";
import MembershipCard from "./MembershipCardTab/MembershipCard";

const { TabPane } = Tabs;

const MemberTabs = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1" className="custom-tabs" centered>
        <TabPane tab="Trang cá nhân" key="1">
          <UserProfile />
        </TabPane>
        <TabPane tab="Thẻ thành viên" key="2">
          <MembershipCard />
        </TabPane>
        <TabPane tab="Lịch sử đặt vé" key="3">
          <div>Lịch sử đặt vé nội dung</div>
        </TabPane>
        <TabPane tab="Voucher" key="4">
          <div>Voucher nội dung</div>
        </TabPane>
        <TabPane tab="Điểm VTI" key="5">
          <div>Điểm VTI nội dung</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MemberTabs;
