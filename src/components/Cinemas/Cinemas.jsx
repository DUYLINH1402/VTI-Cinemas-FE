import { CardShowtime } from "../Cards/Cards";
import "./cinemas.scss";

export const Cinemas = () => {
  return (
    <>
      <div className="content">
        <div className="link__showtimes">
          <button>
            <a href="">07/11</a>
          </button>
          <button>
            <a href="">08/11</a>
          </button>
          <button>
            <a href="">09/11</a>
          </button>
        </div>
        <div className="tab__content">
          <CardShowtime />
        </div>
      </div>
    </>
  );
};
