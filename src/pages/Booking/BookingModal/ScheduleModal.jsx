import React, { useState, useEffect } from "react";
import { fetchShowtimes } from "../../../services/dataService"; // Gọi từ dataService

const ScheduleModal = ({ onNext, onBack, onClose, selectedCinema }) => {
  const [showtimes, setShowtimes] = useState([]); // Danh sách suất chiếu
  const [selectedDate, setSelectedDate] = useState(""); // Ngày được chọn
  const [selectedTime, setSelectedTime] = useState(""); // Suất chiếu được chọn
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  console.log(selectedCinema);

  // Gọi API lấy danh sách suất chiếu khi Modal được mở
  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        const data = await fetchShowtimes(selectedCinema); // Gọi API với rạp đã chọn
        console.log("Fetched Showtimes:", data);
        setShowtimes(data);
      } catch (err) {
        setError(err.message || "Failed to load showtimes.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCinema) fetchShowtimeData();
  }, [selectedCinema]);

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      console.log("Selected Time:", selectedTime);
      onNext({ date: selectedDate, time: selectedTime }); // Gửi dữ liệu ngày và giờ
    } else {
      alert("Vui lòng chọn suất chiếu.");
    }
  };
  const filteredShowtimes = showtimes.filter((showtime) => showtime !== null); // Lọc null
  return (
    <div className="modal-overlay">
      <div className=" modal-content modal-booking-content modal-schedule">
        <h2>Chọn suất chiếu</h2>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Đang tải danh sách suất chiếu...</p>
        ) : (
          <>
            {/* Hiển thị danh sách ngày */}
            <div className="showtime-date">
              {filteredShowtimes.map((showtime) => (
                <button
                  className="button-chose"
                  key={showtime.date}
                  onClick={() => setSelectedDate(showtime.date)}
                  style={{
                    backgroundColor:
                      selectedDate === showtime.date ? "lightblue" : "white",
                  }}
                >
                  {showtime.date}
                </button>
              ))}
            </div>

            {/* Hiển thị danh sách giờ theo ngày đã chọn */}
            <div>
              {showtimes
                .find((showtime) => showtime.date === selectedDate)
                ?.sessions.map((session) => (
                  <button
                    className="button-chose"
                    key={session.time}
                    onClick={() => setSelectedTime(session.time)}
                    style={{
                      backgroundColor:
                        selectedTime === session.time ? "lightblue" : "white",
                    }}
                  >
                    {session.time} ({session.seatsAvailable} ghế trống)
                  </button>
                ))}
            </div>
          </>
        )}
        <button className="button-action success" onClick={onBack}>
          Quay lại
        </button>
        <button className="button-action cancel" onClick={onClose}>
          Hủy
        </button>
        <button
          className="button-action success"
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
