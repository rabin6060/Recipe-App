import { UserInfo } from '@/pages/Login/type';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api/v1/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user: UserInfo = JSON.parse(userJson || '');
        if (user && user.data && user.data.accessToken) {
          config.headers.Authorization = `Bearer ${user.data.accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
