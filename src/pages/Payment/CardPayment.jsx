import React, { useState } from "react";
import { Service } from "./Service_Cinema/Service";
import { Timeout } from "../Booking_Seat/Timeout/Timeout";
import { Ticket_Detail } from "../Booking_Seat/Ticket_Detail/Ticket_Detail";
import { Price } from "../Booking_Seat/Timeout/Price";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
// import ConfirmationModal from "./PaymentConfirmationModal";
import { Modal, Box, Typography, Button } from "@mui/material";
import { Margin } from "@mui/icons-material";

export const CardPayment = ({ userDetail }) => {
  const { state } = useLocation();
  const { selectSeatName, selectedSeatPrice } = state || {};
  const [comboPrice, setComboPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const totalPrice = selectedSeatPrice + comboPrice - discount;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handlePayment = async () => {
    try {
      // Gọi API server tạo đơn hàng ZaloPay
      const response = await axios.post("http://localhost:8888/payment", {
        amount: totalPrice,
        description: "Thanh toán vé xem phim",
      });
      // Kiểm tra URL thanh toán từ server
      if (response.data.order_url) {
        window.location.href = response.data.order_url;
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo giao dịch.");
      // }
    }
  };

  return (
    <>
      <div className="card_payment">
        <div className="content_tab">
          <div className="col1">
            <h1>Thông tin thanh toán</h1>
            {/*  */}
            <div className="person_inf">
              <div>
                <label htmlFor="">Họ tên:</label>
                <input type="text" value={userDetail.name} readOnly />
              </div>
              <div>
                <label htmlFor="">Số điện thoại:</label>
                <input type="text" value={userDetail.phone} readOnly />
              </div>
              <div>
                <label htmlFor="">Email:</label>
                <input type="email" value={userDetail.email} readOnly />
              </div>
            </div>
            {/*  */}
            <div className="service">
              <h1>COMBO ƯU ĐÃI</h1>
              <div className="lable_service">
                <div>
                  <label htmlFor="">Tên combo: </label>
                </div>
                <div>
                  <label htmlFor="">Mô tả: </label>
                </div>
                <div>
                  <label htmlFor="">Số lượng: </label>
                </div>
              </div>
              <div className="service1">
                <Service setComboPrice={setComboPrice} />
              </div>
            </div>
            {/*  */}
            <div className="voucher">
              <h1>Giảm giá</h1>
              {/* <span>VTI voucher (Nhấn vào đây để xem danh sách voucher)</span>
              <div className="button">
                <button>Đổi điểm</button>
              </div> */}
              <div className="code_voucher">
                <label htmlFor="">Mã voucher</label>
                <select
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                >
                  <option value="0">---</option>
                  <option value="5000">Mã giảm giá 5000đ</option>
                  <option value="10000">Mã giảm giá 10.000đ</option>
                  <option value="20000">Mã giảm giá 20.000đ</option>
                </select>
              </div>
              {/* <div className="point_voucher">
                <div>
                  <label htmlFor="">Điểm hiện có</label>
                  <input type="text" />
                </div>
                <div>
                  <label htmlFor="">Nhập điểm</label>
                  <input type="text" />
                </div>
              </div> */}
              {/*  */}
              <div className="total_price">
                <div>
                  <p>Số tiền được giảm: </p>
                  <p>
                    {discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    VNĐ
                  </p>
                </div>
                <div>
                  <p>Số tiền cần thanh toán: </p>
                  <Price price={totalPrice} />
                </div>
              </div>
            </div>
            <div className="time_out">
              <div>
                <span>Vui lòng kiểm tra lại thông tin</span> <br /> <br />
                <span>* Vé mua rồi không trả lại được dưới mọi hình thức</span>
              </div>

              <div>
                <h2>Thời gian còn lại: </h2>
                <Timeout />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col2">
            <h1>Thông tin vé</h1>
            <div className="detail_movie">
              <Ticket_Detail seat_name={selectSeatName} />
              <button onClick={handleOpenModal}>Xác nhận thanh toán</button>
            </div>
          </div>
        </div>
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "2rem", color: "#e74c3c", marginBottom: "10px" }}
            >
              Xác nhận thanh toán
            </Typography>
            <Box sx={{ fontSize: "1.4rem" }}>
              <Ticket_Detail seat_name={selectSeatName} showImage={false} />
              <div
                style={{ lineHeight: 1.5, marginTop: "5px", fontWeight: "600" }}
              >
                Tổng thanh toán
                <Price price={totalPrice} />
              </div>
              <Typography sx={{ fontSize: "1.2rem", color: "red" }}>
                (Khi bấm xác nhận bạn sẽ được chuyển đến trang thanh toán)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "10px",
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  sx={{ fontSize: "1.2rem" }}
                  color="secondary"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handlePayment}
                  color="primary"
                  sx={{ fontSize: "1.2rem" }}
                >
                  Xác nhận
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
};
