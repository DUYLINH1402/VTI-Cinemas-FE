import axios from "axios";
import api from "./api";

// API lấy thông tin Account bằng ID
export const fetchAccountFromSQL = async (account_id) => {
  const response = await api.get(`/api/account/findId/${account_id}`); // endpoint của backend
  return response.data;
};
// API lấy thông tin Account bằng Email
// api phải là http://localhost:8081
export const fetchAccountByEmailFromSQL = async (loginRequest) => {
  const response = await api.get(`/api/login/email`, loginRequest); // endpoint của backend
  return response.data;
};
// API lấy dữ liệu Movies từ SQL
export const fetchMoviesFromSQL = async () => {
  try {
    const response = await api.get("/movie/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API lấy dữ liệu cho Movies bằng 3 Nút lọc
export const fetchMoviesByTabFromSQL = async (tab) => {
  let endpoint = "/movie";
  switch (tab) {
    case "upcoming":
      endpoint = "/movie/findComingSoon";
      break;
    case "nowShowing":
      endpoint = "/movie/findShowing";
      break;
    case "specialShows":
      endpoint = "/movie/findSpecial";
      break;
    default:
      endpoint = "/movie";
  }

  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${tab} movies from SQL:`, error);
    throw error;
  }
};

// API lấy dữ liệu Carousel từ SQL
export const fetchCarouselDataFromSQL = async () => {
  const response = await api.get("/carousel"); // endpoint của backend
  return response.data;
};

// API Create Account
export const createAccountToSQL = async (accountRequest) => {
  try {
    // register chỉ cần username, email, password là đủ update sẽ cập nhật sau _tzanlam
    const response = await api.post("/register", {
      //fullname: accountRequest.name,
      email: accountRequest.email,
      username: accountRequest.username,
      // phone_number: accountRequest.phone,
      // birth_date: accountRequest.birthDate,
      // gender: accountRequest.gender,
      password: accountRequest.password, // Có thể mã hóa trước khi gửi
                          // => bên be đã mã hóa chỉ cần truyền dữ liệu String 
    });

    console.log("Lưu dữ liệu vào SQL thành công:", response.data);
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào SQL:", error);
  }
};
// API lấy dữ liệu CINEMAS từ SQL
export const fetchCinemasFromSQL = async () => {
  try {
    const response = await api.get("/cinema/find"); // endpoint của backend
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching movies from SQL:", error);
    throw error; // Throw lỗi để xử lý ở nơi gọi
  }
};

// API Lấy danh sách suất chiếu từ SQL
// cái này theo em thì đầu tiên khi ấn vào Cinema sẽ show ra list phim
export const fetchMovieFormSql = async (cinema_id) => {
  try {
    const response = await api.get(`/cinema/findMovies/${cinema_id}`);
    return response.data;
  } catch (error) {
      console.error("Error fetching movie", error);
      
  }
}
// sau đó khi người dùng ấn vào phim cụ thể sẽ show ra lịch chiếu
export const fetchShowTimesOnMovie =async (movie_id)=>{
  try {
    const reponse = api.get(`/showtime/findByMovie/${movie_id}`);
    return reponse.data; // => cái này sẽ trả về lịch chiếu phim trong ngày hôm đó không hiện những ngày khác
  } catch (error) {
    console.error("Error fetching showtime by movie", error);
  }
}
// còn phương thức của anh thì gộp chung khá nhiều cũng khá rộng.
//Em nghĩ cứ ghép lại từ cái api nhỏ thui ạ. function em đã tab thu gọn r _tzanlam
// export const fetchShowtimesFromSQL = async () => {
//   try {
//     const response = await api.get(`/showtimes?cinemaId=${cinema_id}`); // endpoint của backend
//     return response.data; // Trả về danh sách suất chiếu
//   } catch (error) {
//     console.error("Error fetching showtimes from SQL:", error);
//     throw error;
//   }
// };

// sau khi chọn xong phim thì sẽ hiện ra các button là các ghế cụ thể logic em nghĩ sẽ là: 
// chọn cinema => chọn phim => chọn giờ chiếu => tìm kiếm xem phòng nào chiếu phim đó giờ đó
// sau đó fetchSeat theo movie với start time tìm ra room rồi kiếm ra seatRoom
const fetchSeatRoomByMovieIdAndStartTime = async (movie_id, start_time) => {
  try {
    return api.get(`/showtime/findSeatRoomByMovieAndStartTime/${movie_id}/${start_time}`.data);
  } catch (error) {
    console.error("Error fetching SeatRoom by Movie and StartTime"+ error);
  }
}
// nãy giờ em chỉnh đang làm 1 trường hợp đối với phim được chiếu trong ngày hôm đó thui nhé

const createTikcet = async(TicketRequest) => {
  try {
    
  } catch (error) {
    
  }
}
// Hàm lấy dữ liệu Seat
export const fetchSeatsFromSQL = async () => {
  const reponse = await api.get("/seat");
  return reponse.data;
};
