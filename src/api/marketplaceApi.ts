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

  // Get all marketplace products with filters
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    location?: string;
    sortBy?: 'price' | 'date';
    order?: 'asc' | 'desc';
  }) => {
    const response = await API.get(marketplaceRoutes.getAllProducts, {
      params,
      withCredentials: true
    });
    return response.data;
  },

  // Get products for specific user
  getUserProducts: async () => {
    const response = await API.get(marketplaceRoutes.getUserProducts, {
      withCredentials: true
    });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (productId: string) => {
    const response = await API.get(`${marketplaceRoutes.getProductById}/${productId}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Update product
  updateProduct: async (productId: string, formData: FormData) => {
    const response = await API.put(
      `${marketplaceRoutes.updateProduct}/${productId}`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const response = await API.delete(
      `${marketplaceRoutes.deleteProduct}/${productId}`,
      { withCredentials: true }
    );
    return response.data;
  },

  // Search products
  searchProducts: async (query: string) => {
    const response = await API.get(marketplaceRoutes.searchProducts, {
      params: { q: query },
      withCredentials: true
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string) => {
    const response = await API.get(
      `${marketplaceRoutes.getCategoriesProducts}/${category}`,
      { withCredentials: true }
    );
    return response.data;
  },
};