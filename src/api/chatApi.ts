import API from '../services/axios';
import { IChat, IMessage } from '@/types/IChat';

export const ChatAPI = {
  getUserChats: async (): Promise<IChat[]> => {
    const response = await API.get('/chat/chats', { withCredentials: true });
    return response.data.data;
  },

  getChatMessages: async (chatId: string, page: number = 1, limit: number = 50): Promise<{
    messages: IMessage[];
    pagination: {
      totalMessages: number;
      totalPages: number;
      currentPage: number;
    }
  }> => {
    const response = await API.get(`/chat/messages/${chatId}?page=${page}&limit=${limit}`, { 
      withCredentials: true 
    });
    return response.data.data;
  },

  sendMessage: async (
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'video' = 'text'
  ): Promise<IMessage> => {
    const response = await API.post('/chat/send-message', { 
      receiverId, 
      content, 
      messageType 
    }, { withCredentials: true });
    return response.data.data;
  },

  // Add file upload method
  uploadChatFile: async (file: File, messageType: 'image' | 'video'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageType', messageType);

    const response = await API.post('/chat/upload-file', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.fileUrl;
  }
};