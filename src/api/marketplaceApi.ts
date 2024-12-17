import API from '../services/axios';
import { marketplaceRoutes } from '../services/endpoints/userEndpoints';

export const MarketplaceApi = {
  createProduct: async (formData: FormData) => {
    const response = await API.post(marketplaceRoutes.createProduct, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAllProducts: async (
    page: number = 1, 
    limit: number = 8, 
    filters: {
      searchQuery?: string;
      minPrice?: number;
      maxPrice?: number;
      category?: string;
      dateSort?: string;
      locationFilter?: {
        latitude: number;
        longitude: number;
        radius: number; 
      }
    } = {}
  ) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Add filters to query params
    if (filters.searchQuery) {
      queryParams.append('search', filters.searchQuery);
    }
    if (filters.minPrice !== undefined) {
      queryParams.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      queryParams.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    if (filters.dateSort) {
      queryParams.append('dateSort', filters.dateSort);
    }

    if (filters.locationFilter) {
      queryParams.append('latitude', filters.locationFilter.latitude.toString());
      queryParams.append('longitude', filters.locationFilter.longitude.toString());
      queryParams.append('radius', filters.locationFilter.radius.toString());
    }

    const response = await API.get(
      `${marketplaceRoutes.getAllProducts}?${queryParams.toString()}`,
      { withCredentials: true }
    );
    return response.data;
  },
  // Get products for specific user
  getUserProducts: async (userId: string) => {
    const response = await API.get(`${marketplaceRoutes.getUserProducts}/${userId}`, {
      withCredentials: true
    });
    return response.data;
  },
  promoteProduct: async (productId: string): Promise<{ sessionUrl: string }> => {
    const response = await API.post(`/market/promote/${productId}`);
    return response.data;
  },

  checkPromotionStatus: async (sessionId: string) => {
    
    const response = await API.get(`/market/promote/success?session_id=${sessionId}`);
    return response.data;
  },

  updateProduct: async (productId: string, formData: FormData) => {
    const response = await API.put(`${marketplaceRoutes.updateProduct}/${productId}`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await API.delete(`${marketplaceRoutes.deleteProduct}/${productId}`, {
      withCredentials: true
    });
    return response.data;
  }



  
};