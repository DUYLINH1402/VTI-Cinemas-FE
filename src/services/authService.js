import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
const useFirebase = import.meta.env.VITE_USE_FIREBASE === "true"; // QUAN TRỌNG!

// HÀM ĐĂNG NHẬP BẰNG GOOGLE
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

// HÀM ĐĂNG NHẬP BẰNG FACEBOOK
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

// HÀM KIỂM TRA EMAIL CÓ TỒN TẠI KHÔNG
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

// HÀM ĐĂNG NHẬP BẰNG EMAIL VÀ MẬT KHẨU
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const checkUser = await getAccountByEmailFromFirebase(email);
    if (!checkUser) {
      throw new Error("Người dùng không tồn tại!");
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (!user.emailVerified) {
      throw new Error(
        `Email của bạn chưa được xác nhận. Vui lòng kiểm tra email.`
      );
    }
    return user;
  } catch (error) {
    switch (error.code) {
      case `auth/invalid-credential`:
        error.message = "Mật khẩu không đúng.";
        break;
      case `auth/invalid-email`:
        error.message = "Tài khoản không tồn tại.";
        break;
      case `auth/user-not-found`:
        error.message = "Tài khoản không tồn tại.";
        break;
      case `auth/wrong-password`:
        error.message = "Mật khẩu không đúng.";
        break;
      case `auth/user-disabled`:
        error.message = "Tài khoản của bạn đã bị vô hiệu hóa.";
        break;
      case `auth/too-many-requests`:
        error.message = "Bạn đã nhập sai quá nhiều lần, vui lòng thử lại sau.";
        break;
    }
    console.error("Lỗi đăng nhập:", error.code || error.message);
    throw new Error(error.message || "Lỗi đăng nhập");
  }
};
// HÀM ĐĂNG KÝ TÀI KHOẢN
export const registerWithEmailAndPassword = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  // Gửi email xác nhận
  await sendEmailVerification(user);
  const accessToken = await user.getIdToken(); // Lấy accessToken sau khi gửi email xác nhận
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

// HÀM GỬI LẠI EMAIL XÁC NHẬN KHI NGƯỜI DÙNG ĐĂNG NHẬP VỚI EMAIL CHƯA XÁC NHẬN
export const resendVerificationEmail = async (email, password) => {
  const auth = getAuth();
  try {
    // Đăng nhập để lấy đối tượng user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user.emailVerified) {
      throw new Error("Email đã được xác nhận, không cần gửi lại.");
    }
    // Gửi lại email xác nhận
    await sendEmailVerification(userCredential.user);
    // Sau khi gửi, sign out để không cho đăng nhập trước khi xác nhận
    await signOut(auth);
    return "Email xác nhận đã được gửi lại. Vui lòng kiểm tra email của bạn.";
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error.message);
    throw error;
  }
};
