import { MarketplaceProduct } from '@/types/IMarketplace';
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
  getPosts: async () => {
    const response = await API.get(adminRoutes.getPosts, { withCredentials: true });
    return response.data;
  },
  blockPost: async (postId: string) => {
    const response = await API.post(`${adminRoutes.blockPost}/${postId}`, {}, { withCredentials: true });
    return response.data;
  },

  unblockPost: async (postId: string) => {
    const response = await API.post(`${adminRoutes.unblockPost}/${postId}`, {}, { withCredentials: true });
    return response.data;
  },
  getAllReports: async (filter: string = 'all') => {
    const response = await API.get(`${adminRoutes.reports}?filter=${filter}`, {
      withCredentials: true
    });
    return response.data;
  },

  updateReportStatus: async (reportId: string, status: string) => {
    const response = await API.put(`${adminRoutes.updateReportStatus}/${reportId}`, 
      { status },
      { withCredentials: true }
    );
    return response.data;
  },

  getProducts: async (): Promise<MarketplaceProduct[]> => {
    const response = await API.get(adminRoutes.getProducts, { withCredentials: true });
    return response.data;
  },

  approveProduct: async (productId: string): Promise<MarketplaceProduct> => {
    const response = await API.patch(
      `${adminRoutes.approveProduct}/${productId}`,
      { isApproved: true },
      { withCredentials: true }
    );
    return response.data;
  },
  updateProductStatus: async (productId: string, status: 'block' | 'unblock'): Promise<MarketplaceProduct> => {
    const response = await API.patch(
      `${adminRoutes.updateProductStatus}/${productId}`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  },


};