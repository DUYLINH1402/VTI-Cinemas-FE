import { Carousel } from "antd";
import "./carousel.scss";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { CardCarousel } from "../../Cards/Cards";
// import { APICarousel } from "./API";

export const CarouselSlide = () => {
  const [imgCarousel, setImgCarousel] = useState([]);
  // Call APICarousel
  useEffect(() => {
    axios
      .get("https://vticinema-default-rtdb.firebaseio.com/Banners.json") // Thêm ".json" vào cuối URL
      .then((response) => {
        const data = response.data;
        const bannersArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key, // Lưu key Firebase làm ID
        }));
        console.log(bannersArray);
        setImgCarousel(bannersArray);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className="carousel_img">
        {/* autoplay ---> Carousel Auto Play */}
        <Carousel autoplay>
          {/* Render data of carousel */}
          {imgCarousel.map((item) => {
            return <CardCarousel item={item} key={item.id} />;
          })}
        </Carousel>
      </div>
    </>
  );
};
