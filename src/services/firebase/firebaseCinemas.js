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

// API LẤY DANH SÁCH CÁC RẠP PHIM
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
// API LẤY DANH SÁCH KHU VỰC CỦA TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
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

// API LẤY DANH SÁCH RẠP PHIM THEO KHU VỰC
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

// API GỬI THÔNG TIN LIÊN HỆ
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
