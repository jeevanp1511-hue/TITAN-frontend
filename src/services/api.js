
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://titan-backend-4.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('titan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response
      ? error.response.data?.message ||
        (Array.isArray(error.response.data?.errors)
          ? error.response.data.errors.map((e) => e.message).join(', ')
          : `Request failed (${error.response.status})`)
      : 'Cannot connect to TITAN server. Check backend URL and CORS.';

    return Promise.reject(new Error(message));
  }
);

export default api;
