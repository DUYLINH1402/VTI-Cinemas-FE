import { useEffect } from "react";
import { CardPayment } from "../../components/Cards/Cards";
import "./Payment.scss";

export const Payment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <div className="content">
        <CardPayment />
      </div>
    </>
  );
};
