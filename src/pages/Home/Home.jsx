import { CarouselSlide } from "./../../components/Carousel/Carousel";
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
