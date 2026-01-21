import axios from 'axios';
import { APP_ENV } from '../env';
import type { ILoginUser, LoginResponse } from '../types/account/ILoginUser';
import type { IUserProfile } from '../types/account/IUserProfile';
import type { IUser, IUserCreatePayload, IUserUpdatePayload } from '../types/account/IUser';

const apiClient = axios.create({
  baseURL: APP_ENV.SERVER_URL || 'http://localhost:4099/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо токен до запитів, якщо він є
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обробка помилок авторизації
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const loginUser = async (data: ILoginUser): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/users/login/', {
    username: data.username,
    password: data.password,
  });

  // Зберігаємо токени в localStorage
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);

  return response.data;
};

export const getUserProfile = async (): Promise<IUserProfile> => {
  const response = await apiClient.get<IUserProfile>('/users/profile/');
  return response.data;
};

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await apiClient.get<IUser[]>('/users/');
  return response.data;
};

export const createUser = async (data: IUserCreatePayload): Promise<IUser> => {
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

  const response = await apiClient.post<IUser>('/users/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateUser = async (id: number, data: IUserUpdatePayload): Promise<IUser> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as Blob);
    }
  });

  const response = await apiClient.patch<IUser>(`/users/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}/`);
};

export default apiClient;

