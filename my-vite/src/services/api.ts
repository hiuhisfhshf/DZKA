import axios from 'axios';
import { APP_ENV } from '../env';

const apiClient = axios.create({
  baseURL: APP_ENV.SERVER_URL || 'http://localhost:4099/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  image?: File;
}

export interface RegisterResponse {
  refresh: string;
  access: string;
}

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const formData = new FormData();
  
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('first_name', data.first_name);
  formData.append('last_name', data.last_name);
  formData.append('phone', data.phone);
  
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await apiClient.post<RegisterResponse>('/users/register/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default apiClient;

