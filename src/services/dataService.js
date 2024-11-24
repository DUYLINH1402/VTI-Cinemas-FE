import {
  fetchMoviesFromFirebase,
  fetchCarouselDataFromFirebase,
  getAccountFromFirebase,
  createAccountToFirebase,
  getAccountByEmailFromFirebase,
  fetchMoviesByTabFromFirebase,
  fetchSeatsFromFirebase,
  fetchCinemasFromFirebase,
  fetchShowtimesFromFirebase,
  updateAccountToFirebase,
  fetchMoviesByIdFromFirebase,
  updatePasswordInFirebase,
  searchFromFireBase,
} from "./firebaseService";
import {
  fetchMoviesFromSQL,
  fetchCarouselDataFromSQL,
  fetchAccountFromSQL,
  createAccountToSQL,
  fetchAccountByEmailFromSQL,
  fetchMoviesByTabFromSQL,
  fetchSeatsFromSQL,
  fetchCinemasFromSQL,
  fetchMoviesByIdFromSQL,
  updatePasswordInSQL,
  searchFromSQL,
  // fetchShowtimesFromSQL,
} from "./sql/sqlService";

// Hàm Search
export const searchDataService = {
  getSearchSuggestions: async (query) => {
    console.log("Query received in dataService:", query);
    if (!query || typeof query !== "string") {
      console.error("Invalid query passed to dataService:", query);
      return [];
    }
    try {
      if (useFirebase) {
        return await searchFromFireBase.searchMovies(query);
      } else {
        return await searchFromSQL.searchMovies(query);
      }
    } catch (error) {
      console.error("Error in dataService:", error);
      return [];
    }
  },
};

// Hàm đổi mật khẩu
export const changePassword = async (email, oldPassword, newPassword) => {
  if (useFirebase) {
    // Sử dụng Firebase
    return await updatePasswordInFirebase(email, oldPassword, newPassword);
  } else {
    // Sử dụng SQL
    return await updatePasswordInSQL(email, oldPassword, newPassword);
  }
};
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";
// Hàm đăng nhập bằng Email/Pasword
const loginWithEmailAndPassword = async (email, password) => {
  try {
    // 1. Xác thực với Firebase
    const firebaseUser = await fireBaseService.loginWithFirebase(
      email,
      password
    );

    // 2. Lấy thông tin người dùng từ SQL dựa trên email của Firebase
    const sqlUser = await sqlService.loginWithSQL(firebaseUser.email);

    // 3. Kết hợp thông tin hoặc trả về dữ liệu từ SQL
    return {
      firebaseUser,
      sqlUser,
    };
  } catch (error) {
    throw new Error(`Login Error: ${error.message}`);
  }
};
// API lấy dữ liệu Account
export const fetchAccount = async (account_id) => {
  return useFirebase
    ? await getAccountFromFirebase(account_id)
    : await fetchAccountFromSQL(account_id);
};
// API lấy dữ liệu cho Movies
export const fetchMovies = async () => {
  return useFirebase
    ? await fetchMoviesFromFirebase()
    : await fetchMoviesFromSQL();
};
// API lấy dữ liệu cho MoviesBYID
export const fetchMoviesById = async (movie_id) => {
  return useFirebase
    ? await fetchMoviesByIdFromFirebase(movie_id)
    : await fetchMoviesByIdFromSQL(movie_id);
};
// API lấy dữ liệu Movies (hỗ trợ theo tab)
export const fetchMoviesByTab = async (tab) => {
  try {
    return useFirebase
      ? await fetchMoviesByTabFromFirebase(tab)
      : await fetchMoviesByTabFromSQL(tab);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// API lấy dữ liệu cho Carousel
export const fetchCarouselData = async () => {
  return useFirebase
    ? await fetchCarouselDataFromFirebase()
    : await fetchCarouselDataFromSQL();
};

// API tạo Account mới
export const createAccount = async (formData) => {
  return useFirebase
    ? await createAccountToFirebase(formData)
    : await createAccountToSQL(formData);
};
// API lấy Account By email
export const fetchAccountByEmail = async (email) => {
  return useFirebase
    ? await getAccountByEmailFromFirebase(email)
    : await fetchAccountByEmailFromSQL(email);
};
// API Update Account By email
export const updateAccount = async (formData) => {
  // console.log("Form data trước khi gọi updateAccountToFirebase:", formData);
  return useFirebase
    ? await updateAccountToFirebase(formData.email, formData)
    : await updateAccountToSQL(formData.email, formData);
};
// Hàm lấy dữ liệu Seats
export const fetchSeats = async () => {
  return useFirebase
    ? await fetchSeatsFromFirebase()
    : await fetchSeatsFromSQL();
};
// API lấy dữ liệu Cinemas
export const fetchCinemas = async () => {
  return useFirebase
    ? await fetchCinemasFromFirebase()
    : await fetchCinemasFromSQL();
};
// API lấy dữ liệu Showtimes
export const fetchShowtimes = async () => {
  return useFirebase
    ? await fetchShowtimesFromFirebase()
    : await fetchShowtimesFromSQL();
};
