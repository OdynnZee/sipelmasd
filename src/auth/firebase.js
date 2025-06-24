// src/auth/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0g5S0GvmAcE1JiGfVrFunR9PXeAajOuU",
  authDomain: "sipelmasd-7cd44.firebaseapp.com",
  projectId: "sipelmasd-7cd44",
  storageBucket: "sipelmasd-7cd44.appspot.com", // ✅ sudah diperbaiki
  messagingSenderId: "796813014272",
  appId: "1:796813014272:web:8763470c1f21b39ba46fe5"
};

// ✅ Inisialisasi Firebase App & Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
