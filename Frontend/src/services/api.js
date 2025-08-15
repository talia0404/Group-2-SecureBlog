import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If backend says 401, clear token and bounce to login
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      // Avoid circular imports; just hard-redirect
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default API;
