import React, { useState, useEffect } from "react";
import { getDatabase, ref, query, onValue } from "firebase/database";
import { fetchMoviesByIdFromFirebase } from "../../../services/firebase/firebaseMovie.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import "./FeaturedComments.scss";
import LazyImage from "../../../components/LazyImage.jsx";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 3; // Số phim hiển thị ban đầu
const MAX_COMMENTS_PER_MOVIE = 2; // Tối đa 2 bình luận cho mỗi phim

const FeaturedComments = () => {
  const [commentsByMovie, setCommentsByMovie] = useState({}); // Nhóm bình luận theo movieId
  const [moviesData, setMoviesData] = useState({});
  const [visibleMovies, setVisibleMovies] = useState(ITEMS_PER_PAGE); // Số phim hiển thị
  const [loading, setLoading] = useState(true);
  const [openCommentModal, setOpenCommentModal] = useState(false); // Trạng thái mở/đóng modal bình luận
  const [selectedComment, setSelectedComment] = useState(null); // Bình luận được chọn
  const [openTrailerModal, setOpenTrailerModal] = useState(false); // Trạng thái mở/đóng modal trailer
  const [selectedMovie, setSelectedMovie] = useState(null); // Lưu thông tin phim được chọn để hiển thị trong modal trailer
  const navigate = useNavigate();

  // Hàm định dạng ngày tháng
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Lấy tất cả bình luận từ Firebase và nhóm theo movieId
  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");

    const unsubscribe = onValue(commentsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setCommentsByMovie({});
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const fetchedComments = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
          timestamp: new Date(value.timestamp).getTime(),
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // Sắp xếp theo thời gian mới nhất

      // Nhóm bình luận theo movieId và giới hạn tối đa 2 bình luận cho mỗi phim
      const groupedComments = {};
      fetchedComments.forEach((comment) => {
        const movieId = comment.movieId;
        if (!groupedComments[movieId]) {
          groupedComments[movieId] = [];
        }
        if (groupedComments[movieId].length < MAX_COMMENTS_PER_MOVIE) {
          groupedComments[movieId].push(comment);
        }
      });

      // Lấy thông tin phim cho từng movieId
      const movieIds = Object.keys(groupedComments);
      const movies = {};
      for (const movieId of movieIds) {
        try {
          const movie = await fetchMoviesByIdFromFirebase(movieId);
          if (movie) {
            movies[movieId] = movie;
          }
        } catch (error) {
          console.error(`Lỗi khi lấy dữ liệu phim ${movieId}:`, error);
        }
      }

      setMoviesData(movies);
      setCommentsByMovie(groupedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShowMore = () => {
    setVisibleMovies((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleClickComment = (movieId) => {
    navigate(`/movieinf/${movieId}`); // Điều hướng đến trang chi tiết phim
  };

  const handleOpenCommentModal = (comment) => {
    setSelectedComment(comment);
    setOpenCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
    setSelectedComment(null);
  };

  // Hàm mở modal trailer và lưu thông tin phim
  const handleOpenTrailerModal = (movie) => {
    setSelectedMovie(movie);
    setOpenTrailerModal(true);
  };

  // Hàm đóng modal trailer
  const handleCloseTrailerModal = () => {
    setOpenTrailerModal(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return <div>Đang tải bình luận...</div>;
  }

  // Chuyển commentsByMovie thành mảng để hiển thị
  const movieIds = Object.keys(commentsByMovie);

  return (
    <div className="featured-comments-container">
      <h2 className="featured-comments-title">Bình luận nổi bật</h2>

      <div className="featured-comments-grid">
        {movieIds.slice(0, visibleMovies).map((movieId) => {
          const movie = moviesData[movieId];
          const comments = commentsByMovie[movieId];
          if (!movie || !comments) return null; // Bỏ qua nếu không tìm thấy phim hoặc bình luận

          return (
            <div key={movieId} className="featured-comment-card">
              <div className="featured-comment-thumbnail">
                <LazyImage src={movie.background} alt={movie.title} />
                <div
                  className="play-icon"
                  onClick={() => handleOpenTrailerModal(movie)} // Truyền toàn bộ movie vào modal
                >
                  <FontAwesomeIcon icon={faCirclePlay} />
                </div>
              </div>
              <div className="featured-comment-info">
                <h3 className="movie-title">
                  {movie.title} <span className="imdb">IMDb {movie.rating || "N/A"}</span>
                </h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <LazyImage
                        src={comment.avatar}
                        alt={comment.username}
                        width="40px"
                        height="40px"
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <p className="username">{comment.username}</p>
                        <p className="timestamp">{formatDate(comment.timestamp)}</p>
                      </div>
                      {comment.purchased && <span className="verified-badge">Đã mua qua MoMo</span>}
                    </div>
                    <p
                      className="comment-content"
                      onClick={() => handleOpenCommentModal(comment)} // Mở modal bình luận khi nhấn
                    >
                      {comment.content}
                    </p>
                  </div>
                ))}
                <button className="view-more-comment" onClick={() => handleClickComment(movieId)}>
                  Xem thêm
                  <span className="arrow-icon">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleMovies < movieIds.length && (
        <button className="show-more-button" onClick={handleShowMore}>
          Xem tiếp nhé!
          <span className="arrow-icon">
            <FontAwesomeIcon icon={faArrowDown} />
          </span>
        </button>
      )}

      {/* Modal hiển thị toàn bộ nội dung bình luận */}
      {openCommentModal && selectedComment && (
        <div className="custom-modal-overlay" onClick={handleCloseCommentModal}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseCommentModal}>
              ✕
            </button>
            <div className="modal-commen-wrapper">
              <div className="modal-header">
                <LazyImage
                  src={selectedComment.avatar}
                  alt={selectedComment.username}
                  width="40px"
                  height="40px"
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="username">{selectedComment.username}</p>
                  <p className="timestamp">{formatDate(selectedComment.timestamp)}</p>
                </div>
              </div>
              <p className="modal-comment-content">{selectedComment.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị trailer và thông tin phim */}
      {openTrailerModal && selectedMovie && (
        <div className="custom-modal-overlay" onClick={handleCloseTrailerModal}>
          <div className="custom-trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseTrailerModal}>
              ✕
            </button>
            <div className="modal-trailer-wrapper">
              <iframe
                width="100%"
                height="315"
                src={selectedMovie.trailer}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* Thông tin phim bên dưới trailer */}
              <div>
                <div className="modal-movie-info">
                  <div className="modal-movie-thumbnail">
                    <img
                      src={selectedMovie.image}
                      alt="Movie Thumbnail"
                      onClick={() => handleClickComment(selectedMovie.movie_id)}
                    />
                  </div>
                  <div className="modal-movie-detail">
                    <span
                      className="modal-movie-title"
                      onClick={() => handleClickComment(selectedMovie.movie_id)}
                    >
                      {selectedMovie.movie_name}
                    </span>
                    <span className="modal-movie-genre"> - {selectedMovie.genre}</span>
                    <p className="modal-movie-description">{selectedMovie.description}</p>
                  </div>
                </div>
                <button className="modal-close-button" onClick={handleCloseTrailerModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedComments;
