import PostData from '@/types/IPost';
import API from '../services/axios';
import { postRoutes } from '../services/endpoints/userEndpoints';

export const PostApi = {
  createPost: async (formData: FormData) => {
    const response = await API.post(postRoutes.createPost, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAllPosts: async () => {
    const response = await API.get(postRoutes.getAllPosts, { withCredentials: true });
    return response.data;
  },
  getProfilePosts: async () => {
    const response = await API.get(postRoutes.getUserPots, { withCredentials: true });
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await API.delete(`${postRoutes.deletePost}/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  },
  updatePost: async (postId: string, updateData: { caption?: string; location?: string }) => {
    const response = await API.put(`${postRoutes.updatePost}/${postId}`, updateData, {
      withCredentials: true,
    });
    return response.data;
  },
  likePost: async (postId: string) => {
    const response = await API.post(`${postRoutes.likePost}/${postId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  },
};