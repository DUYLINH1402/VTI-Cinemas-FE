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
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
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
      const allRegions = Object.values(cinemas).map((cinema) => normalizeString(cinema.city));
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
  try {
    const db = getDatabase();
    const showtimesRef = ref(db, "Showtimes");
    const snapshot = await get(showtimesRef);

    if (!snapshot.exists()) {
      console.warn("Không có dữ liệu suất chiếu trong Firebase.");
      return {};
    }

    const showtimesData = snapshot.val();

    // Nếu không truyền cinema_id, trả về toàn bộ suất chiếu
    if (!cinema_id) {
      return showtimesData;
    }

    // Lọc các suất chiếu theo cinema_id
    const filteredShowtimes = Object.entries(showtimesData).reduce((acc, [key, value]) => {
      const cinemaIdInKey = key.includes(cinema_id);
      if (cinemaIdInKey && value.cinema_id === cinema_id) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // console.log(`Suất chiếu lấy được cho cinema_id ${cinema_id}:`, filteredShowtimes);

    if (Object.keys(filteredShowtimes).length === 0) {
      console.warn(`Không tìm thấy suất chiếu cho cinema_id: ${cinema_id}`);
      return {};
    }

    return filteredShowtimes;
  } catch (error) {
    console.error("Lỗi khi lấy suất chiếu từ Firebase:", error);
    return {};
  }
};

// API LẤY DANH SÁCH RẠP PHIM CÓ SUẤT CHIẾU TỪ FIREBASE KÈM TÊN RẠP
export const fetchCinemasWithShowtimesFromFirebase = async () => {
  try {
    const db = getDatabase(); // Kết nối tới Firebase Realtime Database

    // Lấy dữ liệu từ nhánh Showtimes
    const showtimesRef = ref(db, "Showtimes");
    const showtimesSnapshot = await get(showtimesRef);

    if (!showtimesSnapshot.exists()) {
      console.warn("Không tìm thấy dữ liệu suất chiếu trong Firebase.");
      return [];
    }

    const showtimesData = showtimesSnapshot.val();

    // Tạo một Set để lưu các cinema_id duy nhất
    const cinemaIds = new Set();
    Object.values(showtimesData).forEach((showtime) => {
      if (showtime.cinema_id) {
        cinemaIds.add(showtime.cinema_id);
      }
    });

    if (cinemaIds.size === 0) {
      console.warn("Không tìm thấy rạp nào có suất chiếu.");
      return [];
    }

    // Lấy dữ liệu từ nhánh Cinema
    const cinemasRef = ref(db, "Cinema");
    const cinemasSnapshot = await get(cinemasRef);
    // console.log("Danh sách Cinemas: ", cinemasSnapshot.val());
    if (!cinemasSnapshot.exists()) {
      console.warn("Không tìm thấy dữ liệu rạp trong nhánh Cinema.");
      return Array.from(cinemaIds)
        .sort()
        .map((id) => ({ id, name: "Unknown" }));
    }

    const cinemasData = cinemasSnapshot.val();
    // Tạo danh sách rạp với id và tên
    const cinemaList = Array.from(cinemaIds)
      .sort()
      .map((cinemaId) => {
        // Tìm thông tin rạp tương ứng trong nhánh Cinema
        const cinemaInfo = Object.entries(cinemasData).find(
          ([key, value]) => value.cinema_id === cinemaId
        );

        return {
          id: cinemaId,
          name: cinemaInfo ? cinemaInfo[1].cinema_name : "Unknown",
          latitude: cinemaInfo ? cinemaInfo[1].latitude : null, // Lấy latitude từ cinemaInfo
          longitude: cinemaInfo ? cinemaInfo[1].longitude : null, // Lấy longitude từ cinemaInfo
          city: cinemaInfo ? cinemaInfo[1].city : "Unknown", // Lấy city để lọc theo khu vực
          location: cinemaInfo ? cinemaInfo[1].location : "Unknown",
          logo: cinemaInfo ? cinemaInfo[1].logo : "Unknown",
        };
      });

    // console.log("Danh sách rạp có suất chiếu kèm tên:", cinemaList);

    return cinemaList;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp có suất chiếu từ Firebase:", error);
    return [];
  }
};
