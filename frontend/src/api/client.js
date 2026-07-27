import axios from 'axios';
import { clearAuthSession, readAuthSession } from '../services/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const session = readAuthSession();
  const token = session?.accessToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      clearAuthSession();
      window.dispatchEvent(new Event('auth:logout'));

      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export function extractApiError(error) {
  if (error?.response?.data?.detail) {
    return Array.isArray(error.response.data.detail)
      ? error.response.data.detail.map((item) => item?.msg || item).join(', ')
      : error.response.data.detail;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong.';
}