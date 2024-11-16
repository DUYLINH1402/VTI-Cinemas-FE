import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import bcrypt from "bcryptjs";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { getAccountByEmailFromFirebase } from "./firebaseService";
const auth = getAuth();

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

// Hàm lấy mật khẩu mã hoá từ Account trong Data
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
    // Lấy thông tin tài khoản từ Firebase
    const userData = await getAccountByEmailFromFirebase(email);

    // Lấy mật khẩu mã hóa từ Firebase
    const hashedPasswordFromDB = userData.password;

    // Kiểm tra mật khẩu
    const isPasswordValid = bcrypt.compareSync(password, hashedPasswordFromDB);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác");
    }

    // Trả về thông tin người dùng (nếu cần)
    return userData;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { error: error.message }; // Trả lỗi để Redux xử lý
  }
};

// Hàm đăng ký tài khoản
export const registerWithEmailAndPassword = async (email, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10); // Mã hóa mật khẩu
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    hashedPassword
  );
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
