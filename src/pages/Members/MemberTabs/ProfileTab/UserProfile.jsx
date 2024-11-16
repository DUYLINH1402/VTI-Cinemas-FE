import "./UserProfile.modul.scss";
import React, { useState } from "react";

export const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    passport: "",
    dob: "",
    gender: "Nam",
    city: "",
    district: "",
    address: "",
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted: ", formData);
  };

  return (
    <>
      <div>
        <div className="profile-info ">
          <h2 className="title">Thông tin cá nhân</h2>
          <form onSubmit={handleSubmit}>
            <div className="avatar-section">
              <img
                src={formData.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="avatar-preview"
              />
              <div>
                <label htmlFor="avatar" className="upload-btn">
                  Tải ảnh lên
                </label>
                <input
                  className="input-modal"
                  type="file"
                  id="avatar"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="save-btn"
                  onClick={() => alert("Ảnh đã được lưu!")}
                >
                  Lưu ảnh
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label>Họ tên</label>
                <input
                  className="input-modal"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Email</label>
                <input
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
                  className="input-modal"
                  type="date"
                  name="birthDate"
                  value={formData.dob}
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
            <div className="change-password">
              <a href="#">Đổi mật khẩu?</a>
            </div>
            <button type="submit" className="update-btn">
              Cập nhật
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
