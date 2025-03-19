import axios from 'axios';

// Determine the base URL based on environment
const API_URL = import.meta.env.PROD 
  ? '' // In production, use relative URLs (empty string) for API endpoints
  : 'http://localhost:5000'; // In development, use local server

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;