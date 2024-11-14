import React, { useState, useEffect } from "react";
import "./Movies.scss";
import { CardMovie } from "../../components/Cards/Cards";
import { fetchMovies } from "../../../src/services/dataService";
import { Pagination } from "antd";

export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10; // Số lượng phim mỗi trang

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMoviesData();
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Lấy danh sách phim của trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Chuyển đến trang mới
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="content">
        <div className="movie-buttons">
          <button>PHIM SẮP CHIẾU</button>
          <button>PHIM ĐANG CHIẾU</button>
          <button>SUẤT CHIẾU ĐẶC BIỆT</button>
        </div>
        <div className="movies__content">
          {/* Kiểm tra dữ liệu và hiển thị danh sách phim */}
          {currentMovies && currentMovies.length > 0 ? (
            currentMovies.map((item, index) => (
              <CardMovie item={item} key={index}></CardMovie>
            ))
          ) : (
            <p>No movies available</p>
          )}
        </div>
        <Pagination
          current={currentPage}
          pageSize={moviesPerPage}
          total={movies.length}
          onChange={handlePageChange}
          showSizeChanger={false} // Ẩn tùy chọn thay đổi kích thước trang
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </>
  );
};
