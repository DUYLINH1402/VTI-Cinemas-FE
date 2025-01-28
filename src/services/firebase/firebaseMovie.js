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
import { getAuth } from "firebase/auth";
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

// API LẤY DNH SÁCH SUBCOMMENT (ĐÃ CHẠY OK)
export const getSubcommentsFromFirebase = async (commentId) => {
  try {
    const db = getDatabase();
    const subcommentsRef = ref(db, `Comments/${commentId}/subcomments`);
    const snapshot = await get(subcommentsRef);

    if (snapshot.exists()) {
      return Object.values(snapshot.val()); // Trả về danh sách subcomments
    }
    return []; // Nếu không có subcomments, trả về mảng rỗng
  } catch (error) {
    console.error("Lỗi khi lấy subcomments:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// API THÊM SUBCOMMENT (ĐÃ CHẠY OK)
export const pushSubcommentToFirebase = async (
  commentId,
  newSubcommentData
) => {
  try {
    const db = getDatabase();
    const subcommentsRef = ref(db, `Comments/${commentId}/subcomments`);
    const newSubcommentRef = push(subcommentsRef);
    await set(newSubcommentRef, newSubcommentData);
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("Lỗi khi thêm subcomment:", error);
    return false; // Trả về false nếu thất bại
  }
};

// API CẬP NHẬT COMMENTCOUNT (ĐÃ CHẠY OK)
export const updateCommentsCountInFirebase = async (
  commentId,
  increment = 1
) => {
  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);
    const snapshot = await get(commentRef);

    if (snapshot.exists()) {
      const currentCount = snapshot.val().commentsCount || 0;
      await update(commentRef, { commentsCount: currentCount + increment });
      return true;
    } else {
      console.warn(`Comment với ID ${commentId} không tồn tại!`);
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật commentsCount:", error);
    return false;
  }
};

// API CHỈNH SỬA SUBCOMMENT
export const updateSubcommentInFirebase = async (commentId, newText) => {
  try {
    const db = getDatabase();
    const commentRef = ref(db, `Comments/${commentId}`);

    await update(commentRef, { text: newText });

    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận:", error);
    return false;
  }
};
