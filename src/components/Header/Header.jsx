import React, { useEffect, useState } from "react";
import support from "./../../../src/assets/icon/support.jpg";
import top_scroll from "./../../../src/assets/icon/top_scroll.png";
import logo from "./../../../src/assets/image/logo.png";
import "./header.scss";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../../utils/authActions";
import { Dropdown, Avatar } from "antd";
import LoginModal from "./../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";
import { resetError, setAuth } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { searchMovies } from "../../../store/searchSlice";
import { getAuthToken, removeAuthToken } from "../../utils/authStorage";
import GuideModal from "../GuideModal/GuideModal";
import { getAuth } from "firebase/auth";
import MobileSidebar from "./MobileSidebar";

export const Header = () => {
  const token = getAuthToken();
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
  const [loading, setLoading] = useState(false);

  // STATE HIỂN THỊ TOGGLER CHO MOBILE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setError(""); // Reset lỗi
    dispatch(resetError()); // Reset lỗi trong Redux
    setModalType(null);
  };

  const [searchResults, setSearchResults] = useState([]);

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

  // useEffect để cập nhật thông tin người dùng mỗi khi đăng nhập/đăng xuất
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const authInstance = getAuth();
          await authInstance.currentUser?.reload(); // Cập nhật dữ liệu mới nhất từ Firebase
          const updatedUser = authInstance.currentUser;
          // Kiểm tra nếu updatedUser là null thì không làm gì cả
          if (!updatedUser) {
            console.warn("User is null after reload, retrying in 2 seconds...");
            setTimeout(fetchUserData, 2000); // Thử lại sau 2 giây
            return;
          }
          // Dispatch cập nhật Redux store với dữ liệu mới
          dispatch(
            setAuth({
              user: {
                uid: updatedUser.uid,
                email: updatedUser.email || "", // Tránh lỗi khi email bị undefined
                displayName: updatedUser.displayName || "Người dùng",
                photoURL: updatedUser.photoURL || "",
              },
              token: await updatedUser.getIdToken(),
            })
          );
        } catch (error) {
          console.error("Lỗi khi cập nhật thông tin user:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [isLoggedIn, dispatch]); // Chạy lại mỗi khi trạng thái đăng nhập thay đổi

  useEffect(() => {
    // Hàm xử lý sự kiện cuộn
    const handleScroll = () => {
      const scrollToTopBtn = document.getElementById("scrollToTopBtn");
      if (scrollToTopBtn) {
        if (
          document.body.scrollTop > 150 ||
          document.documentElement.scrollTop > 150
        ) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      }
    };

    // Thêm sự kiện cuộn vào window
    window.addEventListener("scroll", handleScroll);

    // Lấy nút và gắn sự kiện onclick
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
      scrollToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }

    // Cleanup sự kiện cuộn khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const onLogout = () => {
    removeAuthToken();
    handleLogout(dispatch);
    navigate("/"); // Truyền dispatch vào handleLogout
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
  const userMenuItems = [
    {
      key: "profile",
      label: <Link to="/members">Trang cá nhân</Link>,
    },
    {
      key: "settings",
      label: <Link to="/settings">Cài đặt</Link>,
    },
    {
      key: "logout",
      label: <span onClick={onLogout}>Đăng xuất</span>,
    },
  ];

  return (
    <>
      <div className="navbar ">
        <div className="nav-content">
          {/* Phần logo ở góc trái của header */}
          <div className="header " id="header">
            {/* Nút toggler menu cho mobile */}
            <div>
              <button className="navbar-toggler">
                <MobileSidebar />
              </button>
            </div>
            <div className="header-left">
              <Link to="/">
                <img className="header-logo" src={logo} alt="logo" />
              </Link>
            </div>

            {/* Navigation trung tâm */}
            <div
              className="header-center collapse navbar-collapse"
              id="navbarNav"
            >
              <ul className="header__nav navbar-nav mx-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "active" : "nav-link"
                    }
                    onClick={closeMenu}
                  >
                    TRANG CHỦ
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/movies"
                    className={({ isActive }) =>
                      isActive ? "active" : "nav-link"
                    }
                    onClick={closeMenu}
                  >
                    PHIM
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/promotions"
                    className={({ isActive }) =>
                      isActive ? "active" : "nav-link"
                    }
                    onClick={closeMenu}
                  >
                    TIN TỨC
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/members"
                    className={({ isActive }) =>
                      isActive ? "active" : "nav-link"
                    }
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
                      handleMemberClick(token, setModalType);
                      closeMenu();
                    }}
                  >
                    THÀNH VIÊN
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive ? "active" : "nav-link"
                    }
                    onClick={closeMenu}
                  >
                    LIÊN HỆ
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="nav-item search-wrapper">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm phim, thể loại, diễn viên... "
              />
            </div>
            {/* Phần login hoặc thông tin người dùng ở góc phải */}
            <div className="header-right">
              <div className="login-actions">
                {isLoggedIn && user ? (
                  // Nếu người dùng đã đăng nhập, hiển thị avatar với Dropdown
                  <Dropdown
                    menu={{ items: userMenuItems }}
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
                    className="btn action-btn btn-primary"
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
      <GuideModal />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};
