import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Tạo styled component để tùy chỉnh giao diện
const WelcomeCard = styled(Card)(({ theme }) => ({
  color: "#1976d2",
  minHeight: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const AdminDashboard = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Card chào mừng chính */}
        <Grid item xs={12}>
          <WelcomeCard>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" gutterBottom>
                Xin chào Admin!
              </Typography>
              <Typography variant="h6">Chào mừng bạn đến với Bảng điều khiển Quản trị</Typography>
            </CardContent>
          </WelcomeCard>
        </Grid>

        {/* Card thông tin nhanh 1 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Tổng quan hệ thống
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Mọi thứ đang hoạt động bình thường <br /> (ĐANG PHÁT TRIỂN TÍNH NĂNG)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card thông tin nhanh 2 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Nhiệm vụ hôm nay
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Bạn có 3 nhiệm vụ cần xử lý <br />
                (ĐANG PHÁT TRIỂN TÍNH NĂNG)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card thông tin nhanh 3 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Hỗ trợ
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Liên hệ đội ngũ hỗ trợ nếu cần <br />
                (ĐANG PHÁT TRIỂN TÍNH NĂNG)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
