import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchShowtimes } from "../../../services/service/serviceCinemas";
import { fetchMovies } from "../../../services/service/serviceMovie";
import {
  fetchCinemasWithShowtimesFromFirebase,
  fetchRegionsOfCinemasFromFirebase,
  fetchCinemasByRegionFromFirebase,
} from "../../../services/firebase/firebaseCinemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import not_found_showtimes from "../../../assets/image/not_found_showtimes.svg";
import "./MovieSchedule.scss";
import { toast } from "react-toastify";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    console.error("Invalid coordinates:", { lat1, lon1, lat2, lon2 });
    return Infinity;
  }

  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const MovieSchedule = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date("2025-03-23"));
  const [dates, setDates] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isSortedByLocation, setIsSortedByLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const today = new Date("2025-03-23");
    const dateList = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateList.push(date);
    }
    setDates(dateList);
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = await fetchRegionsOfCinemasFromFirebase();
        setRegions(regionData);
        if (regionData.length > 0) {
          setSelectedRegion(regionData[0]);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const cinemaData = await fetchCinemasWithShowtimesFromFirebase();
        setCinemas(cinemaData);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };
    loadCinemas();
  }, []);

  useEffect(() => {
    const loadFilteredCinemas = async () => {
      try {
        let filteredCinemasWithShowtimes = [];

        if (isSortedByLocation && userLocation) {
          const nearestCinema = cinemas.reduce((nearest, cinema) => {
            if (!cinema.latitude || !cinema.longitude) {
              console.warn(`Cinema ${cinema.name} lacks valid coordinates. Skipping...`);
              return nearest;
            }

            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              cinema.latitude,
              cinema.longitude
            );
            if (!nearest || distance < nearest.distance) {
              return { cinema, distance };
            }
            return nearest;
          }, null);

          if (nearestCinema) {
            const nearestRegion = nearestCinema.cinema.city;
            setSelectedRegion(nearestRegion);
            const filteredData = await fetchCinemasByRegionFromFirebase(nearestRegion);
            filteredCinemasWithShowtimes = cinemas.filter((cinema) =>
              filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
            );

            filteredCinemasWithShowtimes.sort((a, b) => {
              const distanceA = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                a.latitude,
                a.longitude
              );
              const distanceB = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                b.latitude,
                b.longitude
              );
              return distanceA - distanceB;
            });
          }
        } else if (selectedRegion) {
          const filteredData = await fetchCinemasByRegionFromFirebase(selectedRegion);
          filteredCinemasWithShowtimes = cinemas.filter((cinema) =>
            filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
          );

          if (userLocation) {
            filteredCinemasWithShowtimes.sort((a, b) => {
              const distanceA = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                a.latitude,
                a.longitude
              );
              const distanceB = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                b.latitude,
                b.longitude
              );
              return distanceA - distanceB;
            });
          }
        } else {
          filteredCinemasWithShowtimes = [...cinemas];
        }

        setFilteredCinemas(filteredCinemasWithShowtimes);
        if (filteredCinemasWithShowtimes.length > 0) {
          setSelectedCinema(filteredCinemasWithShowtimes[0].id);
        }
      } catch (error) {
        console.error("Error filtering cinemas:", error);
      }
    };
    loadFilteredCinemas();
  }, [selectedRegion, cinemas, userLocation, isSortedByLocation]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    loadMovies();
  }, []);

  useEffect(() => {
    if (selectedCinema) {
      const loadShowtimes = async () => {
        try {
          const showtimeData = await fetchShowtimes(selectedCinema);
          setShowtimes(showtimeData);
        } catch (error) {
          console.error("Error fetching showtimes:", error);
        }
      };
      loadShowtimes();
    }
  }, [selectedCinema]);

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setIsSortedByLocation(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc chọn khu vực thủ công."
          );
          setIsSortedByLocation(false);
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng chọn khu vực thủ công.");
      setIsSortedByLocation(false);
      setIsLoadingLocation(false);
    }
  };

  const handleDisableNearYou = () => {
    setIsSortedByLocation(false);
    setUserLocation(null);
    if (selectedRegion) {
      const loadFilteredCinemas = async () => {
        const filteredData = await fetchCinemasByRegionFromFirebase(selectedRegion);
        const filteredCinemasWithShowtimes = cinemas.filter((cinema) =>
          filteredData.some((filteredCinema) => filteredCinema.cinema_id === cinema.id)
        );
        setFilteredCinemas(filteredCinemasWithShowtimes);
        if (filteredCinemasWithShowtimes.length > 0) {
          setSelectedCinema(filteredCinemasWithShowtimes[0].id);
        }
      };
      loadFilteredCinemas();
    }
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setIsSortedByLocation(false);
  };

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinema(cinemaId);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShowtimeClick = (showtime) => {
    const cinema = filteredCinemas.find((c) => c.id === selectedCinema);
    const time = new Date(showtime.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!showtime.movie_id) {
      console.error("Movie ID is undefined for this showtime:", showtime);
      return;
    }
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    navigate(`/booking_seat/${showtime.movie_id}`, {
      state: {
        cinema: cinema.name,
        cinema_id: selectedCinema,
        date: selectedDate.toISOString().split("T")[0],
        time: time,
        movie_id: showtime.movie_id,
        showtime_id: `showtime_${selectedDate
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "")}_${time.replace(":", "")}_${selectedCinema}_movie${showtime.movie_id}`,
      },
    });
  };

  const groupedShowtimes = Object.values(showtimes).reduce((acc, showtime) => {
    const showtimeDate = new Date(showtime.start_time);
    if (
      showtime.cinema_id === selectedCinema &&
      showtimeDate.getDate() === selectedDate.getDate() &&
      showtimeDate.getMonth() === selectedDate.getMonth() &&
      showtimeDate.getFullYear() === selectedDate.getFullYear()
    ) {
      const movieId = showtime.movie_id;
      if (!acc[movieId]) {
        acc[movieId] = [];
      }
      acc[movieId].push(showtime);
    }
    return acc;
  }, {});

  Object.keys(groupedShowtimes).forEach((movieId) => {
    groupedShowtimes[movieId].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  const getMovieById = (movieId) => {
    return movies.find((movie) => movie.movie_id === movieId) || {};
  };

  const formatDateLabel = (date) => {
    const today = new Date("2025-03-23");
    if (date.getDate() === today.getDate()) return "Hôm nay";
    if (date.getDate() === today.getDate() + 1) return "Ngày mai";
    return `Thứ ${date.getDay() + 1}`;
  };

  // Lấy thông tin rạp được chọn
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
                  <img src={selectedCinemaData.logo} alt="Logo" />
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
          {/* Tên rạp và địa chỉ */}
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
                <p>Úi, Suất chiếu không tìm thấy.</p>
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
