import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Zoom,
  Button,
} from "@mui/material"; // Các thành phần giao diện từ Material-UI
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon trợ giúp
import CloseIcon from "@mui/icons-material/Close"; // Icon đóng Modal
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "./GuideModal.module.scss";
import classNames from "classnames";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const GuideModal = () => {
  // State quản lý trạng thái mở/đóng của Modal
  const [open, setOpen] = useState(true); // Modal mở mặc định
  const [isClosing, setIsClosing] = useState(false); // Trạng thái thu nhỏ (animation khi đóng)
  const [isOpening, setIsOpening] = useState(false); // Trạng thái phóng to (animation khi mở lại)

  // Hàm xử lý đóng Modal
  const handleClose = () => {
    setIsClosing(true); // Kích hoạt hiệu ứng thu nhỏ
    setTimeout(() => {
      setOpen(false); // Đóng Modal sau khi hoàn tất hiệu ứng
      setIsClosing(false); // Reset trạng thái animation
    }, 500); // Thời gian animation (500ms)
  };

  // Hàm xử lý mở lại Modal
  const handleReopen = () => {
    setIsOpening(true); // Kích hoạt hiệu ứng phóng to
    setOpen(true); // Hiển thị Modal
    setTimeout(() => {
      setIsOpening(false); // Reset trạng thái animation
    }, 500); // Thời gian animation (500ms)
  };
  // Hàm sao chép nội dung vào clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!"); // Thông báo người dùng
  };
  return (
    <>
      {/* Hiển thị Modal (Dialog) nếu đang mở hoặc trong trạng thái animation */}
      {(open || isClosing || isOpening) && (
        <Dialog
          open={open} // Trạng thái mở/đóng của Modal
          onClose={handleClose} // Đóng Modal khi nhấn overlay
          disableScrollLock={true} // Không khóa cuộn trang khi Modal hiển thị
          scroll="body" // Nội dung Modal không khóa cuộn
          PaperProps={{
            // Gán class animation cho phần tử Modal
            className: `${isClosing ? styles.modalShrink : ""} ${
              isOpening ? styles.modalExpand : ""
            }`,
          }}
          aria-labelledby="guide-modal-title" // Thẻ `aria` để tăng khả năng truy cập
        >
          {/* Tiêu đề của Modal */}
          <DialogTitle id="guide-modal-title" className={styles.guide__title}>
            Hướng dẫn sử dụng Web
            {/* Nút đóng Modal */}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {/* Nội dung Modal */}
          <DialogContent>
            <p className={styles.guide_intro}>
              Sau khi chọn phim và đặt vé, bạn cần tài khoản để thanh toán. Do
              dó Team phát triển cung cấp các tài khoản thanh toán để bạn trải
              nghiệm Webside
            </p>
            <div className={styles.guide_content}>
              <strong className={styles.guide_intro}>
                1. Thanh toán bằng App ZaloPay :
              </strong>
              <a
                href="https://beta-docs.zalopay.vn/docs/developer-tools/test-instructions/test-wallets/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tải App tại đây (bản thử nghiệm)
              </a>
            </div>
            <div className={styles.guide_content}>
              <p className={styles.guide_intro}>
                2. Thanh toán bằng thẻ Visa, Master, JCB
              </p>
              <p>
                <strong className={styles.title_card}>Số thẻ :</strong>{" "}
                4111111111111111{" "}
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("4111111111111111")}
                >
                  Copy
                </Button>
                <br />
                <strong className={styles.title_card}>Tên :</strong> NGUYEN VAN
                A <br />
                <strong className={styles.title_card}>
                  Ngày hết hạn :
                </strong>{" "}
                01/25 <br />
                <strong className={styles.title_card}>Mã CVV :</strong> 123
              </p>
            </div>
            <div className={styles.guide_content}>
              <p className={styles.guide_intro}>
                3. Thanh toán bằng thẻ ATM (Test với Bank SBI)
              </p>
              <p>
                <strong className={styles.title_card}>Tên chủ thẻ : </strong>{" "}
                NGUYEN VAN A
              </p>
              <p>
                <strong className={styles.title_card}>Ngày phát hành : </strong>
                1018
              </p>
              <p>
                <strong className={styles.title_card}> - Thẻ hợp lệ : </strong>{" "}
                9704540000000062{" "}
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("9704540000000062")}
                >
                  Copy
                </Button>
              </p>
              <p>
                <strong className={styles.title_card}>
                  {" "}
                  - Thẻ bị mất/đánh cắp :{" "}
                </strong>{" "}
                9704540000000013{" "}
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("9704540000000013")}
                >
                  Copy
                </Button>
              </p>
              <p>
                <strong className={styles.title_card}>
                  {" "}
                  - Thẻ hết tiền :{" "}
                </strong>{" "}
                9704540000000047{" "}
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  className={styles.copyButton}
                  onClick={() => handleCopy("9704540000000047	")}
                >
                  Copy
                </Button>
              </p>
            </div>
            <div
              className={classNames(styles.guide_content, styles.guide_intro)}
            >
              4. Để vào được giao diện quản lý vui lòng liên hệ Team phát triển
              để được cung cấp tài khoản Admin thông qua email:{" "}
              <Link to="mailto:mock2406@gmail.com">mock2406@gmail.com</Link>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Action Button (FAB) để mở lại Modal */}
      {!open && !isOpening && (
        <Zoom in>
          <Fab
            color="primary" // Màu sắc của FAB
            onClick={handleReopen} // Xử lý mở lại Modal
            className={styles.reopenButton} // Class CSS cho FAB
          >
            <HelpOutlineIcon /> {/* Icon trợ giúp */}
          </Fab>
        </Zoom>
      )}
    </>
  );
};

export default GuideModal;
