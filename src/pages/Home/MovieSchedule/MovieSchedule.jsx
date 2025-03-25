import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import not_found_showtimes from "../../../assets/image/not_found_showtimes.svg";
import "./MovieSchedule.scss";
import { useMovieSchedule, calculateDistance } from "./MovieScheduleHandle";

const MovieSchedule = () => {
  const {
    regions,
    selectedRegion,
    filteredCinemas,
    selectedCinema,
    selectedDate,
    dates,
    isSortedByLocation,
    isLoadingLocation,
    handleGetLocation,
    handleDisableNearYou,
    handleRegionChange,
    handleCinemaChange,
    handleDateChange,
    handleShowtimeClick,
    groupedShowtimes,
    getMovieById,
    formatDateLabel,
    userLocation,
  } = useMovieSchedule();

  const selectedCinemaData = filteredCinemas.find((cinema) => cinema.id === selectedCinema);

  return (
    <div className="movie-schedule-wrapper">
      <h2 className="schedule-title">Lịch chiếu phim</h2>
      <div className="movie-schedule-controls">
        <div className="movie-schedule-dropdown">
          <span>Vị trí</span>
          <select value={selectedRegion} onChange={handleRegionChange}>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
          {isSortedByLocation ? (
            <button className="near-you-button" onClick={handleDisableNearYou}>
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              Tắt chế độ Gần bạn
            </button>
          ) : (
            <button
              className="near-you-button"
              onClick={handleGetLocation}
              disabled={isLoadingLocation}>
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              {isLoadingLocation ? "Đang lấy vị trí..." : "Gần bạn"}
            </button>
          )}
        </div>
      </div>
      <div className="movie-schedule">
        <div className="cinema-list movie-schedule-left">
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map((cinema) => (
              <div
                key={cinema.id}
                className={`cinema-item ${selectedCinema === cinema.id ? "active" : ""}`}
                onClick={() => handleCinemaChange(cinema.id)}>
                <span className="cinema-logo">
                  <img src={cinema.logo} alt="Logo" />
                </span>
                <span className="cinema-name">{cinema.name}</span>
                {userLocation && cinema.latitude && cinema.longitude && (
                  <span className="distance">
                    (
                    {calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      cinema.latitude,
                      cinema.longitude
                    ).toFixed(2)}{" "}
                    km)
                  </span>
                )}
              </div>
            ))
          ) : (
            <p>
              {isSortedByLocation
                ? "Không tìm thấy rạp chiếu phim gần bạn. Vui lòng chọn khu vực thủ công."
                : "Không tìm thấy rạp chiếu phim. Vui lòng chọn khu vực khác."}
            </p>
          )}
        </div>
        <div className="movie-schedule-right">
          {selectedCinemaData && (
            <div className="selected-cinema-info">
              <div className="cinema-logo">
                <img src={selectedCinemaData.logo} alt="Logo" />
              </div>
              <div className="cinema-details">
                <h3 className="cinema-title">Lịch chiếu {selectedCinemaData.name}</h3>
                <span className="cinema-location">{selectedCinemaData.location}</span>{" "}
                <span>
                  <a
                    href={`https://www.google.com/maps?q=${selectedCinemaData.latitude},${selectedCinemaData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link">
                    [Bản đồ]
                  </a>
                </span>
              </div>
            </div>
          )}
          <div className="date-selector">
            {dates.map((date, index) => (
              <div
                key={index}
                className={`date-item ${selectedDate.getDate() === date.getDate() ? "active" : ""}`}
                onClick={() => handleDateChange(date)}>
                <span className="date-label">{formatDateLabel(date)}</span>
                <span className="date-number">{date.getDate()}</span>
              </div>
            ))}
          </div>
          <div className="showtime-list">
            {Object.keys(groupedShowtimes).length > 0 ? (
              Object.keys(groupedShowtimes).map((movieId) => {
                const showtimesForMovie = groupedShowtimes[movieId];
                const movie = getMovieById(parseInt(movieId));
                return (
                  <div key={movieId} className="showtime-item">
                    <img src={movie.image} alt={movie.movie_name} />
                    <div className="showtime-details">
                      <h3>{movie.movie_name || "Phim không xác định"}</h3>
                      <span className={`age-rating age-${movie.viewing_age}`}>
                        {movie.viewing_age}+
                      </span>
                      <p>
                        {movie.format || "2D"} {movie.subtitle || "Phụ đề"}
                      </p>
                      <div className="showtime-times">
                        {showtimesForMovie.map((showtime, index) => (
                          <div key={index} className="showtime-slot">
                            <button onClick={() => handleShowtimeClick(showtime)}>
                              {new Date(showtime.start_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              ~{" "}
                              {new Date(showtime.end_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="not-found">
                <img src={not_found_showtimes} alt="Not found" />
                <p>Úi, Không tìm thấy suất chiếu.</p>
                <p>Bạn hãy thử tìm ngày khác nhé</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSchedule;
