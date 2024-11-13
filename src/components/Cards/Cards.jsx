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
            <h3 className="line-clamp title">{item.movie_name}</h3>
            <p className="line-clamp">{item.description}</p>
            <p>Rating: {item.rating}</p>
          </div>
        </Link>
        {/* Thêm nút Đặt vé */}
        <button className="book-ticket-button">Đặt vé</button>
      </div>
    </>
  );
};

export const CardCinema = ({ item }) => {
  return (
    <>
      <div className="card__cinema">
        <div className="image">
          <img src={item.image} alt={item.movie_name} />
        </div>
        <div className="row">
          <div className="introduce">
            <Link to="/movieinf">
              <h1>{item.movie_name}</h1>
            </Link>
            <p>Thời gian: {item.duration} phút</p>
            <p>Thể loại: {item.genre}</p>
          </div>
          <div className="showtime">
            <h3>2D</h3>
            <button>
              <a href="#">20:00</a>
            </button>
            <p>149 ghé trống</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const CardInfMovie = ({ item }) => {
  return (
    <>
      <div className="card__inf">
        <div className="image">
          <img src={item.image} alt={item.movie_name} />
          <div className="showtime">
            <button>
              <a href="#">Đặt vé</a>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="introduce">
            <Link to="/movieinf">{/* <h1>{item.movie_name}</h1> */}</Link>
            {/* <p>Thời gian: {item.duration} phút</p>
            <p>Thể loại: {item.genre}</p> */}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
              ducimus assumenda eveniet incidunt sit similique quibusdam
              repudiandae laboriosam quam porro quisquam odio vel obcaecati
              nulla! Adipisci, aperiam. Non, hic tenetur!
            </p>
          </div>
        </div>
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
