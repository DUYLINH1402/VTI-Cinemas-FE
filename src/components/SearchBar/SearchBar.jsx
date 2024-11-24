import "./SearchBar.modul.scss";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Xử lý debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //   console.log("Search term:", searchTerm);
      onSearch(searchTerm); // Gửi kết quả tìm kiếm về parent
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm theo phim, thể loại, diễn viên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
    </div>
  );
};

export default SearchBar;
