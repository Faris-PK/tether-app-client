import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;
//console.log('host',API_URL);


const API :AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API