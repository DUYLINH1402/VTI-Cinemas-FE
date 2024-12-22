import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyImage = ({ src, alt, height, width }) => {
  return (
    <LazyLoadImage
      src={src} // Link ảnh
      alt={alt} // Text thay thế
      effect="blur" // Hiệu ứng mờ khi tải
      height={height}
      width={width}
    />
  );
};

export default LazyImage;
