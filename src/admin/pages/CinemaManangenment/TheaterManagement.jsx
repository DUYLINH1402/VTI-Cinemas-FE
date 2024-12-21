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
import {
  fetchCinemas,
  addCinema,
} from "../../../services/service/serviceCinemas";
import { validateTheaterForm, isValidForm } from "../../utils/validation.js";
import { toast } from "react-toastify";
import "./TheaterManagement.modul.scss";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";

// Hiệu ứng chuyển động Slide
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TheaterManagement = () => {
  const [cinemas, setCinemas] = useState([]); // Lưu danh sách rạp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [searchQuery, setSearchQuery] = useState(""); // State lưu giá trị tìm kiếm
  // State quản lý Dialog và form input
  const [open, setOpen] = useState(false);
  // State quản lý form và lỗi
  const [newCinema, setNewCinema] = useState({
    name: "",
    city: "",
    location: "",
    is_protected: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    city: "",
    location: "",
  });
  // Gọi API để lấy danh sách rạp
  const loadCinemas = async (page = 1) => {
    try {
      const cinemasData = await fetchCinemas(); // Lấy danh sách rạp từ API

      // Lọc rạp theo từ khóa tìm kiếm
      const filteredCinemas = cinemasData
        .filter((cinema) => {
          const matchName =
            cinema.name &&
            cinema.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchCity =
            cinema.city &&
            cinema.city.toLowerCase().includes(searchQuery.toLowerCase());
          const matchLocation =
            cinema.location &&
            cinema.location.toLowerCase().includes(searchQuery.toLowerCase());

          return matchName || matchCity || matchLocation;
        })
        .sort((a, b) => b.cinema_id - a.cinema_id); // Sắp xếp theo cinema_id giảm dần

      const itemsPerPage = 7; // Số lượng rạp mỗi trang
      const total = Math.ceil(filteredCinemas.length / itemsPerPage);
      setTotalPages(total);

      // Chia trang
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCinemas(filteredCinemas.slice(startIndex, endIndex));
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
      setCinemas([]); // Nếu lỗi, gán danh sách rạp là rỗng
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query); // Cập nhật từ khóa tìm kiếm
    setCurrentPage(1); // Luôn quay về trang đầu tiên khi tìm kiếm
  };
  useEffect(() => {
    loadCinemas(currentPage); // Gọi lại loadCinemas khi searchQuery hoặc currentPage thay đổi
  }, [currentPage, searchQuery]);
  console.log(searchQuery);
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
    const validationErrors = validateTheaterForm(newCinema);
    setErrors(validationErrors);

    if (isValidForm(validationErrors)) {
      try {
        const newCinemaData = {
          name: newCinema.name || "Tên rạp chưa xác định",
          city: newCinema.city || "Khu vực chưa xác định",
          location: newCinema.location || "Địa chỉ chưa xác định",
          is_protected: newCinema.is_protected || false, // Giá trị mặc định
        };

        // Gọi API thêm rạp mới
        await addCinema(newCinemaData);
        console.log("Thêm rạp mới thành công:", newCinemaData);

        handleClose();

        // Chuyển về trang đầu và cập nhật danh sách
        setCurrentPage(1);
        loadCinemas(1, searchQuery); // Cập nhật danh sách theo giá trị tìm kiếm
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
        <SearchBar
          onSearch={(query) => handleSearch(query)}
          placeholder="Tìm kiếm rạp, khu vực, địa chỉ..."
        />
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
          {cinemas.length > 0 ? (
            <TableBody>
              {cinemas.map((cinema, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>{cinema.cinema_name}</TableCell>
                  <TableCell>{cinema.city}</TableCell>
                  <TableCell>{cinema.location}</TableCell>
                  <TableCell align="center">
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
          ) : (
            <Typography
              sx={{ display: "block", textAlign: "center", padding: "7px" }}
            >
              Không tìm thấy rạp nào khớp với từ khóa: "{searchQuery}"
            </Typography>
          )}
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
          <Button
            onClick={handleClose}
            color="secondary"
            className="dialog-actions-btn"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddCinema}
            color="primary"
            variant="contained"
            className="dialog-actions-btn"
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TheaterManagement;
