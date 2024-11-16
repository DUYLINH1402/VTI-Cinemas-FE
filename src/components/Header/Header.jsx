import { useEffect, useState } from "react";
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

export const Header = () => {
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const isLoggedIn = auth.isLoggedIn || false;
  const user = auth.user;
  const [error, setError] = useState("");
  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const openForgotPasswordModal = () => setModalType("forgotPassword");
  const closeModal = () => {
    setError(""); // Reset lỗi
    dispatch(resetError()); // Reset lỗi trong Redux
    setModalType(null);
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
    handleLogout(dispatch); // Truyền dispatch vào handleLogout
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
                  <div className="dropdown">
                    <select id="rap" name="rap">
                      <option>Chọn vị trí rạp</option>
                      <optgroup label="Miền Bắc">
                        <option value="hanoi">VTI Hà Nội Cinema</option>
                        <option value="thanglong">VTI Thăng Long Movie</option>
                        <option value="royalhanoi">
                          VTI Royal Hanoi Theater
                        </option>
                        <option value="westlake">VTI West Lake Cinema</option>
                        <option value="redriver">
                          VTI Red River Film House
                        </option>
                      </optgroup>
                      <optgroup label="Miền Trung">
                        <option value="danang">VTI Đà Nẵng Star Cinema</option>
                        <option value="hue">VTI Huế Heritage Cinema</option>
                        <option value="donghoi">
                          VTI Đồng Hới Film Center
                        </option>
                        <option value="nhatrang">
                          VTI Nha Trang Sun Theater
                        </option>
                        <option value="pleiku">VTI Pleiku Movies</option>
                      </optgroup>
                      <optgroup label="Miền Nam">
                        <option value="saigon">VTI Sài Gòn Film House</option>
                        <option value="mekong">VTI Mekong Movie Center</option>
                        <option value="vungtau">
                          VTI Vũng Tàu Ocean Cinema
                        </option>
                        <option value="cantho">
                          VTI Cần Thơ Riverside Theater
                        </option>
                        <option value="bienhoa">VTI Biên Hòa Galaxy</option>
                      </optgroup>
                    </select>
                  </div>
                </li>

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
                    to="/cinemas"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Lịch chiếu theo rạp
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
                  >
                    Thành viên
                  </NavLink>
                </li>
                <li>
                  <input
                    type="text"
                    className="input-search"
                    placeholder="Search"
                  />
                </li>
              </ul>
            </div>

            {/* Phần login hoặc thông tin người dùng ở góc phải */}
            <div className="header-right">
              <div className="login-actions">
                {isLoggedIn && user ? (
                  // Nếu người dùng đã đăng nhập, hiển thị avatar với Dropdown
                  <Dropdown
                    overlay={userMenu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div
                      className="user-info"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="user-name">{user.displayName}</span>
                      <Avatar
                        src={user.imageUrl || user.photoURL}
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
