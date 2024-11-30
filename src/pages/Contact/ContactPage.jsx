import "./ContactPage.modul.scss";
import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    region: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="contact-page">
      {/* Banner & Intro Section */}
      <div className="intro-section">
        <div className="left-banner">
          <img
            src="https://via.placeholder.com/150x500"
            alt="Banner quảng cáo"
          />
        </div>
        <div className="intro-text">
          <h1>
            LIÊN HỆ QUẢNG CÁO TẠI RẠP / MUA VÉ NHÓM / THUÊ RẠP TỔ CHỨC SỰ KIỆN /
            MUA PHIẾU QUÀ TẶNG
          </h1>
          <p>
            Ban có nhu cầu quảng cáo trên màn hình cực lớn tại rạp, tiếp cận
            đông đảo khách xem phim tại rạp. Bạn cần thưởng thức các bộ phim bom
            tấn riêng tư cùng gia đình, bạn bè, đồng nghiệp. Hãy liên hệ ngay
            với LOTTE Cinema để được hỗ trợ ngay:{" "}
          </p>
          <p>
            <strong>Email:</strong> cs@lotte.vn <br />
            <strong>Hotline:</strong> 0985.64.54.94
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <h2>DỊCH VỤ CỦA CHÚNG TÔI</h2>
        <div className="services-list">
          <div className="service-item">
            <img src="https://via.placeholder.com/150x100" alt="Mua vé nhóm" />
            <p>MUA VÉ NHÓM</p>
          </div>
          <div className="service-item">
            <img
              src="https://via.placeholder.com/150x100"
              alt="Thuê rạp tổ chức sự kiện"
            />
            <p>THUÊ RẠP TỔ CHỨC SỰ KIỆN</p>
          </div>
          <div className="service-item">
            <img
              src="https://via.placeholder.com/150x100"
              alt="Quảng cáo tại rạp"
            />
            <p>QUẢNG CÁO TẠI RẠP</p>
          </div>
          <div className="service-item">
            <img
              src="https://via.placeholder.com/150x100"
              alt="Mua phiếu quà tặng"
            />
            <p>MUA PHIẾU QUÀ TẶNG / E-CODE</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="contact-form-section">
        <h2>LẬP KẾ HOẠCH CÙNG LOTTE CINEMA NGAY</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Họ và Tên"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Chọn dịch vụ</option>
              <option value="Mua vé nhóm">Mua vé nhóm</option>
              <option value="Thuê rạp tổ chức sự kiện">
                Thuê rạp tổ chức sự kiện
              </option>
              <option value="Quảng cáo tại rạp">Quảng cáo tại rạp</option>
              <option value="Mua phiếu quà tặng">Mua phiếu quà tặng</option>
            </select>
          </div>
          <div className="form-group">
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">Chọn khu vực</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TPHCM">TPHCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            <textarea
              name="details"
              placeholder="Thông tin chi tiết"
              value={formData.details}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            GỬI
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
