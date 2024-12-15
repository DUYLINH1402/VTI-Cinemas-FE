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
import { setAuthToken } from "../utils/authStorage";
import app from "../services/firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi
const auth = getAuth();

// Chức năng Search (ĐÃ CHẠY OK)
export const searchFromFireBase = {
  searchMovies: async (queryText) => {
    // console.log("Querying Firebase with queryText:", queryText);
    const db = getDatabase();
    const movieRef = ref(db, "Movies");

    // Kiểm tra nếu queryText không hợp lệ
    if (!queryText || typeof queryText !== "string") {
      // console.error("Invalid queryText:", queryText);
      return []; // Trả về mảng rỗng nếu không có từ khóa
    }

    try {
      // Tìm kiếm theo `movie_name`
      const nameQuery = query(
        movieRef,
        orderByChild("movie_name"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );

      // Tìm kiếm theo `actor`
      const actorQuery = query(
        movieRef,
        orderByChild("actor"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );

      // Tìm kiếm theo `genre`
      const genreQuery = query(
        movieRef,
        orderByChild("genre"),
        startAt(queryText),
        endAt(queryText + "\uf8ff")
      );
      const snapshot = await get(movieRef); // Lấy toàn bộ dữ liệu từ Firebase
      if (!snapshot.exists()) {
        return []; // Nếu không có dữ liệu, trả về mảng rỗng
      }

      const normalizedQuery = queryText.toLowerCase(); // Chuyển từ khóa tìm kiếm về chữ thường

      const allMovies = Object.values(snapshot.val()); // Chuyển dữ liệu từ Firebase thành mảng

      // Lọc dữ liệu không phân biệt chữ hoa và chữ thường
      const filteredMovies = allMovies.filter((movie) => {
        return (
          movie.movie_name?.toLowerCase().includes(normalizedQuery) ||
          movie.actor?.toLowerCase().includes(normalizedQuery) ||
          movie.genre?.toLowerCase().includes(normalizedQuery)
        );
      });
      // console.log(filteredMovies);
      return filteredMovies; // Trả về kết quả đã lọc
    } catch (error) {
      console.error("Error in fireBaseService:", error);
      return [];
    }
  },
};
// Đổi mật khẩu trong Firebase dựa trên email
export const updatePasswordInFirebase = async (
  email,
  oldPassword,
  newPassword
) => {
  const db = getDatabase();

  // Tìm kiếm người dùng theo email
  const userQuery = query(
    ref(db, "Account"),
    orderByChild("email"),
    equalTo(email)
  );
  const userSnapshot = await get(userQuery);

  if (!userSnapshot.exists()) {
    throw new Error("Người dùng không tồn tại trong Firebase!");
  }

  // Lấy thông tin người dùng
  const userId = Object.keys(userSnapshot.val())[0];
  const userData = userSnapshot.val()[userId];

  if (!(oldPassword === userData.password)) {
    throw new Error("Mật khẩu cũ không chính xác!");
  }

  // Cập nhật mật khẩu
  const userRef = ref(db, `Account/${userId}`);
  await update(userRef, { password: newPassword });

  return "Mật khẩu đã được thay đổi!";
};
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
// Hàm lấy dữ liệu cho Movies (ĐÃ CHẠY OK)
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
// Hàm lấy dữ liệu cho Movies By Id (ĐÃ CHẠY OK)
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
// Hàm lấy dữ liệu cho Movies bằng 3 Nút lọc (ĐÃ CHẠY OK)
export const fetchMoviesByTabFromFirebase = async (tab) => {
  try {
    // Lấy toàn bộ dữ liệu từ Firebase
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
    );

    const movies = response.data ? Object.values(response.data) : [];
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

// Hàm lấy dữ liệu cho Carousel (ĐÃ CHẠY OK)
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
export const registerAccountToFirebase = async (formData) => {
  const db = getDatabase();
  const accountRef = ref(db, "Account");

  try {
    // Lấy snapshot của node "Account" để đếm số lượng tài khoản hiện có
    const snapshot = await get(accountRef);
    // Xác định account_id (tự tăng)
    const accountId = snapshot.exists() ? snapshot.size + 1 : 1;
    // Lưu dữ liệu vào Firebase với account_id là số
    const userRef = push(accountRef); // Tạo ref mới
    await set(userRef, {
      account_id: accountId, // Sử dụng account_id là số
      fullname: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      passport: "",
      birth_date: formData.birthDate,
      gender: formData.gender,
      password: formData.password,
      role: "user", // Role mặc định
      status: "active", // Trạng thái tài khoản
      city: "",
      district: "",
      address: "",
      avatar_url:
        "https://res.cloudinary.com/ddia5yfia/image/upload/v1731338363/avata-null_s9l4wy.jpg",
      created_date: new Date().toISOString().split("T")[0],
      updated_date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào Firebase:", error);
  }
};
// Hàm lấy tài khoản dựa trên email (ĐÃ CHẠY OK)
export const getAccountByEmailFromFirebase = async (email) => {
  const db = getDatabase();
  const accountRef = ref(db, "Account");
  const emailQuery = query(accountRef, orderByChild("email"), equalTo(email));

  try {
    const snapshot = await get(emailQuery);
    if (!snapshot.exists()) {
      throw new Error("Tài khoản không tồn tại trong hệ thống.");
    }

    // Kiểm tra xem có key hợp lệ hay không
    const accountKey = Object.keys(snapshot.val())[0]; // Lấy key đầu tiên
    if (!accountKey) {
      throw new Error("Không thể xác định accountKey.");
    }

    const accountData = snapshot.val()[accountKey];
    return { ...accountData, accountKey }; // Trả về cả dữ liệu và key
  } catch (error) {
    console.error("Lỗi khi lấy tài khoản từ Firebase:", error.message);
    throw error;
  }
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

// Hàm gọi API để lấy danh sách rạp (ĐÃ CHẠY OK)
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

// API Update Account (ĐÃ CHẠY OK)
export const updateAccountToFirebase = async (email, formData) => {
  const db = getDatabase();
  try {
    // Lấy thông tin tài khoản dựa trên email
    const accountData = await getAccountByEmailFromFirebase(email);

    // Kiểm tra accountKey
    const accountKey = accountData.accountKey;
    if (!accountKey) {
      throw new Error("Không thể xác định accountKey để cập nhật.");
    }

    const userRef = ref(db, `Account/${accountKey}`);

    // Cập nhật thông tin tài khoản
    await set(userRef, {
      ...accountData, // Giữ dữ liệu cũ
      ...formData, // Ghi đè bằng dữ liệu mới
      updated_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin Firebase:", error.message);
    throw error;
  }
};

// Hàm đăng nhập bằng email và mật khẩu (ĐÃ CHẠY OK)
export const loginWithEmailAndPasswordFromFirebase = async (
  email,
  password
) => {
  const auth = getAuth();
  try {
    // Kiểm tra tài khoản trên Realtime Database
    const userData = await getAccountByEmailFromFirebase(email);
    if (!userData) {
      throw new Error("Tài khoản không tồn tại trong hệ thống");
    }
    // Kiểm tra mật khẩu
    if (!(password === userData.password)) {
      throw new Error("Mật khẩu không chính xác!");
    }
    // Đăng nhập với Firebase Authentication để lấy token
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken(); // Lấy token của user
    setAuthToken(token);
    // Thông tin người dùng với token
    const result = {
      ...userData, // Thông tin từ Realtime Database
      token, // Token từ Firebase Authentication
    };

    return result;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    return { error: error.message || "Lỗi đăng nhập. Vui lòng thử lại!" }; // Trả lỗi để Redux xử lý
  }
};
