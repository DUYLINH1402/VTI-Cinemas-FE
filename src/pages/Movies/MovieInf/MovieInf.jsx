import { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { Link, useParams } from "react-router-dom";
import { fetchMovies } from "../../../services/dataService";

import BookingModal from "../../Booking/BookingModal/BookingModal.jsx";
import ScheduleModal from "../../Booking/BookingModal/ScheduleModal.jsx";
import ConfirmationModal from "../../Booking/BookingModal/ConfirmationModal.jsx";

export const MovieInf = () => {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null); // Phim hiện tại
  const [currentModal, setCurrentModal] = useState(0); // Trạng thái Modal
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Hàm mở Modal khi click "Đặt vé"
  const handleBookTicket = (movie) => {
    setMovie(movie); // Lưu thông tin phim
    setCurrentModal(1); // Mở Modal 1
    console.log("Current Modal State:", currentModal);
  };
  // Hàm mở Modal tiếp theo
  const handleNextModal = (data) => {
    console.log("Current Modal:", currentModal, "Data:", data);
    if (currentModal === 1) {
      setSelectedCinema(data); // Lưu thông tin rạp
      setCurrentModal(2); // Chuyển sang Modal 2
      console.log("Current Modal State:", currentModal);
    } else if (currentModal === 2) {
      setSelectedSchedule(data); // Lưu lịch chiếu
      setCurrentModal(3); // Chuyển sang Modal 3
      console.log("Current Modal State:", currentModal);
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
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies();
        const findMovieById = Object.values(data).find(
          (movie) => movie.movie_id === parseInt(movie_id)
        );
        setMovie(findMovieById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMoviesData();
    window.scrollTo(0, 0);
  }, [movie_id]);

  console.log("Current Modal State:", currentModal);

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
          movieId={movie.movie_id}
          onNext={handleNextModal}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal 2: Schedule */}
      {currentModal === 2 && (
        <ScheduleModal
          onNext={handleNextModal}
          onBack={handleBackModal}
          onClose={handleCloseModal}
          selectedCinema={selectedCinema}
        />
      )}

      {/* Modal 3: Confirmation */}
      {currentModal === 3 && (
        <ConfirmationModal
          onBack={handleBackModal}
          onClose={handleCloseModal}
          selectedCinema={selectedCinema}
          selectedSchedule={selectedSchedule}
        />
      )}
    </>
  );
};
