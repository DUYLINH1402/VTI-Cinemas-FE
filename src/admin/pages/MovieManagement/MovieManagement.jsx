import React, { useState, useEffect, memo } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { fetchMovies } from "../../../services/service/serviceMovie"; // API giả định
import styles from "./MovieManagement.module.scss"; // Import CSS Module

const MovieRow = memo(({ movie, isOpen, onToggle }) => {
  return (
    <>
      {/* Hàng chính */}
      <TableRow
        onClick={() => onToggle(movie.movie_id)}
        className={`${styles.tableRow} ${
          isOpen ? styles.tableRowSelected : ""
        }`}
      >
        <TableCell>{movie.movie_name}</TableCell>
        <TableCell>{movie.actor}</TableCell>
        <TableCell align="center">{movie.duration} phút</TableCell>
        <TableCell>{movie.genre}</TableCell>
        <TableCell align="center">{movie.release_date}</TableCell>
        <TableCell align="center">{movie.rating}</TableCell>
        <TableCell align="center">
          <IconButton color="primary" onClick={(e) => e.stopPropagation()}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={(e) => e.stopPropagation()}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Hàng chi tiết */}
      <TableRow>
        <TableCell colSpan={7} style={{ padding: 0 }}>
          <Box
            className={`${styles.detailContainer} ${
              isOpen ? styles.detailContainerOpen : ""
            }`}
          >
            <Typography>
              <span className={styles.lableDetail}>- Đạo diễn:</span>
              {movie.director || "Không có thông tin"}
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Ngôn ngữ:</span>
              {movie.language}
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Trailer:</span>
              <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.trailerLink}
              >
                Xem trailer
              </a>
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Ảnh:</span>
              <a
                href={movie.image}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.trailerLink}
              >
                Xem ảnh
              </a>
            </Typography>
            <Typography>
              <span className={styles.lableDetail}>- Mô tả:</span>
              <span className={styles.detailText}>
                {movie.description || "Không có mô tả"}
              </span>
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
});

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openRowId, setOpenRowId] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies(); // API giả định
        const total = Math.ceil(moviesData.length / itemsPerPage);
        setTotalPages(total);
        const startIndex = (currentPage - 1) * itemsPerPage;
        setMovies(moviesData.slice(startIndex, startIndex + itemsPerPage));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getMovies();
  }, [currentPage]);

  const handleRowToggle = (id) => {
    setOpenRowId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">Danh sách phim</Typography>
        <Button
          sx={{
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#125a9c" },
            fontSize: "1.4rem",
          }}
          variant="contained"
          color="primary"
          onClick={() => console.log("Đi tới giao diện thêm mới")}
        >
          Thêm phim mới
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
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
            {movies.map((movie) => (
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
