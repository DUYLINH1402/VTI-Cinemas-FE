import logo from "./../../../assets/image/logo.png";
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";

export const Header = () => {
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
              {/* <p className="title">VTI Cinemas</p> */}
            </div>
            {/* Navigation */}
            <div className="header-center">
              <div>
                <ul className="header__nav">
                  <li>
                    <div className="dropdown">
                      <select id="rap" name="rap">
                        <option>Chọn vị trí rạp</option>
                        <hr />
                        <option value="rap1">Miền Bắc</option>
                        <hr />
                        <option value="rap2">Miền Trung</option>
                        <hr />
                        <option value="rap3">Miền Nam</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    {/* Khi NavLink trỏ đến /movies và người dùng đang ở URL /movies, 
                    isActive sẽ là true, và className sẽ nhận giá trị "active", giúp áp dụng lớp CSS active.
                    Nếu người dùng đang ở URL khác không phải /movies, 
                    isActive sẽ là false, và className sẽ là "" (không có lớp CSS nào được áp dụng). */}
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
                  {/* Search Input */}
                  <li>
                    <input
                      type="text"
                      className="input-search"
                      placeholder="Search"
                    />
                  </li>
                </ul>
              </div>
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

      <div id="detail">
        {/* Outlet sẽ hiển thị ra children bên phần routerHome*/}
        <Outlet />
      </div>
    </>
  );
};
