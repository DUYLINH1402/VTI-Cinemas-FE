import React, { useState, useEffect } from "react";
import { fetchCinemas } from "../../../services/service/serviceCinemas"; // Giả định hàm này lấy dữ liệu từ API
import "./BookingModal.modul.scss";

const BookingModal = ({ movie_id, onNext, onClose, cinema_id }) => {
  const [cinema, setCinema] = useState(""); // State lưu rạp được chọn
  const [cinemaList, setCinemaList] = useState([]); // State lưu danh sách rạp
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading
  const [error, setError] = useState(null); // State lưu lỗi (nếu có)

  // Gọi API lấy danh sách rạp khi component được render
  useEffect(() => {
    const getCinemas = async () => {
      try {
        setLoading(true);
        const data = await fetchCinemas(); // Lâý dữ liệu từ "Cinema"
        setCinemaList(Object.values(data)); // Chuyển đổi object thành array
      } catch (err) {
        setError(err.message || "Failed to load cinemas.");
      } finally {
        setLoading(false);
      }
    };

    getCinemas();
  }, []);

  // Xử lý khi chọn rạp
  const handleCinemaChange = (e) => {
    const selectedCinema = cinemaList.find(
      (cinema) => String(cinema.cinema_id) === String(e.target.value)
    );
    setCinema(selectedCinema || "");
  };

  // Xử lý khi nhấn "Tiếp theo"
  const handleSubmit = () => {
    if (cinema) {
      console.log("cinema_id truyền sang ScheduleModal:", cinema.cinema_id);
      console.log("movie_id truyền sang BookingModal:", movie_id);
      onNext({
        cinema_id: cinema.cinema_id, // Truyền cinema_id
        cinema_name: cinema.cinema_name, // Truyền cinema_name
        movie_id: movie_id, // Truyền movie_id
      });
      console.log("Cinema Selected:", cinema);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-booking">
        <p className="title-booking">Chọn rạp chiếu</p>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Đang tải danh sách rạp...</p>
        ) : (
          <select onChange={handleCinemaChange} value={cinema?.cinema_id || ""}>
            <option value="">--- Vị trí rạp ---</option>
            {cinemaList.map((cinemaItem) => (
              <option key={cinemaItem.cinema_id} value={cinemaItem.cinema_id}>
                {cinemaItem.cinema_name} {/* Hiển thị tên rạp */}
              </option>
            ))}
          </select>
        )}
        <button className="button-action cancel" onClick={onClose}>
          Hủy
        </button>
        <button className="button-action success" onClick={handleSubmit} disabled={!cinema}>
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
