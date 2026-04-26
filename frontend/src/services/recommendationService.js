import api from './api';

export const recommendationService = {
  getForYou: (limit = 8) => api.get(`/recommendations/for-you?limit=${limit}`),
  getSimilar: (productId, limit = 6) => api.get(`/recommendations/similar/${productId}?limit=${limit}`),
  logEvent: (data) => api.post('/recommendations/log', data),
};
