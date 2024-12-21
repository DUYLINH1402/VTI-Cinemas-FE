import "./SearchBar.modul.scss";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Xử lý debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //   console.log("Search term:", searchTerm);
      onSearch(searchTerm); // Gửi kết quả tìm kiếm về parent
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleClear = () => {
    setSearchTerm(""); // Đặt lại giá trị tìm kiếm
    onSearch(""); // Gửi callback với giá trị rỗng
  };
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || "Tìm kiếm..."} // Giá trị mặc định hoặc nhận từ props
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <FontAwesomeIcon
          className="clear-icon"
          icon={faTimes}
          onClick={handleClear}
        />
      )}
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
    </div>
  );
};

export default SearchBar;
