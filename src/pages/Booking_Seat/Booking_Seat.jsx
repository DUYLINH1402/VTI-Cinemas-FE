import { useEffect, useState } from "react";
import { CardSeats } from "../../components/Cards/Cards";
import "./Booking_Seat.scss";
import { fetchMovies } from "../../services/dataService";
import { useParams } from "react-router-dom";

export const Booking_Seat = () => {
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
    window.scrollTo(0, 0);
  }, [movie_id]);

  console.log(movie);

  return (
    <>
      <div className="content">{movie ? <CardSeats item={movie} /> : ""}</div>
    </>
  );
};
