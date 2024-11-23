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
  // fetchShowtimesFromSQL,
} from "./sql/sqlService";

const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

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
