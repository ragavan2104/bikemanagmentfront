import api from './api';
import type { User, ApiResponse } from '../types';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: {
    email: string;
    password: string;
    role: string;
    displayName: string;
  }) => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  }
};