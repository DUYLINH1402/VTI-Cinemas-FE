const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import {
  fetchRegionsOfCinemasFromFirebase,
  fetchCinemasFromFirebase,
  fetchCinemasByRegionFromFirebase,
  sendContactInfoToFirebase,
} from "../firebase/firebaseCinemas.js";
import {
  fetchRegionsOfCinemasFromSQL,
  fetchCinemasFromSQL,
  sendContactInfoToSQL,
  fetchCinemasByRegionFromSQL,
} from "../sql/sqlCinemas.js";

// API LẤY DANH SÁCH TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchCinemas = async () => {
  return useFirebase
    ? await fetchCinemasFromFirebase()
    : await fetchCinemasFromSQL();
};
// API LẤY DANH SÁCH KHU VỰC CỦA TẤT CẢ RẠP PHIM CÓ TRONG HỆ THỐNG
export const fetchRegionsOfCinemas = async () => {
  return useFirebase
    ? await fetchRegionsOfCinemasFromFirebase()
    : await fetchRegionsOfCinemasFromSQL();
};
// API LẤY DANH SÁCH RẠP PHIM THEO KHU VỰC
export const fetchCinemasByRegion = async (region) => {
  return useFirebase
    ? await fetchCinemasByRegionFromFirebase(region)
    : await fetchCinemasByRegionFromSQL(region);
};

// API GỬI THÔNG TIN LIÊN HỆ
export const saveContactInfoToData = async (formData) => {
  return useFirebase
    ? await sendContactInfoToFirebase(formData)
    : await sendContactInfoToSQL(formData);
};
