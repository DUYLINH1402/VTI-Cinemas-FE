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
import MovieHeader from "./MovieHeader";
import MovieRow from "./MovieRow";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]); // Dữ liệu gốc
  const [filteredMovies, setFilteredMovies] = useState([]); // Kết quả sau tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openRowId, setOpenRowId] = useState(null);
  const itemsPerPage = 7;
  const [sortedMovies, setSortedMovies] = useState([]);
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData); // Lưu toàn bộ dữ liệu
        setSortedMovies(moviesData); // Mặc định là chưa sắp xếp
        setTotalPages(Math.ceil(moviesData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getMovies();
  }, []);

  const handleRowToggle = (id) => {
    setOpenRowId((prevId) => (prevId === id ? null : id));
  };
  const handleSort = (key) => {
    const sorted = [...movies].sort((a, b) => {
      if (key === "id") return a.movie_id - b.movie_id;
      if (key === "movie_name" || key === "actor" || key === "genre") {
        return a[key].localeCompare(b[key]);
      }
      if (key === "release_date") {
        return new Date(a[key]) - new Date(b[key]);
      }
      if (key === "rating" || key === "duration") {
        return b[key] - a[key];
      }
      return 0;
    });
    setSortedMovies(sorted);
    setCurrentPage(1); // Reset về trang đầu
  };

  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setTotalPages(Math.ceil(sortedMovies.length / itemsPerPage));
  }, [sortedMovies]);

  return (
    <Box sx={{ padding: 2 }}>
      <MovieHeader
        onSearch={(query) => console.log(query)} // Bổ sung tìm kiếm sau
        onSort={handleSort}
      />
      {/* Dòng title các mục của danh sách phim */}
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
                key={movie.movie_id}
                movie={movie}
                isOpen={openRowId === movie.movie_id}
                onToggle={handleRowToggle}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default MovieManagement;
