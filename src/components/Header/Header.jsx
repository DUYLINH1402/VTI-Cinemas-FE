import { useEffect } from "react";
import support from "./../../../src/assets/icon/support.jpg";
import top_scroll from "./../../../src/assets/icon/top_scroll.png";
import logo from "./../../../src/assets/image/logo.png";
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";

export const Header = () => {
  useEffect(() => {
    // Hiển thị nút khi người dùng cuộn xuống
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

    // Sự kiện click để cuộn lên đầu trang
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
            {/* header-left */}
            <div className="header-left">
              <Link to="/">
                <img className="header-logo" src={logo} alt="logo" />
              </Link>
            </div>
            {/* Navigation */}
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
                    to="/member"
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
            {/* header-right */}
            <div className="header-right">
              <div className="login-actions">
                <Link to="#!" className="btn action-btn">
                  Đăng nhập
                </Link>
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
