import axios from 'axios';

const api = axios.create({
  // In production (Vercel), VITE_API_URL = https://your-render-app.onrender.com/api
  // In development, Vite proxy forwards /api → localhost:5000 automatically
  baseURL: (import.meta as any).env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;