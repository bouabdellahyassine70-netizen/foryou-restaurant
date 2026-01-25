import axios from 'axios';

// Get API URL and clean it (remove spaces, handle placeholder)
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Clean the URL: remove spaces, handle placeholder
API_URL = API_URL.trim().replace(/\s+/g, '');

// If it's still a placeholder, show error in console
if (API_URL.includes('placeholder') || API_URL.includes('YOUR-RAILWAY')) {
  console.error('❌ ERROR: NEXT_PUBLIC_API_URL is not set correctly!');
  console.error('Current value:', API_URL);
  console.error('Please set NEXT_PUBLIC_API_URL in Vercel to your Railway backend URL');
  console.error('Example: https://your-app.up.railway.app/api');
}

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

