import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const carsAPI = {
  getAll: (params?: any) => api.get('/cars', { params }),
  getAdminAll: (params?: any) => api.get('/cars/admin/all', { params }),
  getById: (id: string) => api.get(`/cars/${id}`),
  search: (params: any) => api.get('/cars/search', { params }),
  getFeatured: () => api.get('/cars/featured'),
  create: (data: any) => api.post('/cars', data),
  update: (id: string, data: any) => api.put(`/cars/${id}`, data),
  delete: (id: string) => api.delete(`/cars/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/cars/${id}/status`, data),
};

export const brandsAPI = {
  getAll: (params?: any) => api.get('/brands', { params }),
  getAdminAll: (params?: any) => api.get('/brands/admin/all', { params }),
  getById: (id: string) => api.get(`/brands/${id}`),
  create: (data: any) => api.post('/brands', data),
  update: (id: string, data: any) => api.put(`/brands/${id}`, data),
  delete: (id: string) => api.delete(`/brands/${id}`),
};

export const partsAPI = {
  getAll: (params?: any) => api.get('/parts', { params }),
  getById: (id: string) => api.get(`/parts/${id}`),
  search: (params: any) => api.get('/parts/search', { params }),
};

export const dealersAPI = {
  getAll: (params?: any) => api.get('/dealers', { params }),
  getById: (id: string) => api.get(`/dealers/${id}`),
  verify: (id: string) => api.patch(`/dealers/${id}/verify`),
};

export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: (params?: any) => api.get('/orders', { params }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
};

export const paymentsAPI = {
  createRazorpayOrder: (data: any) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpayPayment: (data: any) => api.post('/payments/razorpay/verify', data),
};

export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  getReviews: (params: any) => api.get('/reviews', { params }),
};

export const testDriveAPI = {
  book: (data: any) => api.post('/test-drives', data),
  getMyBookings: () => api.get('/test-drives'),
  getById: (id: string) => api.get(`/test-drives/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/test-drives/${id}/status`, data),
  cancel: (id: string, reason: string) => api.patch(`/test-drives/${id}/cancel`, { reason }),
  addFeedback: (id: string, data: any) => api.put(`/test-drives/${id}/feedback`, data),
};

export const uploadAPI = {
  uploadImages: (files: FormData) => {
    return api.post('/upload/images', files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId: string) => {
    return api.delete(`/upload/image/${encodeURIComponent(publicId)}`);
  },
  deleteMultipleImages: (publicIds: string[]) => {
    return api.post('/upload/images/delete', { publicIds });
  },
};

export const bookingAPI = {
  createOrder: (data: any) => api.post('/bookings/create-order', data),
  verifyPayment: (data: any) => api.post('/bookings/verify-payment', data),
  getUserBookings: () => api.get('/bookings/user'),
  getSellerBookings: () => api.get('/bookings/seller'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateOfflinePayment: (id: string, data: any) => api.put(`/bookings/${id}/offline-payment`, data),
  cancelBooking: (id: string, reason: string) => api.put(`/bookings/${id}/cancel`, { reason }),
};

export const adminAPI = {
  getStats: () => api.get('/users/admin/stats'),
  getUsers: (params?: any) => api.get('/users', { params }),
  updateUserRole: (id: string, data: any) => api.patch(`/users/${id}/role`, data),
  updateUserStatus: (id: string, data: any) => api.patch(`/users/${id}/status`, data),
};
