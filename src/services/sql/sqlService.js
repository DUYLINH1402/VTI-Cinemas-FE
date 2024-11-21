import axios from "axios";
import api from "./api";

// Hàm lấy thông tin Account bằng ID
export const fetchAccountFromSQL = async (account_id) => {
  const response = await api.get(`/api/users/${account_id}`); // endpoint của backend
  return response.data;
};
// Hàm lấy thông tin Account bằng Email
export const fetchAccountByEmailFromSQL = async (account_id) => {
  const response = await api.get(`/api/users/${email}`); // endpoint của backend
  return response.data;
};
// Hàm lấy dữ liệu Movies từ SQL
export const fetchMoviesFromSQL = async () => {
  try {
    const response = await api.get("/movies"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// Hàm lấy dữ liệu cho Movies bằng 3 Nút lọc
export const fetchMoviesByTabFromSQL = async (tab) => {
  let endpoint = "/movies";
  switch (tab) {
    case "upcoming":
      endpoint = "/movies/upcoming";
      break;
    case "nowShowing":
      endpoint = "/movies/now-showing";
      break;
    case "specialShows":
      endpoint = "/movies/special-shows";
      break;
    default:
      endpoint = "/movies";
  }

  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${tab} movies from SQL:`, error);
    throw error;
  }
};

// Hàm lấy dữ liệu Carousel từ SQL
export const fetchCarouselDataFromSQL = async () => {
  const response = await api.get("/carousel"); // endpoint của backend
  return response.data;
};

// Hàm Create Account
export const createAccountToSQL = async (formData) => {
  try {
    const response = await axios.post("/api/register", {
      fullname: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      birth_date: formData.birthDate,
      gender: formData.gender,
      password: formData.password, // Có thể mã hóa trước khi gửi
    });

    console.log("Lưu dữ liệu vào SQL thành công:", response.data);
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào SQL:", error);
  }
};

// Hàm lấy dữ liệu Seat 
export const fetchSeatsFromSQL = async () => {
  const reponse = await api.get("/seat");
  return reponse.data
}
