// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBflLdTkessKwOAOOsmoj6HyP6VSaLJseI",
  authDomain: "vticinema.firebaseapp.com",
  databaseURL: "https://vticinema-default-rtdb.firebaseio.com",
  projectId: "vticinema",
  storageBucket: "vticinema.firebasestorage.app",
  messagingSenderId: "770060105597",
  appId: "1:770060105597:web:48f335b17eec7a9d8d3e14",
  measurementId: "G-WVYBZBEH88",
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo đối tượng db cho Realtime Database
const db = getDatabase(app);

export default { db };
