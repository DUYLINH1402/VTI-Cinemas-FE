// services/authService.js
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth();

// Hàm đăng nhập bằng Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Hàm đăng nhập bằng Facebook
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

// Hàm đăng nhập bằng email và mật khẩu
export const loginWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
