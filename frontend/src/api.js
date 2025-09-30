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

// Auth helpers are no-ops in guest mode
export async function login() { return null; }
export async function register() { return null; }
export async function getMe() { return null; }

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


