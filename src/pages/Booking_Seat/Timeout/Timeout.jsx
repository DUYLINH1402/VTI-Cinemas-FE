import { useEffect, useState } from "react";

export const Timeout = () => {
  const [count, setCount] = useState(6000); // Đặt thời gian ban đầu là 600 giây (10 phút)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);
    // Hàm cleanup để clear interval khi component unmount hoặc khi count về 0
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      // Chuyển hướng về trang chủ khi count bằng 0
      window.location.href = "/";
    }
  }, [count]);
  return (
    <>
      {Math.floor(count / 60)}:{count % 60}
    </>
  );
};
