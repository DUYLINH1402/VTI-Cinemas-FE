import { useEffect } from "react";
import { CardSeats } from "../../components/Cards/Cards";
import "./Booking_Seat.scss";
import { useLocation } from "react-router-dom";

export const Booking_Seat = () => {
  const { state } = useLocation();
  const { cinema, date, time } = state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="content">
        <CardSeats cinema={cinema} date={date} time={time} />
      </div>
    </>
  );
};
