import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Fade,
} from "@mui/material";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import module from "./PaymentNotification.module.scss";
import ServiceOrders from "./Service_Cinema/ServiceOrders";

export const PaymentNotification = ({ appTransId }) => {
  const [status, setStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!appTransId) {
      console.error("Thiếu appTransId để lắng nghe trạng thái");
      setStatus("not_found");
      return;
    }
    const db = getDatabase(); // Kết nối Firebase Realtime Database
    const orderRef = ref(db, `Orders/${appTransId}`); // Tham chiếu giao dịch

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
        className={module.notification_overlay}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, borderRadius: 2, maxWidth: 400 }}
          className={module.notification_container}
        >
          {status === "success" ? (
            <>
              <Typography
                variant="h5"
                color="success.main"
                textAlign="center"
                className={module.success_title}
              >
                Giao dịch thành công!
              </Typography>
              {paymentData && (
                <section className="notification-container">
                  <Grid container spacing={2}>
                    {/* Mã giao dịch */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Mã giao dịch:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {appTransId}
                      </Typography>
                    </Grid>

                    {/* Tên phim */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Tên phim:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.movieName}
                      </Typography>
                    </Grid>

                    {/* Hình thức */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Hình thức:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.format}
                      </Typography>
                    </Grid>

                    {/* Địa chỉ rạp */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Rạp:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.theater}
                      </Typography>
                    </Grid>

                    {/* Ghế ngồi */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Phòng - Ghế ngồi:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.room} -{" "}
                        {paymentData.movieDetails?.seat}
                      </Typography>
                    </Grid>

                    {/* Ngày chiếu */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Ngày chiếu:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.showDate}
                      </Typography>
                    </Grid>

                    {/* Suất chiếu */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Suất chiếu:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_value}
                      >
                        {paymentData.movieDetails?.showTime}
                      </Typography>
                    </Grid>

                    {/* Dịch vụ */}
                    <Grid item xs={4}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Dịch vụ kèm:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Box
                        className={module.notification_value}
                        sx={{ textAlign: "right" }}
                      >
                        {/* Lấy danh sách dịch vụ đã Orders */}
                        <ServiceOrders services={paymentData.services} />
                      </Box>
                    </Grid>

                    {/* Tổng thanh toán */}
                    <Grid item xs={6}>
                      <Typography
                        className={module.notification_title}
                        variant="body1"
                        align="left"
                      >
                        <strong>Tổng thanh toán:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        align="right"
                        className={module.notification_title}
                      >
                        {new Intl.NumberFormat("vi-VN").format(
                          paymentData.amount
                        )}{" "}
                        VNĐ
                      </Typography>
                    </Grid>
                  </Grid>
                </section>
              )}
              <Box mt={2}>
                <Button
                  className={module.action_buttons}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/")}
                >
                  Quay lại trang chủ
                </Button>
                <Button
                  className={module.action_buttons}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate("/members?tab=booking-history")}
                >
                  Xem lịch sử giao dịch
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                color="error.main"
                textAlign="center"
                className={module.error_title}
              >
                Giao dịch thất bại!
              </Typography>
              <Button
                className={module.action_buttons}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate("/payment")}
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
