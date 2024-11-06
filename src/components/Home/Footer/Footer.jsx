import "./footer.scss";
import logo from "./../../../assets/image/logo.png";
import logo_da_thong_bao_bct from "./../../../assets/image/logo_da_thong_bao_bct.webp";
import {
  CopyrightOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
export const Footer = () => {
  return (
    <>
      <div className="footer">
        <div class="footer__section footer__links">
          <Link to="/">
            <img src={logo} alt="Logo" className="footer__logo" />
          </Link>
          <ul>
            <li>
              <Link to="#">Giới thiệu</Link>
            </li>
            <li>
              <Link to="#">Tuyển dụng</Link>
            </li>
            <li>
              <Link to="#">FAQ</Link>
            </li>
            <li>
              <Link to="#">Điều khoản sử dụng</Link>
            </li>
            <li>
              <Link to="#">Liên hệ quảng cáo</Link>
            </li>
            <li>
              <Link to="#">Hướng dẫn đặt vé online</Link>
            </li>
          </ul>
        </div>
        <div class="footer__section footer__info">
          <h4>Hệ thống rạp</h4>
          <div className="footer__list__cinemas">
            <ul>
              <p className="title__location">Miền Bắc</p>
              <li>
                <Link to="#">VTI Hà Nội Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Thăng Long Movie</Link>
              </li>
              <li>
                <Link to="#">VTI Royal Hanoi Theater</Link>
              </li>
              <li>
                <Link to="#">VTI West Lake Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Red River Film House</Link>
              </li>
            </ul>
            <ul>
              <p className="title__location">Miền Trung</p>
              <li>
                <Link to="#">VTI Đà Nẵng Star Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Huế Heritage Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Đồng Hới Film Center</Link>
              </li>
              <li>
                <Link to="#">VTI Nha Trang Sun Theater</Link>
              </li>
              <li>
                <Link to="#">VTI Pleiku Movies</Link>
              </li>
            </ul>
            <ul>
              <p className="title__location">Miền Nam</p>
              <li>
                <Link to="#">VTI Sài Gòn Film House</Link>
              </li>
              <li>
                <Link to="#">VTI Mekong Movie Center</Link>
              </li>
              <li>
                <Link to="#">VTI Vũng Tàu Ocean Cinema</Link>
              </li>
              <li>
                <Link to="#">VTI Cần Thơ Riverside Theater</Link>
              </li>
              <li>
                <Link to="#">VTI Biên Hòa Galaxy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer__section footer__social">
          <h4>Kết nối</h4>
          <ul>
            <li>
              <FacebookFilled />
              <Link to="#">
                {" "}
                <span>Facebook</span>
              </Link>
            </li>
            <li>
              <InstagramFilled />
              <Link to="#">
                {" "}
                <span>Instagram</span>
              </Link>
            </li>
            <li>
              <TwitterSquareFilled />
              <Link to="#">
                <span>Twitter</span>
              </Link>
            </li>
          </ul>
          <img src={logo_da_thong_bao_bct} alt="logo_da_thong_bao_bct" />
        </div>
        <div class="footer__section footer__contact">
          <h4>Liên hệ</h4>
          <ul>
            <li>CÔNG TY CỔ PHẦN VTI MEDIA</li>
            <li>LIÊN HỆ HỢP TÁC</li>
            <li>
              HOTLINE: <Link to="tel:19001999">1900 1999</Link>
            </li>
            <li>
              EMAIL:{" "}
              <Link to="mailto:vticinema@gmail.com">vticinema@gmail.com</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>
          {" "}
          <CopyrightOutlined />
          Copyright 2024
        </p>
      </div>
    </>
  );
};
