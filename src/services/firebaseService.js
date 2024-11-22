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
  child,
} from "firebase/database";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const auth = getAuth();

import bcrypt from "bcryptjs";
import app from "./firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi
// const db = getDatabase();
// Lấy thông tin Account
export const getAccountFromFirebase = async (account_id) => {
  const db = getDatabase();
  const userRef = ref(db, `Account/${account_id}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("User data not found");
  }
};
// Hàm lấy dữ liệu cho Movies
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
// Hàm lấy dữ liệu cho Movies bằng 3 Nút lọc
export const fetchMoviesByTabFromFirebase = async (tab) => {
  try {
    // Lấy toàn bộ dữ liệu từ Firebase
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
    );

    const movies = response.data ? Object.values(response.data) : []; // Chuyển từ object sang array
    const currentDate = new Date(); // Ngày hiện tại để so sánh

    // Lọc dữ liệu dựa trên tab
    let filteredMovies = [];
    if (tab === "upcoming") {
      // Phim sắp chiếu: release_date > currentDate
      filteredMovies = movies.filter((movie) => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate > currentDate;
      });
    } else if (tab === "nowShowing") {
      // Phim đang chiếu: release_date <= currentDate
      filteredMovies = movies.filter((movie) => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate <= currentDate;
      });
    } else if (tab === "specialShows") {
      // Suất chiếu đặc biệt: is_special_show === true
      filteredMovies = movies.filter((movie) => movie.is_special_show);
    }

    return filteredMovies;
  } catch (error) {
    console.error(`Error fetching ${tab} movies from Firebase:`, error);
    throw error;
  }
};

// Hàm lấy dữ liệu cho Carousel
export const fetchCarouselDataFromFirebase = async () => {
  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Banners.json"
    );
    const data = response.data;
    const bannersArray = Object.keys(data).map((key) => ({
      ...data[key],
      id: key, // Lưu key Firebase làm ID
    }));
    return bannersArray;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Hàm lưu thông tin Account
export const createAccountToFirebase = async (formData) => {
  const db = getDatabase();
  const accountRef = ref(db, "Account");

  try {
    // Lấy snapshot của node "Account" để đếm số lượng tài khoản hiện có
    const snapshot = await get(accountRef);

    // Xác định account_id (tự tăng)
    const accountId = snapshot.exists() ? snapshot.size + 1 : 1;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(formData.password, 10); // 10 là số rounds mã hóa

    // Lưu dữ liệu vào Firebase với account_id là số
    const userRef = push(accountRef); // Tạo ref mới
    await set(userRef, {
      account_id: accountId, // Sử dụng account_id là số
      fullname: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      birth_date: formData.birthDate,
      gender: formData.gender,
      password: hashedPassword,
      role: "user", // Role mặc định
      status: "active", // Trạng thái tài khoản
      created_date: new Date().toISOString().split("T")[0],
      updated_date: new Date().toISOString().split("T")[0],
    });

    console.log(
      "Lưu dữ liệu vào Firebase thành công với account_id:",
      accountId
    );
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào Firebase:", error);
  }
};
// Hàm lấy tài khoản dựa trên email
export const getAccountByEmailFromFirebase = async (email) => {
  const db = getDatabase();
  const accountRef = ref(db, "Account");
  const emailQuery = query(accountRef, orderByChild("email"), equalTo(email));

  const snapshot = await get(emailQuery);
  if (!snapshot.exists()) {
    throw new Error("Tài khoản không tồn tại.");
  }

  // Trả về tài khoản đầu tiên tìm được
  const accounts = Object.values(snapshot.val());
  return accounts[0];
};

// Hàm lưu thông tin Seats
export const fetchSeatsFromFirebase = async () => {
  try {
    const reponse = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Seats.json"
    );
    return Object.values(reponse.data);
  } catch (error) {
    console.error("Error fetching seats from Firebase:", error);
  }
};

// Hàm gọi API để lấy danh sách rạp
export const fetchCinemasFromFirebase = async () => {
  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Cinema.json"
    );
    return response.data; // Trả về dữ liệu danh sách rạp
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    throw error;
  }
};

// API Lấy danh sách suất chiếu từ Firebase
export const fetchShowtimesFromFirebase = async (cinema_id) => {
  try {
    const response = await axios.get(
      `https://vticinema-default-rtdb.firebaseio.com/Showtimes.json`
    );
    return Object.values(response.data); // Trả về danh sách suất chiếu
  } catch (error) {
    console.error("Error fetching showtimes from Firebase:", error);
    throw error;
  }
};

// RESET Password
export const forgotPassword = {
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};
