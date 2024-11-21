import React, { useState, useEffect } from "react";
import { fetchCinemas } from "../../../services/dataService"; // Gọi hàm từ dataService
import "./BookingModal.modul.scss";

const BookingModal = ({ movieId, onNext, onClose }) => {
  const [cinema, setCinema] = useState(""); // Rạp được chọn
  const [cinemaList, setCinemaList] = useState([]); // Danh sách rạp
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  // Gọi API lấy danh sách rạp khi component được render
  useEffect(() => {
    const getCinemas = async (cinemaItem) => {
      try {
        setLoading(true);
        const data = await fetchCinemas(); // Gọi hàm từ dataService
        console.log("Fetched Cinemas:", data); // Log giá trị trả về
        setCinemaList(Object.values(data)); // Chuyển đổi Object thành Array và Lưu danh sách rạp vào state
      } catch (err) {
        setError(err.message || "Failed to load cinemas.");
      } finally {
        setLoading(false);
      }
    };

    getCinemas();
  }, []); // Chỉ gọi API một lần khi component render lần đầu

  const handleSubmit = () => {
    if (cinema) {
      onNext({
        cinema: cinema,
        movieId: movieId, // Truyền movie_id đến bước tiếp theo
      }); // Gửi thông tin rạp đã chọn
      console.log("Cinema Selected:", cinema);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-booking">
        <h2>Chọn rạp chiếu</h2>
        {/* Hiển thị lỗi nếu có */}
        {error && <p className="error">{error}</p>}
        {/* Hiển thị loading nếu đang tải */}
        {loading ? (
          <p>Đang tải danh sách rạp...</p>
        ) : (
          <select onChange={(e) => setCinema(e.target.value)} value={cinema}>
            <option value="">---Vị trí rạp---</option>
            {cinemaList.map((cinemaItem) => (
              <option key={cinemaItem.cinema_id} value={cinemaItem.cinema_name}>
                {cinemaItem.cinema_name}
              </option>
            ))}
          </select>
        )}
        <button className="button-action cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button-action success"
          onClick={handleSubmit}
          disabled={!cinema}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
