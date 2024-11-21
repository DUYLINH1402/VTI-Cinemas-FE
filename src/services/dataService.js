import {
  fetchMoviesFromFirebase,
  fetchCarouselDataFromFirebase,
  getAccountFromFirebase,
  createAccountToFirebase,
  getAccountByEmailFromFirebase,
  fetchMoviesByTabFromFirebase,
  fetchSeatsFromFirebase,
} from "./firebaseService";
import {
  fetchMoviesFromSQL,
  fetchCarouselDataFromSQL,
  fetchAccountFromSQL,
  createAccountToSQL,
  fetchAccountByEmailFromSQL,
  fetchMoviesByTabFromSQL,
  fetchSeatsFromSQL,
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

// Hàm lấy dữ liệu Seats
export const fetchSeats = async () => {
  return useFirebase
    ? await fetchSeatsFromFirebase()
    : await fetchSeatsFromSQL();
};
