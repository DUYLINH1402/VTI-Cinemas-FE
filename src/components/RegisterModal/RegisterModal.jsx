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
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../store/authSlice";

const RegisterModal = ({ closeModal, openLoginModal }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error); // Lấy lỗi từ Redux store

  // Khởi tạo dữ liệu form với các trường nhập liệu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (!hasErrors) {
      // Thực hiện đăng ký nếu form hợp lệ
      dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          password: formData.password,
        })
      )
        .then((response) => {
          console.log("Phản hồi từ registerUser:", response);
          if (response) {
            closeModal();
          }
        })
        .catch((error) => {
          console.error("Đăng ký thất bại:", error); // Hiển thị lỗi khi đăng ký thất bại
        });
    }
  };

  const renderErrorMessage = (error) => {
    switch (error) {
      case "auth/email-already-in-use":
        return "Email này đã được sử dụng.";
      default:
        return "Đăng ký thất bại. Vui lòng thử lại.";
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Đăng Ký Tài Khoản</h2>
        <form noValidate>
          <div className="input-container">
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

            <label>Ngày sinh</label>
            <input
              type="text"
              name="birthDate"
              placeholder="YYYY/MM/DD"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={formData.birthDate}
              onChange={handleChange}
            />

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

            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={errors.password ? "input-error" : ""}
              />
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

            <label>Nhập lại mật khẩu</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                className={errors.confirmPassword ? "input-error" : ""}
              />
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
            {error && (
              <p className="error-message">{renderErrorMessage(error)}</p>
            )}
            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
            >
              Đăng ký
            </button>
          </div>
        </form>

        {error && <p className="error-message">{renderErrorMessage(error)}</p>}

        <button onClick={handleClose} className="close-button">
          <FontAwesomeIcon icon={faXmark} />
        </button>

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
