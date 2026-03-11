const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LOCAL_API_RETRY_COOLDOWN_MS = 30000;
let localApiUnavailableUntil = 0;

interface ApiRequestInit extends RequestInit {
  quietError?: boolean;
}

export const isApiOfflineError = (error: unknown) =>
  error instanceof Error &&
  (error.message === "Local API unavailable" || error.message === "Failed to fetch");

// API client with error handling
const apiClient = async (endpoint: string, options: ApiRequestInit = {}) => {
  const token = localStorage.getItem('token');
  const { quietError = false, ...requestOptions } = options;
  const now = Date.now();
  const isLocalApi = API_BASE_URL.includes('localhost:5000') || API_BASE_URL.includes('127.0.0.1:5000');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...requestOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (isLocalApi && localApiUnavailableUntil > now) {
    throw new Error('Local API unavailable');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    if (isLocalApi) {
      localApiUnavailableUntil = Date.now() + LOCAL_API_RETRY_COOLDOWN_MS;
    }
    if (!quietError) {
      console.error('API Error:', error);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    country: string;
    preferred_currency?: string;
  }) => apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiClient('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: () => apiClient('/products', { quietError: true }),
  getById: (id: string) => apiClient(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => apiClient('/cart'),
  add: (productId: string, quantity: number) =>
    apiClient('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),
  remove: (productId: string) =>
    apiClient(`/cart/remove/${productId}`, { method: 'DELETE' }),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) =>
    apiClient('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getAll: () => apiClient('/orders'),
  getById: (id: string) => apiClient(`/orders/${id}`),
};

// Payment Methods API
export const paymentAPI = {
  getByCountry: (country: string) => apiClient(`/payment-methods/${country}`, { quietError: true }),
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  payment: paymentAPI,
};
