// DO HỆ THỐNG MỞ RỘNG NÊN CẦN CHIA CÁC API THEO TỪNG BẢNG ĐỂ DỄ QUẢN LÝ
// SAU NÀY CÓ THỜI GIAN SẼ CHIA LẠI CÁC API ĐÃ LÀM

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
import { normalizeString } from "../../utils/validation.js";
import app from "../firebase/firebaseConfig"; // Import Firebase App đã khởi tạo. Nếu khống có khi chạy chương trình sẽ lỗi
const auth = getAuth();

// API LẤY DANH SÁCH CÁC RẠP PHIM (ĐÃ CHẠY OK)
export const fetchCinemasFromFirebase = async () => {
  try {
    const db = getDatabase(); // Kết nối tới database Firebase
    const snapshot = await get(ref(db, "Cinema")); // Lấy dữ liệu từ path "Cinema"

    if (snapshot.exists()) {
      const data = snapshot.val(); // Dữ liệu thô từ Firebase (object)
      // Chuyển đổi object thành mảng
      const cinemas = Object.keys(data).map((key) => ({
        id: key, // Key của mỗi rạp (ví dụ: cinema1, cinema10)
        ...data[key], // Spread các trường dữ liệu bên trong từng rạp
      }));
      return cinemas; // Trả về mảng danh sách rạp
    } else {
      console.warn("Không tìm thấy dữ liệu Cinema");
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp từ Firebase:", error);
    return [];
  }
};
// API LẤY DANH SÁCH KHU VỰC CỦA TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG (ĐÃ CHẠY OK)
export const fetchRegionsOfCinemasFromFirebase = async () => {
  try {
    const db = getDatabase();
    const cinemaRef = ref(db, "Cinema"); // Đường dẫn tới node "Cinema"
    const snapshot = await get(cinemaRef);

    if (snapshot.exists()) {
      const cinemas = snapshot.val();
      const allRegions = Object.values(cinemas).map((cinema) =>
        normalizeString(cinema.city)
      );
      // Loại bỏ các khu vực trùng lặp
      return [...new Set(allRegions)];
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khu vực:", error);
    throw error;
  }
};

// API LẤY DANH SÁCH RẠP PHIM THEO KHU VỰC (ĐÃ CHẠY OK)
export const fetchCinemasByRegionFromFirebase = async (region) => {
  const normalizedRegion = normalizeString(region); // Chuẩn hóa region
  if (!region) {
    console.error("Region không hợp lệ:", region); // Log lỗi nếu region không được truyền
    return [];
  }

  try {
    const db = getDatabase();
    const cinemaRef = ref(db, "Cinema");
    const snapshot = await get(cinemaRef);

    if (snapshot.exists()) {
      const cinemas = snapshot.val();
      // Lọc danh sách rạp theo khu vực
      const filteredCinemas = Object.values(cinemas).filter(
        (cinema) => normalizeString(cinema.city) === normalizedRegion
      );
      console.log("Danh sách rạp trong khu vực:", filteredCinemas);

      return filteredCinemas;
    }

    return [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp theo khu vực:", error);
    throw error;
  }
};

// API GỬI THÔNG TIN LIÊN HỆ (ĐÃ CHẠY OK)
export const sendContactInfoToFirebase = async (data) => {
  try {
    const db = getDatabase(); // Lấy instance của Realtime Database
    const contactRef = ref(db, "Contacts"); // Đường dẫn đến collection "Contacts"
    await push(contactRef, data); // Thêm một object mới vào "Contacts"
    console.log("Dữ liệu đã được lưu thành công vào Realtime Database!");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu lên Realtime Database:", error);
    throw error; // Bắn lỗi để xử lý phía trên
  }
};

// API THÊM RẠP MỚI (ĐÃ CHẠY OK)
export const addCinemaToFirebase = async (newCinema) => {
  try {
    const db = getDatabase(); // Kết nối tới Firebase
    const cinemaRef = ref(db, "Cinema"); // Đường dẫn tới nhánh Cinema

    // Lấy danh sách hiện có để tính toán key mới
    const snapshot = await get(cinemaRef);
    let maxId = 0;

    if (snapshot.exists()) {
      const cinemas = snapshot.val();
      // Tìm ID lớn nhất trong các key hiện tại
      maxId = Math.max(
        ...Object.keys(cinemas)
          .filter((key) => key.startsWith("cinema")) // Lọc các key theo format cinemaX
          .map((key) => parseInt(key.replace("cinema", ""), 10)),
        0
      );
    }

    // Tạo key mới dạng cinemaX
    const newCinemaKey = `cinema${maxId + 1}`;
    const newCinemaData = {
      cinema_name: newCinema.name,
      city: newCinema.city,
      location: newCinema.location,
      is_protected: newCinema.is_protected || false,
      cinema_id: maxId + 1,
    };

    // Lưu dữ liệu vào Firebase với key mới
    await set(ref(db, `Cinema/${newCinemaKey}`), newCinemaData);

    console.log("Rạp mới đã thêm vào Firebase với key:", newCinemaKey);
    return newCinemaKey;
  } catch (error) {
    console.error("Lỗi khi thêm rạp vào Firebase:", error);
    throw error;
  }
};

// API LẤY DANH SÁCH SUẤT CHIẾU TỪ FIREBASE
export const fetchShowtimesFromFirebase = async (cinema_id) => {
  if (!cinema_id) {
    console.error("fetchShowtimes: Missing cinema_id");
    return [];
  }

  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Cinema.json"
    );

    const cinemas = response.data;
    if (!cinemas) {
      console.warn("⚠ Không có dữ liệu rạp chiếu trong Firebase.");
      return [];
    }

    //  Tìm key rạp theo `cinema_id`
    const cinemaKey = Object.keys(cinemas).find(
      (key) => cinemas[key].cinema_id === cinema_id
    );

    if (!cinemaKey) {
      console.warn(`Không tìm thấy rạp có cinema_id: ${cinema_id}`);
      return [];
    }

    const showtimes = cinemas[cinemaKey].showtimes || {};
    console.log(" Suất chiếu lấy từ Firebase:", showtimes);

    return Object.entries(showtimes).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  } catch (error) {
    console.error(" Lỗi khi lấy suất chiếu từ Firebase:", error);
    return [];
  }
};

