import React, { useEffect, useState } from "react";
import support from "./../../../src/assets/icon/support.jpg";
import top_scroll from "./../../../src/assets/icon/top_scroll.png";
import logo from "./../../../src/assets/image/logo.png";
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../../utils/authActions";
import { Dropdown, Menu, Avatar } from "antd";
import LoginModal from "./../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
import { resetError } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { searchDataService } from "../../services/dataService";
import { searchMovies } from "../../../store/searchSlice";

export const Header = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user;
  const [error, setError] = useState("");
  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const openForgotPasswordModal = () => setModalType("forgotPassword");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const closeModal = () => {
    setError(""); // Reset lỗi
    dispatch(resetError()); // Reset lỗi trong Redux
    setModalType(null);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Quản lý trạng thái tìm kiếm

  // Hàm xử lý tìm kiếm từ SearchBar
  const handleSearch = async (query) => {
    // Xử lý khi từ khóa rỗng
    if (!query || query.trim() === "") {
      dispatch(searchMovies([])); // Gửi từ khóa trống nếu không có nội dung
      return;
    }
    dispatch(searchMovies(query.trim())); // Gửi từ khóa tìm kiếm

    try {
      const results = searchMovies(query.trim());
      dispatch(setSearchResults(results)); // Cập nhật kết quả tìm kiếm
    } catch (error) {
      console.error("Error in handleSearch:", error);
      dispatch(setSearchResults([])); // Reset kết quả nếu có lỗi
    }
  };

  useEffect(() => {
    window.onscroll = function () {
      const scrollToTopBtn = document.getElementById("scrollToTopBtn");
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    };

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
      scrollToTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }, []);
  const onLogout = () => {
    localStorage.removeItem("authToken");
    handleLogout(dispatch); // Truyền dispatch vào handleLogout
  };
  const handleMemberClick = (token, setModalType) => {
    if (token) {
      // Nếu đã đăng nhập, chuyển đến trang /members
      navigate("/Members");
    } else {
      // Nếu chưa đăng nhập, mở modal đăng nhập
      openLoginModal();
    }
  };
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/members">Trang cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/settings">Cài đặt</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="navbar">
        <div className="nav-content">
          <div className="header" id="header">
            {/* Phần logo ở góc trái của header */}
            <div className="header-left">
              <Link to="/">
                <img className="header-logo" src={logo} alt="logo" />
              </Link>
            </div>

            {/* Navigation trung tâm */}
            <div className="header-center">
              <ul className="header__nav">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Trang chủ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/movies"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Phim
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Tin tức và sự kiện
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/members"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
                      handleMemberClick(token, setModalType);
                    }}
                  >
                    Thành viên
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Liên hệ
                  </NavLink>
                </li>
                <li>
                  <SearchBar onSearch={handleSearch} />
                </li>
              </ul>
            </div>

            {/* Phần login hoặc thông tin người dùng ở góc phải */}
            <div className="header-right">
              <div className="login-actions">
                {isLoggedIn && user ? (
                  // Nếu người dùng đã đăng nhập, hiển thị avatar với Dropdown
                  <Dropdown
                    menu={userMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div
                      className="user-info"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="user-name">
                        {user.fullname || user.displayName}
                      </span>
                      <Avatar
                        src={user.avatar_url || user.photoURL}
                        alt="User Avatar"
                      />
                    </div>
                  </Dropdown>
                ) : (
                  // Nếu người dùng chưa đăng nhập, hiển thị nút Đăng nhập
                  <Link
                    to="#!"
                    className="btn action-btn"
                    onClick={openLoginModal}
                  >
                    Đăng nhập
                  </Link>
                )}

                {modalType === "login" && (
                  <LoginModal
                    closeModal={closeModal}
                    openRegisterModal={openRegisterModal}
                    openForgotPasswordModal={openForgotPasswordModal}
                  />
                )}
                {modalType === "register" && (
                  <RegisterModal
                    closeModal={closeModal}
                    openLoginModal={openLoginModal}
                  />
                )}
                {modalType === "forgotPassword" && (
                  <ForgotPasswordModal closeModal={closeModal} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="support__icon">
        <img src={support} alt="Support icon" />
      </div>

      <div className="top__scroll">
        <img id="scrollToTopBtn" src={top_scroll} alt="Top Scroll" />
      </div>

      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};
