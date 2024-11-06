// useRouteError Lấy ra thông báo lỗi của react router dom
import { useRouteError } from "react-router-dom";
import errorPage from "./../../../src/assets/image/errorPage.svg";
import "./errorPage.scss";
import { Header } from "../Home/Header/Header";
import { Footer } from "../Home/Footer/Footer";

export const ErrorPage = () => {
  return (
    <>
      <Header />
      <div className="content">
        <div id="error-page" className="error-page">
          <div>
            <h2 className="message">Không tìm thấy trang</h2>
            <div className="notFoundImage">
              <img id="notFound" src={errorPage} alt="Page Not Found" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
