import React, { useState, useEffect } from "react";
import "./HomeContent.scss";
import { Link } from "react-router-dom";
import { CardMovie } from "../../../components/Cards/Cards";
import { fetchMovies } from "../../../services/dataService"; // Import từ dataService

export const HomeContent = () => {
  const [movies, setMovies] = useState([]);

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies(); // Gọi hàm từ dataService
        setMovies(data); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <>
      <div className="content">
        <div className="movie-buttons">
          <button>PHIM SẮP CHIẾU</button>
          <button>PHIM ĐANG CHIẾU</button>
          <button>SUẤT CHIẾU ĐẶC BIỆT</button>
        </div>
        <div>
          <Link to="/movies">
            <button className="view-more-button">Xem Thêm</button>
          </Link>
        </div>
        <div className="home__content">
          {/* Kiểm tra dữ liệu và hiển thị danh sách phim */}
          {movies && movies.length > 0 ? (
            movies.map((item, index) => (
              <CardMovie item={item} key={index}></CardMovie>
            ))
          ) : (
            <p>No movies available</p>
          )}
        </div>
      </div>
    </>
  );
};
