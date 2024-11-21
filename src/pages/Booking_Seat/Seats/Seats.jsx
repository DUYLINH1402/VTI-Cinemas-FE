import { useEffect, useState } from "react";
import { fetchSeats } from "../../../services/dataService";

export const Seats = ({ setSelectedSeatPrice, setSelectSeatName }) => {
  const [seats, setSeats] = useState([]);
  const [statusSeats, setStatusSeats] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSeats();
        setSeats(data);

        const intitialStatus = {};
        Object.entries(data).forEach(([seatData]) => {
          Object.entries(seatData).forEach(([seat_id, seatInf]) => {
            intitialStatus[seat_id] = seatInf.status || false;
          });
        });
        setStatusSeats(intitialStatus);
      } catch (error) {
        console.error("Error fetching seats data:", error);
      }
    };
    fetchData();
  }, []);

  console.log(statusSeats);

  const handleSeatClick = (price, seat_name, seat_id) => {
    // Cập nhật trạng thái của ghế khi người dùng click vào ghế
    const updatedStatus = { ...statusSeats };
    updatedStatus[seat_id] = !updatedStatus[seat_id]; // Đổi trạng thái (nếu ghế đang chưa chọn thì chọn, ngược lại)
    setStatusSeats(updatedStatus); // Cập nhật lại trạng thái ghế

    // Cập nhật giá vé và tên ghế cho component cha
    if (updatedStatus[seat_id]) {
      setSelectedSeatPrice(price);
      setSelectSeatName(seat_name);
    } else {
      setSelectedSeatPrice(null);
      setSelectSeatName(null);
    }
  };

  return (
    <>
      {Object.entries(seats).map(([row, seatData]) => (
        <div key={row}>
          {Object.entries(seatData).map(([seat_id, seatInf]) => {
            const seatImgUrl = statusSeats[seat_id]
              ? seatInf.imgURL_select
              : seatInf.imgURL;
            return (
              <div
                key={seat_id}
                title={seatInf.seat_name}
                onClick={() =>
                  handleSeatClick(
                    seatInf.price,
                    seatInf.seat_name,
                    seatInf.seat_id
                  )
                }
              >
                <img src={seatImgUrl} alt={seatInf.seat_name} />
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};
