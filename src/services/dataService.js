import {
  fetchMoviesFromFirebase,
  fetchCarouselDataFromFirebase,
} from "./firebaseService";
import { fetchMoviesFromSQL, fetchCarouselDataFromSQL } from "./sql/sqlService";

const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

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
