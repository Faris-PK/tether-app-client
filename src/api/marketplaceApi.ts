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

  // Search Products
  searchProducts: async (query: string) => {
    const response = await API.get(`${marketplaceRoutes.searchProducts}?q=${query}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get Products by Location and Radius
  getProductsByLocation: async (latitude: number, longitude: number, radius: number) => {
    const response = await API.get(
      `${marketplaceRoutes.getCategoriesProducts}?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  // Get Products by Price Range
  getProductsByPrice: async (minPrice: number, maxPrice: number) => {
    const response = await API.get(
      `${marketplaceRoutes.getProductsByPrice}?min=${minPrice}&max=${maxPrice}`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  // Get Products by Category
  getProductsByCategory: async (category: string) => {
    const response = await API.get(`${marketplaceRoutes.getCategoriesProducts}?category=${category}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get Products by Date (Newest or Oldest)
  getProductsByDate: async (sort: 'newest' | 'oldest') => {
    const response = await API.get(`${marketplaceRoutes.getProductsByDate}?sort=${sort}`, {
      withCredentials: true
    });
    return response.data;
  }

  
};