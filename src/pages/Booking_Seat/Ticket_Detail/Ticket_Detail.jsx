import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovies } from "../../../services/dataService";

export const Ticket_Detail = ({ seat_name }) => {
  const [movie, setMovie] = useState(null);
  const { movie_id } = useParams();

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
    <>{movie ? <Detail_Movie movie={movie} seat_name={seat_name} /> : ""}</>
  );
};

export const Detail_Movie = ({ movie, seat_name }) => {
  return (
    <>
      <img src={movie.image} alt={movie.movie_name} />
      <h1>{movie.movie_name}</h1>
      <p>Hình thức: 2D</p>
      <p>Thể loại: {movie.genre}</p>
      <p>Thời lượng: {movie.duration} phút</p>
      <p>Rạp chiếu: VTI Hà Nội</p>
      <p>Ngày chiếu: 20/11/2024</p>
      <p>Giờ chiếu: 18:00</p>
      <p>Phòng chiếu: P1</p>
      <p>Ghế ngồi: {seat_name}</p>
    </>
  );
};
