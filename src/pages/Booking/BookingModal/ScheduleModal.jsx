import React, { useState, useEffect } from "react";
import { fetchShowtimes, fetchCinemas } from "../../../services/service/serviceCinemas";
import { toast } from "react-toastify";

const ScheduleModal = ({ onNext, onBack, onClose, selectedCinema, movie_id }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCinemas, setAvailableCinemas] = useState([]);

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        console.log("Fetching showtimes for cinema_id:", selectedCinema?.cinema_id);
        console.log("MovieId truyền vào ScheduleModal: ", movie_id);
        if (!selectedCinema?.cinema_id) {
          setError("Không tìm thấy rạp chiếu phù hợp.");
          return;
        }

        // Lấy dữ liệu suất chiếu cho rạp đã chọn
        const data = await fetchShowtimes(selectedCinema.cinema_id);
        console.log("Suất chiếu lấy được:", data);

        if (!data || Object.keys(data).length === 0) {
          setError("Rạp này hiện không có suất chiếu nào.");
          setShowtimes([]);
          return;
        }

        // Lấy toàn bộ suất chiếu để tìm rạp có suất chiếu cho phim này
        const allShowtimes = await fetchShowtimes(null); // Lấy tất cả suất chiếu
        const cinemas = await fetchCinemas();

        // Tìm các rạp có suất chiếu cho phim này
        const cinemasWithShowtimes = Object.entries(allShowtimes)
          .filter(([key, value]) => String(value.movie_id) === String(movie_id))
          .map(([key]) => key.split("_")[3]); // Lấy cinema_id từ key (ví dụ: cinema_10)

        const uniqueCinemas = [...new Set(cinemasWithShowtimes)];
        const availableCinemaNames = uniqueCinemas
          .map((cinemaId) => {
            const cinema = Object.values(cinemas).find((c) => c.cinema_id === cinemaId);
            return cinema ? cinema.cinema_name : null;
          })
          .filter((name) => name && name !== selectedCinema.cinema_name);

        setAvailableCinemas(availableCinemaNames);

        // Lọc suất chiếu theo movie_id (không cần kiểm tra cinema_id vì API đã lọc)
        const filteredShowtimes = Object.entries(data).filter(([key, value]) => {
          return String(value.movie_id) === String(movie_id);
        });

        if (filteredShowtimes.length === 0) {
          setError(
            `Phim này hiện không có suất chiếu tại rạp ${selectedCinema.cinema_name}.${
              availableCinemaNames.length > 0
                ? ` Bạn có thể thử tại: ${availableCinemaNames.join(", ")}.`
                : ""
            }`
          );
          setShowtimes([]);
          return;
        }

        // Định dạng dữ liệu suất chiếu thành { date, sessions }
        const formattedShowtimes = {};
        filteredShowtimes.forEach(([showtimeId, showtime]) => {
          const dateKey = showtimeId.split("_")[1];
          const timeKey = showtimeId.split("_")[2];
          const formattedDate = `${dateKey.substring(6, 8)}/${dateKey.substring(4, 6)}`;
          const formattedTime = `${timeKey.substring(0, 2)}:${timeKey.substring(2, 4)}`;

          if (!formattedShowtimes[formattedDate]) {
            formattedShowtimes[formattedDate] = { date: formattedDate, sessions: [] };
          }

          formattedShowtimes[formattedDate].sessions.push({
            time: formattedTime,
            movie_id: showtime.movie_id,
            showtime_id: showtimeId,
          });
        });

        setShowtimes(Object.values(formattedShowtimes));
      } catch (err) {
        console.error("Failed to load showtimes:", err);
        setError(err.message || "Lỗi tải suất chiếu");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCinema) fetchShowtimeData();
  }, [selectedCinema, movie_id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      toast.warning("Vui lòng chọn ngày chiếu.");
      return;
    }
    if (!selectedTime) {
      toast.warning("Vui lòng chọn giờ chiếu.");
      return;
    }

    const selectedShowtime = showtimes
      .find((showtime) => showtime.date === selectedDate)
      ?.sessions.find((session) => session.time === selectedTime);

    if (!selectedShowtime) {
      toast.warning("Không tìm thấy suất chiếu phù hợp.");
      return;
    }

    onNext({
      date: selectedDate,
      time: selectedTime,
      showtime_id: selectedShowtime.showtime_id,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-schedule">
        <p className="title-booking">Chọn suất chiếu</p>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Đang tải danh sách suất chiếu...</p>
        ) : (
          <>
            <div className="showtime-date">
              {showtimes.map((showtime) => (
                <button
                  className="button-chose button-chose-date"
                  key={showtime.date}
                  onClick={() => handleDateChange(showtime.date)}
                  style={{
                    backgroundColor: selectedDate === showtime.date ? "lightblue" : "white",
                  }}
                >
                  {showtime.date}
                </button>
              ))}
            </div>
            <div className="showtime-time">
              {showtimes
                .find((showtime) => showtime.date === selectedDate)
                ?.sessions.map((session) => (
                  <button
                    className="button-chose button-chose-time"
                    key={session.time}
                    onClick={() => setSelectedTime(session.time)}
                    style={{
                      backgroundColor: selectedTime === session.time ? "lightblue" : "white",
                    }}
                  >
                    {session.time}
                  </button>
                ))}
            </div>
          </>
        )}
        <button className="button-action" onClick={onBack}>
          Quay lại
        </button>
        <button className="button-action cancel" onClick={onClose}>
          Hủy
        </button>
        <button className="button-action success" onClick={handleSubmit}>
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
