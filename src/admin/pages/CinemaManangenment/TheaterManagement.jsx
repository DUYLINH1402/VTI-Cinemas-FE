import React, { useState, useEffect } from "react";
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
  Pagination,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { fetchCinemas } from "../../../services/service/serviceCinemas";

const TheaterManagement = () => {
  const [cinemas, setCinemas] = useState([]); // Lưu danh sách rạp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const breadcrumbsLinks = [{ label: "Trang chủ", href: "/admin/dashboard" }];
  const breadcrumbsCurrent = "Danh sách rạp";

  // Gọi API để lấy danh sách rạp
  useEffect(() => {
    const getCinemas = async () => {
      try {
        const cinemasData = await fetchCinemas(); // Gọi API
        const itemsPerPage = 7;
        const total = Math.ceil(cinemasData.length / itemsPerPage); // Tổng số trang
        setTotalPages(total);

        // Lấy dữ liệu cho trang hiện tại
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCinemas(cinemasData.slice(startIndex, endIndex)); // Lọc dữ liệu
      } catch (error) {
        console.error("Lỗi khi lấy danh sách rạp:", error);
        setCinemas([]); // Gán mảng rỗng nếu lỗi
      }
    };

    getCinemas();
  }, [currentPage]);

  // Xử lý thay đổi trang
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header bảng: Tiêu đề + Nút thêm mới */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">Danh sách rạp</Typography>
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
          Thêm rạp mới
        </Button>
      </Box>
      {/* Bảng danh sách rạp */}
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(22, 10, 95, 0.2)",
              }}
            >
              <TableCell
                sx={{
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong>Tên rạp chiếu</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <strong>Khu vực</strong>
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <strong>Địa chỉ</strong>
              </TableCell>
              <TableCell
                sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                align="center"
              >
                <strong>Chỉnh sửa</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cinemas.map((cinema, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff", // Màu xen kẽ
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                >
                  {cinema.cinema_name}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                >
                  {cinema.city}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                >
                  {cinema.location}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                  align="center"
                >
                  <IconButton
                    color="primary"
                    onClick={() => console.log("Edit", cinema.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => console.log("Delete", cinema.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TheaterManagement;
