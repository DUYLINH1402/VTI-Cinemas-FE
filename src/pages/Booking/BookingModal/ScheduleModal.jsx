import React, { useState, useEffect } from "react";
import { fetchShowtimes } from "../../../services/service/serviceCinemas"; // Import hàm fetchShowtimes từ dataService
import { toast } from "react-toastify";

const ScheduleModal = ({
  onNext,
  onBack,
  onClose,
  selectedCinema,
  movie_id
}) => {
  const [showtimes, setShowtimes] = useState([]); // State lưu danh sách suất chiếu
  const [selectedDate, setSelectedDate] = useState(""); // State lưu ngày được chọn
  const [selectedTime, setSelectedTime] = useState(""); // State lưu suất chiếu được chọn
  const [loading, setLoading] = useState(true); // State kiểm soát trạng thái loading
  const [error, setError] = useState(null); // State lưu lỗi (nếu có)

  // Gọi API lấy danh sách suất chiếu khi Modal được mở
  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        setLoading(true); // Bật trạng thái loading trước khi gọi API
        console.log(
          "Fetching showtimes for cinema_id:",
          selectedCinema?.cinema_id
        );

        if (!selectedCinema?.cinema_id) {
          console.error("Error: selectedCinema is missing cinema_id");
          setError("Không tìm thấy rạp chiếu phù hợp.");
          return;
        }

        const data = await fetchShowtimes(selectedCinema.cinema_id); // Gọi API với thông tin rạp đã chọn
        console.log("Suất chiếu lấy được", data);
        if (!data || data.length === 0) {
          setError("Rạp này hiện không có suất chiếu nào");
          setShowtimes([]);
          return;
        }
        
        // Lọc các suất chiếu có movie_id trùng với phim đang chọn
        const filteredShowtimes = data.filter(
          showtime => String(showtime.movie_id) === String(movie_id)
        );
        
      if (filteredShowtimes.length === 0) {
        setError("Phim này không có suất chiếu tại rạp đã chọn.");
        setShowtimes([]);
        return;
      }

        //  Chuyển đổi dữ liệu `showtimes` thành dạng có `date` và `sessions`
      const formattedShowtimes = {};
      data.forEach((showtime) => {
        const dateKey = showtime.id.split("_")[1]; // Lấy phần "20250308" từ `showtime_20250308_1000`
        const time = showtime.id.split("_")[2]; // Lấy phần "1000" từ `showtime_20250308_1000`

        //  Chuyển ngày thành `dd/MM`
        const formattedDate = `${dateKey.substring(6, 8)}/${dateKey.substring(4, 6)}`;

        if (!formattedShowtimes[formattedDate]) {
          formattedShowtimes[formattedDate] = { date: formattedDate, sessions: [] };
        }

        formattedShowtimes[formattedDate].sessions.push({
          time: `${time.substring(0, 2)}:${time.substring(2, 4)}`, // Chuyển "1000" thành "10:00"
          movie_id: showtime.movie_id,
          showtime_id: showtime.id,
        });
      });

      setShowtimes(Object.values(formattedShowtimes)); // Chuyển object thành array để sử dụng trong `map()`
        console.log(selectedCinema);
      } catch (err) {
        console.error("Failed to load showtimes:", err);
        setError(err.message || "Lỗi tải suất chiếu"); // Lưu lỗi nếu gọi API thất bại
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
      }
    };

    if (selectedCinema) fetchShowtimeData(); // Gọi API nếu có rạp đã được chọn
  }, [selectedCinema]); // useEffect chạy lại khi `selectedCinema` thay đổi

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset lại giờ khi đổi ngày
  };
  

  // Xử lý khi người dùng nhấn nút "Tiếp theo"
  const handleSubmit = () => {
    if (!selectedDate){
      toast.warning("Vui lòng chọn suất chiếu.");
      return;
    }
    if (!selectedTime){
      toast.warning("Vui lòng chọn giờ chiếu.");
      return;
    }
    
  // Lấy `showtime_id` từ danh sách đã lưu
  const selectedShowtime = showtimes
  .find(showtime => showtime.date === selectedDate)
  ?.sessions.find(session => session.time === selectedTime);

if (!selectedShowtime) {
  toast.warning("Không tìm thấy suất chiếu phù hợp.");
  return;
} 
     else {
      onNext({ date: selectedDate, time: selectedTime, showtime_id: selectedShowtime.showtime_id, }); // Truyền dữ liệu ngày và giờ chiếu đến bước tiếp theo
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-schedule">
        <p className="title-booking">Chọn suất chiếu</p>
        {/* Hiển thị lỗi nếu có */}
        {error && <p className="error">{error}</p>}

        {/* Hiển thị trạng thái loading hoặc danh sách suất chiếu */}
        {loading ? (
          <p>Đang tải danh sách suất chiếu...</p>
        ) : (
          <>
            {/* Hiển thị danh sách ngày chiếu */}
            <div className="showtime-date">
              {showtimes.map((showtime) => (
                <button
                  className="button-chose button-chose-date"
                  key={showtime.date}
                  onClick={() => handleDateChange(showtime.date)} // Cập nhật ngày được chọn
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
            <div className="showtime-time">
            
              {showtimes
                .find((showtime) => showtime.date === selectedDate) // Tìm ngày đã chọn
                ?.sessions.map((session) => (
                  <button
                    className="button-chose button-chose-time"
                    key={session.time}
                    onClick={() => setSelectedTime(session.time)} // Cập nhật giờ chiếu được chọn
                    style={{
                      backgroundColor:
                        selectedTime === session.time ? "lightblue" : "white", // Đổi màu khi giờ chiếu được chọn
                    }}
                  >
                    {session.time}
                  </button>
                ))}
            </div>
          </>
        )}

        {/* Nút "Quay lại" */}
        <button className="button-action" onClick={onBack}>
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
          // disabled={!selectedDate || !selectedTime} // Chỉ kích hoạt nếu đã chọn ngày và giờ chiếu
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal; // Xuất component để sử dụng trong các phần khác
