import api from './api.js';

export const networkService = {
  async getNetworks() {
    const res = await api.get('/networks');
    return res.data;
  },

  async getNetworkById(id) {
    const res = await api.get(`/networks/${id}`);
    return res.data;
  },

  async createNetwork(data) {
    const res = await api.post('/networks', data);
    return res.data;
  },

  async updateNetwork(id, data) {
    const res = await api.patch(`/networks/${id}`, data);
    return res.data;
  },

  async joinNetwork(invitationCode) {
    const res = await api.post('/networks/join', { invitationCode });
    return res.data;
  },

  async getMembers(networkId) {
    const res = await api.get(`/members/${networkId}`);
    return res.data;
  },

  async updateMemberStatus(networkId, memberId, status) {
    const res = await api.patch(`/members/${networkId}/${memberId}`, { status });
    return res.data;
  },
};
