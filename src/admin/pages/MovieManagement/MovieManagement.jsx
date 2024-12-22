import React, { useState, useEffect, memo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { fetchMovies } from "../../../services/service/serviceMovie";
import styles from "./MovieManagement.module.scss";
import MovieHeader from "./MovieHeader"; // Component header (tìm kiếm, sắp xếp)
import MovieRow from "./MovieRow"; // Component hiển thị từng dòng phim

const MovieManagement = () => {
  const [movies, setMovies] = useState([]); // Dữ liệu phim gốc từ API
  const [filteredMovies, setFilteredMovies] = useState([]); // Dữ liệu sau khi tìm kiếm
  const [sortedMovies, setSortedMovies] = useState([]); // Dữ liệu sau khi sắp xếp
  const [sortKey, setSortKey] = useState("id"); // Tiêu chí sắp xếp hiện tại
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của phân trang
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [openRowId, setOpenRowId] = useState(null); // ID của dòng được mở chi tiết
  const itemsPerPage = 7; // Số lượng phim hiển thị mỗi trang

  // Lấy dữ liệu phim từ API
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies(); // Gọi API để lấy danh sách phim
        setMovies(moviesData); // Lưu dữ liệu gốc
        setFilteredMovies(moviesData); // Ban đầu hiển thị toàn bộ phim
        setSortedMovies(moviesData); // Dữ liệu sau khi sắp xếp
      } catch (error) {
        console.error("Error fetching movies:", error); // Log lỗi nếu API gặp vấn đề
      }
    };
    getMovies();
  }, []);

  // Xử lý mở/đóng dòng chi tiết
  const handleRowToggle = (id) => {
    setOpenRowId((prevId) => (prevId === id ? null : id)); // Đóng nếu ID đang mở hoặc mở dòng khác
  };

  // Xử lý tìm kiếm phim
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase().trim(); // Chuyển từ khóa tìm kiếm về chữ thường và bỏ khoảng trắng

    const filtered = movies.filter((movie) => {
      const { movie_name, actor, genre, duration, release_date, rating } =
        movie;

      // Tìm kiếm trong tên phim, diễn viên, hoặc thể loại
      if (
        movie_name.toLowerCase().includes(lowerCaseQuery) ||
        actor.toLowerCase().includes(lowerCaseQuery) ||
        genre.toLowerCase().includes(lowerCaseQuery)
      ) {
        return true;
      }
      // Tìm kiếm theo số (điểm đánh giá hoặc thời lượng)
      if (!isNaN(lowerCaseQuery)) {
        const numberQuery = parseFloat(lowerCaseQuery);
        return duration >= numberQuery || rating >= numberQuery;
      }
      // Tìm kiếm theo ngày chiếu
      if (release_date && release_date.includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });

    setFilteredMovies(filtered); // Lưu danh sách đã tìm kiếm
    applySort(filtered, sortKey); // Sắp xếp danh sách dựa trên tiêu chí hiện tại
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Xử lý sắp xếp danh sách phim
  const handleSort = (key) => {
    setSortKey(key); // Cập nhật tiêu chí sắp xếp
    applySort(filteredMovies, key); // Sắp xếp danh sách đã lọc
  };

  // Hàm áp dụng sắp xếp cho danh sách phim
  const applySort = (moviesList, key) => {
    const sorted = [...moviesList].sort((a, b) => {
      if (key === "id") return a.movie_id - b.movie_id; // Sắp xếp theo ID
      if (key === "movie_name" || key === "actor" || key === "genre") {
        return a[key]?.localeCompare(b[key]); // Sắp xếp theo chuỗi
      }
      if (key === "release_date") return new Date(a[key]) - new Date(b[key]); // Sắp xếp theo ngày
      if (key === "rating" || key === "duration") return b[key] - a[key]; // Sắp xếp giảm dần
      return 0;
    });

    setSortedMovies(sorted); // Lưu danh sách đã sắp xếp
  };

  // Lấy danh sách phim của trang hiện tại
  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Cập nhật tổng số trang khi dữ liệu sắp xếp thay đổi
  useEffect(() => {
    setTotalPages(Math.ceil(sortedMovies.length / itemsPerPage));
  }, [sortedMovies]);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header với chức năng tìm kiếm và sắp xếp */}
      <MovieHeader onSearch={handleSearch} onSort={handleSort} />

      {/* Bảng hiển thị danh sách phim */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow className={styles.tableRowColor}>
              <TableCell>
                <strong className={styles.lableDetail}>Tên phim</strong>
              </TableCell>
              <TableCell>
                <strong className={styles.lableDetail}>Diễn viên</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Thời lượng</strong>
              </TableCell>
              <TableCell>
                <strong className={styles.lableDetail}>Thể loại</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Ngày chiếu</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Đánh giá</strong>
              </TableCell>
              <TableCell align="center">
                <strong className={styles.lableDetail}>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMovies.map((movie) => (
              <MovieRow
                key={movie.movie_id} // ID duy nhất của mỗi phim
                movie={movie} // Thông tin phim
                isOpen={openRowId === movie.movie_id} // Trạng thái mở dòng chi tiết
                onToggle={handleRowToggle} // Hàm xử lý mở/đóng dòng chi tiết
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(sortedMovies.length / itemsPerPage)} // Tổng số trang
          page={currentPage} // Trang hiện tại
          onChange={(event, value) => setCurrentPage(value)} // Xử lý thay đổi trang
          color="primary" // Màu sắc pagination
        />
      </Box>
    </Box>
  );
};

export default MovieManagement;
