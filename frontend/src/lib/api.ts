import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect based on current path
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/staff')) {
        window.location.href = '/staff/login';
      } else if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        // Default to admin login for other protected routes
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

