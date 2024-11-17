import { useEffect, useState } from "react";
import { CardCinema } from "../../components/Cards/Cards";
import "./Cinemas.scss";
import { fetchMovies } from "../../services/dataService";
import { Pagination } from "antd"; // Thư viện hỗ trợ phân trang
import FullPageSkeleton from "../../components/Skeleton/FullPageSkeleton"; // Component Skeleton hiển thị khi tải dữ liệu

export const Cinemas = () => {
  const [movies, setMovies] = useState([]); // State lưu danh sách phim
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
  const moviesPerPage = 10; // Số lượng phim hiển thị trên mỗi trang
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading Skeleton

  // Gọi API để lấy danh sách phim
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies(); // Gọi hàm fetchMovies từ service
        setMovies(data); // Cập nhật state movies với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching data:", error); // Log lỗi nếu có
      } finally {
        setLoading(false); // Tắt trạng thái loading Skeleton
      }
    };

    fetchMoviesData(); // Gọi hàm fetchMoviesData
    window.scrollTo(0, 0); // Cuộn về đầu trang khi thay đổi trang
  }, [currentPage]); // Chỉ chạy lại khi currentPage thay đổi

  // Tính toán danh sách phim hiển thị trên trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage; // Vị trí phim cuối cùng của trang
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; // Vị trí phim đầu tiên của trang
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie); // Lấy danh sách phim của trang hiện tại

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page) => setCurrentPage(page);

  console.log(currentMovies); // Log danh sách phim trên trang hiện tại

  return (
    <>
      <div className="content">
        {/* Phần hiển thị các liên kết ngày giờ chiếu */}
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

        {/* Phần hiển thị danh sách phim hoặc Skeleton khi đang tải */}
        <div className="tab__content">
          {loading ? (
            // Hiển thị Skeleton nếu đang tải dữ liệu
            <FullPageSkeleton />
          ) : currentMovies && currentMovies.length > 0 ? (
            // Hiển thị danh sách phim nếu có dữ liệu
            currentMovies.map((item, index) => (
              <CardCinema item={item} key={index}></CardCinema> // Render CardCinema cho mỗi phim
            ))
          ) : (
            // Thông báo nếu không có phim
            <p>Không có phim nào trong danh sách</p>
          )}
        </div>

        {/* Phân trang */}
        <Pagination
          current={currentPage} // Trang hiện tại
          pageSize={moviesPerPage} // Số phim trên mỗi trang
          total={movies.length} // Tổng số phim
          onChange={handlePageChange} // Hàm xử lý khi chuyển trang
          showSizeChanger={false} // Ẩn tùy chọn thay đổi kích thước trang
          style={{ marginTop: "20px", textAlign: "center" }} // Căn giữa và thêm khoảng cách phía trên
        />
      </div>
    </>
  );
};
