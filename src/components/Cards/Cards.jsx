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
        <button className="book-ticket-button">Đặt vé</button>
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
            <button>
              <a href="#">20:00</a>
            </button>
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
            <button>
              <a href="#">Đặt vé</a>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="introduce">
            <h1>{movie.movie_name}</h1>
            <p>Mô tả: {movie.description}</p>
            <p>Thời gian: {movie.duration} phút</p>
            <p>Thể loại: {movie.genre}</p>
            <p>Đạo diễn: {movie.director} </p>
            <p>Diễn viên: {movie.actor}</p>
            <p>Ngôn ngữ: {movie.language}</p>
          </div>
        </div>
      </div>

      <div className="trailer">
        <h2>Trailer</h2>
        <iframe
          width="600"
          height="300"
          src="https://www.youtube.com/embed/ITlQ0oU7tDA"
          title="MẮT BIẾC - OFFICIAL TRAILER"
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
