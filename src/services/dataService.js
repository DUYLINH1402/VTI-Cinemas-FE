import {
  fetchMoviesFromFirebase,
  fetchCarouselDataFromFirebase,
  getAccountFromFirebase,
} from "./firebaseService";
import {
  fetchMoviesFromSQL,
  fetchCarouselDataFromSQL,
  fetchAccountFromSQL,
} from "./sql/sqlService";

const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";
// Hàm lấy dữ liệu Account
export const fetchAccount = async (account_id) => {
  return useFirebase
    ? await getAccountFromFirebase(account_id)
    : await fetchAccountFromSQL(account_id);
};
// Hàm lấy dữ liệu cho Movies
export const fetchMovies = async () => {
  return useFirebase
    ? await fetchMoviesFromFirebase()
    : await fetchMoviesFromSQL();
};
// Hàm lấy dữ liệu cho Carousel
export const fetchCarouselData = async () => {
  return useFirebase
    ? await fetchCarouselDataFromFirebase()
    : await fetchCarouselDataFromSQL();
};
