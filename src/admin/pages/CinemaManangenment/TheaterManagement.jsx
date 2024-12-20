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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Slide,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { fetchCinemas } from "../../../services/service/serviceCinemas";
import { validateTheaterForm, isValidForm } from "../../utils/validation.js";
import "./TheaterManagement.modul.scss";

// Hiệu ứng chuyển động Slide
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TheaterManagement = () => {
  const [cinemas, setCinemas] = useState([]); // Lưu danh sách rạp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  // State quản lý Dialog và form input
  const [open, setOpen] = useState(false);
  // State quản lý form và lỗi
  const [newCinema, setNewCinema] = useState({
    name: "",
    city: "",
    location: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    city: "",
    location: "",
  });
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

  // Xử lý mở/đóng Dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCinema({ name: "", city: "", location: "" });
    setErrors({ name: "", city: "", location: "" });
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCinema((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Xóa lỗi khi nhập lại
  };
  // Xử lý thêm rạp mới
  const handleAddCinema = async () => {
    // Validate form trước khi gửi dữ liệu
    const validationErrors = validateTheaterForm(newCinema);
    setErrors(validationErrors);
    if (isValidForm(validationErrors)) {
      try {
        await addCinema(newCinema); // Gọi API để thêm rạp mới
        console.log("Thêm rạp mới:", newCinema);
        handleClose();
        loadCinemas(); // Tải lại danh sách rạp
      } catch (error) {
        console.error("Lỗi khi thêm rạp mới:", error);
      }
    }
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
          onClick={handleOpen}
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
      {/* Dialog Thêm Rạp */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition} // Thêm hiệu ứng chuyển động
        keepMounted // Giữ Dialog trong DOM để mượt mà hơn
      >
        <DialogTitle>Thêm Rạp Mới</DialogTitle>
        <DialogContent sx={{ fontSize: "1.4rem" }}>
          <Box className="theater-input-container">
            <TextField
              label="Tên rạp"
              name="name"
              value={newCinema.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
            />
            <Box className="error-container">
              {!!errors.name && (
                <Typography className="error-message">{errors.name}</Typography>
              )}
            </Box>
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Khu vực"
              name="city"
              value={newCinema.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.city}
            />
            <Box className="error-container">
              {!!errors.city && (
                <Typography className="error-message">{errors.city}</Typography>
              )}
            </Box>
          </Box>

          <Box className="theater-input-container">
            <TextField
              label="Địa chỉ"
              name="location"
              value={newCinema.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.location}
            />
            <Box className="error-container">
              {!!errors.location && (
                <Typography className="error-message">
                  {errors.location}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleAddCinema} color="primary" variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TheaterManagement;
