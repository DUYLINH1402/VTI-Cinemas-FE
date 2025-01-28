import {
  fetchMoviesFromFirebase,
  getSubcommentsFromFirebase,
  pushSubcommentToFirebase,
  updateCommentsCountInFirebase,
  updateSubcommentInFirebase,
} from "../firebase/firebaseMovie.js";
import {} from "../sql/sqlMovie";
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG! // Chọn nguồn dữ liệu trong .env

// API LẤY DANH SÁCH PHIM
export const fetchMovies = async () => {
  return useFirebase
    ? await fetchMoviesFromFirebase()
    : await fetchMoviesFromSQL();
};

// API LẤY DANH SÁCH SUBCOMMENT CHO 1 COMMENT CỤ THỂ
export const getSubcomments = async (commentId) => {
  return useFirebase
    ? await getSubcommentsFromFirebase(commentId)
    : await getSubcommentsFromSQL(commentId);
};

// API THÊM SUBCOMMENT
export const pushSubcomment = async (commentId, newSubcommentData) => {
  return useFirebase
    ? await pushSubcommentToFirebase(commentId, newSubcommentData)
    : await pushSubcommentToSQL(commentId, newSubcommentData);
};

// API CẬP NHẬT COMMENTCOUNT
export const updateCommentsCount = async (commentId) => {
  return useFirebase
    ? await updateCommentsCountInFirebase(commentId)
    : await updateCommentsCountToSQL(commentId);
};

// API CHỈNH SỬA SUBCOMMENT
export const updateSubcomment = async (commentId, newText) => {
  return useFirebase
    ? await updateSubcommentInFirebase(commentId, newText)
    : await updateSubcommentToSQL(commentId, newText);
};
