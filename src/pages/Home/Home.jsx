import { CarouselSlide } from "./../../components/Carousel/Carousel";
import FeaturedComments from "./FeaturedComments/FeaturedComments";
import { HomeContent } from "./HomeContent/HomeContent";
import "./HomeContent/HomeContent.scss";
import HomePromotions from "./HomePromotions/HomePromotions";
import MovieSchedule from "./MovieSchedule/MovieSchedule";
export const Home = () => {
  return (
    <>
      <div className="content ">
        <CarouselSlide />
        <HomeContent />
        <section className="movie-schedule-section">
          <MovieSchedule />
        </section>
        <section className="featured-comments-section">
          <FeaturedComments />
        </section>
        <section className="promotions-section">
          <HomePromotions />
        </section>
      </div>
    </>
  );
};
