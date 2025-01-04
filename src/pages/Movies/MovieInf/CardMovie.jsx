import React, { useState, useEffect } from "react";
import LazyImage from "../../../components/LazyImage";
import { renderStars } from "../../../components/Cards/Cards";
import notification_bg from "../../../assets/image/notification_bg.jpg";
import { fetchMoviesByTab } from "../../../services/dataService";
import { useNavigate } from "react-router-dom";

export const CardInfMovie = ({ movie, onBookTicket }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("nowShowing");
  const [showMore, setShowMore] = useState(false); // Trạng thái để hiển thị thêm phim
  const navigate = useNavigate();

  // Giới hạn số lượng phim hiển thị
  const moviesToShow = showMore ? movies : movies.slice(0, 7);
  // Fetch movies based on activeTab
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesByTab(activeTab);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeTab]);

  const handleMovieClick = (movieId) => {
    navigate(`/movieinf/${movieId}`); // Điều hướng đến trang chi tiết phim
  };

  return (
    <>
      <div
        className="card__inf"
        style={{
          backgroundImage: `url(${notification_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="image ">
          <LazyImage
            src={movie.image}
            alt={movie.movie_name}
            height="320px"
            width="250px"
          />
          <div className="showtime">
            {/* Sử dụng callback để mở Modal */}
            <button onClick={() => onBookTicket(movie)}>Đặt vé</button>
          </div>
        </div>

        <div className="row">
          <div className="introduce">
            <p className="movie__title">{movie.movie_name}</p>
            <div className="render_stars">{renderStars(movie.rating || 0)}</div>
            <p>Ngày phát hành : {movie.release_date}</p>
            <p>Thời gian : {movie.duration} phút</p>
            <p>Thể loại : {movie.genre}</p>
            <p>Đạo diễn : {movie.director}</p>
            <p>Diễn viên : {movie.actor}</p>
            <p>Ngôn ngữ : {movie.language}</p>
            <p>Nội dung : {movie.description}</p>
          </div>
        </div>
      </div>

      <div className="movie-page">
        {/* Left Section */}
        <div className="left-section">
          <div className="trailer">
            <p className="title">Trailer</p>
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
          <div className=" comment">
            <p className="title">Bình luận từ người xem</p>
            <textarea placeholder="Gửi bình luận ở đây"></textarea>
            <div className="submit">
              <button className="button">Gửi</button>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="right-section">
          <div className="tab-buttons">
            <button
              className={activeTab === "nowShowing" ? "active" : ""}
              onClick={() => setActiveTab("nowShowing")}
            >
              Phim đang chiếu
            </button>
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              Phim sắp chiếu
            </button>
          </div>

          <div className="now-showing">
            {loading ? (
              <p className="paragraph">Đang tải...</p>
            ) : moviesToShow.length > 0 ? (
              <>
                <ul className="movie-list">
                  {moviesToShow.map((movie, index) => (
                    <li
                      key={index}
                      className="movie-item"
                      onClick={() => handleMovieClick(movie.movie_id)} // Gọi hàm khi click
                      style={{ cursor: "pointer" }}
                    >
                      <LazyImage
                        src={movie.image}
                        alt={movie.movie_name}
                        height="90px"
                        width="64px"
                      />
                      {/* Hiển thị tuổi xem phim */}
                      {movie.viewing_age && (
                        <span className={`age-rating age-${movie.viewing_age}`}>
                          {movie.viewing_age}+
                        </span>
                      )}
                      <div className="movie-thumbnail">
                        <p className="movie-thumbnail__title">
                          {movie.movie_name}
                        </p>
                        <p className="movie-thumbnail__genre">{movie.genre}</p>
                        <p className="movie-thumbnail__rating">
                          {renderStars(movie.rating)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {movies.length > 7 && (
                  <button
                    className="show-more-button"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Ẩn bớt" : "Xem thêm"}
                  </button>
                )}
              </>
            ) : (
              <p>Không có phim nào.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
