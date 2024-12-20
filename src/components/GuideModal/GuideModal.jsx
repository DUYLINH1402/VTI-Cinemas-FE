import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
  Zoom,
} from "@mui/material"; // Các thành phần giao diện từ Material-UI
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon trợ giúp
import CloseIcon from "@mui/icons-material/Close"; // Icon đóng Modal
import styles from "./GuideModal.module.scss";

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
          <DialogTitle id="guide-modal-title" className={styles.dialogTitle}>
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
            <p>Đây là nội dung của Modal hướng dẫn.</p>
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
