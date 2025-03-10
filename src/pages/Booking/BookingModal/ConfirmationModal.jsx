import { useNavigate } from "react-router-dom";

const ConfirmationModal = ({
  onBack, // Hàm xử lý khi người dùng nhấn "Quay lại"
  selectedCinema, // Thông tin rạp chiếu được chọn
  selectedSchedule, // Lịch chiếu (ngày, giờ) được chọn
  movie_id, // ID của phim đang đặt vé
  movie_name, // Tên phim được chọn
}) => {
  const navigate = useNavigate(); // Hook của React Router để điều hướng
  // console.log("Thông tin rạp đã chọn: ",selectedCinema)
  const handleConfirm = () => {

    localStorage.setItem("selectedCinemaID", selectedCinema.cinema_id);
    localStorage.setItem("timerCount", 600);
    localStorage.setItem("statusSeats", JSON.stringify({}));
    localStorage.setItem("selectedSeatPrice", 0);
    localStorage.setItem("selectedSeatNames", JSON.stringify([]));
    // console.log("movie_id in ConfirmationModal: ", movie_id);
    // Điều hướng đến trang chọn ghế và truyền dữ liệu đã chọn
    navigate(`/booking_seat/${movie_id}`, {
      state: {
        cinema: selectedCinema.cinema_name, // Thông tin rạp đã chọn
        date: selectedSchedule.date, // Ngày chiếu
        time: selectedSchedule.time, // Giờ chiếu
        movie_id: movie_id, // ID của phim
        cinema_id: selectedCinema.cinema_id,
        showtime_id: selectedSchedule.showtime_id,
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-booking-content modal-confirmation">
        <p className="title-booking">Bạn đang đặt vé xem phim</p>
        {/* Hiển thị tên phim */}
        <h3 className="movie_name">{movie_name}</h3>

        {/* Hiển thị thông tin rạp, ngày và giờ chiếu */}
        <p>Rạp chiếu : {selectedCinema.cinema_name}</p>
        <p>Ngày chiếu : {selectedSchedule.date}</p>
        <p>Giờ chiếu : {selectedSchedule.time}</p>

        {/* Nút "Quay lại" để quay lại bước trước */}
        <button className="button-action success" onClick={onBack}>
          Quay lại
        </button>

        {/* Nút "Xác nhận" để điều hướng đến trang chọn ghế */}
        <button className="button-action success" onClick={handleConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal; // Xuất component để sử dụng ở các phần khác
