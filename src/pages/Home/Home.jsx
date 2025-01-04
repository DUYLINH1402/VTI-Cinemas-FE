import { CarouselSlide } from "./../../components/Carousel/Carousel";
import { HomeContent } from "./HomeContent/HomeContent";
import "./HomeContent/HomeContent.scss";
export const Home = () => {
  return (
    <>
      <div className="content ">
        <CarouselSlide />
        <HomeContent />
      </div>
    </>
  );
};
