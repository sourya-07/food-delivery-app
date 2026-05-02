import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveApiBaseUrl() {
  // Prefer host from Expo dev server to derive LAN IP for device testing
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri || Constants.manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:4000`;
  }
  // Android emulator special-case
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  // Fallback for iOS simulator / web
  return 'http://localhost:4000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function register(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function getRestaurants() {
  const res = await api.get('/restaurants');
  return res.data;
}

export async function getRestaurant(id) {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
}

export async function getMenu(id) {
  const res = await api.get(`/restaurants/${id}/menu`);
  return res.data;
}

export async function createOrder(restaurantId, items) {
  const res = await api.post('/orders', { restaurantId, items });
  return res.data;
}

export async function getMyOrders() {
  const res = await api.get('/orders');
  return res.data;
}

export async function getOrderStatus(orderId) {
  const res = await api.get(`/orders/${orderId}/status`);
  return res.data.status;
}

export async function logout() { await AsyncStorage.removeItem('token'); }

// ---------- Admin ----------
export async function getAdminStats() {
  const res = await api.get('/admin/stats');
  return res.data;
}

export async function getAdminOrders() {
  const res = await api.get('/admin/orders');
  return res.data;
}

export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return res.data;
}

export async function createRestaurant(payload) {
  const res = await api.post('/admin/restaurants', payload);
  return res.data;
}

export async function updateRestaurant(id, payload) {
  const res = await api.put(`/admin/restaurants/${id}`, payload);
  return res.data;
}

export async function deleteRestaurant(id) {
  const res = await api.delete(`/admin/restaurants/${id}`);
  return res.data;
}

export async function createMenuItem(payload) {
  const res = await api.post('/admin/menu-items', payload);
  return res.data;
}

export async function updateMenuItem(id, payload) {
  const res = await api.put(`/admin/menu-items/${id}`, payload);
  return res.data;
}

export async function deleteMenuItem(id) {
  const res = await api.delete(`/admin/menu-items/${id}`);
  return res.data;
}

export async function getAdminUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}

export async function updateUserRole(id, role) {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data;
}


