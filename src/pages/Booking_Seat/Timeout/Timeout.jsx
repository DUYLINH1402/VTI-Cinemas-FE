import { useEffect, useState } from "react";
export const Timeout = () => {
  const [count, setCount] = useState(() => {
    // Lấy thời gian từ localStorage hoặc mặc định là 600
    const savedCount = localStorage.getItem("timerCount");
    return savedCount ? parseInt(savedCount, 10) : 600;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount > 0 ? prevCount - 1 : 0;
        localStorage.setItem("timerCount", newCount); // Cập nhật localStorage
        return newCount;
      });
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval
  }, []);

  // Reset thời gian nếu rời khỏi trang chọn ghế
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Nếu rời khỏi trang, reset giá trị về 600
      localStorage.setItem("timerCount", 600);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      // Chuyển hướng về trang chủ khi thời gian hết
      window.location.href = "/";
    }
  }, [count]);

  return (
    <>
      {Math.floor(count / 60)}:{count % 60 < 10 ? `0${count % 60}` : count % 60}
    </>
  );
};
