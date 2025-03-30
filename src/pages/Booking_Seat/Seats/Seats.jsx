import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { toast } from "react-toastify";
import { LoadingScreen } from "../../../components/Loading/LoadingScreen";

const db = getDatabase();

export const Seats = ({ setSelectedSeatPrice, setSelectSeatName, cinema_id, showtime_id }) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [seatsByRow, setSeatsByRow] = useState({});
  const [statusSeats, setStatusSeats] = useState({});

  // LẮNG NGHE DỮ LIỆU TỪ SEATS VÀ BOOKINGS
  useEffect(() => {
    const seatsRef = ref(db, "Seats");
    const bookingsRef = ref(db, `Bookings/${showtime_id}/seats`);

    onValue(seatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allSeats = snapshot.val();
        // console.log("Dữ liệu ghế từ Seats:", allSeats); // Kiểm tra dữ liệu ghế

        onValue(bookingsRef, (bookingSnapshot) => {
          const seatStatuses = bookingSnapshot.exists() ? bookingSnapshot.val() : {};
          setStatusSeats(seatStatuses);

          // Gộp dữ liệu Seats và trạng thái từ Bookings
          const mergedSeats = Object.keys(allSeats).reduce((acc, row) => {
            acc[row] = Object.entries(allSeats[row]).reduce((rowAcc, [_, seatData]) => {
              const seat_id = seatData.seat_id;
              rowAcc[seat_id] = {
                ...seatData,
                status: seatStatuses[seat_id]?.status || "empty",
                user: seatStatuses[seat_id]?.user || null,
                timestamp: seatStatuses[seat_id]?.timestamp || null,
              };
              return rowAcc;
            }, {});
            return acc;
          }, {});
          // console.log("Dữ liệu ghế sau khi gộp (seatsByRow):", mergedSeats); // Kiểm tra dữ liệu sau khi gộp
          setSeatsByRow(mergedSeats);
        });
      } else {
        toast.error("Không tìm thấy danh sách ghế!");
      }
    });
  }, [showtime_id]);

  // XỬ LÝ KHI CLICK CHỌN GHẾ
  const handleSeatClick = async (price, seat_name, seat_id) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chọn ghế!");
      return;
    }

    const seatRef = ref(db, `Bookings/${showtime_id}/seats/${seat_id}`);
    const snapshot = await get(seatRef);
    const seatData = snapshot.exists() ? snapshot.val() : { status: "empty" };

    if (seatData.status === "sold") {
      toast.error(`Ghế ${seat_name} đã được đặt!`);
      return;
    }
    if (seatData.status === "reserved" && seatData.user !== user.email) {
      toast.warning(`Ghế ${seat_name} đang được giữ bởi ${seatData.user}!`);
      return;
    }

    const isSelected = seatData.status !== "reserved";
    const newStatus = isSelected ? "reserved" : "empty";
    const newTimestamp = isSelected ? Date.now() : null;

    await update(seatRef, {
      status: newStatus,
      user: isSelected ? user.email : null,
      timestamp: newTimestamp,
    });

    setSelectSeatName((prev) => {
      const updatedNames = isSelected
        ? [...prev, seat_name]
        : prev.filter((name) => name !== seat_name);
      localStorage.setItem("selectedSeatNames", JSON.stringify(updatedNames));
      return updatedNames;
    });

    setSelectedSeatPrice((prev) => {
      const newTotalPrice = isSelected ? prev + price : Math.max(0, prev - price);
      localStorage.setItem("selectedSeatPrice", newTotalPrice);
      return newTotalPrice;
    });

    setSeatsByRow((prev) => {
      const row = seat_name.charAt(0).toUpperCase();
      return {
        ...prev,
        [row]: {
          ...prev[row],
          [seat_id]: {
            ...prev[row][seat_id],
            status: newStatus,
            user: isSelected ? user.email : null,
            timestamp: newTimestamp,
          },
        },
      };
    });
  };

  // TỰ ĐỘNG RESET GHẾ SAU 10 PHÚT NẾU KHÔNG MUA
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      Object.entries(statusSeats).forEach(async ([seat_id, seat]) => {
        if (
          seat.status === "reserved" &&
          seat.user === user?.email &&
          now - seat.timestamp > 10 * 60 * 1000
        ) {
          const seatRef = ref(db, `Bookings/${showtime_id}/seats/${seat_id}`);
          await update(seatRef, { status: "empty", user: null, timestamp: null });
        }
      });
    }, 30 * 1000); // Kiểm tra mỗi 30 giây
    return () => clearInterval(interval);
  }, [statusSeats, showtime_id, user?.email]);

  // RESET GHẾ NẾU RỜI KHỎI TRANG CHỌN GHẾ
  // useEffect(() => {
  //   const handleBeforeUnload = async () => {
  //     // Nếu rời khỏi trang, reset giá trị về {},0,[]
  //     localStorage.setItem("statusSeats", JSON.stringify({}));
  //     setStatusSeats({});
  //     localStorage.setItem("selectedSeatPrice", 0);
  //     setSelectedSeatPrice(0);
  //     localStorage.setItem("selectedSeatNames", JSON.stringify([]));
  //     setSelectSeatName([]);

  //     const showtimeSeatRef = ref(db, `Bookings/${showtime_id}/seats`);
  //     const snapshot = await get(showtimeSeatRef);
  //     if (snapshot.exists()) {
  //       const seatStatuses = snapshot.val();

  //       // Chỉ reset ghế nếu user hiện tại là người giữ ghế đó
  //       Object.entries(seatStatuses).forEach(async ([seat_id, seatData]) => {
  //         if (seatData.status === "reserved" && seatData.user === user?.email) {
  //           const seatRef = ref(db, `Bookings/${showtime_id}/seats/${seat_id}`);
  //           await update(seatRef, {
  //             status: "empty",
  //             user: null,
  //             timestamp: null,
  //           });
  //         }
  //       });
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [showtime_id]);
  useEffect(() => {
    // Hàm reset trạng thái ghế
    const resetSeats = async () => {
      // Reset localStorage
      localStorage.setItem("statusSeats", JSON.stringify({}));
      setStatusSeats({});
      localStorage.setItem("selectedSeatPrice", 0);
      setSelectedSeatPrice(0);
      localStorage.setItem("selectedSeatNames", JSON.stringify([]));
      setSelectSeatName([]);

      // Reset ghế trong Firebase
      const showtimeSeatRef = ref(db, `Bookings/${showtime_id}/seats`);
      const snapshot = await get(showtimeSeatRef);
      if (snapshot.exists()) {
        const seatStatuses = snapshot.val();
        Object.entries(seatStatuses).forEach(async ([seat_id, seatData]) => {
          if (seatData.status === "reserved" && seatData.user === user?.email) {
            const seatRef = ref(db, `Bookings/${showtime_id}/seats/${seat_id}`);
            await update(seatRef, {
              status: "empty",
              user: null,
              timestamp: null,
            });
          }
        });
      }
    };

    // Xử lý khi rời khỏi trang (beforeunload)
    const handleBeforeUnload = async () => {
      await resetSeats();
    };

    // Xử lý khi trang được hiển thị lại (pageshow)
    const handlePageShow = async (event) => {
      if (event.persisted) {
        // Nếu trang được khôi phục từ BFCache (người dùng nhấn nút "quay lại")
        await resetSeats();
      }
    };

    // Gắn sự kiện beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Gắn sự kiện pageshow
    window.addEventListener("pageshow", handlePageShow);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [showtime_id, user?.email, setSelectedSeatPrice, setSelectSeatName]);

  if (!seatsByRow || Object.keys(seatsByRow).length === 0) {
    return <LoadingScreen />;
  }

  // Định nghĩa thứ tự các hàng ghế (A, B, C, ..., H)
  const rowOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div>
      <div className="card_seat">
        <div>
          <div className="col1">
            <div className="row_seat">
              {rowOrder
                .filter((row) => seatsByRow[row]) // Chỉ lấy các hàng có trong seatsByRow
                .map((row) => (
                  <div key={row} className="seat-row">
                    <div className="seat">
                      {Object.entries(seatsByRow[row])
                        .sort((a, b) => {
                          // Tách số từ seat_name (ví dụ: "A1" -> 1, "A10" -> 10)
                          const numA = parseInt(a[1].seat_name.slice(1));
                          const numB = parseInt(b[1].seat_name.slice(1));
                          return numA - numB; // Sắp xếp theo số
                        })
                        .map(([seat_id, seatInf]) => (
                          <div
                            key={seat_id}
                            // TẠO LỐI ĐI
                            // className={`seat-wrapper ${
                            //   seatInf.seat_name.endsWith("4") ? "aisle-before" : ""
                            // }`}
                          >
                            <div
                              className="seat"
                              onClick={() =>
                                handleSeatClick(seatInf.price, seatInf.seat_name, seat_id)
                              }>
                              {seatInf.status === "sold" ? (
                                <img src={seatInf.imgURL_sold} alt={seatInf.seat_name} />
                              ) : seatInf.status === "reserved" ? (
                                seatInf.user === user?.email ? (
                                  <img src={seatInf.imgURL_select} alt={seatInf.seat_name} />
                                ) : (
                                  <img src={seatInf.imgURL_reserved} alt={seatInf.seat_name} />
                                )
                              ) : (
                                <img src={seatInf.imgURL} alt={seatInf.seat_name} />
                              )}
                              <p className="seat-name">{seatInf.seat_name}</p>
                            </div>
                            {/* Thêm lối đi sau ghế số 5 */}
                            {seatInf.seat_name.endsWith("5") && <div className="aisle" />}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
