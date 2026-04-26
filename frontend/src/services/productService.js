import api from './api';

export const productService = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? '?' + query : ''}`);
  },
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
};
