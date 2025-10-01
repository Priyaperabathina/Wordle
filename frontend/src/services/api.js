import axios from "axios";

// Base API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:9090/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    console.log("API Request Interceptor:", {
      url: config.url,
      method: config.method,
      token: token ? "Present" : "Missing",
      tokenPreview: token ? token.substring(0, 20) + "..." : "None",
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Authorization header set:",
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.log("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("Network Error")
    ) {
      console.error(
        "Backend connection failed. Please ensure the backend server is running on",
        API_BASE_URL
      );
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Player API
export const playerAPI = {
  startGame: (userId) => api.post(`/player/game/start?userId=${userId}`),
  makeGuess: (gameId, guess) =>
    api.post(`/player/game/${gameId}/guess`, { guess }),
  getGameStatus: (gameId) => api.get(`/player/game/${gameId}/status`),
  getGamesPlayedToday: (userId) => api.get(`/player/${userId}/games/today`),
};

// Admin API
export const adminAPI = {
  // Word management
  getWords: () => api.get("/admin/words"),
  createWord: (wordData) => api.post("/admin/words", wordData),
  updateWord: (wordId, wordData) => api.put(`/admin/words/${wordId}`, wordData),
  deleteWord: (wordId) => api.delete(`/admin/words/${wordId}`),

  // Reports
  getDailyReport: (date) => api.get(`/admin/report/daily/${date}`),
  getPlayerReport: (userId) => api.get(`/admin/report/player/${userId}`),

  // Players
  getPlayers: () => {
    return api.get("/admin/players");
  },
};

export default api;
