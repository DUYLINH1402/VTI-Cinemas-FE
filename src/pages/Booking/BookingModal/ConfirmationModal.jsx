import { useNavigate } from "react-router-dom";

const ConfirmationModal = ({
  onBack,
  onClose,
  selectedCinema,
  selectedSchedule,
}) => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    // Điều hướng đến trang chọn ghế và truyền dữ liệu
    navigate("/booking_seat/:movie_id", {
      state: {
        cinema: selectedCinema,
        date: selectedSchedule.date,
        time: selectedSchedule.time,
        id: selectedCinema.movie_id,
      },
    });
  };
  return (
    <div className="modal-overlay ">
      <div className=" modal-content modal-booking-content modal-confirmation">
        <h2>Bạn đang đặt vé xem phim</h2>
        <title>{selectedCinema.movieId}</title>
        <p>Rạp chiếu: {selectedCinema}</p>
        <p>Ngày chiếu: {selectedSchedule.date}</p>
        <p>Giờ chiếu: {selectedSchedule.time}</p>
        <button className="button-action success" onClick={onBack}>
          Quay lại
        </button>
        <button className="button-action success" onClick={handleConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};
export default ConfirmationModal;
