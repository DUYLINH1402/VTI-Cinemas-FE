// src/utils/validation.js

// Kiểm tra email hoặc số điện thoại
export const validateEmailOrPhone = (value) => {
  if (!value) return "Vui lòng nhập email hoặc số điện thoại";

  const emailPattern = /\S+@\S+\.\S+/; // Định dạng email cơ bản
  const phonePattern = /^[0-9]{10}$/; // Định dạng cho số điện thoại 10 chữ số

  if (emailPattern.test(value)) {
    return ""; // Hợp lệ với email
  } else if (phonePattern.test(value)) {
    return ""; // Hợp lệ với số điện thoại
  } else {
    return "Vui lòng nhập đúng email hoặc số điện thoại";
  }
};

// Kiểm tra mật khẩu (ví dụ: yêu cầu tối thiểu 6 ký tự)
export const validatePassword = (password) => {
  if (!password) return "Vui lòng nhập mật khẩu";
  return password.length >= 6 ? "" : "Mật khẩu phải có ít nhất 6 ký tự";
};

// Hàm tổng hợp để validate toàn bộ form đăng nhập
export const validateLoginForm = ({ emailOrPhone, password }) => {
  return {
    emailOrPhone: validateEmailOrPhone(emailOrPhone),
    password: validatePassword(password),
  };
};

// Hàm kiểm tra hợp lệ của trường "Họ và tên"
export const validateName = (name) => {
  if (!name) return "Họ và tên không được để trống";
  if (name.length < 4) return "Họ và tên phải có ít nhất 4 ký tự";
  return "";
};

// Hàm kiểm tra hợp lệ của trường "Email"
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) return "Email không được để trống";
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return "";
};

// Hàm kiểm tra hợp lệ của trường "Số điện thoại"
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?(\d.*){10,}$/;
  if (!phone) return "Số điện thoại không được để trống";
  if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
  return "";
};

// Hàm kiểm tra hợp lệ của trường "Nhập lại mật khẩu"
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Vui lòng nhập lại mật khẩu";

  // So sánh "Nhập lại mật khẩu" với "Mật khẩu"
  if (confirmPassword !== password) return "Mật khẩu không khớp";

  return "";
};
