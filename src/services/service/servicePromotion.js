import {
  fetchPromotionsFromFirebase,
  listenToPromotions,
  fetchRelatedPromotionsFromFirebase,
} from "../firebase/firebasePromotion";

const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

// API LẤY DANH SÁCH KHUYẾN MÃI
export const fetchPromotions = async () => {
  return useFirebase
    ? await fetchPromotionsFromFirebase()
    : await fetchPromotionsFromSQL();
};
// API LẮNG NGHE SỰ KIỆN KHUYẾN MÃI REALTIME
export const subscribeToPromotions = (callback) => {
  if (useFirebase) {
    listenToPromotions(callback);
  }
};
// API LẤY DANH SÁCH KHUYẾN MÃI LIÊN QUAN
export const fetchRelatedPromotions = async (category, slug) => {
  return useFirebase
    ? await fetchRelatedPromotionsFromFirebase(category, slug)
    : await fetchRelatedPromotionsFromSQL(category, slug);
};
