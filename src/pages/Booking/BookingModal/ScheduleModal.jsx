import React, { useState, useEffect } from "react";
import { fetchShowtimes } from "../../../services/dataService"; // Import hàm fetchShowtimes từ dataService

const ScheduleModal = ({
  onNext,
  onBack,
  onClose,
  selectedCinema,
  movie_id,
}) => {
  const [showtimes, setShowtimes] = useState([]); // State lưu danh sách suất chiếu
  const [selectedDate, setSelectedDate] = useState(""); // State lưu ngày được chọn
  const [selectedTime, setSelectedTime] = useState(""); // State lưu suất chiếu được chọn
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading
  const [error, setError] = useState(null); // State lưu lỗi (nếu có)

  // Gọi API lấy danh sách suất chiếu khi Modal được mở
  useEffect(() => {
    const fetchShowtimeData = async (movie_id) => {
      try {
        setLoading(true); // Bật trạng thái loading trước khi gọi API
        const data = await fetchShowtimes(selectedCinema, movie_id); // Gọi API với thông tin rạp đã chọn
        setShowtimes(data); // Lưu dữ liệu suất chiếu vào state
        console.log(selectedCinema);
        console.log("Movie ID", movie_id);
      } catch (err) {
        setError(err.message || "Failed to load showtimes."); // Lưu lỗi nếu gọi API thất bại
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
      }
    };

    if (selectedCinema) fetchShowtimeData(); // Gọi API nếu có rạp đã được chọn
  }, [selectedCinema]); // useEffect chạy lại khi `selectedCinema` thay đổi

  // Xử lý khi người dùng nhấn nút "Tiếp theo"
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onNext({ date: selectedDate, time: selectedTime }); // Truyền dữ liệu ngày và giờ chiếu đến bước tiếp theo
    } else {
      alert("Vui lòng chọn suất chiếu."); // Hiển thị thông báo nếu chưa chọn đầy đủ
    }
  };

  // Lọc suất chiếu không hợp lệ (null)
  const filteredShowtimes = showtimes.filter((showtime) => showtime !== null);

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-schedule">
        <h2>Chọn suất chiếu</h2>
        {/* Hiển thị lỗi nếu có */}
        {error && <p className="error">{error}</p>}

        {/* Hiển thị trạng thái loading hoặc danh sách suất chiếu */}
        {loading ? (
          <p>Đang tải danh sách suất chiếu...</p>
        ) : (
          <>
            {/* Hiển thị danh sách ngày chiếu */}
            <div className="showtime-date">
              {filteredShowtimes.map((showtime) => (
                <button
                  className="button-chose"
                  key={showtime.date}
                  onClick={() => setSelectedDate(showtime.date)} // Cập nhật ngày được chọn
                  style={{
                    backgroundColor:
                      selectedDate === showtime.date ? "lightblue" : "white", // Đổi màu khi ngày được chọn
                  }}
                >
                  {showtime.date}
                </button>
              ))}
            </div>

            {/* Hiển thị danh sách giờ chiếu theo ngày đã chọn */}
            <div>
              {showtimes
                .find((showtime) => showtime.date === selectedDate) // Tìm ngày đã chọn
                ?.sessions.map((session) => (
                  <button
                    className="button-chose"
                    key={session.time}
                    onClick={() => setSelectedTime(session.time)} // Cập nhật giờ chiếu được chọn
                    style={{
                      backgroundColor:
                        selectedTime === session.time ? "lightblue" : "white", // Đổi màu khi giờ chiếu được chọn
                    }}
                  >
                    {session.time} ({session.seatsAvailable} ghế trống)
                  </button>
                ))}
            </div>
          </>
        )}

        {/* Nút "Quay lại" */}
        <button className="button-action success" onClick={onBack}>
          Quay lại
        </button>

        {/* Nút "Hủy" */}
        <button className="button-action cancel" onClick={onClose}>
          Hủy
        </button>

        {/* Nút "Tiếp theo" */}
        <button
          className="button-action success"
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime} // Chỉ kích hoạt nếu đã chọn ngày và giờ chiếu
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal; // Xuất component để sử dụng trong các phần khác
