import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

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

// Hàm đăng nhập bằng email và mật khẩu
export const loginWithEmailAndPassword = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
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
