import { useEffect, useState } from "react";
import "./card.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seats } from "../../pages/Booking_Seat/Seats/Seats";
import { Timeout } from "../../pages/Booking_Seat/Timeout/Timeout";
import { Ticket_Detail } from "../../pages/Booking_Seat/Ticket_Detail/Ticket_Detail";
import { Status_Seat } from "../../pages/Booking_Seat/Status_Seat/Status_Seat";
import { Price } from "../../pages/Booking_Seat/Timeout/Price";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import LazyImage from "../LazyImage";

// HÀM HIỂN THỊ SAO
export const renderStars = (rating) => {
  // Kiểm tra nếu không có rating hoặc rating không phải là số
  if (!rating || typeof rating !== "number") {
    return <p>Không có đánh giá</p>; // Hiển thị thông báo nếu không có đánh giá
  }

  const stars = 5; // Tổng số sao (thường là 5 sao trong hệ thống đánh giá)
  const fullStars = Math.floor((rating / 10) * stars); // Tính số sao đầy (rating được chia từ thang điểm 10 thành 5 sao)
  const halfStar = (rating / 10) * stars - fullStars >= 0.5; // Kiểm tra xem có sao nửa không
  const emptyStars = stars - fullStars - (halfStar ? 1 : 0); // Tính số sao rỗng còn lại

  return (
    <div className="star-rating">
      {/* Hiển thị các sao đầy */}
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={`full-${index}`} icon={solidStar} /> // Icon sao đầy
      ))}
      {/* Hiển thị sao nửa nếu có */}
      {halfStar && <FontAwesomeIcon icon={faStarHalfStroke} />}
      {/* Hiển thị các sao rỗng */}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={`empty-${index}`} icon={regularStar} /> // Icon sao rỗng
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
            <LazyImage
              src={item.image_url}
              alt="Image not found"
              height="350px"
              width="100%"
            />
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
            <LazyImage
              className="card__movie__img"
              src={item.image}
              alt={item.movie_name}
              height="320px"
              width="100%"
            />
            <h3 className="line-clamp title-movie">{item.movie_name}</h3>
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
      <div className="card_seat ">
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
            <div className="status_seat">
              <Status_Seat />
            </div>
            <div className="row_price">
              <div className="timeout-wrapper timeout-wrapper-booking-seat">
                <p className="title_time_out">Thời gian đặt vé còn lại:</p>
                <div className="time_out">
                  <Timeout />
                </div>
              </div>
              <div className="price">
                <div className="title_price">
                  <p>Giá vé</p>
                  <div className="total_price">
                    <Price price={selectedSeatPrice} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col2">
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

export const CardEvent = () => {
  return (
    <>
      <div className="card_event">Event</div>
    </>
  );
};
