import "./card.scss";
import { Link } from "react-router-dom";

export const CardCarousel = ({ item }) => {
  return (
    <div className="card-content" key={item.id}>
      <div className="card_carousel_img">
        <Link to="#!">
          <div>
            <img src={item.image_url} alt="Image not found" />
          </div>
        </Link>
      </div>
    </div>
  );
};
export const CardMovie = ({ item }) => {
  return (
    <>
      <div className="card__movie">
        <Link to="#!">
          <div>
            <img
              className="card__movie__img"
              src={item.image}
              alt={item.movie_name}
            />
            <h3>{item.movie_name}</h3>
            <p>{item.description}</p>
            <p>Rating: {item.rating}</p>
          </div>
        </Link>
      </div>
    </>
  );
};
