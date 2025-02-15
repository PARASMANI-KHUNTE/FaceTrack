import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL:     'https://facetrack-server.onrender.com/api'  , // "http://localhost:3000/api" ,       Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error(error.response.data.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;
