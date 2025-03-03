import "./UserProfile.modul.scss";
import React, { useState, useEffect } from "react";
import {
  fetchAccountByEmail,
  updateAccount,
} from "../../../../services/dataService"; // Import các hàm API
import { toast } from "react-toastify"; // Thư viện thông báo (toast)
import ChangePasswordModal from "../../../../components/ChangePasswordModal/ChangePassword";
import { Link } from "react-router-dom";
import { closeModal } from "../../../../utils/handleAction";
import LoadingIcon from "../../../../components/LoadingIcon";
// import { uploadImageToCloudinary } from "../../../../services/cloudinaryService"; // Hàm upload ảnh lên Cloudinary

// Component UserProfile để hiển thị và cập nhật thông tin cá nhân
export const UserProfile = () => {
  // Lấy thông tin user từ localStorage và parse thành object
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || ""; // Lấy email từ user hoặc trả về chuỗi rỗng nếu không có
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State chứa dữ liệu form để hiển thị và chỉnh sửa
  const [formData, setFormData] = useState({
    fullname: user.fullname || user.displayName,
    email: user.email,
    phone: user.phone,
    passport: user.passport,
    birthDate: user.birth_date,
    gender: user.gender,
    city: user.city,
    district: user.district,
    address: user.address,
    avatar_url: user.avatar_url || user.photoURL, // URL ảnh mặc định nếu không có
  });

  useEffect(() => {
    const fetchDataAccountByEmail = async () => {
      try {
        const data = await fetchAccountByEmail(email); // Gọi API lấy thông tin
        setFormData(data); // Cập nhật state formData với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error); // Log lỗi nếu có
      }
    };

    fetchDataAccountByEmail(); // Gọi hàm lấy dữ liệu
  }, [email]); // Chạy lại khi email thay đổi

  // Xử lý khi input thay đổi
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Lấy name và value từ input
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Cập nhật giá trị của key tương ứng trong formData
    }));
  };

  // Xử lý khi người dùng nhấn nút "Cập nhật"
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Loại bỏ các giá trị null/undefined trước khi gửi dữ liệu
      const sanitizedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      // Kiểm tra dữ liệu formData
      if (!formData || Object.keys(formData).length === 0) {
        throw new Error("formData không hợp lệ hoặc không được truyền đúng."); // Báo lỗi nếu dữ liệu không hợp lệ
      }
      // Gọi API để cập nhật thông tin
      await updateAccount(sanitizedFormData);
      toast.success("Cập nhật thông tin thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error.message);
      toast.error(`Cập nhật thất bại: ${error.message}`); // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false); // 🔥 Ẩn loading sau khi hoàn tất
    }
  };

  return (
    <>
      <div className="profile-info-wrap">
        <div className="profile-info ">
          <h2 className="title">Thông tin cá nhân</h2>
          <form>
            {/* Khu vực tải ảnh đại diện */}
            <div className="avatar-section">
              <img
                src={formData.avatar_url} // Hiển thị ảnh đại diện
                alt="Avatar"
                className="avatar-preview"
              />
              <div>
                <label htmlFor="avatar" className="upload-btn">
                  Tải ảnh lên
                </label>
                <input
                  accept="image/*"
                  className="input-modal"
                  type="file"
                  id="avatar"
                  style={{ display: "none" }}
                  // onChange={handleImageChange} // Xử lý khi tải ảnh
                />
                <button
                  type="button"
                  className="save-btn "
                  // onClick={handleUploadImage} // Thông báo tạm thời
                >
                  Lưu ảnh
                </button>
              </div>
            </div>

            {/* Form chỉnh sửa thông tin cá nhân */}
            <div className="form-grid">
              <div>
                <label>Họ tên</label>
                <input
                  className="input-modal"
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  readOnly // Không cho phép chỉnh sửa email
                  className="input-modal"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Số điện thoại</label>
                <input
                  className="input-modal"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>CMND/Hộ chiếu</label>
                <input
                  className="input-modal"
                  type="text"
                  name="passport"
                  value={formData.passport}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Ngày sinh</label>
                <input
                  className="input-modal selecte-birth-date"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label>Tỉnh/Thành phố</label>
                <input
                  className="input-modal"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Quận/Huyện</label>
                <input
                  className="input-modal"
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </div>
              <div className="address-field">
                <label>Địa chỉ</label>
                <input
                  className="input-modal"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Link đổi mật khẩu */}
            <div className="change-password">
              <Link href="!#" onClick={() => setIsModalOpen(true)}>
                Đổi mật khẩu?
              </Link>
              <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => {
                  closeModal(); // Gọi hàm đóng từ handleAction
                  setIsModalOpen(false); // Cập nhật trạng thái để tránh xung đột
                }}
              />
            </div>

            {/* Nút cập nhật */}
            <button
              onClick={handleSubmit}
              type="button"
              className="update-btn"
              disabled={isLoading}
            >
              {isLoading ? <LoadingIcon size={10} /> : "Cập nhật"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
