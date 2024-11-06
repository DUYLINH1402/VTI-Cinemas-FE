import { CarouselSlide } from "./Carousel/Carousel";
import "./home.scss";
import { HomeContent } from "./HomeContent/HomeContent";
export const Home = () => {
  return (
    <>
      <div className="content">
        <CarouselSlide />
        <HomeContent />
      </div>
    </>
  );
};
