import API from '../services/axios';
import { authRoutes, networkRoutes } from '../services/endpoints/userEndpoints';
import IUser from '../types/IUser';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  mobile:string;
}

export const api = {
  register: async (userData: RegisterData) => {
    const response = await API.post(authRoutes.Register, userData);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await API.post(authRoutes.Otp, { email, otp });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await API.post(authRoutes.ResendOtp, { email });
    return response.data;
  },


  login: async (email: string, password: string) => {
    const response = await API.post(authRoutes.SignIn, { email, password }, { withCredentials: true });
    return response.data;
  },

  googleRegister: async (token: string) => {
    const response = await API.post(authRoutes.googleRegister, { token }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  googleLogin: async (token: string) => {
    const response = await API.post(authRoutes.googleLogin, { token }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  logout: async () => {
    const response = await API.post(authRoutes.logout, {}, { withCredentials: true });
    return response.data;
  },
  getUserProfile: async (userId:string) => {
    const response = await API.get(`${authRoutes.userProfile}/${userId}`, { withCredentials: true });

    return response.data;
  },

  updateUserProfile: async (updateData: Partial<IUser>) => {
    const response = await API.put(authRoutes.userProfile, updateData, { withCredentials: true });
    return response.data;
  },

  uploadImage: async (formData: FormData) => {
    const response = await API.post(authRoutes.uploadImage, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  removeProfilePicture: async (type: 'profile' | 'cover') => {
    const response = await API.post(authRoutes.updateProfile, { type });
    return response.data;
  },



  getFollowers: async () => {
    const response = await API.get(networkRoutes.getFollowers, { withCredentials: true });
    return response.data;
  },

  getFollowing: async () => {
    const response = await API.get(networkRoutes.getFollowing, { withCredentials: true });
    return response.data;
  },
  

};