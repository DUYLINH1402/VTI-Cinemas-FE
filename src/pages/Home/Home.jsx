import { CarouselSlide } from "./../../components/Carousel/Carousel";
import FeaturedComments from "./FeaturedComments/FeaturedComments";
import { HomeContent } from "./HomeContent/HomeContent";
import "./HomeContent/HomeContent.scss";
import HomePromotions from "./HomePromotions/HomePromotions";
export const Home = () => {
  return (
    <>
      <div className="content ">
        <CarouselSlide />
        <HomeContent />
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
