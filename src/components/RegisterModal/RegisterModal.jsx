import React, { useState } from "react";
import "./RegisterModal.modul.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from "../../utils/validation";
import { Link } from "react-router-dom";

// Component RegisterModal để đăng ký tài khoản người dùng
const RegisterModal = ({ closeModal, openLoginModal }) => {
  const [showPassword, setShowPassword] = useState(false); // Điều khiển hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Điều khiển hiển thị mật khẩu xác nhận
  const [isClosing, setIsClosing] = useState(false); // Trạng thái đóng Modal

  // Khởi tạo dữ liệu form với các trường nhập liệu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Khởi tạo trạng thái lỗi cho các trường
  const [errors, setErrors] = useState({});

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Xử lý khi có thay đổi ở các trường nhập liệu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Kiểm tra lỗi ngay khi người dùng rời khỏi trường nhập
  const handleBlur = (field) => {
    let error = "";
    switch (field) {
      case "name":
        error = validateName(formData.name);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "phone":
        error = validatePhone(formData.phone);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(
          formData.password,
          formData.confirmPassword
        );
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // Xử lý khi người dùng nhấn nút "Đăng ký"
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    validationErrors.name = validateName(formData.name);
    validationErrors.email = validateEmail(formData.email);
    validationErrors.phone = validatePhone(formData.phone);
    validationErrors.password = validatePassword(formData.password);
    validationErrors.confirmPassword = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    validationErrors.acceptTerms = !formData.acceptTerms
      ? "Vui lòng chấp nhận điều khoản"
      : "";

    setErrors(validationErrors);

    // Kiểm tra xem có lỗi nào không trước khi thực hiện đăng ký
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (!hasErrors) {
      // Thực hiện đăng ký nếu form hợp lệ
      // TODO: Thêm logic đăng ký vào đây
    }
  };

  // Xử lý khi đóng Modal, thêm hiệu ứng đóng
  const handleClose = () => {
    setIsClosing(true); // Bắt đầu hiệu ứng đóng
    setTimeout(() => {
      closeModal(); // Đóng Modal sau khi hiệu ứng kết thúc
    }, 300); // Thời gian hiệu ứng đồng bộ với CSS
  };

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      {/* Modal chính với hiệu ứng fade-out khi đóng */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Đăng Ký Tài Khoản</h2>
        {/* Form đăng ký tài khoản */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container">
            {/* Input Họ và tên */}
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}

            {/* Input Email */}
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="abc@gmail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            {/* Input Số điện thoại */}
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              placeholder="090xxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur("phone")}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}

            {/* Input Ngày sinh */}
            <label>Ngày sinh</label>
            <input
              type="text"
              name="birthdate"
              placeholder="YYYY/MM/DD"
              onFocus={(e) => (e.target.type = "date")} // Đổi sang kiểu date khi người dùng tương tác
              onBlur={(e) => (e.target.type = "text")} // Trở lại kiểu text khi người dùng rời khỏi trường nhập
              value={formData.birthdate}
              onChange={handleChange}
            />

            {/* Chọn Giới tính */}
            <div className="checkbox-group">
              <label>Giới tính</label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={formData.gender === "Nam"}
                  onChange={handleChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={formData.gender === "Nữ"}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>

            {/* Input Mật khẩu */}
            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"} // Toggle hiển thị mật khẩu
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={errors.password ? "input-error" : ""}
              />
              {/* Nút Toggle hiển thị mật khẩu */}
              <button
                type="button"
                className="show-password"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            {/* Input Nhập lại mật khẩu */}
            <label>Nhập lại mật khẩu</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle hiển thị mật khẩu xác nhận
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {/* Nút Toggle hiển thị mật khẩu xác nhận */}
              <button
                type="button"
                className="show-password"
                onClick={toggleConfirmPasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}

            {/* Chấp nhận điều khoản dịch vụ */}
            <label>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              Đồng ý với Điều khoản dịch vụ
            </label>
            {errors.acceptTerms && (
              <p className="error-message">{errors.acceptTerms}</p>
            )}

            {/* Nút submit để đăng ký */}
            <button type="submit" className="submit-button">
              Đăng ký
            </button>
          </div>
        </form>

        {/* Nút đóng Modal */}
        <button onClick={handleClose} className="close-button">
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Link mở Modal đăng nhập */}
        <p className="login-text">
          Bạn đã có tài khoản?{" "}
          <Link className="login-link" onClick={openLoginModal}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
