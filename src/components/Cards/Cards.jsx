import { useEffect, useState } from "react";
import "./card.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Seats } from "../../pages/Booking_Seat/Seats/Seats";
import { Timeout } from "../../pages/Booking_Seat/Timeout/Timeout";
import { Ticket_Detail } from "../../pages/Booking_Seat/Ticket_Detail/Ticket_Detail";
import { Status_Seat } from "../../pages/Booking_Seat/Status_Seat/Status_Seat";
import { Price } from "../../pages/Booking_Seat/Timeout/Price";
import { toast } from "react-toastify";
import { Service } from "../../pages/Payment/Service_Cinema/Service";
<<<<<<< HEAD
import axios from "axios";
=======
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import fstar_solid from "../../assets/icon/star_solid.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
>>>>>>> 4733ebe96238807a6d0013bd7d353fbca6765548

export const renderStars = (rating) => {
  if (!rating || typeof rating !== "number") {
    return <p>Không có đánh giá</p>; // Hiển thị nếu không có rating
  }

  const stars = 5; // Tổng số sao
  const fullStars = Math.floor((rating / 10) * stars); // Tính số sao đầy dựa trên thang 10
  const halfStar = (rating / 10) * stars - fullStars >= 0.5; // Kiểm tra sao nửa
  const emptyStars = stars - fullStars - (halfStar ? 1 : 0); // Sao rỗng

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon={faStar} />
      ))}
      {halfStar && <FontAwesomeIcon icon={faStarHalfStroke} />}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={`empty-${index}`} icon={fstar_solid} />
      ))}
    </div>
  );
};
export const CardCarousel = ({ item }) => {
  return (
    <div className="card-content" key={item.id}>
      <div className="card_carousel_img">
        <Link to="#!">
          <div>
            <img src={item.image_url} alt="Image not found" />
          </div>
        </Link>
      </div>
    </div>
  );
};
export const CardMovie = ({ item }) => {
  // console.log("Card Item:", item); // Kiểm tra dữ liệu được truyền vào
  return (
    <>
      <div className="card__movie">
        <Link to={`/movieinf/${item.movie_id}`}>
          <div>
            <img
              className="card__movie__img"
              src={item.image}
              alt={item.movie_name}
            />
            <h3 className="line-clamp title">{item.movie_name}</h3>
            <p className="line-clamp"> Diễn viên: {item.actor}</p>
            <div className="row_stars">
              <p>Thời lượng: {item.duration} phút</p>
              <div>{renderStars(item.rating || 0)}</div>
            </div>
          </div>
        </Link>
        {/* Thêm nút Đặt vé */}
        <Link to={`/movieinf/${item.movie_id}`}>
          <button className="book-ticket-button">Xem chi tiết</button>
        </Link>
      </div>
    </>
  );
};

export const CardInfMovie = ({ movie, onBookTicket }) => {
  return (
    <>
      <div className="card__inf">
        <div className="image ">
          <img src={movie.image} alt={movie.movie_name} />
          <div className="showtime">
            {/* Sử dụng callback để mở Modal */}
            <button onClick={() => onBookTicket(movie)}>Đặt vé</button>
          </div>
        </div>

        <div className="row">
          <div className="introduce">
            <h1 className="movie__title">{movie.movie_name}</h1>
            <p>Ngày phát hành: {movie.release_date}</p>
            <p>Thời gian: {movie.duration} phút</p>
            <p>Thể loại: {movie.genre}</p>
            <p>Đạo diễn: {movie.director}</p>
            <p>Diễn viên: {movie.actor}</p>
            <p>Ngôn ngữ: {movie.language}</p>
            <p>Mô tả: {movie.description}</p>
          </div>
        </div>
      </div>

      <div className="trailer">
        <h2>Trailer</h2>
        <iframe
          width="600"
          height="300"
          src={movie.trailer}
          title={movie.movie_name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <div className="comment">
        <h2>Gửi đánh giá và bình luận</h2>
        <textarea placeholder="Gửi bình luận ở đây"></textarea>
        <div className="submit">
          <button className="button">Gửi</button>
        </div>
      </div>
    </>
  );
};

export const CardSeats = ({ cinema, date, time }) => {
  const [selectedSeatPrice, setSelectedSeatPrice] = useState(() => {
    return Number(localStorage.getItem("selectedSeatPrice")) || 0; // Lấy giá vé từ localStorage
  });
  const [selectSeatName, setSelectSeatName] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedSeatNames")) || []; // Lấy tên ghế từ localStorage
  });
  const { movie_id } = useParams();
  const navigate = useNavigate();

  // Tải trạng thái chỗ đã lưu trước đó từ localStorage (nếu tồn tại)
  useEffect(() => {
    const savedSeatNames =
      JSON.parse(localStorage.getItem("selectedSeatNames")) || [];
    const savedSeatPrice =
      JSON.parse(localStorage.getItem("selectedSeatPrice")) || 0;

    setSelectSeatName(savedSeatNames);
    setSelectedSeatPrice(savedSeatPrice);
  }, []);

  // Lưu chỗ ngồi đã chọn và giá vào localStorage
  useEffect(() => {
    localStorage.setItem("selectedSeatNames", JSON.stringify(selectSeatName));
    localStorage.setItem(
      "selectedSeatPrice",
      JSON.stringify(selectedSeatPrice)
    );
  }, [selectSeatName, selectedSeatPrice]);

  const handlePayment = () => {
    if (selectSeatName.length === 0) {
      toast.warning("Vui lòng chọn ghế để tiếp tục");
      return;
    }
    navigate(`/payment/${movie_id}`, {
      state: {
        selectSeatName: selectSeatName,
        selectedSeatPrice: selectedSeatPrice,
        cinema: cinema,
        date: date,
        time: time,
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("timerCount", 600);
  }, []);

  return (
    <>
      <div className="card_seat">
        <div className="status_seat">
          <Status_Seat />
        </div>
        <div className="content_tab">
          <div className="col1">
            <img
              src="https://res.cloudinary.com/dcoviwlpx/image/upload/v1731809663/ic-screen_qsvlrn.png"
              alt="màn chiếu"
            />

            <div className="row_seat">
              <div className="seat">
                <Seats
                  setSelectedSeatPrice={setSelectedSeatPrice}
                  setSelectSeatName={setSelectSeatName}
                />
              </div>
            </div>

            <div className="detail_seat">
              <div className="price">
                <h3>Giá vé</h3>
                <Price price={selectedSeatPrice} />
              </div>

              <div className="timeout">
                <h3>Thời gian</h3>
                <h2>
                  <Timeout />
                </h2>
              </div>
            </div>
          </div>

          <div className="col2">
            <h1>Thông tin vé</h1>
            <div className="detail_movie">
              <Ticket_Detail seat_name={selectSeatName} />
              <button onClick={handlePayment}>Tiếp tục</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CardPayment = ({ userDetail }) => {
  const { state } = useLocation();
  const { selectSeatName, selectedSeatPrice } = state || {};
  const [comboPrice, setComboPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const totalPrice = selectedSeatPrice + comboPrice - discount;
  
  
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
              <button onClick={handlePayment}>Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
