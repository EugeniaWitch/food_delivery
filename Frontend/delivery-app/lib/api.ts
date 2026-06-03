import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Автоматически добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email: string, password: string) =>
  api.post('/auth/register', { email, password });

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// Restaurants
export const getRestaurants = (params?: {
  cuisine?: string;
  category?: string;
  hasPromo?: boolean;
  highRating?: boolean;
  search?: string;
}) => api.get('/restaurants', { params });

export const getRestaurant = (id: number) =>
  api.get(`/restaurants/${id}`);

// User
export const getProfile = () =>
  api.get('/user/profile');

export const updateAddress = (address: string) =>
  api.put('/user/address', { address });

export const getFavorites = () =>
  api.get('/user/favorites');

export const addFavorite = (menuItemId: number) =>
  api.post(`/user/favorites/${menuItemId}`);

export const removeFavorite = (menuItemId: number) =>
  api.delete(`/user/favorites/${menuItemId}`);

// Orders
export const createOrder = (data: {
  restaurantId: number;
  deliveryAddress: string;
  promoCode?: string;
  items: { menuItemId: number; quantity: number; price: number }[];
}) => api.post('/orders', data);

export const getMyOrders = () =>
  api.get('/orders/my');

export default api;

// Промокоды
export const applyPromo = (code: string, orderTotal: number) =>
  api.post('/promo/apply', { code, orderTotal });

export const getRestaurantPromos = (restaurantId: number) =>
  api.get(`/promo/restaurant/${restaurantId}`);

// Admin
export const adminGetStats = () =>
  api.get('/admin/stats');

export const adminGetRestaurants = () =>
  api.get('/admin/restaurants');

export const adminCreateRestaurant = (data: any) =>
  api.post('/admin/restaurants', data);

export const adminUpdateRestaurant = (id: number, data: any) =>
  api.put(`/admin/restaurants/${id}`, data);

export const adminDeleteRestaurant = (id: number) =>
  api.delete(`/admin/restaurants/${id}`);

export const adminGetMenu = (restaurantId: number) =>
  api.get(`/admin/restaurants/${restaurantId}/menu`);

export const adminCreateMenuItem = (restaurantId: number, data: any) =>
  api.post(`/admin/restaurants/${restaurantId}/menu`, data);

export const adminUpdateMenuItem = (id: number, data: any) =>
  api.put(`/admin/menu/${id}`, data);

export const adminDeleteMenuItem = (id: number) =>
  api.delete(`/admin/menu/${id}`);

export const adminGetPromos = () =>
  api.get('/admin/promos');

export const adminCreatePromo = (data: any) =>
  api.post('/admin/promos', data);

export const adminTogglePromo = (id: number) =>
  api.put(`/admin/promos/${id}/toggle`);

export const adminDeletePromo = (id: number) =>
  api.delete(`/admin/promos/${id}`);

export const adminGetRestaurantPromos = () =>
  api.get('/admin/restaurant-promos');

export const adminToggleRestaurantPromo = (id: number) =>
  api.put(`/admin/restaurant-promos/${id}/toggle`);

export const adminCreateRestaurantPromo = (data: any) =>
  api.post('/admin/restaurant-promos', data);

export const getMenuItemsByRestaurant = (restaurantId: number) =>
  api.get(`/admin/restaurants/${restaurantId}/menu`);

export const adminUpdateRestaurantPromo = (id: number, data: any) =>
  api.put(`/admin/restaurant-promos/${id}`, data);

export const adminDeleteRestaurantPromo = (id: number) =>
  api.delete(`/admin/restaurant-promos/${id}`);