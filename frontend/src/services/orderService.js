import api from './api';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/orders${query ? '?' + query : ''}`);
  },
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};
