import axios from "axios";
import { getDatabase, ref, get } from "firebase/database";
import db from "../services/firebase/firebaseConfig";

// const db = getDatabase();
// Lấy thông tin Account
export const getAccountFromFirebase = async (account_id) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${account_id}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("User data not found");
  }
};
// Hàm lấy dữ liệu cho Movies
export const fetchMoviesFromFirebase = async () => {
  const response = await axios.get(
    "https://vticinema-default-rtdb.firebaseio.com/Movies.json"
  );
  return Object.values(response.data);
};

// Hàm lấy dữ liệu cho Carousel
export const fetchCarouselDataFromFirebase = async () => {
  try {
    const response = await axios.get(
      "https://vticinema-default-rtdb.firebaseio.com/Banners.json"
    );
    const data = response.data;
    const bannersArray = Object.keys(data).map((key) => ({
      ...data[key],
      id: key, // Lưu key Firebase làm ID
    }));
    return bannersArray;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
