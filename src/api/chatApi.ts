import API from '../services/axios';
import { chatRoutes } from '../services/endpoints/userEndpoints';
import { Contact, Message } from '../types/IChat';

export const ChatApi = {
  getContacts: async (): Promise<Contact[]> => {
    const response = await API.get(chatRoutes.getContacts, { withCredentials: true });
    return response.data;
  },

  getMessages: async (contactId: string): Promise<Message[]> => {
    const response = await API.get(`${chatRoutes.getMessages}/${contactId}`, { withCredentials: true });
    return response.data;
  },

  sendMessage: async (contactId: string, message: string): Promise<Message> => {
    const response = await API.post(
      chatRoutes.sendMessage,
      { contactId, message },
      { withCredentials: true }
    );
    return response.data;
  },

  markMessagesAsRead: async (contactId: string): Promise<void> => {
    await API.post(
      chatRoutes.markMessagesAsRead,
      { contactId },
      { withCredentials: true }
    );
  },
   // Search for users to start a new chat
   searchUsers: async (query: string): Promise<Contact[]> => {
    const response = await API.get(`${chatRoutes.searchUsers}?query=${query}`, { withCredentials: true });
    return response.data;
  },

  // Start a new chat with a user
  startNewChat: async (userId: string): Promise<Contact> => {
    const response = await API.post(
      chatRoutes.startNewChat,
      { userId },
      { withCredentials: true }
    );
    return response.data;
  },
  deleteMessage: async (messageId: string): Promise<void> => {
    await API.patch(`${chatRoutes.deleteMessage}/${messageId}`, {}, { 
      withCredentials: true 
    });
  },
};
