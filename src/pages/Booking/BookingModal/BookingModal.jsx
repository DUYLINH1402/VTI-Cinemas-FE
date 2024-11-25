import React, { useState, useEffect } from "react";
import { fetchCinemas } from "../../../services/dataService"; // Import hàm fetchCinemas từ dataService
import "./BookingModal.modul.scss";

const BookingModal = ({ movie_id, onNext, onClose }) => {
  const [cinema, setCinema] = useState(""); // State lưu rạp được chọn
  const [cinemaList, setCinemaList] = useState([]); // State lưu danh sách rạp
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading
  const [error, setError] = useState(null); // State lưu lỗi (nếu có)

  // Gọi API lấy danh sách rạp khi component được render
  useEffect(() => {
    const getCinemas = async () => {
      try {
        setLoading(true); // Bật trạng thái loading trước khi gọi API
        const data = await fetchCinemas(); // Gọi API lấy danh sách rạp
        console.log("Fetched Cinemas:", data); // Log dữ liệu trả về từ API
        setCinemaList(Object.values(data)); // Chuyển đổi Object thành Array và lưu vào state
      } catch (err) {
        setError(err.message || "Failed to load cinemas."); // Lưu thông báo lỗi nếu gọi API thất bại
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi API hoàn tất
      }
    };

    getCinemas(); // Gọi hàm lấy danh sách rạp
  }, []); // Chỉ gọi API một lần khi component được render lần đầu

  // Xử lý khi người dùng nhấn nút "Tiếp theo"
  const handleSubmit = () => {
    if (cinema) {
      onNext({
        cinema: cinema, // Truyền thông tin rạp đã chọn
        movie_id: movie_id, // Truyền ID phim đã chọn
      });
      console.log("Cinema Selected:", cinema); // Log thông tin rạp đã chọn
      console.log("Movie ID", movie_id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-booking">
        <h2>Chọn rạp chiếu</h2>
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="error">{error}</p>}

        {/* Hiển thị trạng thái loading nếu đang tải danh sách rạp */}
        {loading ? (
          <p>Đang tải danh sách rạp...</p>
        ) : (
          <select onChange={(e) => setCinema(e.target.value)} value={cinema}>
            {/* Tùy chọn mặc định */}
            <option value="">---Vị trí rạp---</option>
            {/* Hiển thị danh sách các rạp */}
            {cinemaList.map((cinemaItem) => (
              <option key={cinemaItem.cinema_id} value={cinemaItem.cinema_name}>
                {cinemaItem.cinema_name}
              </option>
            ))}
          </select>
        )}

        {/* Nút Cancel để đóng modal */}
        <button className="button-action cancel" onClick={onClose}>
          Cancel
        </button>

        {/* Nút Tiếp theo để chuyển sang bước tiếp theo */}
        <button
          className="button-action success"
          onClick={handleSubmit}
          disabled={!cinema} // Chỉ cho phép nhấn nếu đã chọn rạp
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default BookingModal; // Xuất component để sử dụng trong các phần khác
