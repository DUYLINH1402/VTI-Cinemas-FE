import { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { useParams } from "react-router-dom";
import { fetchMovies } from "../../../services/dataService";

export const MovieInf = () => {
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

  return (
    <>
      <div className="content">
        {movie ? <CardInfMovie movie={movie} /> : <div>No movie found</div>}
      </div>
    </>
  );
};
