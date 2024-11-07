import { React, useState, useEffect } from "react";
import axios from "axios";
import "./Movies.scss";
import Link from "antd/es/typography/Link";
import { CardMovie } from "../Cards/Cards";

export const Movies = () => {
  const [movies, setMovies] = useState([]);

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await axios.get(
          "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
        );
        console.log(response.data); // Dữ liệu `Movies` sẽ được in ra đây
        setMovies(Object.values(response.data)); // Chuyển đối tượng thành mảng
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
        <div className="movies__content">
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
