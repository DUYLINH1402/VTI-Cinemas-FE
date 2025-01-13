import React from "react";
import "./LoadingScreen.scss";

export const LoadingScreen = ({ message = "Đang tải..." }) => {
  return (
    <div>
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingScreen;
