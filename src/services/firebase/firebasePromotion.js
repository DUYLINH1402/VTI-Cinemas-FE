import axios from "axios";
import {
  getDatabase,
  ref,
  get,
  onValue,
  set,
  push,
  update,
  remove,
  runTransaction,
} from "firebase/database";
import { getAuth } from "firebase/auth";

const auth = getAuth();

// API LẤY DANH SÁCH KHUYẾN MÃI TỪ FIREBASE
export const fetchPromotionsFromFirebase = async () => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khuyến mãi từ Firebase:", error);
    return [];
  }
};

// API LẮNG NGHE KHI CÓ THAY ĐỔI TRONG DANH SÁCH KHUYẾN MÃI (REALTIME)
export const listenToPromotions = (callback) => {
  const db = getDatabase();
  const promotionsRef = ref(db, "Promotions");

  onValue(promotionsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const promoList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      callback(promoList);
    } else {
      callback([]);
    }
  });
};

// API LẤY CHI TIẾT SỰ KIỆN THEO SLUG
export const fetchPromotionBySlug = async (slug) => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const event = Object.values(data).find((item) => item.slug === slug);
      return event || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sự kiện:", error);
    return null;
  }
};
// API LẤY DANH SÁCH KHUYẾN MÃI LIÊN QUAN
export const fetchRelatedPromotionsFromFirebase = async (category, slug) => {
  try {
    const db = getDatabase();
    const promotionsRef = ref(db, "Promotions");
    const snapshot = await get(promotionsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((promo) => promo.category === category && promo.slug !== slug); // Loại bỏ bài viết hiện tại
      // .slice(0, 4); // Giới hạn hiển thị 4 bài viết liên quan
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khuyến mãi liên quan:", error);
    return [];
  }
};
