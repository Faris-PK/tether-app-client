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

  deletePost: async (postId: string) => {
    const response = await API.delete(`${postRoutes.deletePost}/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};