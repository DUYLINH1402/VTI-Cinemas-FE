import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { loginWithEmailAndPasswordFromFirebase } from "./firebaseService";
import { loginWithEmailAndPasswordFromSQL } from "./sql/sqlService";
const auth = getAuth();
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG!

// Hàm đăng nhập bằng Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const accessToken = await user.getIdToken(); // Lấy accessToken

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    accessToken,
  };
};

// Hàm đăng nhập bằng Facebook
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const accessToken = await user.getIdToken(); // Lấy accessToken

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    accessToken,
  };
};

// Hàm kiểm tra Email có tồn tại không
export const getUserByEmail = async (email) => {
  const db = getDatabase();
  const userRef = ref(db, "users");
  const userQuery = query(userRef, orderByChild("email"), equalTo(email));

  const snapshot = await get(userQuery);
  if (!snapshot.exists()) {
    throw new Error("Người dùng không tồn tại!");
  }

  const userData = snapshot.val();
  // Nếu có nhiều kết quả, chọn kết quả đầu tiên
  const userValues = Object.values(userData);
  if (!userValues.length) {
    throw new Error("Dữ liệu không hợp lệ");
  }

  return userValues[0]; // Trả về người dùng đầu tiên
};
// Hàm đăng nhập bằng email và mật khẩu
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    if (useFirebase) {
      return await loginWithEmailAndPasswordFromFirebase(email, password);
    } else {
      return await loginWithEmailAndPasswordFromSQL(email, password);
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.response || error.message);
    return { error: error.message }; // Trả lỗi để Redux xử lý
  }
};

// Hàm đăng ký tài khoản
export const registerWithEmailAndPassword = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  const accessToken = await user.getIdToken(); // Lấy accessToken

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    accessToken,
  };
};

// Hàm lắng nghe trạng thái đăng nhập
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
