import "./SearchBar.modul.scss";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) setSearchTerm("");
  };

  return (
    <div>
      <div className={`search-container ${isExpanded ? "expanded" : ""}`}>
        <div className="search-admin-wrapper">
          <FontAwesomeIcon
            className="search-icon"
            icon={faSearch}
            onClick={toggleSearch}
          />
          <input
            type="text"
            className="search-input"
            placeholder={placeholder || "Tìm kiếm..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isExpanded && (
            <FontAwesomeIcon
              className="clear-icon"
              icon={faTimes}
              onClick={toggleSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
