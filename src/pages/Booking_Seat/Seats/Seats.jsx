import { useEffect, useState } from "react";
import { fetchSeats } from "../../../services/dataService";

export const Seats = ({ setSelectedSeatPrice, setSelectSeatName }) => {
  const [seats, setSeats] = useState([]); // Dữ liệu ghế
  const [statusSeats, setStatusSeats] = useState(() => {
    // Load trạng thái ghế từ localStorage
    const savedStatus = localStorage.getItem("statusSeats");
    return savedStatus ? JSON.parse(savedStatus) : {};
  }); // Trạng thái ghế

  // Cập nhật trạng thái ghế vào localStorage
  useEffect(() => {
    localStorage.setItem("statusSeats", JSON.stringify(statusSeats));
  }, [statusSeats]);

  // Reset ghế nếu rời khỏi trang chọn ghế
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Nếu rời khỏi trang, reset giá trị về {},0,[]
      localStorage.setItem("statusSeats", JSON.stringify({}));
      setStatusSeats({});
      localStorage.setItem("selectedSeatPrice", 0);
      setSelectedSeatPrice(0);
      localStorage.setItem("selectedSeatNames", JSON.stringify([]));
      setSelectSeatName([]);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Lấy dữ liệu ghế từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSeats();
        setSeats(data);
      } catch (error) {
        console.error("Error fetching seats data:", error);
      }
    };
    fetchData();
  }, []);

  // Xử lý khi click vào ghế
  const handleSeatClick = (price, seat_name, seat_id) => {
    setStatusSeats((prevStatus) => {
      const isSelected = !prevStatus[seat_id]?.selected; // Trạng thái mới của ghế
      const updatedStatus = {
        ...prevStatus,
        [seat_id]: {
          selected: isSelected, // Cập nhật trạng thái chọn
        },
      };

      // Cập nhật tên ghế đã chọn
      setSelectSeatName((prevName) => {
        if (isSelected) {
          if (!prevName.includes(seat_name)) {
            return [...prevName, seat_name]; // Thêm tên ghế vào danh sách nếu chưa có
          }
        } else {
          return prevName.filter((name) => name !== seat_name); // Xóa tên ghế khi bỏ chọn
        }
        localStorage.setItem("selectedSeatNames", JSON.stringify(prevName)); // Lưu tên ghế vào localStorage
        return prevName;
      });

      // Cập nhật tổng giá vé
      const totalPrice = Object.values(updatedStatus).reduce((total, seat) => {
        return seat.selected ? total + price : total;
      }, 0);

      setSelectedSeatPrice(totalPrice); // Cập nhật tổng giá vé
      localStorage.setItem("selectedSeatPrice", totalPrice); // Lưu giá vé vào localStorage

      return updatedStatus;
    });
  };

  return (
    <>
      {Object.entries(seats || {}).map(([row, seatData]) => (
        <div key={row} className="seat-row">
          {Object.entries(seatData || {}).map(([seat_id, seatInf]) => {
            const seatStatus = statusSeats[seat_id] || {}; // Trạng thái của ghế
            return (
              <div
                key={seat_id}
                title={seatInf.seat_name}
                className="seat"
                onClick={() =>
                  handleSeatClick(seatInf.price, seatInf.seat_name, seat_id)
                }
              >
                {seatStatus.selected ? (
                  <img src={seatInf.imgURL_select} alt={seatInf.seat_name} />
                ) : (
                  <img src={seatInf.imgURL} alt={seatInf.seat_name} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};
