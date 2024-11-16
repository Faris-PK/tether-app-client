import { CreateProductDTO, MarketplaceProduct } from '@/types/IMarketplace';
import API from '../services/axios';
import { marketplaceRoutes } from '../services/endpoints/userEndpoints';

export const MarketplaceApi = {
  // Create a new product listing
  createProduct: async (formData: FormData) => {
    const response = await API.post(marketplaceRoutes.createProduct, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAllProducts: async () => {
    const response = await API.get(marketplaceRoutes.getAllProducts, {
     
      withCredentials: true
    });
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
  }



  
};