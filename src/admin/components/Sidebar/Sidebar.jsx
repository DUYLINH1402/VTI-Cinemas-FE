import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  Home,
  ExpandLess,
  ExpandMore,
  Movie,
  TheaterComedy,
  Event,
  AttachMoney,
  Support,
  CalendarToday,
  Schedule,
  CreditCard,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.modul.scss";
import logo from "../../../assets/image/logo.png";

const Sidebar = () => {
  // State để quản lý trạng thái mở/đóng các menu dropdown
  const [openMenus, setOpenMenus] = React.useState({});
  const location = useLocation(); // Lấy thông tin URL hiện tại

  // Hàm toggle dropdown
  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Hàm kiểm tra xem URL có khớp với route của một item không
  const isActive = (path) => location.pathname.includes(path);
  return (
    <div>
      <Drawer
        className="content"
        variant="permanent" // Sidebar luôn hiển thị cố định (không ẩn đi).
        //Sử dụng CSS-in-JS của Material-UI để tùy chỉnh CSS cho Sidebar
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "rgba(22, 10, 95, 0.2)",
          },
        }}
      >
        <List>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          {/* Trang chủ */}
          <ListItem
            button
            component={Link}
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "sidebar-active" : ""}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
          {/* Quản lý rạp phim */}
          <ListItem button onClick={() => toggleMenu("cinema")}>
            <ListItemIcon>
              <TheaterComedy />
            </ListItemIcon>
            <ListItemText primary="Quản lý rạp phim" />
            {/* ExpandLess và ExpandMore Hiển thị icon mũi tên chỉ lên hoặc xuống, tùy theo trạng thái. */}
            {openMenus.cinema ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.cinema} timeout="auto" unmountOnExit>
            {/* Hiển thị danh sách các mục con.  disablePadding: Loại bỏ khoảng cách padding mặc định */}
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="theaters/list"
                className={isActive("theaters/list") ? "sidebar-active" : ""}
              >
                <ListItemText inset primary="Danh sách rạp" />
              </ListItem>
            </List>
          </Collapse>
          {/* Quản lý phim */}
          <ListItem button onClick={() => toggleMenu("movies")}>
            <ListItemIcon>
              <Movie />
            </ListItemIcon>
            <ListItemText primary="Quản lý phim" />
            {openMenus.movies ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.movies} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="movies/list"
                className={isActive("movies/list") ? "sidebar-active" : ""}
              >
                <ListItemText inset primary="Danh sách phim" />
              </ListItem>
            </List>
          </Collapse>
          {/* Quản lý phòng chiếu */}
          <ListItem button onClick={() => toggleMenu("rooms")}>
            <ListItemIcon>
              <Schedule />
            </ListItemIcon>
            <ListItemText primary="Quản lý phòng chiếu" />
            {openMenus.rooms ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.rooms} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="admin/rooms"
                className={isActive("admin/rooms") ? "sidebar-active" : ""}
              >
                <ListItemText inset primary="Danh sách phòng chiếu" />
              </ListItem>
              <ListItem button component={Link} to="/admin/add-room">
                <ListItemText inset primary="Thêm phòng chiếu" />
              </ListItem>
            </List>
          </Collapse>
          {/* Quản lý vé */}
          <ListItem button component={Link} to="/admin/tickets">
            <ListItemIcon>
              <CreditCard />
            </ListItemIcon>
            <ListItemText primary="Quản lý vé" />
          </ListItem>
          {/* Quản lý lịch chiếu */}
          <ListItem button onClick={() => toggleMenu("schedules")}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Quản lý lịch chiếu" />
            {openMenus.schedules ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.schedules} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/admin/schedules"
                className={isActive("admin/schedules") ? "asidebar-ctive" : ""}
              >
                <ListItemText inset primary="Danh sách lịch chiếu" />
              </ListItem>
              <ListItem button component={Link} to="/admin/add-schedule">
                <ListItemText inset primary="Thêm lịch chiếu" />
              </ListItem>
            </List>
          </Collapse>
          {/* Phân cách */}
          <hr />
          {/* Quản lý doanh thu */}
          <ListItem button component={Link} to="/admin/revenue">
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Quản lý doanh thu" />
          </ListItem>
          {/* Quản lý sự kiện */}
          <ListItem button component={Link} to="/admin/events">
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Quản lý sự kiện" />
          </ListItem>
          {/* Quản lý tài khoản */}
          <ListItem button component={Link} to="/admin/accounts">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Quản lý tài khoản" />
          </ListItem>
          {/* Quản lý thanh toán */}
          <ListItem button component={Link} to="/admin/payments">
            <ListItemIcon>
              <CreditCard />
            </ListItemIcon>
            <ListItemText primary="Quản lý thanh toán" />
          </ListItem>
          {/* Quản lý hỗ trợ */}
          <ListItem button component={Link} to="/admin/support">
            <ListItemIcon>
              <Support />
            </ListItemIcon>
            <ListItemText primary="Quản lý hỗ trợ" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
