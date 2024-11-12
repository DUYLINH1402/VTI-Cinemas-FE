import "./Cinemas.scss";

export const Cinemas = () => {
  return (
    <>
      <div className="content">
        <div className="link_showtime">
          <button>
            <a href="#">12/11</a>
          </button>
          <button>
            <a href="#">13/11</a>
          </button>
          <button>
            <a href="#">14/11</a>
          </button>
        </div>
        <div className="tab_content"></div>
      </div>
    </>
  );
};
