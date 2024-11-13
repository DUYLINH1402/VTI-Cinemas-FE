import api from "./api";

// Hàm lấy thông tin Account
export const fetchAccountFromSQL = async (account_id) => {
  const response = await api.get(`/api/users/${account_id}`); // endpoint của backend
  return response.data;
};
// Hàm lấy dữ liệu Movies từ SQL
export const fetchMoviesFromSQL = async () => {
  const response = await api.get("/movies"); // endpoint của backend
  return response.data;
};
// Hàm lấy dữ liệu Carousel từ SQL
export const fetchCarouselDataFromSQL = async () => {
  const response = await api.get("/carousel"); // endpoint của backend
  return response.data;
};
