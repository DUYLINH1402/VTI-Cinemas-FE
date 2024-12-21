import React from "react";
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import styles from "./MovieManagement.module.scss"; // Import CSS Module

const MovieRow = ({ movie, isOpen, onToggle }) => {
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
};
export default MovieRow;
