import PostData from '@/types/IPost';
import API from '../services/axios';
import { postRoutes } from '../services/endpoints/userEndpoints';
import { Comment, CommentResponse, CommentsResponse } from '@/types/IComment';


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
  getSinglePost: async (postId:string) => {
    const response = await API.get(`${postRoutes.getSinglePost}/${postId}`, { withCredentials: true });
    return response.data;
  },
  getProfilePosts: async (userId : string) => {
    const response = await API.get(`${postRoutes.getUserPots}/${userId}`, { withCredentials: true });
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
  reportPost: async (postId: string, reason: string) => {
    const response = await API.post(`${postRoutes.reportPost}/${postId}`, 
      { reason },
      { withCredentials: true }
    );
    return response.data;
  },
  getPostComments: async (postId: string): Promise<Comment[]> => {
    const response = await API.get(`${postRoutes.getComments}/${postId}`, {
      withCredentials: true
    });
    return response.data.data;
  },

  addComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await API.post(
      `${postRoutes.addComment}/${postId}`,
      { content },
      { withCredentials: true }
    );
    return response.data.data;
  },
  editComment: async (postId: string, commentId: string, content: string): Promise<Comment> => {
    const response = await API.put(
      `${postRoutes.editComment}/${postId}/${commentId}`,
      { content },
      { withCredentials: true }
    );
    return response.data.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<{ success: boolean }> => {
    const response = await API.delete(
      `${postRoutes.deleteComment}/${postId}/${commentId}`,
      { withCredentials: true }
    );
    return response.data;
  },
  addReplyToComment: async (
    postId: string, 
    commentId: string, 
    content: string
  ): Promise<Comment> => {
    const response = await API.post(
      `${postRoutes.addReplyToComment}/${postId}/${commentId}`, 
      { content }, 
      { withCredentials: true }
    );
    return response.data.data;
  },
};