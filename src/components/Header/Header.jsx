import { useEffect } from "react";
import support from "./../../../src/assets/icon/support.jpg";
import top_scroll from "./../../../src/assets/icon/top_scroll.png";
import logo from "./../../../src/assets/image/logo.png";
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";
import React, { useState } from "react";
import LoginModal from "./../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";

export const Header = () => {
  // State để quản lý loại modal hiển thị: null, "login", "register" hoặc "forgotPassword"
  const [modalType, setModalType] = useState(null);

  // Mở các modal tương ứng
  const openLoginModal = () => setModalType("login");
  const openRegisterModal = () => setModalType("register");
  const openForgotPasswordModal = () => setModalType("forgotPassword");
  const closeModal = () => setModalType(null); // Đóng modal

  useEffect(() => {
    // Hiển thị nút cuộn lên đầu khi người dùng cuộn trang
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

    // Sự kiện click để cuộn lên đầu trang khi nhấn nút "scrollToTopBtn"
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
      scrollToTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
  }, []); // Chỉ chạy một lần khi component được mount

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
                {/* Dropdown chọn vị trí rạp */}
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

                {/* Các link điều hướng */}
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
                    to="/member"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Thành viên
                  </NavLink>
                </li>
                {/* Ô tìm kiếm */}
                <li>
                  <input
                    type="text"
                    className="input-search"
                    placeholder="Search"
                  />
                </li>
              </ul>
            </div>

            {/* Phần login ở góc phải */}
            <div className="header-right">
              <div className="login-actions">
                <Link
                  to="#!"
                  className="btn action-btn"
                  onClick={openLoginModal}
                >
                  Đăng nhập
                </Link>
                {/* Hiển thị LoginModal nếu modalType là "login" */}
                {modalType === "login" && (
                  <LoginModal
                    closeModal={closeModal}
                    openRegisterModal={openRegisterModal}
                    openForgotPasswordModal={openForgotPasswordModal} // Truyền hàm mở ForgotPasswordModal vào LoginModal
                  />
                )}
                {/* Hiển thị RegisterModal nếu modalType là "register" */}
                {modalType === "register" && (
                  <RegisterModal
                    closeModal={closeModal}
                    openLoginModal={openLoginModal}
                  />
                )}
                {/* Hiển thị ForgotPasswordModal nếu modalType là "forgotPassword" */}
                {modalType === "forgotPassword" && (
                  <ForgotPasswordModal closeModal={closeModal} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icon hỗ trợ ở góc dưới bên phải */}
      <div className="support__icon">
        <img src={support} alt="Support icon" />
      </div>

      {/* Nút cuộn lên đầu trang */}
      <div className="top__scroll">
        <img id="scrollToTopBtn" src={top_scroll} alt="Top Scroll" />
      </div>

      {/* Outlet để render các route con */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};
