import API from '../services/axios';
import { storyRoutes } from '../services/endpoints/userEndpoints';

export interface Story {
  id: string;
  userId: string;
  username: string;
  profilePicture: string;
  media: string;
  text?: string;
  textStyle?: string;
  bgColor?: string;
  filter?: string;
  bgMusic?: string;
  createdAt: string;
  duration: number;
}

export const StoryApi = {
  createStory: async (formData: FormData) => {
    const response = await API.post(storyRoutes.createStory, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAllStories: async () => {
    const response = await API.get(storyRoutes.getAllStories, { withCredentials: true });
    return response.data;
  },

  getUserStories: async (userId: string) => {
    const response = await API.get(`${storyRoutes.getUserStories}/${userId}`, {
      withCredentials: true
    });
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    const response = await API.delete(`${storyRoutes.deleteStory}/${storyId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  viewStory: async (storyId: string) => {
    const response = await API.post(`${storyRoutes.viewStory}/${storyId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  }
};