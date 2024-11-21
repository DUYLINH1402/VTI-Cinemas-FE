import { useEffect } from "react";
import { CardSeats } from "../../components/Cards/Cards";
import "./Booking_Seat.scss";

export const Booking_Seat = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <div className="content">
        <CardSeats />
      </div>
    </>
  );
};
