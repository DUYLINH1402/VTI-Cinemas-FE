import { useEffect } from "react";

const useAutosizeTextarea = (textareaRef, value) => {
  useEffect(() => {
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // Reset chiều cao trước khi tính toán lại
      textarea.style.height = textarea.scrollHeight + "px"; // Gán chiều cao dựa trên nội dung
    }
  }, [textareaRef, value]); // Chạy lại khi giá trị thay đổi
};

export default useAutosizeTextarea;
