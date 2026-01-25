import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://carsystem-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles token expiry and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";

      // If token expired, clear it and redirect to login
      if (
        message.includes("expired") ||
        message.includes("invalid") ||
        message.includes("No token")
      ) {
        localStorage.removeItem("token");

        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?session=expired";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
