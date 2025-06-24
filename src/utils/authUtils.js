// src/utils/authUtils.js
import { jwtDecode } from "jwt-decode"; // ✅ Named import

export const saveJWT = (token) => {
  localStorage.setItem("jwtToken", token);
};

export const getJWTUser = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    return jwtDecode(token); // ✅ Dekode token
  } catch (err) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("firebaseToken");
};
