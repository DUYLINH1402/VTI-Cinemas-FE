import React from "react";
import PropTypes from "prop-types";

const LoadingIcon = ({ size, color }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}40`, // Màu viền mờ hơn
        borderTop: `3px solid ${color}`, // Màu viền chính
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
  );
};

// Thêm animation quay tròn
const style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

LoadingIcon.propTypes = {
  size: PropTypes.string, // Kích thước của spinner (e.g., "20px", "2rem")
  color: PropTypes.string, // Màu sắc (e.g., "#1976d2", "red")
};

LoadingIcon.defaultProps = {
  size: "20px",
  color: "red",
};

export default LoadingIcon;
