import api from './api.js';

export const requestService = {
  async getRequests(networkId) {
    const res = await api.get(`/requests/network/${networkId}`);
    return res.data;
  },

  async createRequest(data) {
    const res = await api.post('/requests', data);
    return res.data;
  },

  async cancelRequest(requestId) {
    const res = await api.patch(`/requests/${requestId}/cancel`);
    return res.data;
  },
};
