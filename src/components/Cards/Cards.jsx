import "./card.scss";
import { Link } from "react-router-dom";

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
        <Link to={`/booking_seat/${item.movie_id}`}>
          <button className="book-ticket-button">Đặt vé</button>
        </Link>
      </div>
    </>
  );
};

export const CardCinema = ({ item }) => {
  return (
    <>
      <div className="card__cinema">
        <div className="image">
          <img src={item.image} alt={item.movie_name} />
        </div>
        <div className="row">
          <div className="introduce">
            <Link to={`/movieinf/${item.movie_id}`}>
              <h1>{item.movie_name}</h1>
            </Link>
            <p>Thời gian: {item.duration} phút</p>
            <p>Thể loại: {item.genre}</p>
          </div>
          <div className="showtime">
            <h3>2D</h3>
            <Link to={`/booking_seat/${item.movie_id}`}>
              <button>20:00</button>
            </Link>
            <p>149 ghé trống</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const CardInfMovie = ({ movie }) => {
  return (
    <>
      <div className="card__inf">
        <div className="image">
          <img src={movie.image} alt={movie.movie_name} />
          <div className="showtime">
            <Link to={`/booking_seat/${movie.movie_id}`}>
              <button>Đặt vé</button>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="introduce">
            <h1>{movie.movie_name}</h1>
            <p>Thời gian: {movie.duration} phút</p>
            <p>Thể loại: {movie.genre}</p>
            <p>Đạo diễn: {movie.director} </p>
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
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>

      <div className="comment">
        <h2>Gửi đánh giá và bình luận</h2>
        <textarea placeholder="Gửi bình luận ở đây"></textarea>
        <div className="submit">
          <button>Gửi</button>
        </div>
      </div>
    </>
  );
};

export const CardSeats = ({ item }) => {
  return (
    <>
      <div className="card_seat">
        <div className="status_seat">
          <img
            src="src\assets\image\seat-unselect-normal.png"
            alt="Ghế trống"
          />
          <p>Ghế trống</p>
          <img
            src="src\assets\image\seat-select-normal.png"
            alt="Ghế đang chọn"
          />
          <p>Ghế đang chọn</p>

          <img
            src="src\assets\image\seat-process-normal.png"
            alt="Ghế Ghế đang giữ"
          />
          <p>Ghế đang giữ</p>

          <img
            src="src\assets\image\seat-buy-normal.png"
            alt="Ghế ghế đã bán"
          />
          <p>Ghế đã bán</p>

          <img
            src="src\assets\image\seat-set-normal.png"
            alt="Ghế ghế đặt trước"
          />
          <p>Ghế đặt trước</p>
        </div>
        <div className="content_tab">
          <div className="col1">
            <img src="src\assets\image\ic-screen.png" alt="màn chiếu" />
            <div className="row_seat">
              <div>
                <img
                  src="src\assets\image\seat-unselect-normal.png"
                  alt="Ghế ghế chưa đặt"
                />
              </div>
            </div>
            <div className="detail_seat">
              <div className="detail">
                <div>
                  <img
                    src="src\assets\image\seat-unselect-normal.png"
                    alt="Ghế thường"
                  />
                  <p>Ghế thường</p>
                </div>
                <div>
                  <img
                    src="src\assets\image\seat-unselect-vip.png"
                    alt="Ghế Vip"
                  />
                  <p>Ghế Vip</p>
                </div>
                <div>
                  <img
                    src="src\assets\image\seat-unselect-double.png"
                    alt="Ghế Đôi"
                  />
                  <p>Ghế Đôi</p>
                </div>
              </div>
              <div className="price">
                <h2>Giá vé</h2>
                <h3>60.000đ</h3>
              </div>
              <div className="timeout">
                <h2>Thời gian</h2>
                <h3>10:00</h3>
              </div>
            </div>
          </div>
          <div className="col2">
            <h1>Thông tin vé</h1>
            <div className="detail_movie">
              <img src={item.image} alt={item.movie_name} />
              <h1>{item.movie_name}</h1>
              <p>Hình thức: 2D</p> <br />
              <p>Thể loại: {item.genre}</p>
              <p>Thời lượng: {item.duration} phút</p>
              <p>Rạp chiếu: </p>
              <p>Ngày chiếu: </p>
              <p>Giờ chiếu: </p>
              <p>Phòng chiếu: </p>
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
