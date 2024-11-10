import React, { useState } from "react";
import "./ForgotPasswordModal.modul.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { validateEmailOrPhone } from "../../utils/validation";

// Component ForgotPasswordModal để xử lý yêu cầu quên mật khẩu
const ForgotPasswordModal = ({ closeModal }) => {
  const [emailOrPhone, setEmailOrPhone] = useState(""); // State lưu trữ thông tin email hoặc số điện thoại
  const [errors, setErrors] = useState({ emailOrPhone: "" }); // State lưu trữ lỗi của input

  // State để quản lý hiệu ứng đóng modal
  const [isClosing, setIsClosing] = useState(false);

  // Xác thực khi người dùng rời khỏi trường nhập
  const handleEmailOrPhoneBlur = () => {
    const error = validateEmailOrPhone(emailOrPhone);
    setErrors((prevErrors) => ({ ...prevErrors, emailOrPhone: error }));
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);

    if (!emailOrPhoneError) {
      // Nếu không có lỗi, tiến hành xử lý yêu cầu quên mật khẩu
      console.log("Thông tin hợp lệ, tiến hành gửi yêu cầu quên mật khẩu...");
      closeWithAnimation();
    } else {
      // Nếu có lỗi, hiển thị lỗi
      setErrors({ emailOrPhone: emailOrPhoneError });
    }
  };

  // Hàm đóng modal với hiệu ứng mượt mà
  const closeWithAnimation = () => {
    setIsClosing(true); // Bắt đầu hiệu ứng đóng
    setTimeout(() => {
      closeModal(); // Đóng modal sau khi hoàn tất animation
    }, 300); // Thời gian 300ms cho hiệu ứng đóng, khớp với CSS
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? "fade-out" : ""}`}
      onClick={(e) => {
        // Đóng modal khi người dùng click bên ngoài nội dung modal
        if (e.target.className.includes("modal-overlay")) closeWithAnimation();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`modal-content ${isClosing ? "scale-out" : ""}`}
        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click bên trong nội dung
      >
        <h2>Quên mật khẩu</h2>
        {/* Form quên mật khẩu */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container">
            <label>Email hoặc số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              onBlur={handleEmailOrPhoneBlur} // Kiểm tra lỗi khi rời khỏi input
              className={errors.emailOrPhone ? "input-error" : ""} // Thêm class lỗi nếu có
              required
            />
            {errors.emailOrPhone && (
              <p className="error-message">{errors.emailOrPhone}</p> // Hiển thị thông báo lỗi
            )}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={!!errors.emailOrPhone} // Vô hiệu hóa nút submit nếu có lỗi
          >
            Gửi yêu cầu
          </button>
        </form>
        {/* Nút đóng modal */}
        <button
          onClick={closeWithAnimation}
          className="close-button"
          aria-label="Đóng"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
