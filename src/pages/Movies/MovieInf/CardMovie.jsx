import React, { useState, useEffect } from "react";
import LazyImage from "../../../components/LazyImage";
import { renderStars } from "../../../components/Cards/Cards";
import notification_bg from "../../../assets/image/notification_bg.jpg";
import { fetchMoviesByTab } from "../../../services/dataService";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";
import MovieList from "../../../components/MovieList/MovieList";
import SkeletonSection from "../../../components/Skeleton/SkeletonSection";

export const CardInfMovie = ({ movie, onBookTicket }) => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("nowShowing");
  const [showMore, setShowMore] = useState(false); // Trạng thái để hiển thị thêm phim
  const [loading, setLoading] = useState(false);
  const [showMoreDes, setShowMoreDes] = useState(false);

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

  useEffect(() => {
    if (!movie) return;
    setLoading(true); // Bắt đầu hiển thị Skeleton
    const timer = setTimeout(() => {
      setLoading(false); // Kết thúc loading sau khi dữ liệu được cập nhật
    }, 500); // Điều chỉnh thời gian theo nhu cầu

    return () => clearTimeout(timer); // Dọn dẹp timeout khi component unmount
  }, [movie]);

  return (
    <>
      {loading ? (
        <SkeletonSection />
      ) : (
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
              <div className="render_stars">
                {renderStars(movie.rating || 0)}
              </div>
              <p>Ngày phát hành : {movie.release_date}</p>
              <p>Thời gian : {movie.duration} phút</p>
              <p>Thể loại : {movie.genre}</p>
              <p>Đạo diễn : {movie.director}</p>
              <p>Diễn viên : {movie.actor}</p>
              <p>Ngôn ngữ : {movie.language}</p>
              <p className="description-lable">Nội dung</p>
              <p className="description">
                {showMoreDes
                  ? movie.description
                  : `${movie.description.substring(0, 200)}...`}
                <span>
                  <button
                    onClick={() => setShowMoreDes(!showMoreDes)}
                    className="read-more-description-button"
                  >
                    {showMoreDes ? "Ẩn bớt" : "Xem thêm"}
                  </button>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="movie-page">
        {/* Left Section */}
        <div className="left-section">
          <div className="trailer">
            {/* <p className="title">Trailer</p> */}
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
          <div>
            {/* Bình luận */}
            <Comments movieId={movie.movie_id} movieName={movie.movie_name} />
          </div>
        </div>
        {/* Right Section: Dùng MovieList */}
        <MovieList initialTab="nowShowing" />
      </div>
    </>
  );
};
