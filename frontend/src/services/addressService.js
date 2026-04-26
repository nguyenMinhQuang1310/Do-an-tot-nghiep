import api from './api';

export const addressService = {
  getAddresses: () => api.get('/addresses'),
  createAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.patch(`/addresses/${id}/set-default`),
};
