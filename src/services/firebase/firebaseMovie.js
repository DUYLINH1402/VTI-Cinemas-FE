import axios from "axios";
import {
  getDatabase,
  ref,
  get,
  equalTo,
  set,
  push,
  query,
  orderByChild,
  update,
  startAt,
  endAt,
} from "firebase/database";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setAuthToken } from "../../utils/authStorage";
import app from "../firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi
const auth = getAuth();

// API LẤY DANH SÁCH PHIM (ĐÃ CHẠY OK)
export const fetchMoviesFromFirebase = async () => {
  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
    );
    return Object.values(response.data); // Chuyển đổi thành array nếu dữ liệu là object
  } catch (error) {
    console.error("Error fetching movies from Firebase:", error);
    throw error; // Throw để các hàm gọi biết lỗi
  }
};

// API LẤY DANH SÁCH PHIM THEO ID (ĐÃ CHẠY OK)
export const fetchMoviesByIdFromFirebase = async (movie_id) => {
  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
    );

    if (response.data) {
      // Chuyển dữ liệu từ object sang array và lọc theo `movie_id`
      const movies = Object.values(response.data);
      const movie = movies.find((m) => m.movie_id === parseInt(movie_id, 10)); // So khớp `movie_id`
      return movie || null;
    } else {
      console.log("No data found in Firebase.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie by ID from Firebase:", error);
    throw error;
  }
};
