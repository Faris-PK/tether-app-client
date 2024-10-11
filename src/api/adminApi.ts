import API from '../services/axios';
import { adminRoutes } from '../services/endpoints/adminEndpoints';
import { UserData } from '../types/user';

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await API.post(adminRoutes.login, { email, password }, { withCredentials: true });
    return response.data;
  },

  logout: async () => {
    const response = await API.post(adminRoutes.logout, {}, { withCredentials: true });
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await API.post(`${adminRoutes.blockUser}/${userId}`, {}, { withCredentials: true });
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await API.post(`${adminRoutes.unblockUser}/${userId}`, {}, { withCredentials: true });
    return response.data;
  },

  getUsers: async (): Promise<UserData[]> => {
    const response = await API.get(adminRoutes.getUsers, { withCredentials: true });
    return response.data;
  },
};