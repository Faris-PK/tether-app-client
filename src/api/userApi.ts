import API from '../services/axios';
import { authRoutes } from '../services/endpoints/userEndpoints';
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

  resendOtp: async (email: string, otp: string) => {
    const response = await API.post(authRoutes.ResendOtp, { email, otp });
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
  getUserProfile: async () => {
    const response = await API.get(authRoutes.userProfile, { withCredentials: true });
    console.log(response);
    
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
  

};