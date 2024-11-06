import logo from "./../../../assets/image/logo.png";
import "./header.scss";
import { Outlet, Link } from "react-router-dom";

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
                    <div class="dropdown">
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
                    <Link id="home" to="/">
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link id="cinemas" to="/cinemas">
                      Lịch chiếu theo rạp
                    </Link>
                  </li>
                  <li>
                    <Link id="movies" to="/movies">
                      Phim
                    </Link>
                  </li>
                  <li>
                    <Link id="events" to="/events">
                      Tin tức và sự kiện
                    </Link>
                  </li>
                  <li>
                    <Link id="member" to="/member">
                      Thành viên
                    </Link>
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
              <div class="login-actions">
                <Link to="#!" class="btn action-btn">
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
