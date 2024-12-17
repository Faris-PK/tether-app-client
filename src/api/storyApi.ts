import API from '../services/axios';
import { storyRoutes } from '../services/endpoints/userEndpoints';
import { Story } from '@/types/IStory';

interface SearchTracksParams {
  query: string;
  type: string;
  limit: number;
}




export const storyApi = {
  searchTracks: async (params: SearchTracksParams) => {
    const response = await API.get(storyRoutes.search, {
      params,
      withCredentials: true,
    });
  //  console.log('response : ', response);
    
    return response.data.data;
  },
  createStory: async (formData: FormData) => {
    const response = await API.post(storyRoutes.createStory, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getStories: async () => {
    const response = await API.get(storyRoutes.getStories, {
      withCredentials: true
    });
    return response.data.data as Story[];
  },

  viewStory: async (storyId: string) => {
    const response = await API.post(`${storyRoutes.viewStory}/${storyId}`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  
  toggleLike: async (storyId: string) => {
    const response = await API.post(`${storyRoutes.toggleLike}/${storyId}`, {}, {
      withCredentials: true
    });
    return response.data;
  },
  deleteStory: async (storyId: string) => {
    const response = await API.delete(`${storyRoutes.deleteStory}/${storyId}`, {
      withCredentials: true
    });
    return response.data;
  },
  
}