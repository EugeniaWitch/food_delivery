export interface User {
  id: number;
  email: string;
  avatarUrl?: string;
  deliveryAddress?: string;
  createdAt: string;
  role: string;
}

export interface Restaurant {
  id: number;
  name: string;
  imageUrl: string;
  rating: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  cuisine: string;
  category: string;
  category2?: string;
  category3?: string;
  hasPromo: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  restaurantId: number;
}

export interface RestaurantWithMenu extends Restaurant {
  menuItems: MenuItem[];
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  restaurantId: number;
  restaurantName: string;
}

export interface Cart {
  restaurantId: number;
  restaurantName: string;
  items: CartItem[];
  totalPrice: number;
}

export interface Order {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  deliveryAddress: string;
  restaurantName: string;
  items: OrderItem[];
}

export interface OrderItem {
  menuItemName: string;
  quantity: number;
  price: number;
}

export interface FavoriteItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  imageUrl: string;
  restaurantName: string;
  restaurantId: number;
}