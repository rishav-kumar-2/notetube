import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// Base axios instance — no auth header set here
const api = axios.create({ baseURL: API_URL });

// Request interceptor — reads token fresh from localStorage on EVERY request
// This fixes the stale token bug where token was null on first render
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export function useApi() {
  // Auth
  const register = (data) => api.post("/users/register", data);
  const login    = (data) => api.post("/users/login", data);

  // Videos
  const summarizeVideo = (url) => api.post("/videos/summarize", { url });
  const getUserVideos  = ()    => api.get("/videos");
  const getVideoById   = (id)  => api.get(`/videos/${id}`);
  const updateNotes    = (id, notes) => api.patch(`/videos/${id}/notes`, { notes });
  const deleteVideo    = (id)  => api.delete(`/videos/${id}`);

  return { register, login, summarizeVideo, getUserVideos, getVideoById, updateNotes, deleteVideo };
}

export { api }; // exported so AuthContext can attach the 401 interceptor