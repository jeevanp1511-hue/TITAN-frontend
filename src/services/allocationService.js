import api from './api.js';

export const allocationService = {
  async triggerRecalculation(networkId, policy) {
    const res = await api.post(`/allocations/network/${networkId}/run`, { policy });
    return res.data;
  },

  async getLatestAllocation(networkId) {
    const res = await api.get(`/allocations/network/${networkId}/latest`);
    return res.data;
  },

  async getAllocationHistory(networkId) {
    const res = await api.get(`/allocations/network/${networkId}/history`);
    return res.data;
  },

  async comparePolicies(payload) {
    const res = await api.post('/allocations/compare', payload);
    return res.data;
  },

  async getAdminDashboard(networkId) {
    const url = networkId ? `/dashboard/admin?networkId=${networkId}` : '/dashboard/admin';
    const res = await api.get(url);
    return res.data;
  },

  async getUserDashboard() {
    const res = await api.get('/dashboard/user');
    return res.data;
  },
};
