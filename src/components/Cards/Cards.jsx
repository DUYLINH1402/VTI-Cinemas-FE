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

export const CardShowtime = ({ item }) => {
  return (
    <>
      <div className="card__showtimes">
        <div className="image">
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1730809742/1._Ma%CC%86%CC%81t_Bie%CC%82%CC%81c_zjtjfn.jpg"
            alt=""
          />
        </div>
        <div className="row">
          <div className="introduce">
            <h1>Mắt biếc</h1>
            <p>Một câu chuyện tình buồn về tuổi học trò.</p>
          </div>
          <div className="showtime">
            <h3>2D</h3>
            <button>20:00</button> <br />
            <span>149 ghé trống</span>
          </div>
        </div>
      </div>
    </>
  );
};
