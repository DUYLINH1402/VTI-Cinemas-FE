import { React, useState, useEffect } from "react";
import axios from "axios";
import { CardMovie } from "../../Cards/Cards";
import "./HomeContent.scss";
import Link from "antd/es/typography/Link";

export const HomeContent = () => {
  const [movie, setMovie] = useState([]);

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await axios.get(
          "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
        );
        console.log(response.data); // Dữ liệu `Movies` sẽ được in ra đây
        setMovie(Object.values(response.data)); // Chuyển đối tượng thành mảng
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <>
      <div className="content">
        <div class="movie-buttons">
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
          {movie && movie.length > 0 ? (
            movie.map((item, index) => (
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
