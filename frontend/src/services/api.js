import axios from 'axios';

// ── Base URLs ─────────────────────────────────────────────────────────────────
// In production, set VITE_API_URL in Vercel environment variables
// pointing to your Railway/Render backend URL.
// In development, falls back to localhost.
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const WS_BASE  = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000')
  .replace(/^http/, 'ws'); // http → ws, https → wss

// ── Axios client ──────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 s timeout
});

// Attach JWT token from localStorage to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pg_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Service modules ───────────────────────────────────────────────────────────
export const pgService = {
  getAll:      (params) => apiClient.get('/pgs/',         { params }),
  getOne:      (id)     => apiClient.get(`/pgs/${id}`),
  create:      (data)   => apiClient.post('/pgs/',        data),
  book:        (pgId, data) => apiClient.post(`/pgs/${pgId}/book`, data),
  getHistory:  (pgId, clientId) => apiClient.get(`/chat/history/${pgId}/${clientId}`),
  seed:        ()       => apiClient.get('/seed'),
};

export const authService = {
  login:    (data) => apiClient.post('/auth/login',    data),
  register: (data) => apiClient.post('/auth/register', data),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
};

export const adminService = {
  getDashboardStats: () => apiClient.get('/admin/dashboard'),
};

// ── WebSocket URL builder ─────────────────────────────────────────────────────
export const getWsUrl = (pgId, clientId) => `${WS_BASE}/ws/chat/${pgId}/${clientId}`;

export { API_BASE, WS_BASE };
