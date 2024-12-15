import { fetchMoviesFromFirebase } from "../firebase/firebaseMovie";
import { fetchMoviesFromSQL } from "../sql/sqlMovie";
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG! // Chọn nguồn dữ liệu trong .env

// API LẤY DANH SÁCH PHIM
export const fetchMovies = async () => {
  return useFirebase
    ? await fetchMoviesFromFirebase()
    : await fetchMoviesFromSQL();
};
