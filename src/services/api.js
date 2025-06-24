// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Ganti jika backend pindah server
  withCredentials: true, // Untuk mendukung pengiriman cookie jika dibutuhkan
});

// ✅ Interceptor untuk menyisipkan Authorization Bearer Token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Tambahkan token ke header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
