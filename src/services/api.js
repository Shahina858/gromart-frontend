import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ REMOVE AUTO LOGOUT (CRITICAL FIX)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // Just return error, do NOT clear token
    return Promise.reject(error);
  }
);

export default API;
