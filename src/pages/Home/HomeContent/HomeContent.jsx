import React, { useState, useEffect } from "react";
import "./HomeContent.scss";
import { Link } from "react-router-dom";
import { CardMovie } from "../../../components/Cards/Cards";
import { fetchMoviesByTab } from "../../../services/dataService"; // Import fetchMovies
import FullPageSkeleton from "../../../components/Skeleton/FullPageSkeleton"; // Skeleton loader

export const HomeContent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("nowShowing"); // Tab hiện tại (default là "PHIM ĐANG CHIẾU")

  // useEffect để gọi API khi tab thay đổi
  useEffect(() => {
    const fetchMoviesDataByTab = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesByTab(activeTab); // Lấy dữ liệu theo tab
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesDataByTab();
  }, [activeTab]); // Chạy lại khi tab thay đổi
  return (
    <>
      <div className="home__content">
        {/* Nút chuyển tab */}
        <div className="movie-buttons">
          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            PHIM SẮP CHIẾU
          </button>
          <button
            className={activeTab === "nowShowing" ? "active" : ""}
            onClick={() => setActiveTab("nowShowing")}
          >
            PHIM ĐANG CHIẾU
          </button>
          <button
            className={activeTab === "specialShows" ? "active" : ""}
            onClick={() => setActiveTab("specialShows")}
          >
            SUẤT CHIẾU ĐẶC BIỆT
          </button>
        </div>

        {/* Nút "Xem Thêm" */}
        <div>
          <Link to="/movies">
            <button className="view-more-button">Xem Thêm</button>
          </Link>
        </div>

        {/* Danh sách phim */}
        <div className="home__movie">
          {loading ? (
            <FullPageSkeleton /> // Hiển thị Skeleton khi đang tải
          ) : movies && movies.length > 0 ? (
            movies.map((item, index) => (
              <CardMovie item={item} key={index}></CardMovie> // Hiển thị từng phim
            ))
          ) : (
            <p>Không có phim nào theo yêu cầu</p> // Thông báo nếu không có dữ liệu
          )}
        </div>
      </div>
    </>
  );
};
