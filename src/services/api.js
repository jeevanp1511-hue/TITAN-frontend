import axios from 'axios';

const api = axios.create({
  baseURL: 'https://titan-backend-4.onrender.com/api',
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('titan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(
    new Error(
      error.response?.data?.message ||
      `Request failed: ${error.response?.status || 'network error'}`
    )
  )
);

export default api;
