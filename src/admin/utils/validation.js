/**
 * Hàm validate form input
 * @param {Object} form - Dữ liệu form cần validate
 * @returns {Object} errors - Trạng thái lỗi của các input
 */
export const validateTheaterForm = (form) => {
  const errors = {
    name: form.name.trim() === "" ? "Vui lòng nhập tên rạp" : "",
    city: form.city.trim() === "" ? "Vui lòng nhập khu vực " : "",
    location: form.location.trim() === "" ? "Vui lòng nhập địa chỉ" : "",
  };

  return errors;
};

/**
 * Kiểm tra xem có lỗi nào không
 * @param {Object} errors - Đối tượng chứa các trạng thái lỗi
 * @returns {boolean} - true nếu không có lỗi, false nếu có lỗi
 */
export const isValidForm = (errors) => {
  return !Object.values(errors).some((error) => error !== "");
};
