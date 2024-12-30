const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

import {
  fetchRegionsOfCinemasFromFirebase,
  fetchCinemasFromFirebase,
  fetchCinemasByRegionFromFirebase,
  sendContactInfoToFirebase,
  addCinemaToFirebase,
} from "../firebase/firebaseCinemas.js";
import {
  fetchRegionsOfCinemasFromSQL,
  fetchCinemasFromSQL,
  sendContactInfoToSQL,
  fetchCinemasByRegionFromSQL,
  addCinemaToSQL,
} from "../sql/sqlCinemas.js";

// API THANH TOÁN
export const fetchCinemas = async () => {
  return useFirebase
    ? await fetchCinemasFromFirebase()
    : await fetchCinemasFromSQL();
};
