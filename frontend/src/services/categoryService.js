import api from './api';

export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
};
