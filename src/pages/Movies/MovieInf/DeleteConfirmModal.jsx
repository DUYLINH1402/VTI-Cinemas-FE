import React from "react";
import "./DeleteConfirmModal.scss";

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, deleteType }) => {
  if (!isOpen) return null;

  const title = deleteType === "comment" ? "Xác nhận xoá bình luận" : "Xác nhận xoá phản hồi";
  const message =
    deleteType === "comment"
      ? "Bạn có chắc chắn muốn xoá bình luận này?"
      : "Bạn có chắc chắn muốn xoá phản hồi này?";

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="btn-group">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};
