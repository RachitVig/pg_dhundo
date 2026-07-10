import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";
const WS_BASE = "ws://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pgService = {
  getAll: (params) => apiClient.get('/pgs', { params }),
  create: (data) => apiClient.post('/pgs/', data),
  getAll_admin: () => apiClient.get('/pgs/all'),
  getOwnerPgs: (ownerId) => apiClient.get(`/pgs/owner/${ownerId}`),
  updateStatus: (pgId, status) => apiClient.put(`/pgs/${pgId}/status?status=${status}`),
  getHistory: (pgId, clientId) => apiClient.get(`/chat/history/${pgId}/${clientId}`),
  seed: () => apiClient.get('/seed'),
};

export const authService = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
};

export const adminService = {
  getDashboardStats: () => apiClient.get('/admin/dashboard'),
  getAllUsers: () => apiClient.get('/admin/users'),
};

export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings/', data),
  getOwnerBookings: (ownerId) => apiClient.get(`/bookings/owner/${ownerId}`),
  verifyBooking: (bookingId, data) => apiClient.put(`/bookings/${bookingId}/verify`, data),
};

export const getWsUrl = (pgId, clientId) => `${WS_BASE}/ws/chat/${pgId}/${clientId}`;
export { API_BASE, WS_BASE };
