import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchMovies } from "../../../services/dataService";

export const Ticket_Detail = ({ seat_name }) => {
  const [movie, setMovie] = useState(null);
  const { movie_id } = useParams();

  const { state } = useLocation(); // Lấy dữ liệu từ navigate state
  const { cinema, date, time } = state || {}; // Dữ liệu truyền từ ConfirmationModal

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const data = await fetchMovies();
        const findMovieById = data.find(
          (movie) => movie.movie_id === parseInt(movie_id)
        );
        setMovie(findMovieById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMovieData();
  }, [movie_id]);

  return (
    <>
      {movie ? (
        <Detail_Movie
          movie={movie}
          cinema={cinema}
          date={date}
          time={time}
          seat_name={seat_name}
        />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export const Detail_Movie = ({ movie, cinema, date, time, seat_name }) => {
  return (
    <>
      <img src={movie.image} alt={movie.movie_name} />
      <h1>{movie.movie_name}</h1>
      <p>Hình thức: 2D</p>
      <p>Thể loại: {movie.genre}</p>
      <p>Thời lượng: {movie.duration} phút</p>
      <p>Rạp chiếu: {cinema.cinema}</p>
      <p>Ngày chiếu: {date}</p>
      <p>Giờ chiếu: {time}</p>
      <p>Phòng chiếu: P1</p>
      <p>Ghế ngồi: {seat_name}</p>
    </>
  );
};
