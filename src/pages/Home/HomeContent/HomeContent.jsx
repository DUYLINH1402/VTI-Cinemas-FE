import React, { useState, useEffect } from "react";
import "./HomeContent.scss";
import { Link } from "react-router-dom";
import { CardMovie } from "../../../components/Cards/Cards";
import { fetchMoviesByTab } from "../../../services/dataService";
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
        const data = await fetchMoviesByTab(activeTab); // Gọi API theo tab
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesDataByTab();
  }, [activeTab]); // Xóa `isSearching` vì không còn cần thiết

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
        {loading ? (
          <FullPageSkeleton />
        ) : (
          <div className="home__movie">
            {movies.length > 0 ? (
              movies
                .slice(0, 10)
                .map((item, index) => <CardMovie item={item} key={index} />)
            ) : (
              <p>Không có phim nào theo yêu cầu.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
