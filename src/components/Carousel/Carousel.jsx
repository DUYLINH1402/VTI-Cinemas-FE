import { Carousel } from "antd";
import "./carousel.scss";
import { React, useState, useEffect } from "react";
import { CardCarousel } from "../Cards/Cards";
import { fetchCarouselData } from "../../../src/services/dataService";

export const CarouselSlide = () => {
  const [imgCarousel, setImgCarousel] = useState([]);

  // Call API từ dataService
  useEffect(() => {
    const getData = async () => {
      try {
        const bannersArray = await fetchCarouselData();
        setImgCarousel(bannersArray);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="carousel_img">
        <Carousel autoplay>
          {imgCarousel.map((item) => (
            <CardCarousel item={item} key={item.id} />
          ))}
        </Carousel>
      </div>
    </>
  );
};
