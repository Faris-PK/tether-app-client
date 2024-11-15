import API from '../services/axios';
import { networkRoutes } from '../services/endpoints/userEndpoints';

export const connectionApi = {
  getFollowRequests: async () => {
    const response = await API.get(networkRoutes.getFollowRequests, { withCredentials: true });
    return response.data;
  },

  getPeopleSuggestions: async () => {
    const response = await API.get(networkRoutes.getPeopleSuggestions, { withCredentials: true });
    return response.data;
  },

  followUser: async (userId: string) => {
    const response = await API.post(`${networkRoutes.followUser}/${userId}`, {}, { withCredentials: true });
    return response.data;
  },

  unfollowUser: async (userId: string) => {
    const response = await API.post(`${networkRoutes.unfollowUser}/${userId}`, {}, { withCredentials: true });
    return response.data;
  },

  removeFollowRequest: async (userId: string) => {
    const response = await API.delete(`${networkRoutes.removeFollowRequest}/${userId}`, { withCredentials: true });
    return response.data;
  },

  removeSuggestion: async (userId: string) => {
    const response = await API.delete(`${networkRoutes.removeSuggestion}/${userId}`, { withCredentials: true });
    return response.data;
  },
  
};