import { useEffect, useState } from "react";
import "./card.scss";
import { Link } from "react-router-dom";
import { Seats } from "../../pages/Booking_Seat/Seats/Seats";
import { Timeout } from "../../pages/Booking_Seat/Timeout/Timeout";
import { Ticket_Detail } from "../../pages/Booking_Seat/Ticket_Detail/Ticket_Detail";
import { Status_Seat } from "../../pages/Booking_Seat/Status_Seat/Status_Seat";
import { Price } from "../../pages/Booking_Seat/Timeout/Price";

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
            <p className="line-clamp">{item.description}</p>
            <p>Rating: {item.rating}</p>
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

export const CardSeats = () => {
  const [selectedSeatPrice, setSelectedSeatPrice] = useState(0);
  const [selectSeatName, setSelectSeatName] = useState([]);

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
              <Link to="#">
                <button>Tiếp tục</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
