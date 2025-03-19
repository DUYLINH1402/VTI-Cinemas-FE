import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { toast } from "react-toastify";
const db = getDatabase();

export const Seats = ({ setSelectedSeatPrice, setSelectSeatName, cinema_id, showtime_id }) => {
  const userData = localStorage.getItem("user"); // Lấy dữ liệu dạng chuỗi
  const user = userData ? JSON.parse(userData) : null; // Chuyển về object

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

  // LẮNG NGHE SỰ THAY ĐỔI GHẾ THEO THỜI GIAN THỰC
  useEffect(() => {
    const seatsRef = ref(db, `Seats`);
    const showtimeRef = ref(db, `Cinema/${cinema_id}/showtimes/${showtime_id}/seats`);

    onValue(seatsRef, (snapshotSeats) => {
      if (snapshotSeats.exists()) {
        const allSeats = snapshotSeats.val();
        onValue(showtimeRef, (snapshotShowtime) => {
          let seatStatuses = snapshotShowtime.exists() ? snapshotShowtime.val() : {};
          const mergedSeats = Object.entries(allSeats).reduce((acc, [seat_id, seatData]) => {
            acc[seat_id] = { ...seatData, status: seatStatuses[seat_id]?.status || "empty" };
            return acc;
          }, {});
          setSeats(mergedSeats);
          setStatusSeats(seatStatuses);
        });
      }
    });
  }, [cinema_id, showtime_id]);

  // XỬ LÝ KHI CLICK VÀO GHẾ
  const handleSeatClick = async (price, seat_name, seat_id) => {
    const showtimeSeatRef = ref(
      db,
      `Cinema/${cinema_id}/showtimes/${showtime_id}/seats/${seat_id}`
    );
    const snapshot = await get(showtimeSeatRef);
    if (snapshot.exists()) {
      let seatData = snapshot.val();

      if (seatData.status === "sold") {
        toast.error("Ghế này đã được đặt!Chúng tôi đang phát triển tính năng này");
        return;
      }

      // Nếu ghế đang giữ và do user khác giữ -> Không cho chọn
      if (seatData.status === "reserved" && seatData.user !== user.email) {
        toast.warning("Ghế đang được người khác giữ!");
        return;
      }

      // Nếu bỏ chọn ghế -> Xóa thông tin user, xóa timestamp khỏi Firebase
      const isSelected = !seatData.selected;
      const newStatus = isSelected ? "reserved" : "empty";
      const newTimestamp = isSelected ? Date.now() : null; // Chỉ lưu timestamp khi ghế được giữ

      await update(showtimeSeatRef, {
        status: newStatus,
        selected: newStatus === "reserved",
        user: newStatus === "reserved" ? user.email : null, // Xóa user khi bỏ chọn
        timestamp: newTimestamp, // Lưu thời gian giữ ghế
      });

      // Cập nhật danh sách ghế đã chọn
      setSelectSeatName((prevName) => {
        const updatedNames =
          newStatus === "reserved"
            ? [...prevName, seat_name]
            : prevName.filter((name) => name !== seat_name);
        localStorage.setItem("selectedSeatNames", JSON.stringify(updatedNames));
        return updatedNames;
      });

      // Cập nhật tổng giá vé
      setSelectedSeatPrice((prevPrice) => {
        let newTotalPrice;

        if (newStatus === "reserved") {
          newTotalPrice = prevPrice + price;
        } else if (newStatus === "empty" && prevPrice >= price) {
          // Đảm bảo không trừ khi giá trị chưa đủ lớn
          newTotalPrice = prevPrice - price;
        } else {
          newTotalPrice = 0; // Tránh giá trị âm
        }

        localStorage.setItem("selectedSeatPrice", newTotalPrice);
        return newTotalPrice;
      });

      // Cập nhật state ghế để UI thay đổi ngay lập tức
      setSeats((prevSeats) => ({
        ...prevSeats,
        [seat_id]: { ...prevSeats[seat_id], status: newStatus, selected: newStatus === "reserved" },
      }));
    }
  };

  // RESET GHẾ NẾU RỜI KHỎI TRANG CHỌN GHẾ
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Nếu rời khỏi trang, reset giá trị về {},0,[]
      localStorage.setItem("statusSeats", JSON.stringify({}));
      setStatusSeats({});
      localStorage.setItem("selectedSeatPrice", 0);
      setSelectedSeatPrice(0);
      localStorage.setItem("selectedSeatNames", JSON.stringify([]));
      setSelectSeatName([]);

      const showtimeSeatRef = ref(db, `Cinema/${cinema_id}/showtimes/${showtime_id}/seats`);
      const snapshot = await get(showtimeSeatRef);
      if (snapshot.exists()) {
        const seatStatuses = snapshot.val();

        // Chỉ reset ghế nếu user hiện tại là người giữ ghế đó
        Object.entries(seatStatuses).forEach(async ([seat_id, seatData]) => {
          if (seatData.status === "reserved" && seatData.user === user?.email) {
            const seatRef = ref(
              db,
              `Cinema/${cinema_id}/showtimes/${showtime_id}/seats/${seat_id}`
            );
            await update(seatRef, {
              status: "empty",
              selected: false,
              user: null,
              timestamp: null,
            });
          }
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showtime_id]);

  // TỰ ĐỘNG RESET GHẾ KHI HẾT THỜI GIAN GIỮ
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      // Chỉ reset ghế của user hiện tại
      Object.entries(statusSeats).forEach(async ([seat_id, seat]) => {
        if (
          seat.status === "reserved" &&
          seat.user === user?.email &&
          now - seat.timestamp > 10 * 60 * 1000
        ) {
          // Quá 10 phút
          const seatRef = ref(db, `Cinema/${cinema_id}/showtimes/${showtime_id}/seats/${seat_id}`);
          await update(seatRef, { status: "empty", selected: false, user: null, timestamp: null }); // Reset ghế
        }
      });
    }, 30 * 1000); // Kiểm tra mỗi 30 giây

    return () => clearInterval(interval);
  }, [statusSeats]);

  return (
    <>
      {Object.entries(seats || {})
        .sort(([rowA], [rowB]) => {
          const numA = parseInt(rowA.replace(/\D/g, ""), 10) || 0;
          const numB = parseInt(rowB.replace(/\D/g, ""), 10) || 0;
          return numA - numB;
        })
        .map(([row, seatData]) =>
          seatData ? (
            <div key={row} className="seat-row">
              {Object.entries(seatData || {}).map(([seat_id, seatInf]) =>
                seatInf && seatInf.seat_name ? (
                  <div
                    key={seat_id}
                    title={seatInf.seat_name}
                    className="seat"
                    onClick={() => handleSeatClick(seatInf.price, seatInf.seat_name, seat_id)}
                  >
                    {statusSeats[seat_id]?.status === "sold" ? ( // Nếu ghế đã bán
                      <img src={seatInf.imgURL_sold} alt={seatInf.seat_name} />
                    ) : statusSeats[seat_id]?.status === "reserved" ? ( // Nếu ghế đang được giữ
                      statusSeats[seat_id]?.user === user?.email ? (
                        <img src={seatInf.imgURL_select} alt={seatInf.seat_name} />
                      ) : (
                        <img src={seatInf.imgURL_reserved} alt={seatInf.seat_name} />
                      )
                    ) : (
                      <img src={seatInf.imgURL} alt={seatInf.seat_name} /> // Ghế trống
                    )}
                    <p className="seat-name">{seatInf.seat_name}</p>
                  </div>
                ) : null
              )}
            </div>
          ) : null
        )}
    </>
  );
};
