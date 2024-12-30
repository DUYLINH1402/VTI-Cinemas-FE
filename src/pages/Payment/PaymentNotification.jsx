import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Fade,
} from "@mui/material";
import { getDatabase, ref, onValue } from "firebase/database";

export const PaymentNotification = ({ appTransId }) => {
  const [status, setStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!appTransId) {
      console.error("Thiếu appTransId để lắng nghe trạng thái");
      return;
    }

    const db = getDatabase(); // Kết nối Firebase Realtime Database
    const orderRef = ref(db, `orders/${appTransId}`); // Tham chiếu giao dịch

    // Lắng nghe sự thay đổi trạng thái từ Firebase
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStatus(data.status); // Cập nhật trạng thái
        setPaymentData(data); // Lưu thông tin giao dịch
      } else {
        setStatus("not_found");
      }
    });

    return () => unsubscribe(); // Cleanup listener khi component bị unmount
  }, [appTransId]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "not_found") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Không tìm thấy giao dịch!
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={1000}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f8f8f8"
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, borderRadius: 2, maxWidth: 400 }}
        >
          {status === "success" ? (
            <>
              <Typography variant="h5" color="success.main" textAlign="center">
                Giao dịch thành công!
              </Typography>
              <Typography variant="body1" textAlign="center" gutterBottom>
                Mã giao dịch: {appTransId}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => (window.location.href = "/")}
              >
                Quay lại trang chủ
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5" color="error.main" textAlign="center">
                Giao dịch thất bại!
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => (window.location.href = "/payment")}
              >
                Thử lại
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};
