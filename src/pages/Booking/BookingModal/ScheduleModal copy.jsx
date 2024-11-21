import React, { useState, useEffect } from "react";

const ScheduleModal = ({ onNext, onBack, onClose, selectedCinema }) => {
  const [schedule, setSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  // Fetch dữ liệu lịch chiếu
  React.useEffect(() => {
    const fetchSchedule = async () => {
      // Thay bằng API thực tế
      const mockData = [
        {
          date: "2024-11-18",
          sessions: [
            { time: "08:40", seatsAvailable: 136 },
            { time: "12:30", seatsAvailable: 136 },
          ],
        },
      ];
      setSchedule(mockData);
    };
    fetchSchedule();
  }, []);
  console.log("Selected Cinema:", selectedCinema);
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onNext({ date: selectedDate, time: selectedTime }); // Gửi lịch chiếu đã chọn
    }
  };

  if (!schedule) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chọn lịch chiếu</h2>
        <p>Rạp: {selectedCinema}</p>
        <div>
          <button onClick={() => setSelectedDate("2024-11-18")}>18/11</button>
          <button onClick={() => setSelectedDate("2024-11-19")}>19/11</button>
        </div>
        <div>
          <button onClick={() => setSelectedTime("08:40")}>08:40</button>
          <button onClick={() => setSelectedTime("12:30")}>12:30</button>
        </div>
        <button onClick={onBack}>Quay lại</button>
        <button onClick={onClose}>Hủy</button>
        <button onClick={handleSubmit}>Tiếp theo</button>
      </div>
    </div>
  );
};
export default ScheduleModal;
