import api from './api';
import type { Bike, Sale, KPIData, MonthlySalesData, ApiResponse } from '../types';

export const bikeService = {
  addBike: async (bikeData: Omit<Bike, 'id' | 'status' | 'addedBy' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<ApiResponse<Bike>>('/bikes', bikeData);
    return response.data;
  },

  getAllBikes: async (status?: string) => {
    const response = await api.get<ApiResponse<Bike[]>>('/bikes', {
      params: status ? { status } : {}
    });
    return response.data;
  },

  getBikeById: async (id: string) => {
    const response = await api.get<ApiResponse<Bike>>(`/bikes/${id}`);
    return response.data;
  },

  updateBike: async (id: string, bikeData: Partial<Bike>) => {
    const response = await api.put<ApiResponse<Bike>>(`/bikes/${id}`, bikeData);
    return response.data;
  },

  deleteBike: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/bikes/${id}`);
    return response.data;
  }
};

export const saleService = {
  markAsSold: async (bikeId: string, saleData: {
    salePrice: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAadhar: string;
    customerAddress: string;
  }) => {
    const response = await api.post<ApiResponse<Sale>>(`/sales/bike/${bikeId}/sold`, saleData);
    return response.data;
  },

  getAllSales: async () => {
    const response = await api.get<ApiResponse<Sale[]>>('/sales');
    return response.data;
  },

  getSaleById: async (id: string) => {
    const response = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
    return response.data;
  },

  getSaleByBikeId: async (bikeId: string) => {
    const response = await api.get<ApiResponse<Sale>>(`/sales/bike/${bikeId}`);
    return response.data;
  },

  clearAllData: async () => {
    const response = await api.delete<ApiResponse>('/sales/clear-all');
    return response.data;
  }
};

export const analyticsService = {
  getKPIData: async (filters?: { year?: number; month?: number }) => {
    const response = await api.get<ApiResponse<KPIData>>('/analytics/kpi', {
      params: filters || {}
    });
    return response.data;
  },

  getMonthlySalesData: async (year?: number) => {
    const response = await api.get<ApiResponse<MonthlySalesData[]>>('/analytics/monthly-sales', {
      params: year ? { year } : {}
    });
    return response.data;
  }
};
