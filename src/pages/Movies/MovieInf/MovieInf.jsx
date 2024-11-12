import { useEffect, useState } from "react";
import { CardInfMovie } from "../../../components/Cards/Cards";
import "./../MovieInf/MovieInf.scss";
import { fetchMovies } from "../../../services/dataService";

export const MovieInf = () => {
  const [movies, setMovies] = useState([]);

  // Call API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
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
