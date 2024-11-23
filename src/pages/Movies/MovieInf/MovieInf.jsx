import Ract, { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { Link, useParams } from "react-router-dom";
import { fetchMoviesById } from "../../../services/dataService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import BookingModal from "../../Booking/BookingModal/BookingModal.jsx";
import ScheduleModal from "../../Booking/BookingModal/ScheduleModal.jsx";
import ConfirmationModal from "../../Booking/BookingModal/ConfirmationModal.jsx";

export const MovieInf = () => {
  const { movie_id } = useParams(); // 'id' là tên param trong Route
  const [movie, setMovie] = useState(null); // Phim hiện tại
  const [currentModal, setCurrentModal] = useState(0); // Trạng thái Modal
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Kiểm tra token

  // Hàm mở Modal khi click "Đặt vé"
  const handleBookTicket = (movie) => {
    if (!isLoggedIn) {
      toast.warning("Bạn cần đăng nhập trước khi đặt vé!");
    } else {
      setMovie(movie); // Lưu thông tin phim
      setCurrentModal(1); // Mở modal đầu tiên
    }
  };
  // Hàm mở Modal tiếp theo
  const handleNextModal = (data) => {
    // console.log("Current Modal:", currentModal, "Data:", data);
    if (currentModal === 1) {
      setSelectedCinema(data); // Lưu thông tin rạp
      setCurrentModal(2); // Chuyển sang Modal 2
      // console.log("Current Modal State:", currentModal);
    } else if (currentModal === 2) {
      setSelectedSchedule(data); // Lưu lịch chiếu
      setCurrentModal(3); // Chuyển sang Modal 3
      // console.log("Current Modal State:", currentModal);
    }
  };

  // Hàm quay lại Modal trước
  const handleBackModal = () => {
    setCurrentModal((prev) => prev - 1);
  };

  // Hàm đóng Modal
  const handleCloseModal = () => {
    setCurrentModal(0);
  };

  // Call API
  useEffect(() => {
    const fetchMovieByIdData = async (movie_id) => {
      try {
        const findMovieById = await fetchMoviesById(movie_id);
        setMovie(findMovieById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieByIdData(movie_id);
    window.scrollTo(0, 0);
  }, [movie_id]);

  // console.log("Current Modal State:", currentModal);

  return (
    <>
      <div className="content">
        {movie && (
          <CardInfMovie movie={movie} onBookTicket={handleBookTicket} />
        )}
      </div>

      {/* Modal 1: Booking */}
      {currentModal === 1 && (
        <BookingModal
          movie_id={movie_id}
          onNext={handleNextModal}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal 2: Schedule */}
      {currentModal === 2 && (
        <ScheduleModal
          movie_id={movie_id}
          onNext={handleNextModal}
          onBack={handleBackModal}
          onClose={handleCloseModal}
          selectedCinema={selectedCinema}
        />
      )}

      {/* Modal 3: Confirmation */}
      {currentModal === 3 && (
        <ConfirmationModal
          movie_name={movie.movie_name}
          movie_id={movie_id}
          onBack={handleBackModal}
          onClose={handleCloseModal}
          selectedCinema={selectedCinema}
          selectedSchedule={selectedSchedule}
        />
      )}
    </>
  );
};
