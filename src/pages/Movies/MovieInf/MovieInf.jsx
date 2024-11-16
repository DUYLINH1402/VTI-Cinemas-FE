import { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

export const MovieInf = () => {
  const [movies, setMovies] = useState([]);

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await axios.get(
          "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
        );
        const data = response.data;
        const findMovieById = Object.values(data).find(
          (movie) => movie.movie_id === parseInt(movie_id)
        );
        setMovie(findMovieById);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <>
      <div className="content">
        {movies && movies.length > 0 ? (
          movies.map((item, index) => (
            <CardInfMovie item={item} key={index}></CardInfMovie>
          ))
        ) : (
          <p>No movies available</p>
        )}
      </div>
    </>
  );
};
