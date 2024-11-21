import { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { useParams } from "react-router-dom";
import { fetchMovies } from "../../../services/dataService";

export const MovieInf = () => {
  const [movie, setMovie] = useState(null);
  const { movie_id } = useParams();

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

  console.log(movie);

  return (
    <>
      <div className="content">
        {movie ? <CardInfMovie movie={movie} /> : ""}
      </div>
    </>
  );
};
