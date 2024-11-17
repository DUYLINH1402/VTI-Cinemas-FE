import React, { useState, useEffect } from "react";
import "./HomeContent.scss";
import { Link } from "react-router-dom";
import { CardMovie } from "../../../components/Cards/Cards";
import { fetchMovies } from "../../../services/dataService"; // Import hàm fetchMovies từ dataService
import FullPageSkeleton from "../../../components/Skeleton/FullPageSkeleton"; // Skeleton loader để hiển thị khi đang tải dữ liệu

export const HomeContent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading

  // useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies(); // Gọi API lấy danh sách phim
        setMovies(data); // Cập nhật state movies
      } catch (error) {
        console.error("Error fetching data:", error); // Log lỗi
      } finally {
        setLoading(false); // Tắt trạng thái loading Skeleton
      }
    };

    fetchMoviesData();
  }, []); // Mảng dependencies rỗng để chỉ chạy khi component được mount

  return (
    <>
      <div className="home__content">
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

        {/* Phần hiển thị danh sách phim */}
        <div className="home__movie">
          {loading ? (
            // Hiển thị loader khi đang tải dữ liệu
            <FullPageSkeleton />
          ) : movies && movies.length > 0 ? (
            // Hiển thị danh sách phim nếu có dữ liệu
            movies.map((item, index) => (
              <CardMovie item={item} key={index}></CardMovie> // Render từng CardMovie
            ))
          ) : (
            // Hiển thị thông báo nếu không có phim
            <p>Không có phim nào theo yêu cầu</p>
          )}
        </div>
      </div>
    </>
  );
};
