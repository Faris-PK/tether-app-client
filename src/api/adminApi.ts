import { MarketplaceProduct } from '@/types/IMarketplace';
import API from '../services/axios';
import { adminRoutes } from '../services/endpoints/adminEndpoints';
import { UserData } from '../types/user';
import PostData from '@/types/IPost';

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}


export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await API.post(adminRoutes.login, { email, password }, { withCredentials: true });
    return response.data;
  },

  logout: async () => {
    const response = await API.post(adminRoutes.logout, {}, { withCredentials: true });
    return response.data;
  },
  toggleUserBlock: async (userId: string, block: boolean) => {
    const response = await API.put(`${adminRoutes.toggleUserBlock}/${userId}`, 
      { block }, 
      { withCredentials: true }
    );
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: UserData[];
    totalUsers: number;
    totalPages: number;
  }> => {
    const response = await API.get(adminRoutes.getUsers, { 
      params, 
      withCredentials: true 
    });
    return response.data;
  },
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    posts: PostData[];
    totalPosts: number;
    totalPages: number;
  }> => {
    const response = await API.get(adminRoutes.getPosts, {
      params,
      withCredentials: true
    });
    return response.data;
  },
  togglePostBlock: async (postId: string, block: boolean) => {
    const response = await API.put(`${adminRoutes.togglePostBlock}/${postId}`, 
      { block }, 
      { withCredentials: true }
    );
    return response.data;
  },
  getAllReports: async (params: {
    page?: number;
    limit?: number;
    filter?: 'all' | 'pending' | 'reviewed' | 'resolved';
    search?: string;
  } = {}) => {
    const {
      page = 1, 
      limit = 10, 
      filter = 'all', 
      search = ''
    } = params;

    const response = await API.get(`${adminRoutes.reports}`, {
      params: {
        page,
        limit,
        filter,
        search
      },
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

  getProducts: async (params: ProductFilterParams = {}): Promise<{
    products: MarketplaceProduct[];
    totalPages: number;
    totalProducts: number;
  }> => {
    const queryParams = new URLSearchParams();
    
    // Add optional parameters to the query
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const response = await API.get(`${adminRoutes.getProducts}?${queryParams}`, { withCredentials: true });
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