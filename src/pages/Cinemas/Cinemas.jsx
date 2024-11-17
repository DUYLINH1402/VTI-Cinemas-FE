import { useEffect, useState } from "react";
import { CardCinema } from "../../components/Cards/Cards";
import "./Cinemas.scss";
import { fetchMovies } from "../../services/dataService";
import { Pagination } from "antd";

export const Cinemas = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5; // Số lượng phim mỗi trang

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
  console.log(currentMovies);

  return (
    <>
      <div className="content">
        <div className="link__showtimes">
          <button>
            <a href="#">07/11</a>
          </button>
          <button>
            <a href="#">08/11</a>
          </button>
          <button>
            <a href="#">09/11</a>
          </button>
        </div>
        <div className="tab__content">
          {currentMovies && currentMovies.length > 0 ? (
            currentMovies.map((item, index) => (
              <CardCinema item={item} key={index}></CardCinema>
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
