import api from './api';

export const adminService = {
  // Stats
  getOverview: () => api.get('/admin/stats/overview'),
  getRevenue: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/stats/revenue${query ? '?' + query : ''}`);
  },
  getBestSelling: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/stats/best-selling${query ? '?' + query : ''}`);
  },

  // Orders
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/orders${query ? '?' + query : ''}`);
  },
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, orderStatus) => api.patch(`/admin/orders/${id}/status`, { orderStatus }),
  updatePaymentStatus: (id) => api.patch(`/admin/orders/${id}/payment-status`),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users${query ? '?' + query : ''}`);
  },
  toggleUserActive: (id) => api.patch(`/users/${id}/toggle-active`),

  // Products
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Variants
  createVariant: (productId, data) => api.post(`/products/${productId}/variants`, data),
  updateVariant: (id, data) => api.put(`/variants/${id}`, data),
  updateStock: (id, data) => api.patch(`/variants/${id}/stock`, data),
  deleteVariant: (id) => api.delete(`/variants/${id}`),

  // Categories
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  toggleCategoryActive: (id) => api.patch(`/categories/${id}/toggle-active`),
};
