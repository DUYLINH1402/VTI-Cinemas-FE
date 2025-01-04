import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { fetchBookingHistory } from "../../../../services/service/serviceBooking";
import BookingDetailsModal from "./BookingDetailsModal";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const email = userInfo?.email;
  useEffect(() => {
    const loadBookings = async () => {
      const history = await fetchBookingHistory(email);
      setBookings(history);
    };
    loadBookings();
  }, [email]);

  const columns = [
    {
      title: "Tên phim",
      dataIndex: ["movieDetails", "movieName"],
      key: "movieName",
    },
    {
      title: "Rạp",
      dataIndex: ["movieDetails", "theater"],
      key: "theater",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        `${new Intl.NumberFormat("vi-VN").format(amount)} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "success" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status === "success" ? "Thành công" : "Chưa thanh toán"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const dataSource = bookings.map((booking, index) => ({
    ...booking,
    key: index,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={{ pageSize: 5 }}
      />
      <BookingDetailsModal
        isVisible={isModalVisible}
        handleCancel={handleCloseModal}
        bookingData={selectedBooking}
      />
    </>
  );
};

export default BookingHistory;
