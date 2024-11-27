import API from '../services/axios';
import  ILiveStream  from '@/types/ILiveStream';

export const liveStreamApi = {
  createLiveStream: async (userId: string, roomId: string) => {
    const response = await API.post('/livestream/create', { userId, roomId }, {
      withCredentials: true
    });
    return response.data as ILiveStream;
  },

  getLiveStreams: async () => {
    const response = await API.get('/livestream', {
      withCredentials: true
    });
    return response.data.data as ILiveStream[];
  },

  joinLiveStream: async (liveStreamId: string) => {
    const response = await API.post(`/livestream/${liveStreamId}/join`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  leaveLiveStream: async (liveStreamId: string) => {
    const response = await API.post(`/livestream/${liveStreamId}/leave`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};