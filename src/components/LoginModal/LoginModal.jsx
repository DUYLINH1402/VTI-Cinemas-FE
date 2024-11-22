import React, { useState, useEffect } from "react";
import "./LoginModal.modul.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  googleLogin,
  loginUser,
  facebookLogin,
} from "../../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import google from "../../assets/icon/google.svg";
import facebook from "../../assets/icon/facebook.svg";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  validateEmailOrPhone,
  validatePassword,
  validateLoginForm,
} from "../../utils/validation";
import { toast } from "react-toastify";
import { saveUserToDatabase } from "../../utils/authActions.js";
// Component LoginModal để xử lý đăng nhập người dùng
const LoginModal = ({
  closeModal,
  openRegisterModal,
  openForgotPasswordModal,
}) => {
  const [showPassword, setShowPassword] = useState(false); // Điều khiển hiển thị mật khẩu
  const [emailOrPhone, setEmailOrPhone] = useState(""); // State lưu email hoặc số điện thoại
  const [password, setPassword] = useState(""); // State lưu mật khẩu
  const [errors, setErrors] = useState({ emailOrPhone: "", password: "" }); // State lưu các lỗi

  // Hàm toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hiệu ứng khi đóng Modal
  const handleOverlayClick = (e) => {
    e.stopPropagation();

    const overlay = document.querySelector(".modal-overlay");
    const content = document.querySelector(".modal-content");

    if (overlay && content) {
      overlay.classList.add("fade-out");
      content.classList.add("scale-out");

      setTimeout(() => {
        closeModal(); // Đóng Modal sau khi hoàn tất animation
      }, 300); // Thời gian animation (300ms) khớp với CSS
    }
  };

  // Xác thực trường email hoặc số điện thoại khi rời khỏi input
  const handleEmailOrPhoneBlur = () => {
    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
    setErrors((prevErrors) => ({
      ...prevErrors,
      emailOrPhone: emailOrPhoneError,
    }));
  };

  // Xác thực trường mật khẩu khi rời khỏi input
  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
  };

  // Hàm xử lý khi submit form đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm({ emailOrPhone, password });
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (!hasErrors) {
      dispatch(loginUser({ email: emailOrPhone, password }))
        .unwrap()
        .then((response) => {
          const { accessToken, ...user } = response;
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Đăng nhập thành công!");
          console.log("Đăng nhập thành công!");
          closeModal(); // Đóng modal nếu đăng nhập thành công
        })
        .catch((error) => {
          toast.error("Đăng nhập thất bại!");
          console.error("Đăng nhập thất bại:", error.message);
        });
    }
  };

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error); // Lấy mã lỗi từ Redux store

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    dispatch(googleLogin())
      .unwrap()
      .then((response) => {
        const { accessToken, ...user } = response;
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        // Sau khi đăng nhập, đồng bộ dữ liệu người dùng
        saveUserToDatabase(user);
        closeModal();
        navigate("/");
        toast.success("Đăng nhập Google thành công!");
      })
      .catch((error) => {
        toast.error("Đăng nhập Google thất bại!");
        console.error("Đăng nhập Google thất bại:", error.message);
      });
  };

  const handleFacebookLogin = () => {
    dispatch(facebookLogin())
      .unwrap()
      .then((response) => {
        const { accessToken, ...user } = response;
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        closeModal();
        navigate("/");
        toast.success("Đăng nhập Facebook thành công!");
      })
      .catch((error) => {
        toast.error("Đăng nhập Facebook thất bại!");
        console.error("Đăng nhập Facebook thất bại:", error.message);
      });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Đăng nhập tài khoản</h2>
        {/* Form đăng nhập với noValidate để tắt validate mặc định của trình duyệt */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container">
            <label>Email hoặc số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              onBlur={handleEmailOrPhoneBlur} // Kiểm tra khi người dùng rời khỏi trường
              className={errors.emailOrPhone ? "input-error" : ""}
            />
            {errors.emailOrPhone && (
              <p className="error-message">{errors.emailOrPhone}</p> // Hiển thị lỗi nếu có
            )}
            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur} // Kiểm tra khi người dùng rời khỏi trường
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="show-password"
                onClick={togglePasswordVisibility} // Toggle hiển thị mật khẩu
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p> // Hiển thị lỗi nếu có
            )}
            {/* CheckBox Nhớ mật khẩu */}
            <div className="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label className="title" htmlFor="rememberMe">
                Nhớ mật khẩu
              </label>
            </div>
            {/* Hiển thị lỗi đăng nhập nếu có */}
            {error && <p className="error-message">{error}</p>}
            {/* Nút đăng nhập */}

            <button
              type="submit"
              className="submit-button"
              // onClick={handleEmailPasswordLogin}
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="social-login">
          <p>Hoặc đăng nhập bằng</p>
          <div className="social-icons">
            <a
              href="#"
              className="social-button google"
              onClick={handleGoogleLogin}
            >
              <img src={google} alt="Google" />
            </a>

            <a
              href="#"
              className="social-button facebook"
              onClick={handleFacebookLogin}
            >
              <img src={facebook} alt="Facebook" />
            </a>
          </div>
        </div>

        {/* Link mở modal quên mật khẩu */}
        <a
          href="#"
          className="forgot-password"
          onClick={openForgotPasswordModal}
        >
          Quên mật khẩu?
        </a>

        {/* Link mở modal đăng ký */}
        <p className="register-text">
          Bạn chưa có tài khoản?{" "}
          <span className="register-link" onClick={openRegisterModal}>
            Đăng ký
          </span>
        </p>

        {/* Nút đóng modal */}
        <button onClick={handleOverlayClick} className="close-button">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
